// Decode through `dsh headless` (profile rc-headless: the Decode tools and plugin, DeepSeek-V4.1-Flash), one
// question per run, no browser. The answer is the submit_answer call checked by src/check.js as the plugin checks it.
//   node bench/rc-headless.mjs <repo> <qid> [--out rch]
// The prompt groups left out come from RC_PROMPT_DROP (src/prompt.js). The run is in dsh's read-only sandbox unless
// DSH_PERMISSION_MODE says otherwise, so a command the model runs does not change the repository under test.
// Besides answers.json it writes <qid>.row.json (one run, for runs in parallel), with the tokens from the session log.
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import zlib from 'node:zlib'; import {spawn} from 'node:child_process'
import {checkAnswer, relPath} from '../src/check.js'
const repo = path.resolve(process.argv[2]), qid = process.argv[3]
const oi = process.argv.indexOf('--out'), outName = oi > 0 ? process.argv[oi + 1] : 'rch'
const here = import.meta.dirname, out = path.join(here, 'out', outName); fs.mkdirSync(out, {recursive: true})
const q = JSON.parse(fs.readFileSync(path.join(here, 'questions.json'), 'utf8')).find(x => x.id === qid)
const t0 = Date.now()
// each event line is stamped with the seconds since the start (_t)
const r = await new Promise(res => {
  const p = spawn('pnpm', ['-s', 'dsh', '--profile', 'rc-headless', '--json', JSON.stringify(q.q)], {cwd: repo, shell: true,
    env: {...process.env, DSH_PERMISSION_MODE: process.env.DSH_PERMISSION_MODE || 'read-only'}})
  let buf = '', stdout = '', stderr = ''
  const kill = setTimeout(() => p.kill(), 900000)
  const stamp = l => { if (!l.trim()) return; try { stdout += JSON.stringify({...JSON.parse(l), _t: Math.round((Date.now() - t0) / 100) / 10}) + '\n' } catch { stdout += l + '\n' } }
  p.stdout.on('data', c => { buf += c; const ls = buf.split('\n'); buf = ls.pop(); ls.forEach(stamp) })
  p.stderr.on('data', c => { stderr += c })
  p.on('close', () => { clearTimeout(kill); stamp(buf); res({stdout, stderr}) })
})
const secs = Math.round((Date.now() - t0) / 1000)
fs.writeFileSync(path.join(out, qid + '.jsonl'), r.stdout || ''); fs.writeFileSync(path.join(out, qid + '.err'), r.stderr || '')
const ev = (r.stdout || '').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
const reads = new Map()
for (const e of ev) if (e.type === 'tool_call' && e.tool === 'read') {
  const rel = relPath(repo, e.input?.file_path || ''); if (!rel) continue
  const s = Math.max(1, Number(e.input.offset || 1)), n = Number(e.input.limit || 2000)
  ;(reads.get(rel) || reads.set(rel, []).get(rel)).push([s, s + n - 1])
}
const calls = ev.filter(e => e.type === 'tool_call' && e.tool === 'submit_answer')
const results = new Map(ev.filter(e => e.type === 'tool_result').map(e => [e.callId, e]))
const accepted = calls.filter(c => results.get(c.callId)?.status === 'completed').at(-1)
const checked = accepted ? checkAnswer(accepted.input, repo, reads, true) : null
// tokens: the usage of every model message in the session log (~/.dsh/sessions/<cwd>/<session>/session.v4.jsonl.zstd)
const sid = ev.find(e => e.type === 'session')?.sessionId, usage = {input: 0, output: 0, cacheRead: 0, steps: 0}
try {
  const dir = path.join(os.homedir(), '.dsh', 'sessions', '--' + repo.replace(/[:\\/]+/g, '-') + '--', sid)
  // the log is many zstd frames (one per append); zstdDecompressSync reads only the first, so each frame is read alone
  const buf = fs.readFileSync(path.join(dir, 'session.v4.jsonl.zstd')), magic = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]), at = []
  for (let i = buf.indexOf(magic); i >= 0; i = buf.indexOf(magic, i + 4)) at.push(i)
  let log = ''
  for (let k = 0, from = at[0]; k < at.length; k++) {
    const to = at[k + 1] ?? buf.length
    try { log += zlib.zstdDecompressSync(buf.subarray(from, to)).toString('utf8'); from = to } catch { /* the magic inside a frame: join the next part */ }
  }
  for (const l of log.split('\n')) { if (!l.includes('"assistant/message"')) continue; const u = JSON.parse(l).data?.usage; if (!u) continue
    usage.input += u.inputTokens || 0; usage.output += u.outputTokens || 0; usage.cacheRead += u.cacheReadTokens || 0; usage.steps++ }
} catch (e) { usage.error = String(e.message).slice(0, 120) }
const toolCalls = ev.filter(e => e.type === 'tool_call'), byTool = {}
for (const c of toolCalls) byTool[c.tool] = (byTool[c.tool] || 0) + 1
const row = {id: qid, q: q.q, kind: q.kind, drop: process.env.RC_PROMPT_DROP || '', ok: !!checked?.ok, secs, attempts: calls.length, tools: toolCalls.length, byTool, usage,
  answer: checked?.ok ? checked.answer : null, repairs: checked?.repairs || []}
fs.writeFileSync(path.join(out, qid + '.row.json'), JSON.stringify(row, null, 1))
const f = path.join(out, 'answers.json'), prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')).result.filter(x => x.id !== qid) : []
fs.writeFileSync(f, JSON.stringify({engine: 'dsh headless deepseek-flash', result: [...prev, row].sort((a, b) => a.id.localeCompare(b.id))}, null, 1))
const evd = row.answer ? row.answer.paras.flatMap(p => p.evidence) : []
console.log(qid, row.ok, secs + 's', 'tools', row.tools, 'attempts', row.attempts, 'evidence', `${evd.filter(e => e.status === 'verified').length}/${evd.length}`, 'judgments', row.answer?.judgments?.length, row.answer?.take || r.stderr?.slice(-300))
