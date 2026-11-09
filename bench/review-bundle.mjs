// One Markdown file per question for the reviewers: the Decode answer (text, quotes, diagram list, screenshots) and
// the standard-mode answer, with time and tokens from the session logs.
//   node bench/review-bundle.mjs <questions.json> <decode answers.json> <standard answers.json> <metrics.json> <out dir>
// RC_BLIND=1: neutral labels, no time or tokens, and each answer alone in <out dir>/verify/<id>-A.md and -B.md (for the
// check-step test). RC_FULLDIR: a folder of whole diagrams from full-diagrams.mjs, listed beside the panel screenshots.
import fs from 'node:fs'; import path from 'node:path'

const [qfile, decFile, stdFile, metFile, outDir] = process.argv.slice(2)
const qs = JSON.parse(fs.readFileSync(qfile, 'utf8'))
const dec = JSON.parse(fs.readFileSync(decFile, 'utf8')).result, std = JSON.parse(fs.readFileSync(stdFile, 'utf8')).result
const met = JSON.parse(fs.readFileSync(metFile, 'utf8'))
const decDir = path.dirname(path.resolve(decFile))
fs.mkdirSync(outDir, { recursive: true })

const m = (id, mode) => met.find(x => x.id === id && x.mode === mode)
const cost = r => r ? `用时 ${r.secs ?? '?'} 秒；模型调用 ${r.usage.calls} 次；输入 ${r.usage.input} + 缓存命中 ${r.usage.cacheRead}，输出 ${r.usage.output}，合计 ${r.usage.total} token；工具调用 ${JSON.stringify(r.tools)}；推理等级 ${r.effort}` : '无记录'

const shown = t => String(t).replace(/\[\[([^\]|]*)\|[^\]]*\]\]/g, '$1')  // a link reads as its words, as in the panel
function decodeText(a) {
  if (!a) return '（没有拿到 Decode 回答卡片）'
  const out = [`**结论**：${a.take}`, '']
  a.paras.forEach((p, i) => {
    out.push(`${i + 1}. ${shown(p.text)}`)
    for (const e of p.evidence || []) out.push(`   - 引文 \`${e.file}:${e.start}-${e.end}\`（${e.kind}，${e.status}）${e.quote ? '：`' + e.quote.replace(/\s+/g, ' ').slice(0, 160) + '`' : ''}`)
  })
  out.push('', '**图**：' + a.views.map(v => `${v.title}（${v.type}）`).join('；'))
  return out.join('\n')
}

for (const q of qs) {
  const d = dec.find(r => r.id === q.id), s = std.find(r => r.id === q.id)
  const shots = (d?.viewShots || []).map(f => path.join(decDir, f))
  const full = process.env.RC_FULLDIR ? (JSON.parse(fs.readFileSync(path.join(process.env.RC_FULLDIR, 'full.json'), 'utf8'))[q.id] || []).map(f => path.resolve(process.env.RC_FULLDIR, f)) : []
  const blind = !!process.env.RC_BLIND, aText = decodeText(d?.answer), bText = m(q.id, 'standard')?.finalText || s?.plain || '（没有拿到回答）'
  if (blind) { const v = path.join(outDir, 'verify'); fs.mkdirSync(v, { recursive: true })
    const NL = String.fromCharCode(10)
    fs.writeFileSync(path.join(v, `${q.id}-A.md`), ['Question: ' + q.q, '', aText, ''].join(NL)); fs.writeFileSync(path.join(v, `${q.id}-B.md`), ['Question: ' + q.q, '', bText, ''].join(NL))
    fs.writeFileSync(path.join(outDir, `${q.id}.md`), [`# ${q.id}（${q.kind}）`, '', `**问题**：${q.q}`, '', '## 回答 A', '', '图（面板截图）：', ...shots.map(f => `- ${f}`), '', '图（整张）：', ...full.map(f => `- ${f}`), '', aText, '', '## 回答 B', '', bText, ''].join(NL))
    console.log(q.id, 'shots', shots.length, 'full', full.length, 'A', !!d?.answer, 'B', !!(s?.plain || m(q.id, 'standard')?.finalText)); continue }
  const md = [
    `# ${q.id}（${q.kind}）`, '', `**问题**：${q.q}`, '',
    `## 回答 A：Decode 插件`, '', `代价：${cost(m(q.id, 'decode'))}`, '',
    `图的截图（右侧面板，一张图一个文件）：`, ...shots.map(f => `- ${f}`), '',
    decodeText(d?.answer), '',
    `## 回答 B：标准模式`, '', `代价：${cost(m(q.id, 'standard'))}`, '',
    (s?.plain || m(q.id, 'standard')?.finalText || '（没有拿到回答）'), '',
  ].join('\n')
  fs.writeFileSync(path.join(outDir, `${q.id}.md`), md)
  console.log(q.id, 'shots', shots.length, 'A', !!d?.answer, 'B', !!(s?.plain || m(q.id, 'standard')?.finalText))
}
