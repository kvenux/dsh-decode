// Read the paired review back: candidate minus reference, per reviewer and per dimension.
//   node bench/pair-tally.mjs <review dir>     (needs ../key.json, and codex.json and/or subagent.json)
// Gain = change in 正确性 + 心智模型. Writes tally.json and prints a line per reviewer and the verdict of the keep rule:
// keep when the mean gain is above 0, neither reviewer's gain is below 0, and 注意力成本 does not fall by more than the gain.
import fs from 'node:fs'; import path from 'node:path'
const dir = process.argv[2], key = JSON.parse(fs.readFileSync(path.join(dir, '..', 'key.json'), 'utf8'))
const DIMS = ['正确性', '证据可核查', '心智模型', '注意力成本', 'total']
const read = f => { try { const t = fs.readFileSync(path.join(dir, f), 'utf8'); return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)) } catch { return null } }
const avg = a => a.reduce((x, y) => x + y, 0) / a.length, r1 = x => Math.round(x * 100) / 100
const out = { reviewers: {} }
for (const [name, f] of [['codex', 'codex.json'], ['subagent', 'subagent.json'], ['subagent2', 'subagent2.json']]) {
  const r = read(f); if (!r) continue
  const rows = r.questions.map(q => { const k = key[q.id], c = k.A === 'candidate' ? q.A : q.B, f0 = k.A === 'candidate' ? q.B : q.A
    return { id: q.id, cand: Object.fromEntries(DIMS.map(d => [d, +c[d]])), ref: Object.fromEntries(DIMS.map(d => [d, +f0[d]])), reason: q.reason } })
  const mean = s => Object.fromEntries(DIMS.map(d => [d, r1(avg(rows.map(x => x[s][d])))]))
  const cand = mean('cand'), ref = mean('ref'), delta = Object.fromEntries(DIMS.map(d => [d, r1(cand[d] - ref[d])]))
  out.reviewers[name] = { cand, ref, delta, gain: r1(delta['正确性'] + delta['心智模型']), perQ: rows.map(x => ({ id: x.id, gain: x.cand['正确性'] + x.cand['心智模型'] - x.ref['正确性'] - x.ref['心智模型'] })), rows }
  console.log(name.padEnd(9), 'cand', JSON.stringify(cand), 'delta', JSON.stringify(delta), 'gain', out.reviewers[name].gain, 'perQ', out.reviewers[name].perQ.map(x => x.gain).join(' '))
}
const rs = Object.values(out.reviewers)
out.delta = Object.fromEntries(DIMS.map(d => [d, r1(avg(rs.map(r => r.delta[d])))]))
out.gain = r1(avg(rs.map(r => r.gain)))
out.keep = out.gain > 0 && rs.every(r => r.gain >= 0) && out.delta['注意力成本'] >= -out.gain
fs.writeFileSync(path.join(dir, 'tally.json'), JSON.stringify(out, null, 1))
console.log('MEAN delta', JSON.stringify(out.delta), 'gain', out.gain, 'keep-rule', out.keep)
