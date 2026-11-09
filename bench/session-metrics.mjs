// Time, tokens, steps and tools of each question, read from the dsh session logs (not from the page).
//   node bench/session-metrics.mjs <questions.json> <since ISO time> [sessions dir]
// A session counts when its first turn starts after <since> and holds the question's exact text; Decode is the
// session whose requests offer submit_answer. The newest match per question and mode wins.
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import zlib from 'node:zlib'

const [qfile, sinceArg, dirArg] = process.argv.slice(2)
const since = Date.parse(sinceArg), root = dirArg || path.join(os.homedir(), '.dsh', 'sessions')
const qs = JSON.parse(fs.readFileSync(qfile, 'utf8'))

function events(f) {
  const b = fs.readFileSync(f), mg = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]); const idx = []; let p = 0, out = ''
  while ((p = b.indexOf(mg, p)) >= 0) { idx.push(p); p += 4 }
  for (let i = 0; i < idx.length; i++) { try { out += zlib.zstdDecompressSync(b.subarray(idx[i], idx[i + 1] ?? b.length)).toString() } catch {} }
  return out.split('\n').map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
}

const files = fs.readdirSync(root).flatMap(w => { try { return fs.readdirSync(path.join(root, w)).map(d => path.join(root, w, d, 'session.v4.jsonl.zstd')) } catch { return [] } })
  .filter(f => fs.existsSync(f) && fs.statSync(f).mtimeMs >= since)
const found = {}
for (const f of files) {
  const ev = events(f), start = ev.find(x => x.type === 'turn/start'), end = ev.find(x => x.type === 'turn/end')
  if (!start || start.time < since) continue
  const text = ev.filter(x => x.type === 'user/message').flatMap(x => (x.data?.content || []).map(c => c.text)).find(t => qs.some(q => q.q === t))
  if (!text) continue
  const q = qs.find(x => x.q === text)
  const decode = ev.some(x => x.type === 'request/header' && (x.data?.header?.tools || []).some(t => t.name === 'submit_answer'))
  const usage = { input: 0, output: 0, cacheRead: 0, total: 0, calls: 0 }
  for (const e of ev) { const u = e.type === 'assistant/message' && e.data?.usage; if (u) { usage.input += u.inputTokens || 0; usage.output += u.outputTokens || 0; usage.cacheRead += u.cacheReadTokens || 0; usage.total += u.totalTokens || 0; usage.calls++ } }
  const cfg = ev.find(x => x.type === 'request/header')?.data?.header?.config || {}
  const tools = {}
  for (const e of ev) if (e.type === 'tool/call') { const n = e.data?.call?.name || e.data?.name || e.data?.toolName || e.data?.tool?.name || '?'; tools[n] = (tools[n] || 0) + 1 }
  const last = ev.filter(x => x.type === 'assistant/message').at(-1)
  const finalText = (last?.data?.message?.content || []).filter(c => c.type === 'text').map(c => c.text).join('\n')
  const row = { id: q.id, mode: decode ? 'decode' : 'standard', start: start.time, secs: end ? Math.round((end.time - start.time) / 1000) : null,
    reason: end?.data?.reason?.kind || 'running', model: cfg.model, effort: cfg.reasoningEffort, steps: ev.filter(x => x.type === 'step/start').length,
    usage, tools, finalText, file: f }
  const k = q.id + '/' + row.mode
  if (!found[k] || found[k].start < row.start) found[k] = row
}
console.log(JSON.stringify(Object.values(found).sort((a, b) => a.id.localeCompare(b.id) || a.mode.localeCompare(b.mode)), null, 1))
