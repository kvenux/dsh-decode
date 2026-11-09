// The judge's file for one round: every answer of every run, in an order drawn from the round's folder name, under neutral
// labels (x01, x02, ...). The key stays outside the judge's folder. Each view comes as its picture only: what the reader sees.
//   RC_FULL=<picture folder in each run, default full> RC_JNAME=<review name> node bench/fix-bundle.mjs <round dir> <runs>
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'
const [dir, runsArg] = process.argv.slice(2), runs = +runsArg, NL = String.fromCharCode(10)
const facts = JSON.parse(fs.readFileSync('bench/facts-dh.json', 'utf8'))
const qs = Object.fromEntries(JSON.parse(fs.readFileSync('bench/questions-dh.json', 'utf8')).map(q => [q.id, q.q]))
const shown = t => String(t).replace(/\[\[([^\]|]*)\|[^\]]*\]\]/g, '$1')
const all = []
for (let i = 1; i <= runs; i++) for (const r of JSON.parse(fs.readFileSync(path.join(dir, `run${i}`, 'answers.json'), 'utf8')).result) all.push({ run: i, r })
const rank = x => crypto.createHash('sha256').update((process.env.RC_JNAME || path.basename(dir)) + x.run + x.r.id).digest('hex')
all.sort((a, b) => rank(a) < rank(b) ? -1 : 1)

const view = (v, img) => `### view ${v.id}: ${v.type} "${v.title}"` + NL + `Picture (open it): ${img}`

const name = process.env.RC_JNAME || path.basename(dir).replace(/^fix-/, ''), out = path.join('bench/out/fix-review', name), judge = path.join(out, 'j'), pics = path.join(judge, 'img')
fs.mkdirSync(pics, { recursive: true })
const body = [], key = {}
all.forEach((x, n) => {
  const label = 'x' + String(n + 1).padStart(2, '0'), a = x.r.ok ? x.r.answer : null // a failed question can hold the card of the question before it
  key[label] = { run: x.run, id: x.r.id }
  body.push(`## ${label} (${x.r.id})`, `Question: ${qs[x.r.id]}`, '')
  if (!a) { body.push('No answer card.', ''); return }
  body.push(`Conclusion: ${shown(a.take)}`, '', ...a.paras.map((p, i) => `P${i + 1}: ${shown(p.text)}`), '', ...a.views.map((v, i) => { const to = path.join(pics, `${label}-${i + 1}.png`); fs.copyFileSync(path.join(dir, `run${x.run}`, process.env.RC_FULL || 'full', `${x.r.id}-full${i + 1}.png`), to); return view(v, path.resolve(to)) }), '')
})
fs.writeFileSync(path.join(judge, 'answers.md'), body.join(NL))
fs.writeFileSync(path.join(judge, 'facts.json'), JSON.stringify(facts, null, 1))
fs.writeFileSync(path.join(judge, 'rules.md'), fs.readFileSync('bench/rubric-facts.md', 'utf8'))
fs.writeFileSync(path.join(out, 'key.json'), JSON.stringify(key, null, 1))
console.log('judge file', judge, 'answers', all.length)
