// Scores of the Decode and standard comparison: means by rubric row, question and run, for any set of questions.
//   node bench/cmp-tally.mjs <review root> <runs> [question id,...]
import fs from 'node:fs'; import path from 'node:path'
const [root, runs, ids] = process.argv.slice(2), only = ids ? ids.split(',') : null
const ROWS = ['正确性', '证据可核查', '心智模型', '注意力成本', '结论前置', '信息密度', '噪声', '记忆负荷', 'total']
const J = Array.from({ length: +runs }, (_, i) => { const t = fs.readFileSync(path.join(root, `r${i + 1}`, 'q', 'judge.json'), 'utf8')
  return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)).questions.filter(q => !only || only.includes(q.id)) })
const avg = a => a.reduce((x, y) => x + y, 0) / a.length, sd = a => { const m = avg(a); return Math.sqrt(a.reduce((n, x) => n + (x - m) ** 2, 0) / (a.length - 1)) }, f = x => x.toFixed(1)
const bad = J.flat().flatMap(q => ['A', 'B'].filter(s => { const c = q[s]; return c['正确性'] + c['证据可核查'] + c['心智模型'] + c['注意力成本'] !== c.total || c['结论前置'] + c['信息密度'] + c['噪声'] + c['记忆负荷'] !== c['注意力成本'] }))
console.log('sum mismatches', bad.length, 'questions per run', J.map(q => q.length).join())
for (const d of ROWS) { const a = J.map(qs => avg(qs.map(q => q.A[d]))), b = J.map(qs => avg(qs.map(q => q.B[d]))), di = a.map((x, i) => x - b[i])
  console.log(d, f(avg(a)), f(avg(b)), 'diff', f(avg(di)), '±' + f(sd(di) / Math.sqrt(di.length)), 'runs', di.map(f).join(' ')) }
for (const id of J[0].map(q => q.id)) { const g = (s, d) => avg(J.map(qs => qs.find(q => q.id === id)[s][d]))
  console.log(id, f(g('A', 'total')), f(g('B', 'total')), ROWS.slice(0, 4).map(d => d + ' ' + f(g('A', d) - g('B', d))).join(' '), 'wins', J.filter(qs => { const q = qs.find(q => q.id === id); return q.A.total > q.B.total }).length, 'mental', J.map(qs => { const q = qs.find(q => q.id === id); return q.A['心智模型'] + '/' + q.B['心智模型'] }).join(' ')) }
const P = J.flat(); console.log('pairs A>B', P.filter(q => q.A.total > q.B.total).length, 'A<B', P.filter(q => q.A.total < q.B.total).length, 'of', P.length)
