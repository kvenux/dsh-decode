// src/client/files.js: the panel's folder tree. The file is a plain script (the client bundle concatenates it), so it
// is run here in this realm and its functions are taken from the result.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'

const src = fs.readFileSync(new URL('../src/client/files.js', import.meta.url), 'utf8')
const F = vm.runInThisContext(`(function () {\n${src}\nreturn { packageRoots, groupOf, mergeRanges, dirIndex, dirList, answerFiles, liveFiles, fileTree, folderWords, findFiles } })()`)

const REPO = ['package.json', 'README.md', 'docs/sub/x.md', 'docs/y.md', 'scripts/a.sh', 'scripts/b.sh', 'tests/t.ts',
  'packages/core/session/package.json', 'packages/core/session/src/repair.ts', 'packages/core/session/src/types.ts', 'packages/core/session/src/surface.ts',
  'packages/core/tools/package.json', 'packages/core/tools/src/run.ts', 'packages/web/package.json', 'packages/web/app.tsx',
  'apps/cli/src/main.ts', 'apps/cli/src/args.ts', 'crates/b/Cargo.toml']
const roots = F.packageRoots(REPO), idx = F.dirIndex(REPO)
// a node of the tree by its folder
const find = (n, dir) => n.dir === dir ? n : n.kids.map(k => find(k, dir)).find(Boolean)

test('package folders come from manifests', () => {
  assert.deepEqual([...roots].sort(), ['', 'crates/b', 'packages/core/session', 'packages/core/tools', 'packages/web'])
})
test('a file belongs to the nearest package above it, else to its folder', () => {
  assert.equal(F.groupOf('packages/core/session/src/repair.ts', roots), 'packages/core/session')
  assert.equal(F.groupOf('docs/sub/x.md', roots), 'docs/sub')
  assert.equal(F.groupOf('README.md', roots), '')
  assert.equal(F.groupOf('a/b.ts', null), 'a')
})
test('line ranges join when they overlap or touch', () => {
  assert.deepEqual(F.mergeRanges([[30, 40], [1, 5], [6, 8], [38, 50], [0, 3]]), [[1, 8], [30, 50]])
  assert.deepEqual(F.mergeRanges([[1, 5], [8, 9]], 2), [[1, 9]])
})
test('the folder index counts files at all levels', () => {
  assert.equal(idx.get('').total, REPO.length)
  assert.equal(idx.get('packages').total, 8)
  assert.deepEqual([...idx.get('packages').dirs].sort(), ['packages/core', 'packages/web'])
  assert.deepEqual([idx.get('docs').files, idx.get('docs').total], [1, 2])
})

const answer = { paras: [
  { evidence: [{ file: 'packages/core/session/src/repair.ts', start: 167, end: 192 }] },
  { evidence: [{ file: 'docs/sub/x.md', start: 3, end: 4 }, { file: 'packages/core/session/src/types.ts', start: 90, end: 90 }, { file: 'packages/core/session/src/repair.ts', start: 53, end: 70 }] },
] }
const reads = [{ file: 'packages/core/session/src/repair.ts', ranges: [[1, 211]] }, { file: 'packages/core/session/src/surface.ts', ranges: [[1, 40]] }, { file: 'apps/cli/src/main.ts', ranges: [[1, 9]] }]

test('answer files: cited files in paragraph order, then files only read', () => {
  const list = F.answerFiles(answer, reads, new Set(['docs/sub/x.md'])).sort((p, q) => p.order - q.order)
  assert.deepEqual(list.map(f => f.file), ['packages/core/session/src/repair.ts', 'docs/sub/x.md', 'packages/core/session/src/types.ts',
    'packages/core/session/src/surface.ts', 'apps/cli/src/main.ts'])
  assert.deepEqual(list[0].cited, [[53, 70], [167, 192]]); assert.deepEqual(list[0].paras, [0, 1])
  assert.deepEqual([list[1].cur, list[1].doc, list[0].cur], [true, true, false])
  assert.deepEqual([list[3].cited, list[3].read], [[], [[1, 40]]])
})

test('the tree: folders in the order of their first file, packages list their files, the rest kept behind a "+"', () => {
  const t = F.fileTree(F.answerFiles(answer, reads, new Set(['docs/sub/x.md'])), idx, roots, F.folderWords(idx, 'zh'))
  assert.deepEqual(t.kids.map(k => k.name), ['packages', 'docs', 'apps/cli/src'])
  assert.deepEqual([find(t, 'packages').kids.map(k => k.name), find(t, 'packages').hidden.dirs.map(o => o.name)], [['core'], ['web']])
  // the files of a package carry paths inside it
  const ses = find(t, 'packages/core/session')
  assert.equal(ses.pkg, true)
  assert.deepEqual(ses.files.map(f => f.name), ['src/repair.ts', 'src/types.ts', 'src/surface.ts'])
  assert.deepEqual([ses.cited, ses.read, ses.cur, ses.hidden], [2, 1, false, null])
  // what else a folder holds, as a file explorer lists it: folders by name with labels and sizes, then files
  assert.deepEqual(find(t, 'packages/core').hidden.dirs.map(o => o.name), ['tools'])
  assert.deepEqual(t.hidden.dirs.map(o => [o.name, o.label, o.total]), [['crates', '', 1], ['scripts', '脚本', 2], ['tests', '测试', 1]])
  assert.deepEqual(t.hidden.files, ['README.md', 'package.json'])
  // a folder with a listed file hides only its other files
  assert.deepEqual([find(t, 'docs').hidden.files, find(t, 'docs').hidden.dirs], [['y.md'], []])
  // the folder of the file the reader is on is marked up to the root
  assert.deepEqual([find(t, 'docs/sub').cur, t.cur, find(t, 'packages/core').cur], [true, true, false])
  // root files and the numbers of the root
  assert.deepEqual([t.files.length, t.all.length, t.cited], [0, 5, 3])
})
test('a joined folder chain keeps the label of its deepest labelled folder', () => {
  const files = F.liveFiles(['apps/cli/src/main.ts'], null)
  const t1 = F.fileTree(files, idx, roots, new Map([['apps', '应用入口']]))
  assert.deepEqual([t1.kids[0].name, t1.kids[0].label], ['apps/cli/src', '应用入口'])
  const t2 = F.fileTree(files, idx, roots, new Map([['apps', '应用入口'], ['apps/cli', '命令行']]))
  assert.equal(t2.kids[0].label, '命令行')
})
test('live files: read order, the file being read is marked', () => {
  const l = F.liveFiles(['a/1.ts', 'b/2.ts', 'a/1.ts'], 'c/3.ts')
  assert.deepEqual(l.map(f => [f.file, f.order, f.cur]), [['a/1.ts', 0, false], ['b/2.ts', 1, false], ['c/3.ts', 2, true]])
  const t = F.fileTree(l, null, null, new Map())
  assert.deepEqual(t.kids.map(k => k.dir), ['a', 'b', 'c'])
  assert.equal(t.hidden, null)
})
test('folder words name common top folders only, in the reader language', () => {
  const zh = F.folderWords(idx, 'zh'), en = F.folderWords(idx, 'en')
  assert.deepEqual([zh.get('docs'), zh.get('packages'), en.get('apps'), zh.get('crates'), zh.get('docs/sub')], ['文档', '各个包', 'entry apps', undefined, undefined])
})
test('a folder lists its folders and files by name', () => {
  const l = F.dirList(idx, 'packages/core/session', new Map([['packages/core/session/src', '源码']]))
  assert.deepEqual([l.dirs.map(d => [d.name, d.label, d.total]), l.files], [[['src', '源码', 3]], ['package.json']])
  assert.deepEqual(F.dirList(idx, 'nope', null), { dir: 'nope', dirs: [], files: [] })
})
test('a cited file in a folder the repository lacks still shows', () => {
  const t = F.fileTree(F.answerFiles({ paras: [{ evidence: [{ file: 'gone/deep/x.ts', start: 1, end: 2 }] }] }, [], null), idx, roots, new Map())
  assert.deepEqual([t.kids.map(k => k.name), t.kids[0].files.map(f => f.name)], [['gone/deep'], ['x.ts']])
})


test('a file gets the icon VS Code gives it; every icon named is in the set', () => {
  const svgs = fs.readFileSync(new URL('../src/client/icon-svgs.js', import.meta.url), 'utf8'), icons = fs.readFileSync(new URL('../src/client/icons.js', import.meta.url), 'utf8')
  const I = vm.runInThisContext(`(function () {\n${svgs}\n${icons}\nreturn { fileIconSvg, iconIds, ICON_SVGS } })()`)
  assert.deepEqual(I.iconIds().filter(id => !I.ICON_SVGS[id]), [])
  const id = f => Object.keys(I.ICON_SVGS).find(k => I.ICON_SVGS[k] === I.fileIconSvg(f))
  assert.deepEqual(['a/b/index.ts', 'x.d.ts', 'App.tsx', 'package.json', 'README.md', 'tsconfig.base.json', 'run.test.ts', 'q.unknown'].map(id),
    ['file-type-typescript', 'file-type-typescriptdef', 'file-type-reactts', 'file-type-npm', 'file-type-readme', 'file-type-tsconfig', 'file-type-testts', 'default-file'])
})

test('map cells: the biggest folders are split until there are enough cells', () => {
  const C = vm.runInThisContext(`(function () {\n${src}\nreturn folderCells })()`)
  // code kept a few folders deep: src/chrys/app is split, not drawn as one cell
  const paths = [...Array(60)].map((_, i) => `src/chrys/app/m${i % 6}/f${i}.py`).concat([...Array(30)].map((_, i) => `src/chrys/service/s${i % 3}/g${i}.py`), ['README.md', 'src/chrys/__init__.py', 'tests/t.py'])
  const c = C(paths, [], 10)
  assert.equal(c.cellOf('src/chrys/app/m1/f1.py'), 'src/chrys/app/m1/')
  assert.equal(c.cellOf('src/chrys/__init__.py'), 'src/chrys/')
  assert.equal(c.cellOf('README.md'), '(根目录)/')
  assert.equal(c.cellOf('tests/t.py'), 'tests/')
  assert.ok(c.size >= 10, String(c.size))
  // a region that is a sub-folder starts split
  assert.equal(C(['tests/a/x.py', 'tests/b/y.py', 'tests/z.py'], ['tests'], 1).cellOf('tests/a/x.py'), 'tests/a/')
  // few folders: no more splitting than there is
  assert.equal(C(['a/b.py', 'c.py'], [], 500).size, 2)
})

test('find: the file name first, letters in order, at most the limit', () => {
  const paths = ['src/web.js', 'src/client/app.js', 'tests/web.test.js', 'docs/webhooks.md', 'vendor/cw-uml.js', 'bench/panel-shots.mjs']
  assert.equal(F.findFiles(paths, 'web')[0], 'src/web.js')
  assert.deepEqual(F.findFiles(paths, 'cwuml'), ['vendor/cw-uml.js'])
  assert.equal(F.findFiles(paths, 'APP')[0], 'src/client/app.js')
  assert.deepEqual(F.findFiles(paths, '  '), [])
  assert.deepEqual(F.findFiles(paths, 'zzz'), [])
  assert.equal(F.findFiles(paths, 's', 2).length, 2)
})
test('find: 5000 paths take a few milliseconds', () => {
  const paths = Array.from({ length: 5000 }, (_, i) => `packages/p${i % 40}/src/mod${i}/file${i}.ts`)
  const t0 = performance.now(); F.findFiles(paths, 'mod12file'); const ms = performance.now() - t0
  assert.ok(ms < 200, ms + ' ms for 5000 paths')
})
