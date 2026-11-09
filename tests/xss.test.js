// Model output is data: a diagram spec must not put markup into the page. The spec comes from the model, and the
// model reads the repository, so a file in it could ask for such a spec.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { checkAnswer } from '../src/check.js'

const BAD = 'part"><img src=x onerror=alert(1)>'

// cw-uml is a browser script: run it with a stub element that keeps the first markup it gets
function draw(spec) {
  globalThis.getComputedStyle ??= () => ({})
  if (!globalThis.CWUML) new Function(fs.readFileSync(new URL('../vendor/cw-uml.js', import.meta.url), 'utf8'))()
  let html = ''
  const el = { set innerHTML(v) { if (!html) html = v; throw new Error('STOP') }, get innerHTML() { return html }, clientWidth: 600, getBoundingClientRect: () => ({ width: 600 }) }
  try { globalThis.CWUML.render(el, spec, { width: 600 }) } catch (e) { if (e.message !== 'STOP') throw e }
  return html
}

const SPECS = {
  sequence: { type: 'sequence', lifelines: [{ id: 'a', name: 'A', kind: BAD }, { id: 'b', name: 'B' }], messages: [{ id: 'm1', from: 'a', to: 'b', text: 'go', kind: BAD }] },
  component: { type: 'component', nodes: [{ id: 'a', name: 'A', kind: BAD, layer: 0 }, { id: 'b', name: 'B', layer: 1 }], deps: [['a', 'b']] },
}

for (const [type, spec] of Object.entries(SPECS)) {
  test(`${type}: a kind with markup does not reach the page`, () => {
    const html = draw(structuredClone(spec))
    assert.ok(html.length > 0, 'drawn')
    assert.ok(!html.includes('<img'), html.slice(0, 200))
  })
}

test('the answer check drops a kind that is not a short word', () => {
  const r = checkAnswer({
    take: '结论', kind: 'explain',
    views: [{ id: 'v1', type: 'sequence', title: 't', spec: JSON.stringify(SPECS.sequence) }],
    paras: [{ text: '一', view: 'v1', now: ['m1'], upto: 'm1', evidence: [] }, { text: '二', view: 'v1', now: [], upto: '', evidence: [] }],
    followups: ['a', 'b'],
  }, process.cwd(), new Map(), true)
  assert.equal(r.ok, true, JSON.stringify(r.errors))
  const s = r.answer.views[0].spec, spec = typeof s === 'string' ? JSON.parse(s) : s
  assert.equal(spec.lifelines[0].kind, undefined)
  assert.ok(!JSON.stringify(r.answer).includes('<img'))
})

const card = spec => checkAnswer({
  take: '结论', kind: 'explain',
  views: [{ id: 'v1', type: spec.type, title: 't', spec: JSON.stringify(spec) }],
  paras: [{ text: '一', view: 'v1', now: [], upto: '', evidence: [] }, { text: '二', view: 'v1', now: [], upto: '', evidence: [] }],
  followups: ['a', 'b'],
}, process.cwd(), new Map(), false)
const specOf = r => { const s = r.answer.views[0].spec; return typeof s === 'string' ? JSON.parse(s) : s }

test('a colour that is not a colour does not reach the page', () => {
  const evil = 'red;cursor:url(https://evil.example/x.png),auto'
  const spec = { type: 'sequence', lifelines: [{ id: 'a', name: 'A', kind: 'actor', color: evil }, { id: 'b', name: 'B', color: '#3a7' }], messages: [{ id: 'm1', from: 'a', to: 'b', text: 'go' }] }
  assert.ok(!draw(structuredClone(spec)).includes('evil.example'))
  const r = card(spec)
  assert.equal(r.ok, true, JSON.stringify(r.errors))
  assert.equal(specOf(r).lifelines[0].color, undefined); assert.equal(specOf(r).lifelines[1].color, '#3a7')
})

test('grid numbers are kept small: a huge row cannot make a huge loop', () => {
  const spec = { type: 'deployment', nodes: [{ id: 'a', name: 'A', row: 1e9, col: -5 }, { id: 'b', name: 'B', span: 'x' }], links: [['a', 'b', 'http']] }
  const r = card(spec)
  assert.equal(r.ok, true, JSON.stringify(r.errors))
  const s = specOf(r)
  assert.equal(s.nodes[0].row, 40); assert.equal(s.nodes[0].col, 0); assert.equal(s.nodes[1].span, undefined)
})

test('a diagram with too many elements, or items that are not objects, is sent back without throwing', () => {
  const big = { type: 'component', nodes: Array.from({ length: 900 }, (_, i) => ({ id: 'n' + i, name: 'N', layer: 0 })), deps: [] }
  const r = card(big)
  assert.equal(r.ok, false); assert.match(r.errors.join('\n'), /太大/)
  const holes = card({ type: 'component', nodes: [null, 3, { id: 'a', name: 'A' }, { id: 'b', name: 'B' }], deps: [['a', 'b']] })
  assert.equal(holes.ok, true, JSON.stringify(holes.errors)); assert.equal(specOf(holes).nodes.length, 2)
})

test('a grid number given as an array or object is dropped; long strings are cut', () => {
  const spec = { type: 'deployment', nodes: [{ id: 'a', name: 'x'.repeat(5000), row: [1e9], col: { v: 1 } }, { id: 'b', name: 'B' }], links: [['a', 'b', 'http']] }
  const r = card(spec)
  assert.equal(r.ok, true, JSON.stringify(r.errors))
  const s = specOf(r)
  assert.equal(s.nodes[0].row, undefined); assert.equal(s.nodes[0].col, undefined); assert.ok(s.nodes[0].name.length <= 401)
  // the drawing caps its own grid numbers too
  assert.ok(draw({ type: 'deployment', nodes: [{ id: 'a', name: 'A', row: [1e9] }, { id: 'b', name: 'B' }], links: [['a', 'b', 'x']] }).length > 0)
})

test('arrays count toward the size; a spec whose shape throws is sent back', () => {
  const deps = Array.from({ length: 1000 }, (_, i) => ['a', 'b'])
  const r = card({ type: 'component', nodes: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }], deps })
  assert.equal(r.ok, false); assert.match(r.errors.join('\n'), /太大/)
  const f = card({ type: 'sequence', lifelines: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }], messages: [{ id: 'm1', from: 'a', to: 'b', text: 'x' }], frags: [null] })
  assert.equal(f.ok, false); assert.match(f.errors.join('\n'), /结构不对/)
})

test('strings inside arrays are cut; empty operands, bad notes and repeated view ids are sent back or dropped', () => {
  const d = card({ type: 'deployment', nodes: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }], links: [['a', 'b', 'y'.repeat(3000)]] })
  assert.equal(d.ok, true, JSON.stringify(d.errors)); assert.ok(specOf(d).links[0][2].length <= 401)
  const seq = { type: 'sequence', lifelines: [{ id: 'a', name: 'A', kind: 'actor' }, { id: 'b', name: 'B' }], messages: [{ id: 'm1', from: 'a', to: 'b', text: 'x' }] }
  const op = card({ ...seq, frags: [{ id: 'f1', kind: 'loop', operands: [] }] })
  assert.equal(op.ok, false); assert.match(op.errors.join('\n'), /operands/)
  const notes = card({ ...seq, notes: [{ text: 'ok', on: ['a'] }, { text: 'bad', on: 'a' }, { on: ['nope'], text: 'x' }, null] })
  assert.equal(notes.ok, true, JSON.stringify(notes.errors)); assert.deepEqual(specOf(notes).notes, [{ text: 'ok', on: ['a'] }])
  const two = checkAnswer({
    take: '结论', kind: 'explain',
    views: [{ id: 'v1', type: 'sequence', title: 't', spec: JSON.stringify(seq) }, { id: 'v1', type: 'sequence', title: 't2', spec: JSON.stringify(seq) }],
    paras: [{ text: '一', view: 'v1', now: [], upto: '', evidence: [] }, { text: '二', view: 'v1', now: [], upto: '', evidence: [] }],
    followups: ['a', 'b'],
  }, process.cwd(), new Map(), false)
  assert.equal(two.ok, false); assert.match(two.errors.join('\n'), /重复/)
})

test('evidence: an unknown kind counts as inferred; git\'s own folder is never a cited file', () => {
  const r = checkAnswer({
    take: '结论', kind: 'explain', views: [],
    paras: [{ text: '一', evidence: [{ file: 'README.md', start: 1, end: 1, quote: '', kind: 'x" onmouseover="y' }, { file: '.git/config', start: 1, end: 1, quote: '[core]', kind: 'read' }] }, { text: '二', evidence: [] }],
    followups: ['a', 'b'],
  }, process.cwd(), new Map(), true)
  assert.equal(r.ok, true, JSON.stringify(r.errors))
  const [a, b] = r.answer.paras[0].evidence
  assert.equal(a.kind, 'inferred'); assert.equal(a.status, 'inferred')
  assert.equal(b.status, 'missing')
})

test('ids that every object has (constructor, toString) are sent back', () => {
  const r = card({ type: 'component', nodes: [{ id: 'constructor', name: 'A' }, { id: 'b', name: 'B' }], deps: [['constructor', 'b']] })
  assert.equal(r.ok, false); assert.match(r.errors.join('\n'), /保留字/)
})

test('deployment: a node kind keeps its class name (the helper is not shadowed by the grid)', () => {
  const html = draw({ type: 'deployment', nodes: [{ id: 'a', name: 'A', kind: 'cloud' }, { id: 'b', name: 'B' }], links: [['a', 'b', 'x']] })
  assert.match(html, /cu-k-cloud/)
})

test('evidence: git\'s folder by a short name is not a cited file either', (t) => {
  const short = fs.readdirSync(process.cwd()).includes('.git') ? 'GIT~1/config' : null
  if (!short || !fs.existsSync(path.join(process.cwd(), short))) { t.skip('no 8.3 short names here'); return }
  const r = checkAnswer({ take: '结论', kind: 'explain', views: [],
    paras: [{ text: '一', evidence: [{ file: short, start: 1, end: 1, quote: '[core]', kind: 'read' }] }, { text: '二', evidence: [] }], followups: ['a', 'b'] }, process.cwd(), new Map(), true)
  assert.equal(r.answer.paras[0].evidence[0].status, 'missing')
})

test('a folder whose name starts with two dots is inside the repository', async () => {
  const { relPath } = await import('../src/check.js')
  assert.equal(relPath('/repo', '/repo/..notes/a.js'.replaceAll('/', path.sep)), '..notes/a.js')
  assert.equal(relPath('/repo', '/other/a.js'.replaceAll('/', path.sep)), null)
})

test('evidence: a tracked file deleted from the working tree is missing', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-del-'))
  fs.mkdirSync(path.join(root, 'src')); fs.writeFileSync(path.join(root, 'src', 'gone.js'), 'x\n')
  execFileSync('git', ['-C', root, 'init', '-q']); execFileSync('git', ['-C', root, 'add', '.'])
  fs.rmSync(path.join(root, 'src', 'gone.js'))
  const r = checkAnswer({ take: '结论', kind: 'explain', views: [],
    paras: [{ text: '一', evidence: [{ file: 'gone.js', start: 1, end: 1, quote: 'x', kind: 'read' }] }, { text: '二', evidence: [] }], followups: ['a', 'b'] }, root, new Map(), true)
  assert.equal(r.answer.paras[0].evidence[0].status, 'missing')
})
