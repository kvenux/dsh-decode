// src/check.js: the answer check that runs on every submit_answer. A small repository is written to a temp folder.
import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { checkAnswer, checkAreas, cjkShare, codeNames, trackedFiles, VIEW_TYPES } from '../src/check.js'

let root
const FILES = {
  'src/install.js': [
    '// Install packages for the host.',                                                               // 1
    'export async function install(names, opts) {',                                                    // 2
    '  const preflight = []',                                                                           // 3
    '  // An install command names the packages it adds, so their manifests are read and checked before', // 4
    '  // anything is written.',                                                                        // 5
    '  for (const n of names) {',                                                                       // 6
    '    const m = await readManifest(n)',                                                              // 7
    '    if (!m) preflight.push(n)',                                                                    // 8
    '  }',                                                                                              // 9
    "  log('checked', names.length)",                                                                   // 10
    "  log('preflight', preflight.length)",                                                             // 11
    "  log('opts', opts)",                                                                              // 12
    "  log('again')",                                                                                   // 13
    "  log('more')",                                                                                    // 14
    "  if (preflight.length > 0) return rejected(preflight, 'nothing was installed')",                  // 15
    '  return commit(names)',                                                                           // 16
    '}',                                                                                                // 17
    '// The session log is append-only: every event is one JSON line, and a reader',                   // 18
    '// skips lines it cannot parse.',                                                                  // 19
  ].join('\n'),
  // a path git quotes unless asked for raw paths
  'docs/快照/说明.md': '# 快照',
  'README.md': ['# Hot reload', '', '`hmr` keeps open pages in sync with the plugin graph.', '', 'Enable/disable changes take effect without a reload.'].join('\n'),
}
before(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-check-'))
  for (const [f, text] of Object.entries(FILES)) { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), text) }
  // git ls-files lets a cited path that names only the end of a file resolve
  execFileSync('git', ['init', '-q'], { cwd: root, stdio: 'ignore' }); execFileSync('git', ['-c', 'core.autocrlf=false', 'add', '.'], { cwd: root, stdio: 'ignore' })
})
after(() => { fs.rmSync(root, { recursive: true, force: true }) })

const SEQ = { lifelines: [{ id: 'user', name: '你', kind: 'actor' }, { id: 'core', name: '核心' }],
  messages: [{ id: 'm1', from: 'user', to: 'core', text: '提交' }, { id: 'm2', from: 'core', to: 'user', text: '返回结果', kind: 'return' }] }
const answer = (over = {}) => ({
  take: '安装前先检查每个包的清单', kind: 'explain',
  views: [{ id: 'v1', type: 'sequence', title: '安装', spec: JSON.stringify(SEQ) }],
  paras: [{ text: '先提交。', view: 'v1', now: ['m1'], upto: 'm1', evidence: [] }, { text: '再返回。', view: 'v1', now: ['m2'], upto: 'm2', evidence: [] }],
  followups: ['a', 'b'], ...over,
})
const ev = (e, reads = new Map()) => {
  const r = checkAnswer(answer({ paras: [{ text: '一', view: 'v1', now: ['m1'], upto: '', evidence: [e] }, { text: '二', view: 'v1', now: [], upto: '', evidence: [] }] }), root, reads, false)
  assert.equal(r.ok, true, JSON.stringify(r.errors))
  return r.answer.paras[0].evidence[0]
}

// ------------------------------------------------------------------ evidence: checked by content
test('a quoted line is found: verified', () => {
  const e = ev({ file: 'src/install.js', start: 7, end: 7, quote: 'const m = await readManifest(n)', kind: 'read' })
  assert.equal(e.status, 'verified'); assert.deepEqual([e.start, e.end], [7, 7])
})
test('drifted line numbers are corrected from the quote', () => {
  const e = ev({ file: 'src/install.js', start: 40, end: 42, quote: 'const m = await readManifest(n)', kind: 'read' })
  assert.equal(e.status, 'verified'); assert.deepEqual([e.start, e.end], [7, 7])
})
test('adjacent quoted lines and line-number prefixes are accepted', () => {
  const e = ev({ file: 'src/install.js', start: 6, end: 7, quote: '6: for (const n of names) {\n7:   const m = await readManifest(n)', kind: 'read' })
  assert.equal(e.status, 'verified'); assert.deepEqual([e.start, e.end], [6, 7])
})
test('a path that names only the end of a tracked file resolves', () => {
  const e = ev({ file: 'install.js', start: 7, end: 7, quote: 'const m = await readManifest(n)', kind: 'read' })
  assert.equal(e.file, 'src/install.js'); assert.equal(e.status, 'verified')
})
test('a file that does not exist: missing', () => {
  assert.equal(ev({ file: 'src/nope.js', start: 1, end: 2, quote: 'x', kind: 'read' }).status, 'missing')
})
test('inferred evidence stays inferred; a quote not in the file stays unverified', () => {
  assert.equal(ev({ file: 'src/install.js', start: 1, end: 2, quote: '', kind: 'inferred' }).status, 'inferred')
  assert.equal(ev({ file: 'src/install.js', start: 1, end: 2, quote: 'const nothing = here()', kind: 'read' }).status, 'unverified')
})
test('a line the model put together from two places is not verified', () => {
  // seen in q07 (packages/client/hmr/README.md): the claim was right, but this text is not in the file
  const e = ev({ file: 'README.md', start: 3, end: 3, quote: '`hmr` keeps open pages in sync with the plugin graph. Enable/disable changes take effect without a reload.', kind: 'read' })
  assert.equal(e.status, 'unverified')
})
test('seen: the lines were read in this session', () => {
  const reads = new Map([['src/install.js', [[1, 10]]]])
  assert.equal(ev({ file: 'src/install.js', start: 7, end: 7, quote: 'const m = await readManifest(n)', kind: 'read' }, reads).seen, true)
  assert.equal(ev({ file: 'src/install.js', start: 15, end: 15, quote: "if (preflight.length > 0) return rejected(preflight, 'nothing was installed')", kind: 'read' }, reads).seen, false)
})
// known false "unverified" (bench/review-2026-11-04.md): the quote is real, the matcher misses it
test('two quoted lines apart inside the cited range are verified', { todo: 'seen in q07 operations.ts:344-363 and q11 index.ts:638-647' }, () => {
  const e = ev({ file: 'src/install.js', start: 4, end: 15, quote: '  // An install command names the packages it adds, so their manifests are read and checked before\n  if (preflight.length > 0) return rejected(preflight, \'nothing was installed\')', kind: 'read' })
  assert.equal(e.status, 'verified')
})
test('a comment the model wrapped at other places is verified', { todo: 'seen in q05: the matcher compares line by line' }, () => {
  const e = ev({ file: 'src/install.js', start: 18, end: 19, quote: '// The session log is append-only:\n// every event is one JSON line, and a reader skips lines it cannot parse.', kind: 'read' })
  assert.equal(e.status, 'verified')
})

// ------------------------------------------------------------------ views and paragraphs
test('the table view is gone; every view type is a cw-uml kind the prompt teaches', () => {
  assert.ok(!VIEW_TYPES.includes('table'))
  const r = checkAnswer(answer({ views: [{ id: 'v1', type: 'table', title: 't', spec: '{}' }] }), root, new Map(), false)
  assert.equal(r.ok, false); assert.match(r.errors.join('\n'), /type 只能是/)
})
test('an answer without a diagram is sent back on the first submit, accepted on a later one', () => {
  const first = checkAnswer(answer({ views: [] }), root, new Map(), false)
  assert.equal(first.ok, false); assert.match(first.errors[0], /没有图/)
  const later = checkAnswer(answer({ views: [] }), root, new Map(), true)
  assert.equal(later.ok, true); assert.equal(later.answer.views.length, 0)
})
test('branches of a frame: any order is accepted, one message in two branches is sent back', () => {
  const frame = operands => answer({ views: [{ id: 'v1', type: 'sequence', title: 't', spec: JSON.stringify({ ...SEQ, frags: [{ id: 'f1', kind: 'alt', operands }] }) }] })
  assert.equal(checkAnswer(frame([{ guard: 'b', from: 'm2', to: 'm2' }, { guard: 'a', from: 'm1', to: 'm1' }]), root, new Map(), false).ok, true)
  const twice = checkAnswer(frame([{ guard: 'a', from: 'm1', to: 'm2' }, { guard: 'b', from: 'm1', to: 'm1' }]), root, new Map(), false)
  assert.equal(twice.ok, false); assert.match(twice.errors.join(' '), /分支有重叠/)
})
test('a diagram that cannot be drawn: sent back first, dropped later', () => {
  const bad = { views: [{ id: 'v1', type: 'sequence', title: 't', spec: '{bad' }] }
  const first = checkAnswer(answer(bad), root, new Map(), false)
  assert.equal(first.ok, false); assert.match(first.errors.join('\n'), /不是合法 JSON/)
  const later = checkAnswer(answer(bad), root, new Map(), true)
  assert.equal(later.ok, true); assert.equal(later.answer.views.length, 0); assert.match(later.repairs.join('\n'), /画不出来/)
})
test('fewer than two paragraphs or no conclusion is sent back', () => {
  const r = checkAnswer(answer({ take: '', paras: [answer().paras[0]] }), root, new Map(), false)
  assert.equal(r.ok, false); assert.match(r.errors.join('\n'), /至少 2 段/); assert.match(r.errors.join('\n'), /take 不能为空/)
})
test('a step id written as text becomes the step\'s words, linked to the diagram', () => {
  const r = checkAnswer(answer({ paras: [{ text: '用户先 m1，然后等待', view: 'v1', now: ['m1'], upto: 'm1', evidence: [] }, answer().paras[1]] }), root, new Map(), false)
  assert.equal(r.ok, true); assert.equal(r.answer.paras[0].text, '用户先 [[提交|m1]]，然后等待'); assert.match(r.repairs.join('\n'), /编号换成了文字/)
})
test('a sequence paragraph that names no message walks the messages up to its upto', () => {
  const r = checkAnswer(answer({ paras: [answer().paras[0], { text: '再返回。', view: 'v1', now: [], upto: 'm2', evidence: [] }] }), root, new Map(), false)
  assert.deepEqual(r.answer.paras[1].now, ['m2'])
})
test('an unknown paragraph view falls back to the previous paragraph\'s view', () => {
  const r = checkAnswer(answer({ paras: [answer().paras[0], { text: '二', view: 'nope', now: ['m2'], upto: '', evidence: [] }] }), root, new Map(), false)
  assert.equal(r.answer.paras[1].view, 'v1'); assert.match(r.repairs.join('\n'), /不存在/)
})
test('a matrix (removed) is sent back, and dropped from a final answer', () => {
  const spec = { rows: [{ id: 'r1', name: '读' }], cols: [{ id: 'c1', name: '标准' }], cell: { r1: { c1: '✓' } } }
  const views = [answer().views[0], { id: 'v2', type: 'matrix', title: 'm', spec: JSON.stringify(spec) }]
  const first = checkAnswer(answer({ views }), root, new Map(), false)
  assert.equal(first.ok, false); assert.match(first.errors.join('\n'), /type 只能是/)
  const last = checkAnswer(answer({ views }), root, new Map(), true)
  assert.deepEqual(last.answer.views.map(v => v.type), ['sequence']); assert.match(last.repairs.join('\n'), /画不出来/)
})
test('a use case diagram: actors, cases and links are checked; a broken group, side or include is repaired', () => {
  const spec = { system: '插件管理页', actors: [{ id: 'user', name: '你', side: 'top' }, { id: 'market', name: '插件市场', side: 'right' }],
    cases: [{ id: 'install', name: '安装插件', group: 'nope' }, { id: 'toggle', name: '启用或停用' }],
    links: [['user', 'install'], ['user', 'toggle'], ['market', 'install']], includes: [['install', 'toggle', 'extend'], ['install', 'gone']] }
  const paras = [{ text: '一', view: 'u1', now: [], upto: '', evidence: [] }, { text: '二', view: 'u1', now: ['install'], upto: '', evidence: [] }]
  const r = checkAnswer(answer({ kind: 'use', views: [{ id: 'u1', type: 'usecase', title: 'u', spec: JSON.stringify(spec) }], paras }), root, new Map(), false)
  const s = r.answer.views[0].spec
  assert.equal(r.answer.kind, 'use'); assert.equal(r.answer.views[0].type, 'usecase')
  assert.equal(s.actors[0].side, undefined); assert.equal(s.actors[1].side, 'right'); assert.equal(s.cases[0].group, undefined)
  assert.deepEqual(s.includes, [['install', 'toggle', 'extend']]); assert.deepEqual(r.answer.paras[1].now, ['install'])
  const bad = checkAnswer(answer({ views: [{ id: 'u1', type: 'usecase', title: 'u', spec: JSON.stringify({ ...spec, links: [['user', 'nope']] }) }], paras }), root, new Map(), false)
  assert.equal(bad.ok, false); assert.match(bad.errors.join('\n'), /不存在的case "nope"/)
})

// ------------------------------------------------------------------ reader checks (first submit only)
test('the answer follows the language of the question', () => {
  const en = checkAnswer(answer(), root, new Map(), false, { en: true })
  assert.equal(en.ok, false); assert.match(en.errors[0], /asked in English/)
  const long = 'The installer reads every manifest before it writes anything, so a bad package stops the whole install. '.repeat(3)
  const zh = checkAnswer(answer({ take: 'Install checks manifests first', paras: [{ ...answer().paras[0], text: long }, { ...answer().paras[1], text: long }] }), root, new Map(), false, { en: false })
  assert.equal(zh.ok, false); assert.match(zh.errors[0], /读者用中文提问/)
  assert.equal(checkAnswer(answer(), root, new Map(), true, { en: true }).ok, true)
})
test('a flow paragraph with more than ten code names is sent back; a locate answer may name code', () => {
  const text = '`a1` `a2` `a3` `a4` `a5` `a6` `a7` `a8` `a9` `a10` `a11` 依次运行'
  const flow = checkAnswer(answer({ kind: 'flow', paras: [{ ...answer().paras[0], text }, answer().paras[1]] }), root, new Map(), false)
  assert.equal(flow.ok, false); assert.match(flow.errors[0], /11 个代码名/)
  assert.equal(checkAnswer(answer({ kind: 'locate', paras: [{ ...answer().paras[0], text }, answer().paras[1]] }), root, new Map(), false).ok, true)
})
test('codeNames and cjkShare', () => {
  assert.deepEqual(codeNames('先调 `install`，再看 session.log 和 readManifest、pre_flight').sort(), ['install', 'pre_flight', 'readManifest', 'session.log'])
  assert.ok(cjkShare('安装前先检查清单') > 0.9)
  assert.ok(cjkShare('The installer checks every manifest first `安装`') < 0.1)
})

// ------------------------------------------------------------------ areas: what the folders are for
test('tracked files keep paths with non-ASCII characters as they are', () => {
  assert.ok(trackedFiles(root).includes('docs/快照/说明.md'), trackedFiles(root).join(' | '))
})
test('areas keep folders of the repository only, with one short line each', () => {
  const fixes = []
  const out = checkAreas([
    { path: 'src/', role: '  安装\n命令 ' }, { path: 'src', role: '重复的' }, { path: 'docs/快照', role: '测试快照' },
    { path: 'nope', role: '不存在' }, { path: 'src/install.js', role: '一个文件不是目录' }, { path: '../x', role: '仓库外' },
    { path: 'docs', role: '这是一句很长很长很长很长很长很长很长很长很长很长的用途说明' }, { role: '没有路径' }, 'docs', null,
  ], root, m => fixes.push(m))
  assert.deepEqual(out.map(x => x.path), ['src', 'docs/快照', 'docs'])
  assert.equal(out[0].role, '安装 命令')
  assert.equal([...out[2].role].length, 24); assert.ok(out[2].role.endsWith('…'))
  assert.equal(fixes.length, 2)
  assert.deepEqual(checkAreas(undefined, root), [])
})
test('an answer without areas is accepted; its areas are checked', () => {
  const r0 = checkAnswer(answer(), root, new Map(), false)
  assert.deepEqual([r0.ok, r0.answer.areas], [true, []])
  const r1 = checkAnswer(answer({ areas: [{ path: 'src', role: '安装命令' }, { path: 'lib', role: '没有' }] }), root, new Map(), false)
  assert.equal(r1.ok, true); assert.deepEqual(r1.answer.areas, [{ path: 'src', role: '安装命令' }])
})

test('fileTypes: the tracked file types, most first', async () => {
  const { fileTypes } = await import('../src/check.js')
  assert.deepEqual(fileTypes(['a/b.js', 'c.JS', 'd.md', 'Makefile', 'e.test.js'], 2), ['.js 3', '.md 1'])
})
