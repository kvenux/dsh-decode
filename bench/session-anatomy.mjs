// Where a turn's tokens go: per model call the prompt size, and per tool call the size of what it put back.
//   node bench/session-anatomy.mjs <metrics.json>   (the session files listed there)
import fs from 'node:fs'; import zlib from 'node:zlib'

const met = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
function events(f) {
  const b = fs.readFileSync(f), mg = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]); const idx = []; let p = 0, out = ''
  while ((p = b.indexOf(mg, p)) >= 0) { idx.push(p); p += 4 }
  for (let i = 0; i < idx.length; i++) { try { out += zlib.zstdDecompressSync(b.subarray(idx[i], idx[i + 1] ?? b.length)).toString() } catch {} }
  return out.split('\n').map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
}
const len = x => JSON.stringify(x ?? '').length
const rows = []
for (const r of met) {
  const ev = events(r.file)
  const hdr = ev.find(x => x.type === 'request/header')?.data?.header || {}
  const sys = ev.filter(x => x.type === 'system/message').map(x => len(x.data?.message?.content)).reduce((a, b) => a + b, 0)
  const ctx = ev.filter(x => x.type === 'request/context').map(x => len(x.data)).reduce((a, b) => a + b, 0)
  const toolDefs = len(hdr.tools), nTools = (hdr.tools || []).length
  const calls = ev.filter(x => x.type === 'assistant/message' && x.data?.usage).map(x => ({ prompt: (x.data.usage.inputTokens || 0) + (x.data.usage.cacheReadTokens || 0), out: x.data.usage.outputTokens || 0 }))
  // tool calls and their results, matched by id
  const callEv = ev.filter(x => x.type === 'tool/call'), resEv = ev.filter(x => x.type === 'tool/result')
  const byTool = {}
  for (const c of callEv) {
    const d = c.data || {}, id = d.call?.id || d.id || d.callId || d.toolCallId
    const name = d.name || d.call?.name || d.toolName || '?'
    const res = resEv.find(x => { const e = x.data || {}; return (e.message?.toolCallId || e.callId || e.toolCallId) === id })
    const size = res ? (res.data?.message?.content || []).map(c => (c.text || '').length).reduce((a, b) => a + b, 0) : 0
    const t = byTool[name] ||= { n: 0, chars: 0, max: 0, args: [] }
    t.n++; t.chars += size; t.max = Math.max(t.max, size)
    if (name === 'read') t.args.push(String(d.arguments || '').slice(0, 120))
  }
  rows.push({ id: r.id, mode: r.mode, calls: calls.length, first: calls[0]?.prompt, last: calls.at(-1)?.prompt, sumPrompt: calls.reduce((a, c) => a + c.prompt, 0), out: calls.reduce((a, c) => a + c.out, 0),
    sysChars: sys, ctxChars: ctx, toolDefChars: toolDefs, nTools, toolNames: (hdr.tools || []).map(t => t.name).join(','), byTool, promptSeries: calls.map(c => c.prompt) })
}
// one sample of the event shapes, to check the matching above
const ev0 = events(met[0].file)
console.log('SAMPLE tool/call', JSON.stringify(ev0.find(x => x.type === 'tool/call')).slice(0, 400))
console.log('SAMPLE tool/result', JSON.stringify(ev0.find(x => x.type === 'tool/result')).slice(0, 400))
fs.writeFileSync(process.argv[2].replace(/metrics\.json$/, 'anatomy.json'), JSON.stringify(rows, null, 1))
for (const x of rows) {
  console.log(`\n${x.id} ${x.mode}: calls ${x.calls}, prompt first ${x.first} → last ${x.last}, sum ${x.sumPrompt}, out ${x.out}; system ${x.sysChars} chars, tools ${x.nTools} (${x.toolDefChars} chars)`)
  for (const [n, t] of Object.entries(x.byTool)) console.log(`   ${n}: ${t.n} calls, result ${t.chars} chars (max ${t.max})`)
}
