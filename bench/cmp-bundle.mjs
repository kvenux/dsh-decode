// The Decode and standard answers of several runs, one review folder per run, for a judge who scores both with bench/rubric-attention.md.
//   RC_PLAYWRIGHT=<dir with playwright> RC_CHROME=<chrome> RC_REPO=<asked repository> node bench/cmp-bundle.mjs <questions.json> <decode root> <standard root> <out root> <runs>
// A root holds run<i>/; an answer is in run<i>/<question id>/answers.json, run<i>/a/ or run<i>/b/.
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'
const [qfile, decRoot, stdRoot, outRoot, runs] = process.argv.slice(2), NL = String.fromCharCode(10)
if (!process.env.RC_REPO) throw new Error('set RC_REPO to the repository that was asked about')
const ids = JSON.parse(fs.readFileSync(qfile, 'utf8')).map(q => q.id), bench = import.meta.dirname
const gather = (root, run, back) => ids.map(id => {
  for (const sub of [id, 'a', 'b']) {
    const f = path.join(root, `run${run}`, sub, 'answers.json'); if (!fs.existsSync(f)) continue
    const r = JSON.parse(fs.readFileSync(f, 'utf8')).result.find(x => x.id === id)
    if (r) return { ...r, viewShots: (r.viewShots || []).map(s => path.join(back, root, `run${run}`, sub, s)) }
  }
  throw new Error(`no answer: ${root} run${run} ${id}`)
})
for (let i = 1; i <= +runs; i++) {
  const R = path.join(outRoot, `r${i}`), q = path.join(R, 'q'), back = path.relative(R, '.')
  fs.rmSync(R, { recursive: true, force: true }); fs.mkdirSync(R, { recursive: true })
  const dec = gather(decRoot, i, back), std = gather(stdRoot, i, back)
  fs.writeFileSync(path.join(R, 'decode-plain.json'), JSON.stringify({ result: dec.map(r => ({ ...r, viewShots: [] })) }))
  execFileSync('node', [path.join(bench, 'full-diagrams.mjs'), path.join(R, 'decode-plain.json'), path.join(R, 'full')], { stdio: 'ignore' })
  fs.writeFileSync(path.join(R, 'decode.json'), JSON.stringify({ result: dec }))
  fs.writeFileSync(path.join(R, 'std.json'), JSON.stringify({ result: std }))
  fs.writeFileSync(path.join(R, 'metrics.json'), JSON.stringify(std.map(r => ({ id: r.id, mode: 'standard', finalText: r.end?.finalText || '' }))))
  execFileSync('node', [path.join(bench, 'review-bundle.mjs'), qfile, path.join(R, 'decode.json'), path.join(R, 'std.json'), path.join(R, 'metrics.json'), q], { env: { ...process.env, RC_BLIND: '1', RC_FULLDIR: path.join(R, 'full') }, stdio: 'ignore' })
  fs.rmSync(path.join(q, 'verify'), { recursive: true, force: true })
  fs.writeFileSync(path.join(q, 'rubric.md'), fs.readFileSync(path.join(bench, 'rubric-attention.md'), 'utf8') + [NL, '## 题目文件', '', `和这个文件同一目录下的 ${ids.map(x => x + '.md').join('、')}，共 ${ids.length} 个，都要打分。`, '', `被问的仓库：\`${process.env.RC_REPO}\``, ''].join(NL))
  const miss = ids.flatMap(id => [...fs.readFileSync(path.join(q, id + '.md'), 'utf8').matchAll(/^- (.+\.png)$/gm)].map(m => m[1])).filter(p => !fs.existsSync(p))
  console.log(`r${i} decode ${dec.filter(r => r.ok && r.answer).length} standard ${std.filter(r => r.end?.finalText).length} missing pictures ${miss.length}`)
}
