// The panel's folder tree: the files an answer cites or read, put where they sit in the repository, with what each
// folder is for. The reader builds a map of the repository: the top folders, the groups and packages in them, which
// of them this answer touches. Plain functions, no React and no DOM: scripts/build.mjs puts this file in front of
// app.js in the same scope, and tests/files.test.js loads it with node:vm.

// a file that makes its folder a package (a unit a programmer names: packages/core/session, crates/foo)
const MANIFEST = /(^|\/)(package\.json|Cargo\.toml|go\.mod|pyproject\.toml|setup\.py|pom\.xml|build\.gradle(?:\.kts)?|[^/]+\.csproj)$/

/** Folders that hold a package manifest ('' = the repository root), from the repository's file list. */
function packageRoots(paths) {
  const out = new Set()
  for (const p of paths || []) { const m = MANIFEST.exec(p); if (m) out.add(p.slice(0, m.index)) }
  return out
}

/** Where a file is listed: the nearest folder above it with a manifest (not the root), else the folder it is in. */
function groupOf(file, roots) {
  const d = String(file).split('/').slice(0, -1)
  for (let n = d.length; n > 0; n--) { const k = d.slice(0, n).join('/'); if (roots && roots.has(k)) return k }
  return d.join('/')
}

/** Line ranges sorted, with overlapping and touching ranges joined (and ranges at most `gap` lines apart). */
function mergeRanges(list, gap = 0) {
  const out = []
  for (const [s, e] of [...(list || [])].filter(r => r && r[0] > 0).map(r => [r[0], Math.max(r[0], r[1] || r[0])]).sort((x, y) => x[0] - y[0])) {
    const last = out[out.length - 1]
    if (last && s <= last[1] + 1 + gap) last[1] = Math.max(last[1], e); else out.push([s, e])
  }
  return out
}


const DOC = /\.(md|mdx|markdown|rst|adoc|txt)$/i
const nameIn = (key, file) => (key && file.startsWith(key + '/') ? file.slice(key.length + 1) : file)
const parentOf = p => p.split('/').slice(0, -1).join('/')
const lastSeg = p => p.split('/').pop()

/** Per folder of a repository ('' = the root): its child folders, the names of its own files, and how many files it
 * holds at all levels. */
function dirIndex(paths) {
  const idx = new Map(), at = d => idx.get(d) || idx.set(d, { dirs: new Set(), files: 0, names: [], total: 0 }).get(d)
  at('')
  for (const p of paths || []) {
    const parts = String(p).split('/')
    let d = ''
    at('').total++
    for (let i = 0; i < parts.length - 1; i++) { const next = d ? d + '/' + parts[i] : parts[i]; at(d).dirs.add(next); at(next).total++; d = next }
    at(d).files++; at(d).names.push(parts[parts.length - 1])
  }
  return idx
}

const byName = (p, q) => (p < q ? -1 : p > q ? 1 : 0)
/** What a folder holds, as a file explorer lists it: folders (with their label and file count), then file names. */
function dirList(idx, dir, labels) {
  const ix = idx?.get(dir) || { dirs: new Set(), names: [] }
  return { dir, dirs: [...ix.dirs].sort(byName).map(d => ({ dir: d, name: lastSeg(d), label: (labels && labels.get(d)) || '', total: idx.get(d)?.total || 0 })),
    files: [...ix.names].sort(byName) }
}

/**
 * The files of an answer in reading order: the file the earliest paragraph cites first, files only read after them.
 * @param {object} a - the checked answer (paras with evidence)
 * @param {Array<{file: string, ranges?: number[][]}>} reads - files read while answering
 * @param {Set<string>} current - files the paragraph being read cites
 * @returns {Array<{file, cited, paras, read, cur, doc, order}>}
 */
function answerFiles(a, reads, current) {
  const byFile = new Map(), at = f => byFile.get(f) || byFile.set(f, { file: f, cited: [], paras: [], read: [], first: Infinity, readAt: Infinity }).get(f)
  ;(a?.paras || []).forEach((p, i) => (p.evidence || []).forEach(e => {
    if (!e || !e.file) return
    const x = at(e.file); x.cited.push([e.start, e.end]); if (!x.paras.includes(i)) x.paras.push(i); x.first = Math.min(x.first, i)
  }))
  let n = 0
  for (const r of reads || []) { if (!r || !r.file) continue; const x = at(r.file); x.read.push(...(r.ranges || [])); x.readAt = Math.min(x.readAt, n++) }
  return [...byFile.values()].map(x => ({ file: x.file, cited: mergeRanges(x.cited), paras: x.paras.sort((p, q) => p - q), read: mergeRanges(x.read),
    cur: !!current && current.has(x.file), doc: DOC.test(x.file), order: x.first < Infinity ? x.first : 1e6 + x.readAt }))
}

/** The files read so far while the agent works, in the order they were first read; `now` is the one being read. */
function liveFiles(reads, now) {
  const list = [...new Set([...(reads || []), ...(now ? [now] : [])])]
  return list.map((f, i) => ({ file: f, cited: [], paras: [], read: [], cur: f === now, doc: DOC.test(f), order: i }))
}

/**
 * The files placed in the repository's folder tree.
 * - From the root down, a folder that holds a listed file opens; it lists its files (a package lists all of its
 *   files, with paths inside the package) and its open sub-folders, in the order of their first file.
 * - What else the folder holds (folders and files with no listed file) is kept as `hidden`, for a "+" row that the
 *   reader opens like a folder in a file explorer. Not inside a package (it lists its files with paths inside it).
 * - A folder with one sub-folder and no files of its own joins it on one row ("apps/web").
 * @param {Array} files - answerFiles or liveFiles
 * @param {Map|null} idx - dirIndex of the repository (null: built from the files alone)
 * @param {Set<string>|null} roots - package folders
 * @param {Map<string, string>} labels - folder -> what it is for
 * @returns {object} the root node: {dir, name, pkg, label, total, cited, read, cur, files, kids, hidden}
 */
function fileTree(files, idx, roots, labels) {
  idx = idx || dirIndex(files.map(f => f.file))
  const home = new Map(files.map(f => [f.file, groupOf(f.file, roots)]))
  // per folder: the first order of the files listed in it or below it
  const first = new Map()
  for (const f of files) for (let d = home.get(f.file); ; d = parentOf(d)) { first.set(d, Math.min(first.get(d) ?? Infinity, f.order)); if (!d) break }
  // the open folders under each folder (from the files, so a cited file in a folder the repository lacks still shows)
  const under = new Map()
  for (const d of first.keys()) if (d) { const p = parentOf(d); under.set(p, [...(under.get(p) || []), d]) }
  const label = d => (labels && labels.get(d)) || ''
  const build = (dir, name) => {
    const none = { dirs: new Set(), files: 0, names: [], total: 0 }
    let ix = idx.get(dir) || none, lab = label(dir)
    // a chain of single folders reads as one path (with the label of the deepest folder that has one)
    while (dir && !(roots && roots.has(dir)) && ix.files === 0 && !files.some(f => home.get(f.file) === dir)) {
      const subs = new Set([...ix.dirs, ...(under.get(dir) || [])]); if (subs.size !== 1) break
      const only = [...subs][0]; if (!first.has(only)) break
      dir = only; name += '/' + lastSeg(only); ix = idx.get(dir) || none; lab = label(dir) || lab
    }
    const pkg = !!dir && !!roots && roots.has(dir)
    const own = files.filter(f => home.get(f.file) === dir).sort((p, q) => p.order - q.order).map(f => ({ ...f, name: nameIn(dir, f.file) }))
    const open = [...(under.get(dir) || [])].sort((p, q) => first.get(p) - first.get(q))
    const kids = open.map(d => build(d, lastSeg(d)))
    let hidden = null
    if (!pkg) {
      const l = dirList(idx, dir, labels), mine = new Set(own.map(f => f.name))
      hidden = { dir, dirs: l.dirs.filter(d => !first.has(d.dir)), files: l.files.filter(n => !mine.has(n)) }
      if (!hidden.dirs.length && !hidden.files.length) hidden = null
    }
    const all = [...own, ...kids.flatMap(k => k.all)]
    return { dir, name, pkg, label: lab, total: ix.total, files: own, kids, all, hidden,
      cited: all.filter(f => f.cited.length).length, read: all.filter(f => !f.cited.length).length, cur: all.some(f => f.cur) }
  }
  return build('', '')
}

// what common top folders hold, by name (a repository's own labels come from answers and replace these)
const FOLDER_WORDS = {
  zh: { apps: '应用入口', packages: '各个包', libs: '库', docs: '文档', doc: '文档', documentation: '文档', scripts: '脚本', tests: '测试', test: '测试', __tests__: '测试',
    examples: '示例', example: '示例', benchmarks: '性能测试', bench: '性能测试', vendor: '第三方代码', third_party: '第三方代码', website: '网站', site: '网站',
    assets: '资源文件', public: '静态文件', static: '静态文件', patches: '依赖补丁', snapshots: '测试快照', fixtures: '测试数据', '.github': 'GitHub 配置', '.agents': '给智能体的说明' },
  en: { apps: 'entry apps', packages: 'packages', libs: 'libraries', docs: 'documents', doc: 'documents', documentation: 'documents', scripts: 'scripts', tests: 'tests', test: 'tests', __tests__: 'tests',
    examples: 'examples', example: 'examples', benchmarks: 'benchmarks', bench: 'benchmarks', vendor: 'third-party code', third_party: 'third-party code', website: 'website', site: 'website',
    assets: 'assets', public: 'static files', static: 'static files', patches: 'dependency patches', snapshots: 'test snapshots', fixtures: 'test data', '.github': 'GitHub settings', '.agents': 'notes for agents' },
}
/** Labels by folder name for the top folders of a repository. */
function folderWords(idx, lang) {
  const words = FOLDER_WORDS[lang] || FOLDER_WORDS.zh, out = new Map()
  for (const d of idx?.get('')?.dirs || []) if (words[d]) out.set(d, words[d])
  return out
}

/**
 * Cells of the repository map when it has too many files to draw one by one: folders, split from the top until there
 * are about `target` of them. The biggest folder is split first, into its sub-folders and (one cell) its own files,
 * so a repository that keeps its code a few folders deep (src/app/core/...) still gets cells of a size that can be
 * seen, and a flat one is not cut up more than needed.
 * @param {string[]} paths - the repository's files
 * @param {Iterable<string>} split0 - folders that are split from the start (the map's regions that are sub-folders)
 * @returns {{cellOf: (path: string) => string, size: number}} cellOf gives "folder/" ("(根目录)/" for the root)
 */
function folderCells(paths, split0 = [], target = 500) {
  const idx = dirIndex(paths), split = new Set(['', ...split0])
  const cellsOf = d => [...(idx.get(d)?.dirs || [])].filter(x => !split.has(x))
  let cells = [], own = 0
  for (const d of split) { cells.push(...cellsOf(d)); if (idx.get(d)?.files) own++ }
  // the biggest folder that has sub-folders is split until there are enough cells
  while (cells.length + own < target) {
    let best = null
    for (const d of cells) if ((idx.get(d)?.dirs.size || 0) && (!best || idx.get(d).total > idx.get(best).total)) best = d
    if (!best) break
    split.add(best); cells = cells.filter(x => x !== best).concat(cellsOf(best)); if (idx.get(best).files) own++
  }
  const cellOf = p => {
    const d = String(p).split('/').slice(0, -1)
    for (let n = 1; n <= d.length; n++) { const k = d.slice(0, n).join('/'); if (!split.has(k)) return k + '/' }
    return d.length ? d.join('/') + '/' : '(根目录)/'
  }
  return { cellOf, size: cells.length + own }
}

/**
 * How well a path answers a search, or null when it does not (from claude-files-pane hooks/paths.ts): the letters of
 * the query in order; a run of letters, a letter at the start of a word, and a letter in the file name count more; the
 * query whole in the file name counts most; a shorter path wins a tie.
 */
function scoreOf(path, query) {
  const text = String(path).toLowerCase(), nameAt = text.lastIndexOf('/') + 1
  const from = start => {
    let score = 0, at = start - 1, run = 0
    for (const letter of query) {
      const found = text.indexOf(letter, at + 1)
      if (found < 0) return null
      run = found === at + 1 ? run + 1 : 0
      score += 1 + run * 2
      if (found === 0 || '/-_. '.includes(text[found - 1])) score += 3
      if (found >= nameAt) score += 2
      at = found
    }
    return score
  }
  let best = null
  for (let start = text.indexOf(query[0] ?? ''); start >= 0; start = text.indexOf(query[0], start + 1)) {
    const s = from(start)
    if (s === null) break
    if (best === null || s > best) best = s
  }
  if (best === null) return null
  if (text.slice(nameAt).includes(query)) best += query.length * 4
  return best - text.length / 100
}

/** The paths that answer a search best, best first (at most `limit`). Spaces in the query are ignored. */
function findFiles(paths, query, limit = 50) {
  const q = String(query || '').toLowerCase().replace(/\s+/g, '')
  if (!q) return []
  const out = []
  for (const p of paths || []) { const s = scoreOf(p, q); if (s !== null) out.push({ p, s }) }
  return out.sort((x, y) => y.s - x.s).slice(0, limit).map(x => x.p)
}
