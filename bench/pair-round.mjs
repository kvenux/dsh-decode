// One round's verdict from its two paired reviews (each already tallied by pair-tally.mjs).
//   node bench/pair-round.mjs <review dir 1> <review dir 2> [noise, default 2.5]
// The keep rule on the mean of the two pairs: mean gain above 0, neither reviewer's mean gain below 0, and 注意力成本 does
// not fall by more than the gain. A gain under the noise is a weak signal.
import fs from 'node:fs'; import path from 'node:path'
const [d1, d2, noiseArg] = process.argv.slice(2), noise = +(noiseArg || 2.5)
const T = [d1, d2].map(d => JSON.parse(fs.readFileSync(path.join(d, 'tally.json'), 'utf8')))
const r2 = x => Math.round(x * 100) / 100, avg = a => a.reduce((x, y) => x + y, 0) / a.length
const DIMS = ['正确性', '证据可核查', '心智模型', '注意力成本', 'total']
const delta = Object.fromEntries(DIMS.map(d => [d, r2(avg(T.map(t => t.delta[d])))]))
const rev = n => r2(avg(T.map(t => t.reviewers[n].gain))), gains = Object.fromEntries(Object.keys(T[0].reviewers).filter(n => T.every(t => t.reviewers[n])).map(n => [n, rev(n)]))
const gain = r2(avg(T.map(t => t.gain)))
const keep = gain > 0 && Object.values(gains).every(g => g >= 0) && delta['注意力成本'] >= -gain
const absolute = Object.fromEntries(DIMS.map(d => [d, r2(avg(T.flatMap(t => Object.values(t.reviewers).map(r => r.cand[d]))))]))
console.log(JSON.stringify({ pairGains: T.map(t => t.gain), reviewerGains: gains, gain, delta, candidateScores: absolute, keep, weak: keep && gain < noise }))
