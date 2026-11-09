// A paired review of two Decode runs: one Markdown file per question, the runs in an order drawn per question (A or B
// tells nothing about which run is which), plus <out dir>/../key.json to read the scores back. The review folder must not tell the runs apart: diagrams are
// copied under neutral names, and the key stays outside it.
//   node bench/pair-bundle.mjs <questions.json> <reference answers.json> <reference full dir> <candidate answers.json> <candidate full dir> <out dir> <seed>
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'

const [qfile, refFile, refFull, candFile, candFull, outDir, seed] = process.argv.slice(2)
const qs = JSON.parse(fs.readFileSync(qfile, 'utf8')), NL = String.fromCharCode(10)
const load = f => JSON.parse(fs.readFileSync(f, 'utf8')).result
const ref = load(refFile), cand = load(candFile)
const fulls = d => JSON.parse(fs.readFileSync(path.join(d, 'full.json'), 'utf8'))
const fr = fulls(refFull), fc = fulls(candFull)
fs.mkdirSync(path.join(outDir, 'img'), { recursive: true })

const shown = t => String(t).replace(/\[\[([^\]|]*)\|[^\]]*\]\]/g, '$1')  // a link reads as its words, as in the panel
function text(a) {
  if (!a) return '（没有拿到回答卡片）'
  const out = [`**结论**：${a.take}`, '']
  a.paras.forEach((p, i) => {
    out.push(`${i + 1}. ${shown(p.text)}`)
    for (const e of p.evidence || []) out.push(`   - 引文 \`${e.file}:${e.start}-${e.end}\`（${e.kind}，${e.status}）${e.quote ? '：`' + e.quote.replace(/\s+/g, ' ').slice(0, 160) + '`' : ''}`)
  })
  out.push('', '**图**：' + a.views.map(v => `${v.title}（${v.type}）`).join('；'))
  return out.join(NL)
}

const key = {}
for (const q of qs) {
  const flip = crypto.createHash('sha256').update(seed + q.id).digest()[0] & 1
  key[q.id] = flip ? { A: 'candidate', B: 'reference' } : { A: 'reference', B: 'candidate' }
  const side = (which, label) => { const c = which === 'candidate'
    const a = (c ? cand : ref).find(r => r.id === q.id)?.answer
    const imgs = ((c ? fc : fr)[q.id] || []).map((f, i) => { const to = path.resolve(outDir, 'img', `${q.id}-${label}-${i + 1}.png`); fs.copyFileSync(path.resolve(c ? candFull : refFull, f), to); return to })
    return [...imgs.map(f => `- ${f}`), '', text(a)] }
  fs.writeFileSync(path.join(outDir, `${q.id}.md`), [`# ${q.id}（${q.kind}）`, '', `**问题**：${q.q}`, '', '## 回答 A', '', '图：', ...side(key[q.id].A, 'A'), '', '## 回答 B', '', '图：', ...side(key[q.id].B, 'B'), ''].join(NL))
}
fs.writeFileSync(path.join(outDir, '..', 'key.json'), JSON.stringify(key, null, 1))
console.log('bundle', outDir, JSON.stringify(Object.fromEntries(Object.entries(key).map(([k, v]) => [k, v.A[0]]))))
