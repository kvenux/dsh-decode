// Errors of one round, from its judge files. A diagram error is a fact a view contradicts, or another view error confirmed in code.
//   node bench/fix-tally.mjs <round name> [judge file names, default judge.json]
import fs from 'node:fs'; import path from 'node:path'
const [name, ...files] = process.argv.slice(2), base = path.join('bench/out/fix-review', name)
const key = JSON.parse(fs.readFileSync(path.join(base, 'key.json'), 'utf8')), r2 = x => Math.round(x * 100) / 100
const res = {}
for (const f of files.length ? files : ['judge.json']) {
  const t = fs.readFileSync(path.join(base, 'j', f), 'utf8'), j = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1))
  const n = j.answers.length, byQ = {}, byRun = {}, byKind = {}, byType = {}, facts = {}; let contradict = 0, correct = 0, absent = 0, other = 0, text = 0, drawing = 0; const byDrawing = {}
  for (const a of j.answers) {
    const k = key[a.label] || { id: a.id, run: 0 }; let e = 0
    for (const x of a.facts || []) { if (x.verdict === 'contradict') { contradict++; e++; (facts[x.id] ||= 0); facts[x.id]++ } else if (x.verdict === 'correct') correct++; else absent++ }
    for (const x of a.view_errors || []) { other++; e++; byKind[x.kind] = (byKind[x.kind] || 0) + 1; byType[x.type] = (byType[x.type] || 0) + 1 }
    for (const x of a.drawing_errors || []) { drawing++; byDrawing[x.kind] = (byDrawing[x.kind] || 0) + 1 }
    text += (a.text_errors || []).length
    byQ[k.id] = (byQ[k.id] || 0) + e; byRun[k.run] = (byRun[k.run] || 0) + e
  }
  res[f] = { answers: n, diagramErrors: contradict + other, perAnswer: r2((contradict + other) / n), contradict, otherViewErrors: other, drawingErrors: drawing, byDrawing, correct, absent, textErrors: text, textPerAnswer: r2(text / n), byQ, byRun, byKind, byType, factsContradicted: facts }
}
fs.writeFileSync(path.join(base, 'tally.json'), JSON.stringify(res, null, 1))
console.log(JSON.stringify(res, null, 0))
