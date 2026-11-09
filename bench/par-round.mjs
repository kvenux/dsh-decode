// Ask several runs of the questions at once in dsh web. Two sessions of one question, one mode and one workspace never run at once: the session log is found by those three.
//   RC_PLAYWRIGHT=<dir with playwright> RC_CHROME=<chrome> node bench/par-round.mjs <dsh url> <questions.json> <mode> <out dir under bench/out> <runs> [lanes, default 8]
// Each lane has its own browser profile, copied from RC_PW_SEED (a profile that already has the workspaces). A finished answer is not asked again. Writes <out>/run<i>/<question id>/answers.json.
import fs from 'node:fs'; import path from 'node:path'; import { spawn } from 'node:child_process'
const [url, qfile, mode, dir, runs, lanesArg] = process.argv.slice(2), LANES = +(lanesArg || 8)
const OUT = path.join(import.meta.dirname, 'out'), WS = (process.env.RC_WORKSPACES || 'deepseek-harness,dh-std').split(','), SEED = process.env.RC_PW_SEED || path.join(OUT, 'pw-profile-std')
const ids = JSON.parse(fs.readFileSync(qfile, 'utf8')).map(q => q.id), decode = mode.startsWith('Decode')
const log = (...a) => console.log(new Date().toTimeString().slice(0, 8), ...a)
const good = j => { try { const r = JSON.parse(fs.readFileSync(path.join(OUT, j.out, 'answers.json'), 'utf8')).result.find(x => x.id === j.q); return decode ? r.ok && r.answer : ['completed', 'concluded'].includes(r.end?.reason) && r.end.finalText } catch { return false } }
const jobs = []; for (let run = 1; run <= +runs; run++) for (const q of ids) { const j = { run, q, out: `${dir}/run${run}/${q}` }; if (!good(j)) jobs.push(j) }
log('jobs', jobs.length)
const profile = l => { const p = path.join(OUT, `pw-profile-l${l}`); if (!fs.existsSync(p)) fs.cpSync(SEED, p, { recursive: true }); for (const f of ['SingletonLock', 'lockfile']) { try { fs.rmSync(path.join(p, f), { force: true, maxRetries: 10, retryDelay: 500 }) } catch {} } return p }
const busy = Array(LANES).fill(false), active = new Set(), fails = []; let running = 0
fs.rmSync(path.join(OUT, 'rc-lock'), { recursive: true, force: true })
await new Promise(done => { const pump = () => {
  for (let l = 0; l < LANES; l++) { if (busy[l]) continue
    const w = WS[l % WS.length], key = j => j.q + '|' + w, i = jobs.findIndex(j => !active.has(key(j))); if (i < 0) continue
    const j = jobs.splice(i, 1)[0]; busy[l] = true; active.add(key(j)); running++; fs.mkdirSync(path.join(OUT, j.out), { recursive: true }); log('start', j.out, 'lane', l, w)
    const fd = fs.openSync(path.join(OUT, j.out + '.log'), 'w')
    const c = spawn('node', [path.join(import.meta.dirname, 'rc-dsh.mjs'), url, w, j.q, '--out', j.out], { env: { ...process.env, RC_QFILE: qfile, RC_LOCALE: 'en-US', RC_EFFORT: 'Low', RC_MODE: mode, RC_LOCK: path.join(OUT, 'rc-lock'), RC_PW_PROFILE: profile(l) }, stdio: ['ignore', fd, fd] })
    const to = setTimeout(() => c.kill(), 960000)
    c.on('exit', () => { clearTimeout(to); busy[l] = false; active.delete(key(j)); running--
      if (good(j)) log('done', j.out); else if (!j.retry) { j.retry = 1; jobs.push(j); log('retry', j.out) } else { fails.push(j.out); log('FAILED', j.out) }
      pump(); if (!running && !jobs.length) done() }) }
  if (!running && !jobs.length) done() }; pump() })
log('fails', JSON.stringify(fails))
