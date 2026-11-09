// src/readback.js: what a diagram says in plain lines, for the model to check against the code.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readBack, conditionsIn } from '../src/readback.js'
import { activityProblems, viewCjk } from '../src/check.js'

test('activity: an unnamed end, a one-way decision, a decision with no guard and a loop with no way out are problems', () => {
  const ok = { nodes: [{ id: 's', kind: 'start' }, { id: 'd', kind: 'decision', name: 'ok?' }, { id: 'a', kind: 'action', name: 'run' }, { id: 'e', kind: 'end', name: 'done' }, { id: 'f', kind: 'end', name: 'failed' }], flows: [{ from: 's', to: 'd' }, { from: 'd', to: 'a', guard: 'yes' }, { from: 'd', to: 'f', guard: 'no' }, { from: 'a', to: 'e' }] }
  assert.deepEqual(activityProblems(ok), [])
  const has = (spec, re) => assert.ok(activityProblems(spec).some(m => re.test(m)), re)
  has({ nodes: [{ id: 'e', kind: 'end' }], flows: [] }, /没有 name/)
  has({ nodes: [{ id: 'd', kind: 'decision' }, { id: 'e', kind: 'end', name: 'x' }], flows: [{ from: 'd', to: 'e', guard: 'y' }] }, /只有 1 个出口/)
  has({ nodes: [{ id: 'd', kind: 'decision' }, { id: 'e', kind: 'end', name: 'x' }, { id: 'f', kind: 'end', name: 'y' }], flows: [{ from: 'd', to: 'e', guard: 'y' }, { from: 'd', to: 'f' }] }, /没有写 guard/)
  has({ nodes: [{ id: 'a', kind: 'action', name: 'a' }, { id: 'b', kind: 'action', name: 'b' }, { id: 'e', kind: 'end', name: 'x' }], flows: [{ from: 'a', to: 'b' }, { from: 'b', to: 'a' }] }, /走不到任何结束节点/)
})

test('language: Chinese words in a diagram are found', () => {
  assert.deepEqual(viewCjk({ title: 'Flow', spec: { nodes: [{ name: '检查 rule' }, { name: 'run' }] } }), ['检查'])
  assert.deepEqual(viewCjk({ title: 'Flow', spec: { nodes: [{ name: 'run' }] } }), [])
})

test('class: every member reads as always there', () => {
  assert.match(readBack([{ type: 'class', title: 'c', spec: { classes: [{ id: 'a', name: 'A', fields: ['x'] }] } }]), /A 总是有：x（没有写条件）/)
})

test('conditions: sentences with a condition are found, strong ones first, links are plain, and the list is capped', () => {
  const c = conditionsIn([{ text: 'It runs if asked. It always loads. It is on [[by default|d1]] in the app. 只有登录后才显示。' }])
  assert.deepEqual(c, ['It is on by default in the app.', '只有登录后才显示。', 'It runs if asked.'])
  assert.equal(conditionsIn([{ text: 'a if b. c if d. e if f.' }], 2).length, 2)
  assert.deepEqual(conditionsIn(undefined), [])
})

test('activity: every path from start to end, and a loop stops at the step it returns to', () => {
  const t = readBack([{ type: 'activity', title: 'x', spec: { nodes: [{ id: 'a', kind: 'start' }, { id: 'b', name: 'check' }, { id: 'd', kind: 'decision', name: 'ok?' }, { id: 'c', name: 'write' }, { id: 'e', kind: 'end' }], flows: [{ from: 'a', to: 'b' }, { from: 'b', to: 'd' }, { from: 'd', to: 'c', guard: 'yes' }, { from: 'd', to: 'b', guard: 'no' }, { from: 'c', to: 'e' }] } }])
  assert.match(t, /路径 1：check → ok\? → \[yes\] write → 结束/)
  assert.match(t, /路径 2：check → ok\? → \[no\] 回到 check/)
})

test('sequence: a message outside every frame reads as on all paths', () => {
  const t = readBack([{ type: 'sequence', title: 'x', spec: JSON.stringify({ lifelines: [{ id: 'u', name: 'U' }, { id: 's', name: 'S' }], messages: [{ id: 'm1', from: 'u', to: 's', text: 'ask' }, { id: 'm2', from: 's', to: 'u', text: 'denied' }, { id: 'm3', from: 's', to: 's', text: 'run' }], frags: [{ kind: 'opt', label: 'deny', from: 'm2', to: 'm2' }] }) }])
  assert.match(t, /只在 opt \[deny\] 时：S → U：denied/)
  assert.match(t, /所有路径都发生：S → S：run/)
})

test('state and component: an edge with no condition is called out; a view with no reading gives nothing', () => {
  const t = readBack([{ type: 'state', title: 's', spec: { states: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }], transitions: [{ from: 'a', to: 'b' }] } }, { type: 'component', title: 'c', spec: { nodes: [{ id: 'a', name: 'A' }, { id: 'b', name: 'B' }], deps: [['a', 'b']] } }])
  assert.match(t, /A → B（没有写条件/)
  assert.match(t, /A 依赖 B/)
  assert.equal(readBack([{ type: 'usecase', spec: {} }]), '')
  assert.equal(readBack([{ type: 'activity', spec: 'not json' }]), '')
})
