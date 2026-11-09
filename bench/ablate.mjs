// Prompt ablation: the questions run through bench/rc-headless.mjs with some prompt groups left out (src/prompt.js),
// a few at a time. Before and after, the repository under test must have no changes (a command the model runs must
// not change it). Writes out/abl-<name>/ (one <qid>.row.json per question, then answers.json from all of them).
//   node bench/ablate.mjs <repo> <name> [--drop S,X | all] [--qs q1,q2] [--par 2] [--resume]
// --resume skips the questions that already have a row; answers.json always takes every question that has one.
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import {spawn, execFileSync} from 'node:child_process'
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d }
const repo = path.resolve(process.argv[2]), name = process.argv[3], drop = arg('--drop', ''), par = Number(arg('--par', 2))
const here = import.meta.dirname, outName = 'abl-' + name, out = path.join(here, 'out', outName)
const all = JSON.parse(fs.readFileSync(path.join(here, 'questions.json'), 'utf8'))
const done = id => fs.existsSync(path.join(out, id + '.row.json'))
const qs = (arg('--qs', '') ? arg('--qs').split(',') : all.filter(q => !q.lang).map(q => q.id)).filter(id => !(process.argv.includes('--resume') && done(id)))
fs.mkdirSync(out, {recursive: true})
const dirty = () => execFileSync('git', ['-C', repo, 'status', '--porcelain'], {encoding: 'utf8'}).trim()
if (dirty()) { console.error('the repository under test has changes; stop:\n' + dirty()); process.exit(1) }
const freeGB = () => os.freemem() / 2 ** 30
const one = qid => new Promise(res => {
  const t0 = Date.now()
  const p = spawn(process.execPath, [path.join(here, 'rc-headless.mjs'), repo, qid, '--out', outName], {env: {...process.env, RC_PROMPT_DROP: drop}})
  let log = ''; p.stdout.on('data', c => { log += c }); p.stderr.on('data', c => { log += c })
  p.on('close', () => { console.log(`[${name}] ${qid} ${Math.round((Date.now() - t0) / 1000)}s ${log.trim().split('\n').at(-1).slice(0, 160)}`); res() })
})
const queue = [...qs]
const worker = async () => {
  while (queue.length) {
    // a dsh run takes some hundred MB: wait while memory is low (the machine has stopped a dsh web server for it once)
    while (freeGB() < 1.2) await new Promise(r => setTimeout(r, 15000))
    await one(queue.shift())
  }
}
const t0 = Date.now()
await Promise.all(Array.from({length: Math.max(1, par)}, worker))
const rows = all.map(q => q.id).filter(done).map(id => { try { return JSON.parse(fs.readFileSync(path.join(out, id + '.row.json'), 'utf8')) } catch { return {id, ok: false, error: 'no row'} } })
fs.writeFileSync(path.join(out, 'answers.json'), JSON.stringify({engine: 'dsh headless deepseek-flash', drop, result: rows}, null, 1))
const changed = dirty()
console.log(`[${name}] done ${Math.round((Date.now() - t0) / 60000)} min, ok ${rows.filter(r => r.ok).length}/${rows.length}` + (changed ? `\nTHE REPOSITORY CHANGED:\n${changed}` : ', repository unchanged'))
