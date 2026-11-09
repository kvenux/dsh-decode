// Un-blind the judges of bench/rubric-screenshot-facts.md and compare the versions.
//   node bench/fact-tally.mjs <review root> <runs> [reference version, default m12]
// Reads <root>/r<i>/key.json and <root>/r<i>/q/facts.json. The score of a fact: right 1, conflict 0.5, unsaid 0, wrong 0 (wrong is also counted apart).
import fs from 'node:fs'
const [root, runs, ref = 'm12'] = process.argv.slice(2), avg = a => a.reduce((x, y) => x + y, 0) / a.length
const sd = a => { const u = avg(a); return Math.sqrt(a.reduce((x, y) => x + (y - u) ** 2, 0) / (a.length - 1)) }, se = a => a.length > 1 ? sd(a) / Math.sqrt(a.length) : 0
const rows = []
for (let i = 1; i <= +runs; i++) {
  const file = `${root}/r${i}/q/facts.json`; if (!fs.existsSync(file)) { console.log('missing', file); continue }
  const key = JSON.parse(fs.readFileSync(`${root}/r${i}/key.json`, 'utf8')), g = JSON.parse(fs.readFileSync(file, 'utf8'))
  for (const q of g.questions) for (const [L, v] of Object.entries(key[q.id])) {
    const c = { right: 0, wrong: 0, conflict: 0, unsaid: 0 }; for (const f of q.facts) c[f[L]]++
    rows.push({ run: i, q: q.id, v, ...c, facts: q.facts.length, score: q['正确性'][L], severe: (q.severe?.[L] || []).length })
  }
}
const vs = [...new Set(rows.map(r => r.v))].sort(), qs = [...new Set(rows.map(r => r.q))], ids = [...new Set(rows.map(r => r.run))]
const rate = r => (r.right + r.conflict / 2) / r.facts
console.log('| version | correctness | fact rate | right | wrong | conflict | unsaid | severe |\n|---|---|---|---|---|---|---|---|')
for (const v of vs) { const R = rows.filter(r => r.v === v), s = k => R.reduce((x, r) => x + r[k], 0), F = s('facts'); console.log(`| ${v} | ${avg(R.map(r => r.score)).toFixed(1)} | ${(100 * avg(R.map(rate))).toFixed(1)}% | ${s('right')}/${F} | ${s('wrong')} | ${s('conflict')} | ${s('unsaid')} | ${s('severe')} |`) }
for (const v of vs.filter(x => x !== ref)) {
  const by = f => ids.map(i => avg(qs.flatMap(q => { const a = rows.find(r => r.run === i && r.q === q && r.v === v), b = rows.find(r => r.run === i && r.q === q && r.v === ref); return a && b ? [f(a) - f(b)] : [] })))
  const d = by(r => r.score), e = by(rate).map(x => x * 100), w = rows.filter(r => r.v === v).map(a => a.score - rows.find(b => b.run === a.run && b.q === a.q && b.v === ref).score)
  console.log(`${v} - ${ref}: correctness ${avg(d).toFixed(2)} +- ${se(d).toFixed(2)} (rounds ${d.map(x => x.toFixed(1)).join(' ')}); fact rate ${avg(e).toFixed(1)} +- ${se(e).toFixed(1)} points; wins/ties/losses ${w.filter(x => x > 0).length}/${w.filter(x => x === 0).length}/${w.filter(x => x < 0).length}`)
}
console.log('\nper question (correctness; fact rate)')
for (const q of qs) console.log(q, vs.map(v => { const R = rows.filter(r => r.q === q && r.v === v); return `${v} ${avg(R.map(r => r.score)).toFixed(1)}; ${(100 * avg(R.map(rate))).toFixed(0)}%` }).join(' | '))
