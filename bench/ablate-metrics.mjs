// What each ablation variant gave, from out/abl-<name>/ (rows and event logs): per question and in sum.
//   node bench/ablate-metrics.mjs <name> [<name> ...] [--json out.json]
import fs from 'node:fs'; import path from 'node:path'
import {codeNames, cjkShare} from '../src/check.js'
const here = import.meta.dirname
const names = process.argv.slice(2).filter((a, i, l) => !a.startsWith('--') && l[i - 1] !== '--json')
const jsonOut = (() => { const i = process.argv.indexOf('--json'); return i > 0 ? process.argv[i + 1] : null })()
// the diagram the choosing rule names for each kind of question (compare and explain allow several)
const EXPECT = {flow: ['sequence'], impact: ['component'], state: ['state'], decision: ['activity'], compare: ['sequence', 'component', 'package'],
  data: ['class'], deploy: ['deployment'], explain: ['component', 'package'], use: ['usecase'], locate: null}
const plain = s => String(s || '').replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
function one(name, id) {
  const dir = path.join(here, 'out', 'abl-' + name)
  let r; try { r = JSON.parse(fs.readFileSync(path.join(dir, id + '.row.json'), 'utf8')) } catch { return {id, missing: true} }
  const ev = (() => { try { return fs.readFileSync(path.join(dir, id + '.jsonl'), 'utf8').split('\n').filter(l => l.startsWith('{')).map(l => JSON.parse(l)) } catch { return [] } })()
  const res = new Map(ev.filter(e => e.type === 'tool_result').map(e => [e.callId, e]))
  // why a submit was sent back: the first line of each refused submit's result
  const back = ev.filter(e => e.type === 'tool_call' && e.tool === 'submit_answer').map(c => res.get(c.callId)).filter(x => x && x.status !== 'completed')
    .map(x => String(x.error || x.result || '').replace(/\s+/g, ' ').slice(0, 140))
  const a = r.answer, paras = a?.paras || [], evd = paras.flatMap(p => p.evidence || [])
  const names = paras.map(p => codeNames(p.text).length)
  const text = [a?.take, ...paras.map(p => plain(p.text))].join('\n')
  const types = (a?.views || []).map(v => v.type), want = EXPECT[r.kind]
  const final = ev.find(e => e.type === 'final')
  return {id, kind: r.kind, ok: r.ok, submitted: r.attempts > 0, plainChars: r.attempts ? 0 : String(final?.text || '').length,
    secs: r.secs, steps: r.usage?.steps, out: r.usage?.output, inNew: r.usage?.input, inCache: r.usage?.cacheRead, tools: r.tools, shell: (r.byTool?.pwsh || 0) + (r.byTool?.bash || 0),
    backs: Math.max(0, r.attempts - 1), back, repairs: r.repairs?.length || 0,
    paras: paras.length, chars: text.length, namesMax: Math.max(0, ...names), namesAvg: names.length ? +(names.reduce((x, y) => x + y, 0) / names.length).toFixed(1) : 0,
    cjk: +cjkShare(text).toFixed(2), take: String(a?.take || '').length,
    ev: evd.length, evOk: evd.filter(e => e.status === 'verified').length, evMissing: evd.filter(e => e.status === 'missing').length, evInferred: evd.filter(e => e.kind === 'inferred').length,
    evRan: evd.filter(e => e.kind === 'ran').length, evLong: evd.filter(e => e.end - e.start + 1 > 30).length, evDoc: evd.filter(e => /\.md$/i.test(e.file)).length,
    types: types.join('+'), typeOk: want ? types.some(t => want.includes(t)) : null, areas: a?.areas?.length || 0}
}
const qs = JSON.parse(fs.readFileSync(path.join(here, 'questions.json'), 'utf8')).map(q => q.id)
const all = {}
for (const n of names) all[n] = qs.map(id => one(n, id)).filter(x => !x.missing)
const sum = list => {
  const s = k => list.reduce((x, r) => x + (Number(r[k]) || 0), 0), avg = k => list.length ? +(s(k) / list.length).toFixed(1) : 0
  const okl = list.filter(r => r.ok)
  return {n: list.length, ok: okl.length, noSubmit: list.filter(r => !r.submitted).length, secs: avg('secs'), steps: avg('steps'), outK: +(s('out') / list.length / 1000).toFixed(1),
    inNewK: +(s('inNew') / list.length / 1000).toFixed(0), inCacheK: +(s('inCache') / list.length / 1000).toFixed(0), tools: avg('tools'), shell: s('shell'),
    backs: s('backs'), repairs: s('repairs'), paras: +(okl.reduce((x, r) => x + r.paras, 0) / (okl.length || 1)).toFixed(1),
    chars: Math.round(okl.reduce((x, r) => x + r.chars, 0) / (okl.length || 1)), namesAvg: +(okl.reduce((x, r) => x + r.namesAvg, 0) / (okl.length || 1)).toFixed(2),
    namesOver3: okl.filter(r => r.namesMax > 3).length, cjk: +(okl.reduce((x, r) => x + r.cjk, 0) / (okl.length || 1)).toFixed(2),
    ev: s('ev'), evOkPct: s('ev') ? Math.round(100 * s('evOk') / s('ev')) : 0, evMissing: s('evMissing'), evInferred: s('evInferred'), evRan: s('evRan'), evLong: s('evLong'), evDoc: s('evDoc'),
    typeOk: `${okl.filter(r => r.typeOk === true).length}/${okl.filter(r => r.typeOk !== null).length}`, areas: +(okl.reduce((x, r) => x + r.areas, 0) / (okl.length || 1)).toFixed(1)}
}
const table = Object.fromEntries(names.map(n => [n, sum(all[n])]))
console.table(table)
for (const n of names) {
  console.log(`\n${n}: per question`)
  console.table(all[n].map(r => ({id: r.id, ok: r.ok, secs: r.secs, steps: r.steps, outK: +(r.out / 1000).toFixed(1), backs: r.backs, shell: r.shell, paras: r.paras, names: r.namesAvg, ev: `${r.evOk}/${r.ev}`, types: r.types, typeOk: r.typeOk})))
  for (const r of all[n]) if (r.back.length) console.log(`  ${r.id} sent back: ${r.back.join(' | ')}`)
  for (const r of all[n]) if (!r.submitted) console.log(`  ${r.id} answered in a plain message (${r.plainChars} chars)`)
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({summary: table, rows: all}, null, 1))
