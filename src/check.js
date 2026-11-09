// Answer checks, ported from codewiki-next apps/desktop/main/answer.mjs (simplified for the first runnable version).
// Only what makes an answer unusable is sent back (a diagram that cannot be drawn, too few paragraphs); everything
// else is repaired in place. Evidence is checked by content: the quoted line is looked up in the file, which also
// corrects drifted line numbers. Evidence that cannot be confirmed is kept and marked unverified.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { execFile, execFileSync } from 'node:child_process'

export const VIEW_TYPES = ['sequence', 'component', 'package', 'class', 'state', 'activity', 'deployment', 'usecase']
export const KINDS = ['flow', 'impact', 'state', 'decision', 'locate', 'explain', 'compare', 'data', 'deploy', 'use']
const DEPLOY_KINDS = ['device', 'env', 'cloud', 'external', 'artifact', 'db']

const isId = s => typeof s === 'string' && /^[A-Za-z][\w-]{0,40}$/.test(s)
const norm = s => String(s).replace(/\s+/g, ' ').trim()

// grid numbers a diagram lays out by (a huge row is a huge loop), and the most elements a diagram may hold
const GRID = ['row', 'col', 'span', 'cols', 'layer'], GRID_MAX = 40, MAX_ITEMS = 800, MAX_TEXT = 400

function checkSpec(v, errs, at, fix) {
  let s
  if (v.spec && typeof v.spec === 'object') s = structuredClone(v.spec)
  else try { s = JSON.parse(v.spec) } catch (e) { errs.push(`${at}.spec 不是合法 JSON：${e.message}`); return null }
  if (!s || typeof s !== 'object') { errs.push(`${at}.spec 必须是对象`); return null }
  s.type = v.type; s.title = v.title || ''
  // every kind is a short lower-case word: the diagram uses it as a class name; drop anything else
  let items = 0
  const clean = x => {
    if (!x || typeof x !== 'object') return
    items++
    if (Array.isArray(x)) { x.forEach((y, i) => { if (typeof y === 'string' && y.length > MAX_TEXT) x[i] = y.slice(0, MAX_TEXT) + '…'; else clean(y) }); return }
    for (const [k, y] of Object.entries(x)) {
      if (k === 'kind' && !(typeof y === 'string' && /^[a-z][a-z-]{0,23}$/.test(y))) delete x[k]
      else if (k === 'color' && !(typeof y === 'string' && /^(#[0-9a-fA-F]{3,8}|[a-zA-Z]{1,30}|var\(--[A-Za-z0-9_-]{1,40}\))$/.test(y))) delete x[k]
      else if (GRID.includes(k)) { const v = typeof y === 'number' || typeof y === 'string' ? Math.round(Number(y)) : NaN; if (Number.isFinite(v)) x[k] = Math.max(0, Math.min(GRID_MAX, v)); else delete x[k] }
      else if (typeof y === 'string' && y.length > MAX_TEXT) x[k] = y.slice(0, MAX_TEXT) + '…'
      else clean(y)
    }
  }
  clean(s)
  if (items > MAX_ITEMS) { errs.push(`${at}.spec 太大（${items} 个元素，最多 ${MAX_ITEMS}）`); return null }
  const ids = new Map()
  const add = (id, kind, where) => {
    if (isId(id) && id in Object.prototype) errs.push(`${where} 的 id "${id}" 是保留字，换一个`)
    else if (!isId(id)) errs.push(`${where} 的 id "${id}" 不合法（字母开头，只含字母数字 _ -）`)
    else if (ids.has(id)) errs.push(`${where} 的 id "${id}" 重复`)
    else ids.set(id, kind)
  }
  const arr = (k, min) => { let a = s[k]; if (!Array.isArray(a)) { errs.push(`${at}.spec.${k} 必须是数组`); return [] } a = s[k] = a.filter(x => x && typeof x === 'object'); if (a.length < min) errs.push(`${at}.spec.${k} 至少 ${min} 项`); return a }
  const named = x => { if (!x.name) x.name = String(x.id) }
  const need = (id, kinds, where) => { if (!ids.has(id) || !kinds.includes(ids.get(id))) errs.push(`${where} 引用了不存在的${kinds.join('/')} "${id}"`) }
  if (v.type === 'sequence') {
    arr('lifelines', 2).forEach((l, i) => { add(l.id, 'lifeline', `${at}.lifelines[${i}]`); named(l) })
    arr('messages', 1).forEach((m, i) => {
      add(m.id, 'message', `${at}.messages[${i}]`); need(m.from, ['lifeline'], `${at}.messages[${i}].from`); need(m.to, ['lifeline'], `${at}.messages[${i}].to`)
      if (!m.text) m.text = '…'
      if (m.kind && !['call', 'return', 'async'].includes(m.kind)) { fix(`${at}.messages[${i}].kind 不认识，按 call 画`); delete m.kind }
    })
    ;(s.frags || []).forEach((f, i) => {
      add(f.id, 'frag', `${at}.frags[${i}]`)
      if (!['loop', 'alt', 'opt', 'par'].includes(f.kind)) f.kind = 'opt'
      if (f.operands != null && !(Array.isArray(f.operands) && f.operands.length && f.operands.every(o => o && typeof o === 'object'))) { errs.push(`${at}.frags[${i}].operands 必须是非空数组，每项是 {from, to}`); return }
      for (const [k, o] of (f.operands || [{ from: f.from, to: f.to }]).entries()) { need(o.from, ['message'], `${at}.frags[${i}].operands[${k}].from`); need(o.to, ['message'], `${at}.frags[${i}].operands[${k}].to`) }
      const pos = id => s.messages.findIndex(m => m.id === id), spans = (f.operands || []).map(o => [pos(o.from), pos(o.to)]).sort((p, q) => p[0] - q[0])
      if (spans.every(([a, b]) => a >= 0 && b >= 0) && spans.some(([a], k) => k && a <= spans[k - 1][1])) errs.push(`${at}.frags[${i}] 的分支有重叠：一条消息只能属于一个分支`)
    })
  } else if (v.type === 'component') {
    arr('nodes', 2).forEach((n, i) => { add(n.id, 'node', `${at}.nodes[${i}]`); named(n); if (!Number.isInteger(n.layer)) { const l = Math.round(Number(n.layer)); n.layer = Number.isFinite(l) ? l : 0 } })
    arr('deps', 0).forEach((d, i) => { if (!Array.isArray(d) || d.length !== 2) errs.push(`${at}.deps[${i}] 必须是 [from, to]`); else { need(d[0], ['node'], `${at}.deps[${i}][0]`); need(d[1], ['node'], `${at}.deps[${i}][1]`) } })
  } else if (v.type === 'state') {
    arr('states', 2).forEach((n, i) => { add(n.id, 'state', `${at}.states[${i}]`); if (n.kind && !['initial', 'final', 'normal'].includes(n.kind)) n.kind = 'normal'; if (!['initial', 'final'].includes(n.kind)) named(n) })
    arr('transitions', 1).forEach((t, i) => { add(t.id, 'transition', `${at}.transitions[${i}]`); need(t.from, ['state'], `${at}.transitions[${i}].from`); need(t.to, ['state'], `${at}.transitions[${i}].to`) })
  } else if (v.type === 'activity') {
    const lanes = new Set((s.lanes || []).map(l => l.id))
    arr('nodes', 2).forEach((n, i) => { add(n.id, 'node', `${at}.nodes[${i}]`); if (!['start', 'end', 'action', 'decision', 'merge', 'fork', 'join'].includes(n.kind)) errs.push(`${at}.nodes[${i}].kind 只能是 start/end/action/decision/merge/fork/join`); if (n.kind === 'action') named(n); if (n.lane && !lanes.has(n.lane)) delete n.lane })
    arr('flows', 1).forEach((f, i) => { add(f.id, 'flow', `${at}.flows[${i}]`); need(f.from, ['node'], `${at}.flows[${i}].from`); need(f.to, ['node'], `${at}.flows[${i}].to`) })
  } else if (v.type === 'package') {
    arr('packages', 2).forEach((k, i) => {
      add(k.id, 'node', `${at}.packages[${i}]`); named(k); const l = Math.round(Number(k.layer)); k.layer = Number.isFinite(l) ? l : 0
      k.children = (Array.isArray(k.children) ? k.children : []).filter(c => c && typeof c === 'object')
      k.children.forEach((c, j) => { add(c.id, 'kid', `${at}.packages[${i}].children[${j}]`); named(c) })
    })
    arr('deps', 0).forEach((d, i) => { if (!Array.isArray(d) || d.length !== 2) errs.push(`${at}.deps[${i}] 必须是 [from, to]`); else { need(d[0], ['node'], `${at}.deps[${i}][0]`); need(d[1], ['node'], `${at}.deps[${i}][1]`) } })
    delete s.reverse
  } else if (v.type === 'class') {
    arr('classes', 2).forEach((c, i) => {
      add(c.id, 'class', `${at}.classes[${i}]`); named(c)
      c.fields = (Array.isArray(c.fields) ? c.fields : []).map((f, j) => {
        if (!f || typeof f !== 'object') return String(f ?? '')
        if (f.id) add(f.id, 'field', `${at}.classes[${i}].fields[${j}]`)
        return { ...(f.id ? { id: f.id } : {}), name: String(f.name || f.id || ''), ...(f.type ? { type: String(f.type) } : {}) }
      })
    })
    s.rels = (Array.isArray(s.rels) ? s.rels : []).filter(r => r && typeof r === 'object')
    s.rels.forEach((r, i) => {
      if (!r.id) r.id = `rel_${i + 1}`
      add(r.id, 'rel', `${at}.rels[${i}]`); need(r.from, ['class'], `${at}.rels[${i}].from`); need(r.to, ['class'], `${at}.rels[${i}].to`)
      if (!['has', 'ref', 'is'].includes(r.kind)) { if (r.kind) fix(`${at}.rels[${i}].kind 不认识，按 ref 画`); r.kind = 'ref' }
    })
  } else if (v.type === 'deployment') {
    const walk = (list, where) => list.forEach((k, i) => {
      add(k.id, 'node', `${where}[${i}]`); named(k)
      if (k.kind && !DEPLOY_KINDS.includes(k.kind)) { fix(`${where}[${i}].kind 不认识，已去掉`); delete k.kind }
      if (Array.isArray(k.children)) walk(k.children, `${where}[${i}].children`); else delete k.children
    })
    walk(arr('nodes', 2), `${at}.nodes`)
    s.links = Array.isArray(s.links) ? s.links : []
    s.links.forEach((l, i) => { if (!Array.isArray(l) || l.length < 2) errs.push(`${at}.links[${i}] 必须是 [from, to, 怎么通信]`); else { need(l[0], ['node'], `${at}.links[${i}][0]`); need(l[1], ['node'], `${at}.links[${i}][1]`) } })
  } else if (v.type === 'usecase') {
    s.system = String(s.system || '')
    s.groups = Array.isArray(s.groups) ? s.groups : []
    s.groups.forEach((g, i) => { add(g.id, 'group', `${at}.groups[${i}]`); named(g) })
    arr('actors', 1).forEach((x, i) => { add(x.id, 'actor', `${at}.actors[${i}]`); named(x)
      if (x.side != null && x.side !== 'left' && x.side !== 'right') { fix(`${at}.actors[${i}].side 只能是 left/right，已去掉`); delete x.side } })
    arr('cases', 1).forEach((c, i) => { add(c.id, 'case', `${at}.cases[${i}]`); named(c)
      if (c.group != null && ids.get(c.group) !== 'group') { fix(`${at}.cases[${i}].group 不存在，已去掉`); delete c.group } })
    s.links = Array.isArray(s.links) ? s.links : []
    s.links.forEach((l, i) => { if (!Array.isArray(l) || l.length < 2) errs.push(`${at}.links[${i}] 必须是 [参与者, 用例]`); else { need(l[0], ['actor'], `${at}.links[${i}][0]`); need(l[1], ['case'], `${at}.links[${i}][1]`) } })
    // an include or extend between cases is optional: a broken one is dropped
    const inc = Array.isArray(s.includes) ? s.includes : []
    s.includes = inc.filter(l => Array.isArray(l) && ids.get(l[0]) === 'case' && ids.get(l[1]) === 'case').map(([p, q, k]) => [p, q, k === 'extend' ? 'extend' : 'include'])
    if (s.includes.length < inc.length) fix(`${at}.includes 有 ${inc.length - s.includes.length} 条连到不存在的用例，已去掉`)
  } else errs.push(`${at}.type 只能是 ${VIEW_TYPES.join('/')}`)
  // notes beside a diagram: text tied to elements of it; a note of another shape is dropped
  if (s.notes != null) {
    const n = Array.isArray(s.notes) ? s.notes : []
    s.notes = n.filter(x => x && typeof x.text === 'string' && Array.isArray(x.on) && x.on.length && x.on.every(id => ids.has(id)))
    if (s.notes.length < n.length || !Array.isArray(s.notes)) fix(`${at}.notes 有 ${n.length - s.notes.length} 条格式不对，已去掉`)
    if (!s.notes.length) delete s.notes
  }
  return { spec: s, ids }
}

// what a reader sees for a diagram element: message text, node/state name, guard or fragment label
// (nested elements — package parts, deployment children, fields — count too)
function labelOf(spec, id) {
  const look = list => {
    for (const x of Array.isArray(list) ? list : []) {
      if (!x || typeof x !== 'object') continue
      if (x.id === id) return String(x.text || x.name || x.label || x.guard || '')
      const k = look(x.children) || look(x.fields)
      if (k) return k
    }
    return ''
  }
  for (const k of ['messages', 'lifelines', 'nodes', 'states', 'transitions', 'flows', 'frags', 'packages', 'classes', 'rels', 'actors', 'cases']) {
    const t = look(spec?.[k]).trim()
    if (t) return t
  }
  return ''
}
// step ids (m7, f1, t3) written as plain text read as noise: they become the element's words, linked when the
// element is on this paragraph's diagram
const STEP_ID = /(?<![\w.\-/|`[])([a-z]{1,2}\d{1,3})(?![\w\]`])/g
function nameStepIds(text, views, view, ids) {
  const [code, plain] = [[], String(text)]
  const masked = plain.replace(/\[\[[^\]]*\]\]|`[^`]*`/g, m => { code.push(m); return `\u0000${code.length - 1}\u0000` })
  let n = 0
  const out = masked.replace(STEP_ID, (m, id) => {
    const own = ids.has(id) ? labelOf(views.find(v => v.id === view)?.spec, id) : ''
    const label = own || views.map(v => labelOf(v.spec, id)).find(Boolean)
    if (!label) return m
    n++
    return own ? `[[${label}|${id}]]` : `“${label}”`
  })
  return { text: out.replace(/\u0000(\d+)\u0000/g, (_, i) => code[i]), n }
}

const quoteLines = q => String(q || '').split(/\r?\n/).map(l => norm(l.replace(/^\s*\d+\s*[:|]\s?/, '').replace(/(…|\.\.\.)\s*$/, ''))).filter(l => l.length >= 3)
function findQuote(lines, q, near) {
  const ql = quoteLines(q); if (!ql.length) return null
  let best = null
  for (let i = 0; i < lines.length; i++) {
    if (!norm(lines[i]).includes(ql[0])) continue
    let k = 1, j = i + 1
    for (; k < ql.length && j < lines.length && j < i + ql.length + 3; j++) if (norm(lines[j]).includes(ql[k])) k++
    const hit = [i + 1, k === ql.length ? j : i + 1]
    if (k === ql.length && (!best || Math.abs(hit[0] - near) < Math.abs(best[0] - near))) best = hit
  }
  return best
}

/** Code names in a reader's sentence: `code` spans and bare identifiers (dotted, path-like, camelCase, snake_case). */
export function codeNames(text) {
  const s = String(text || '').replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
  const names = new Set([...s.matchAll(/`([^`]+)`/g)].map(m => m[1].trim()))
  for (const m of s.replace(/`[^`]+`/g, ' ').matchAll(/[A-Za-z_$][\w$]*(?:[./:][\w$-]+)+|(?<![A-Za-z])[a-z]+[A-Z][\w$]*|[A-Za-z]+_\w+/g)) names.add(m[0])
  return [...names]
}
// questions about behaviour are read as a story: a paragraph that is mostly code names loses a reader who does not
// write code (questions that list modules may name them)
const PLAIN_KINDS = ['flow', 'decision', 'state', 'impact', 'deploy']
const NAMES_PER_PARA = 10

// git options for a repository that may not be trusted: no optional locks, no fsmonitor hook from its config, and
// hooks looked for in a private empty folder made here (none made: git does not run); removed when the host exits
let NO_HOOKS = null
try {
  NO_HOOKS = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-decode-no-hooks-')); fs.chmodSync(NO_HOOKS, 0o700)
  const dir = NO_HOOKS
  process.once('exit', () => { try { fs.rmSync(dir, { recursive: true, force: true }) } catch {} })
} catch {}
export const GIT_SAFE = ['--no-optional-locks', '-c', 'core.fsmonitor=false', '-c', `core.hooksPath=${NO_HOOKS}`]
// git commands get a time limit: a stuck git must not stop the host
export const GIT_TIMEOUT = 15_000

/**
 * The absolute path of git, from the absolute folders of PATH only: a bare name would be looked for in the current
 * folder first on Windows (dsh is often started in the repository, which may hold its own git.exe), and an empty or
 * relative PATH entry names the current folder on any system. null when there is none: then git does not run.
 */
export function findGit(env = process.env, platform = process.platform) {
  const win = platform === 'win32', names = win ? ['git.exe'] : ['git']
  const dirs = String(env.PATH ?? env.Path ?? '').split(win ? ';' : ':').map(d => d.trim().replace(/^"(.*)"$/, '$1'))
  for (const d of dirs) {
    if (!d || !path.isAbsolute(d) || (win && !/^[A-Za-z]:[\\/]|^\\\\/.test(d))) continue
    for (const n of names) { const f = path.join(d, n); try { if (fs.statSync(f).isFile()) return f } catch {} }
  }
  return null
}
let gitPath, gitAt = 0
const gitBin = () => { if (!gitPath && Date.now() - gitAt > 10_000) { gitPath = findGit(); gitAt = Date.now() } return gitPath }

/** git in the repository, without blocking the host: stdout, or a rejection (a non-zero exit, the time limit, too much output). */
export function git(root, args, maxBuffer = 64 << 20) {
  const bin = gitBin()
  if (!bin) return Promise.reject(Object.assign(new Error('git not found on PATH'), { code: 'ENOENT' }))
  if (!NO_HOOKS) return Promise.reject(Object.assign(new Error('no private folder for git hooks'), { code: 'ENOENT' }))
  return new Promise((resolve, reject) => execFile(bin, ['-C', root, ...args], { encoding: 'utf8', maxBuffer, windowsHide: true, timeout: GIT_TIMEOUT },
    (err, out) => (err ? reject(err) : resolve(out))))
}

/**
 * GIT_SAFE plus every filter driver the repository's config names, with its commands emptied (status and diff run them).
 * Fails closed: when the config cannot be read (other than "no filter"), it throws and the caller runs nothing.
 */
export async function gitSafe(root) {
  let out = ''
  try { out = await git(root, ['config', '-z', '--get-regexp', '^filter\\.'], 4 << 20) } catch (e) { if (e.code !== 1) throw e }
  const names = new Set(out.split('\0').map(e => e.split('\n')[0]).filter(k => k.startsWith('filter.')).map(k => k.slice(7, k.lastIndexOf('.'))).filter(Boolean))
  // -c splits at the first '=': a name with '=' (or a line break) cannot be emptied that way, so nothing runs
  if ([...names].some(n => /[=\n\r]/.test(n))) throw new Error('a filter name git cannot be given')
  return [...GIT_SAFE, ...[...names].flatMap(n => ['-c', `filter.${n}.clean=`, '-c', `filter.${n}.smudge=`, '-c', `filter.${n}.process=`, '-c', `filter.${n}.required=false`])]
}

// the largest file read for a quote or a source view; a larger one is left alone
const MAX_READ = 4 << 20

/** The text of a tracked file, or null when its real path leaves the repository (a link) or it is too large. */
export function readInside(root, file) {
  try {
    const base = fs.realpathSync(root), real = fs.realpathSync(path.join(root, file))
    if (real !== base && !real.startsWith(base + path.sep)) return null
    const st = fs.statSync(real)
    if (!st.isFile() || st.size > MAX_READ) return null
    return fs.readFileSync(real, 'utf8')
  } catch { return null }
}

// the tracked files of each repository, read again after a minute (a file added later must resolve)
const tracked = new Map()
/** Read the tracked list now if it is older than a minute, without blocking the host. Call before trackedFiles. */
const loading = new Map()
export function loadTracked(root) {
  const hit = tracked.get(root)
  if (hit && Date.now() - hit.at <= 60_000) return Promise.resolve(hit.files)
  if (!loading.has(root)) loading.set(root, readTracked(root).finally(() => loading.delete(root)))
  return loading.get(root)
}
async function readTracked(root) {
  let out = '', ok = true
  // -z: raw paths (without it git quotes a path with non-ASCII characters: "snapshots/\346...")
  try { out = await git(root, [...GIT_SAFE, 'ls-files', '-z']) } catch { ok = false }
  // a failure is kept for a few seconds only, then git is asked again
  keepTracked(root, ok ? Date.now() : Date.now() - 55_000, out)
  return tracked.get(root).files
}
/** The tracked list loadTracked read last; read here (blocking) only when it was never loaded. */
export function trackedFiles(root) {
  if (!tracked.has(root)) {
    let out = ''
    try { if (!gitBin() || !NO_HOOKS) throw new Error('git not found'); out = execFileSync(gitBin(), ['-C', root, ...GIT_SAFE, 'ls-files', '-z'], { encoding: 'utf8', maxBuffer: 64 << 20, windowsHide: true, timeout: GIT_TIMEOUT }) } catch {}
    keepTracked(root, Date.now(), out)
  }
  return tracked.get(root).files
}
function keepTracked(root, at, out) {
  tracked.delete(root); tracked.set(root, { at, files: out.split('\0').filter(Boolean) })
  while (tracked.size > 8) tracked.delete(tracked.keys().next().value)
}

/** The file types a repository tracks, most first, as ".js 30". */
export function fileTypes(files, max = 8) {
  const n = new Map()
  for (const f of files) { const m = /\.([A-Za-z0-9]+)$/.exec(f.split('/').pop()); if (m) n.set(m[1].toLowerCase(), (n.get(m[1].toLowerCase()) || 0) + 1) }
  return [...n].sort((a, b) => b[1] - a[1]).slice(0, max).map(([e, k]) => `.${e} ${k}`)
}
/** Repository-relative POSIX path of a cited file, or null when it is outside the root. */
export function relPath(root, file) {
  const abs = path.resolve(root, String(file))
  const rel = path.relative(root, abs)
  if (!rel || rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) return null
  return rel.split(path.sep).join('/')
}

/** True when a path of the working tree is git's own folder or in it, by real path. */
function inGitDir(root, rel) {
  try {
    const g = fs.realpathSync.native(path.join(root, '.git')).toLowerCase(), r = fs.realpathSync.native(path.join(root, rel)).toLowerCase()
    return r === g || r.startsWith(g + path.sep)
  } catch { return /[:~]/.test(rel) }
}
function resolveFile(root, file) {
  let rel = relPath(root, file)
  // a file of the working tree (tracked or not, so a new file can be cited), never git's own folder
  if (rel && !/(^|\/)\.git(\/|$)/i.test(rel) && fs.existsSync(path.join(root, rel)) && !inGitDir(root, rel)) return rel
  const tail = '/' + String(file).replaceAll('\\', '/').replace(/^\.?\/+/, '')
  const hits = trackedFiles(root).filter(f => ('/' + f).endsWith(tail))
  return hits.length === 1 && fs.existsSync(path.join(root, hits[0])) ? hits[0] : null
}

/** What the folders of the answer are for: folders of the repository only, one line each (never sent back). */
export function checkAreas(list, root, fix = () => {}) {
  const out = [], seen = new Set()
  for (const x of Array.isArray(list) ? list : []) {
    if (!x || typeof x !== 'object') continue
    const dir = relPath(root, String(x.path || '').replace(/[\\/]+$/, '')), role = String(x.role || '').replace(/\s+/g, ' ').trim()
    if (!dir || !role || seen.has(dir)) continue
    if (!trackedFiles(root).some(f => f.startsWith(dir + '/'))) { fix(`areas 里的 ${x.path} 不是仓库里的目录，已去掉`); continue }
    seen.add(dir); out.push({ path: dir, role: [...role].length > 24 ? [...role].slice(0, 23).join('') + '…' : role })
    if (out.length >= 10) break
  }
  return out
}

/** One piece of evidence checked by content: the quote is looked up in the file, which also corrects drifted lines. */
const EV_KINDS = ['read', 'ran', 'inferred']
function checkEvidence(e, root, reads) {
  e = { ...e, kind: EV_KINDS.includes(e.kind) ? e.kind : 'inferred' }
  const file = resolveFile(root, e.file)
  if (!file) return { file: String(e.file), start: e.start | 0, end: e.end | 0, quote: String(e.quote || ''), kind: e.kind, status: 'missing' }
  let start = Math.max(1, e.start | 0), end = Math.max(start, e.end | 0), status = e.kind === 'read' ? 'unverified' : e.kind
  if (e.kind === 'read' && e.quote) {
    let lines = []
    lines = (readInside(root, file) ?? '').split(/\r?\n/)
    const hit = findQuote(lines, e.quote, start)
    // a quote outside the cited range means the line numbers drifted: the quote's own lines win
    if (hit) { if (hit[0] < start || hit[1] > end) { start = hit[0]; end = hit[1] } status = 'verified' }
  }
  const seen = (reads.get(file) || []).some(([s, t]) => s <= end + 2 && t >= start - 2)
  return { file, start, end, quote: String(e.quote || ''), kind: e.kind, status, seen }
}

/**
 * Check one submitted answer.
 * @param {object} a - the submit_answer arguments
 * @param {string} root - the session workspace root
 * @param {Map<string, Array<[number, number]>>} reads - repository-relative path -> line ranges read this session
 * @param {boolean} final - a later submission: drop a view that still cannot be drawn instead of sending it back
 * @returns {{ok: true, answer: object, repairs: string[]} | {ok: false, errors: string[]}}
 */
// how much of a text is Chinese: a CJK character weighs as a word (about four Latin letters); code spans do not count
export function cjkShare(text) {
  const t = String(text || '').replace(/`[^`]*`/g, '').replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
  const c = (t.match(/[㐀-鿿]/g) || []).length, l = (t.match(/[A-Za-z]/g) || []).length
  return c + l ? c / (c + l / 4) : 0
}

/**
 * What an activity diagram leaves the reader to guess: which result an end means, which way a decision goes, how a loop stops.
 * Not a drawing problem, so it is sent back once, never a reason to drop the diagram.
 */
export function activityProblems(spec, at = 'activity') {
  const nodes = spec?.nodes || [], flows = spec?.flows || [], out = [], next = id => flows.filter(f => f.from === id)
  const canEnd = new Set(nodes.filter(n => n.kind === 'end').map(n => n.id))
  for (let grew = true; grew;) { grew = false; for (const f of flows) if (canEnd.has(f.to) && !canEnd.has(f.from)) { canEnd.add(f.from); grew = true } }
  for (const n of nodes) {
    if (n.kind === 'end' && !String(n.name || '').trim()) out.push(`${at} 的结束节点 "${n.id}" 没有 name：写明这条路径的结果（成功、失败、等待重启等）`)
    if (n.kind === 'decision') {
      const o = next(n.id)
      if (o.length < 2) out.push(`${at} 的判断 "${n.name || n.id}" 只有 ${o.length} 个出口：画出所有结果，包括失败、拒绝和重试用尽`)
      else if (o.some(f => !String(f.guard || '').trim())) out.push(`${at} 的判断 "${n.name || n.id}" 有出口没有写 guard：每个出口都写条件`)
    }
    if (n.kind !== 'end' && !canEnd.has(n.id)) out.push(`${at} 的 "${n.name || n.id}" 走不到任何结束节点：循环要画出退出的条件，步骤要画出后续`)
  }
  return out
}

/** The Chinese words in a diagram's title and spec, for a reader who asked in English. */
export function viewCjk(view) {
  return JSON.stringify([view.title, view.spec]).match(/[㐀-鿿]+/g) || []
}

export function checkAnswer(a, root, reads, final, opts = {}) {
  const errs = [], repairs = [], fix = m => repairs.push(m)
  const answer = { take: String(a.take || ''), kind: KINDS.includes(a.kind) ? a.kind : 'explain', views: [], paras: [], followups: (a.followups || []).map(String).slice(0, 3), areas: checkAreas(a.areas, root, fix) }
  const viewIds = new Map()
  for (const [i, v] of (a.views || []).entries()) {
    const verrs = [], at = `views[${i}]`
    let r
    try { r = checkSpec(v, verrs, at, fix) } catch (e) { verrs.push(`${at}.spec 的结构不对（${e.message}）`); r = null }
    if (verrs.length || !r) { if (final) fix(`${at} 画不出来，已去掉：${verrs[0]}`); else errs.push(...verrs); continue }
    const id = isId(v.id) ? v.id : `v${i + 1}`
    // paragraphs name their view by id: two views with one id cannot both be reached
    if (viewIds.has(id)) { if (final) fix(`${at} 的 id "${id}" 重复，已去掉`); else errs.push(`${at} 的 id "${id}" 和前面的图重复`); continue }
    answer.views.push({ id, type: v.type, title: String(v.title || ''), spec: r.spec })
    viewIds.set(id, r.ids)
  }
  // the card exists for the diagram: an answer without one is an ordinary message
  if (!(a.views || []).length && !final) return { ok: false, errors: ['这个回答没有图：不要调用 submit_answer，直接用普通消息回答（文件路径和行号写在句中）'] }
  const paras = a.paras || []
  if (paras.length < 2) errs.push(`paras 至少 2 段，现在 ${paras.length} 段`)
  if (!answer.take) errs.push('take 不能为空')
  let lastView = answer.views[0]?.id || ''
  const lastUpto = new Map()
  for (const [i, p] of paras.entries()) {
    let view = String(p.view || '')
    if (view && !viewIds.has(view)) { fix(`paras[${i}].view "${view}" 不存在，沿用上一段的图`); view = lastView }
    if (!view) view = lastView
    lastView = view
    const ids = viewIds.get(view) || new Map()
    const now = (p.now || []).filter(x => ids.has(x))
    const upto = ids.get(p.upto) === 'message' ? p.upto : ''
    // a sequence paragraph that names no message walks the messages since the previous paragraph's upto: they are its
    // current step (the diagram shows the text of current messages only, the others are numbers in a narrow panel)
    const spec = answer.views.find(v => v.id === view)?.spec
    if (spec?.messages && upto && !now.some(x => ids.get(x) === 'message')) {
      const order = spec.messages.map(m => m.id), to = order.indexOf(upto), from = order.indexOf(lastUpto.get(view) ?? '') + 1
      const walked = order.slice(from <= to ? from : to, to + 1).slice(-6)
      if (walked.length) { now.push(...walked); fix(`paras[${i}].now 补上这段走过的消息 ${walked.join(',')}`) }
    }
    if (upto) lastUpto.set(view, upto)
    const named = nameStepIds(p.text || '', answer.views, view, ids)
    if (named.n) fix(`paras[${i}] 里 ${named.n} 个图元素编号换成了文字`)
    answer.paras.push({ text: named.text, view, now, upto, evidence: (p.evidence || []).map(e => checkEvidence(e, root, reads)) })
  }
  // sent back once (a later submission is taken as it is)
  if (!final) {
    answer.views.forEach(v => { if (v.type === 'activity') errs.push(...activityProblems(v.spec, `图 "${v.id}"`)) })
    // the reader's language: an English question gets an English answer, a Chinese one a Chinese answer
    if (opts.en != null) {
      const body = [answer.take, ...answer.paras.map(p => p.text)].join('\n'), share = cjkShare(body)
      if (opts.en) for (const v of answer.views) { const w = viewCjk(v); if (w.length) errs.push(`The reader asked in English, but diagram "${v.id}" has Chinese words (${w.slice(0, 4).join(', ')}). Write every word in the diagrams in English. 图里的文字全部改用英文。`) }
      if (opts.en && share <= 0.3 && (body.match(/[㐀-鿿]/g) || []).length > 10) errs.push('The reader asked in English, but the text mixes in Chinese. Write it all in English (a quoted Chinese UI label may stay). 正文全部改用英文。')
      if (opts.en && share > 0.3) errs.push('The reader asked in English, but this answer is written in Chinese. Rewrite take, paras, view titles and the words in the diagrams and followups in English (a quoted Chinese UI label may stay). 读者用英文提问：全部改用英文。')
      if (!opts.en && share < 0.15 && body.length > 200) errs.push('读者用中文提问，这个回答却主要是英文：take、paras、图里的文字、followups 改用中文（代码名保持原样）。')
    }
    if (PLAIN_KINDS.includes(answer.kind)) {
      const t = codeNames(answer.take)
      if (t.length > 3) errs.push(`take 里有 ${t.length} 个代码名（${t.join('、')}）：结论要一眼读懂，代码名最多 3 个`)
      answer.paras.forEach((p, i) => {
        const n = codeNames(p.text)
        if (n.length > NAMES_PER_PARA) errs.push(`paras[${i}] 有 ${n.length} 个代码名（${n.join('、')}）：改成白话讲清这一步做了什么、为什么，代码名最多 ${NAMES_PER_PARA} 个，其余放进 evidence`)
      })
    }
  }
  if (errs.length) return { ok: false, errors: errs }
  return { ok: true, answer, repairs }
}
