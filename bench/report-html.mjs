// The comparison report: one self-contained HTML file (screenshots inlined) from the run data and the two reviews.
//   node bench/report-html.mjs <review dir> <decode out dir> <standard out dir> <questions.json> <out.html>
import fs from 'node:fs'; import path from 'node:path'; import { roundsHtml } from './report-rounds.mjs'

const [rdir, ddir, sdir, qfile, outFile] = process.argv.slice(2)
const qs = JSON.parse(fs.readFileSync(qfile, 'utf8'))
const met = JSON.parse(fs.readFileSync(path.join(rdir, 'metrics.json'), 'utf8'))
const dec = JSON.parse(fs.readFileSync(path.join(ddir, 'answers.json'), 'utf8')).result
const std = JSON.parse(fs.readFileSync(path.join(sdir, 'answers.json'), 'utf8')).result
const readJson = f => { try { let t = fs.readFileSync(f, 'utf8').trim(); t = t.replace(/^```(?:json)?\s*/, '').replace(/```\s*$/, ''); const i = t.indexOf('{'); return JSON.parse(t.slice(i)) } catch (e) { console.error('cannot read', f, e.message); return null } }
const reviews = [['Codex', readJson(path.join(rdir, 'codex.json'))], ['子代理（Claude）', readJson(path.join(rdir, 'subagent.json'))]].filter(r => r[1])
const DIMS = process.env.RC_DIMS ? JSON.parse(process.env.RC_DIMS) : [['正确性', 25], ['完整性', 15], ['证据可核查', 15], ['图式构建', 20], ['可读性', 15], ['聚焦', 10]]

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const img = f => fs.existsSync(f) ? `data:image/png;base64,${fs.readFileSync(f).toString('base64')}` : ''
const m = (id, mode) => met.find(x => x.id === id && x.mode === mode)
const k = n => n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n)
const qrev = (r, id) => r.questions?.find(x => x.id === id)
const tot = s => s ? (s.total ?? DIMS.reduce((a, [d]) => a + (+s[d] || 0), 0)) : null
const avg = a => { const v = a.filter(x => x != null); return v.length ? v.reduce((x, y) => x + y, 0) / v.length : null }
const f1 = x => x == null ? '—' : (Math.round(x * 10) / 10).toString()

// totals per reviewer and side
const rows = qs.map(q => {
  const md = m(q.id, 'decode'), ms = m(q.id, 'standard')
  const sc = reviews.map(([n, r]) => { const x = qrev(r, q.id); return { n, A: tot(x?.A), B: tot(x?.B), w: x?.winner } })
  return { q, md, ms, sc, A: avg(sc.map(s => s.A)), B: avg(sc.map(s => s.B)) }
})
const sum = (f) => rows.reduce((a, r) => a + (f(r) || 0), 0)
const avgA = avg(rows.map(r => r.A)), avgB = avg(rows.map(r => r.B))
const tA = sum(r => r.md?.secs), tB = sum(r => r.ms?.secs), kA = sum(r => r.md?.usage.total), kB = sum(r => r.ms?.usage.total)
const oA = sum(r => r.md?.usage.output), oB = sum(r => r.ms?.usage.output), nA = sum(r => r.md?.usage.input), nB = sum(r => r.ms?.usage.input)
const winsA = rows.filter(r => r.A != null && r.B != null && r.A > r.B).length, winsB = rows.filter(r => r.A != null && r.B != null && r.B > r.A).length

const dimAvg = (side) => DIMS.map(([d, max]) => [d, max, avg(rows.flatMap(r => reviews.map(([, rv]) => { const x = qrev(rv, r.q.id)?.[side]; return x ? +x[d] : null })))])
const dA = dimAvg('A'), dB = dimAvg('B')

const bar = (v, max, cls) => `<div class="bar"><span class="${cls}" style="width:${v == null ? 0 : Math.max(0, Math.min(100, v / max * 100))}%"></span></div>`

function decodeHtml(a) {
  if (!a) return '<p class="muted">没有拿到回答卡片</p>'
  return `<p class="take">${esc(a.take)}</p><ol class="paras">${a.paras.map(p => `<li><div>${esc(p.text)}</div>${(p.evidence || []).length ? `<ul class="ev">${p.evidence.map(e => `<li><code>${esc(e.file)}:${e.start}-${e.end}</code> <span class="st ${e.status === 'verified' ? 'ok' : 'warn'}">${esc(e.status || e.kind)}</span></li>`).join('')}</ul>` : ''}</li>`).join('')}</ol>`
}
const costCells = r => r ? `<td>${r.secs} 秒</td><td>${k(r.usage.total)}</td><td>${k(r.usage.input)}</td><td>${k(r.usage.cacheRead)}</td><td>${k(r.usage.output)}</td><td>${r.usage.calls}</td><td>${Object.entries(r.tools).map(([n, c]) => `${esc(n)}×${c}`).join(' ')}</td>` : '<td colspan="7">无记录</td>'

const qSections = rows.map(({ q, md, ms, sc }) => {
  const d = dec.find(r => r.id === q.id), s = std.find(r => r.id === q.id)
  const shots = (d?.viewShots || []).map(f => path.join(ddir, f))
  const stdShot = path.join(sdir, `${q.id}-1-answer.png`)
  const revBlocks = reviews.map(([n, r]) => { const x = qrev(r, q.id); if (!x) return ''
    return `<div class="rev"><h4>${esc(n)}${x.winner ? ` <span class="pill ${x.winner === 'A' ? 'a' : x.winner === 'B' ? 'b' : ''}">胜：${esc(x.winner === 'A' ? 'Decode' : x.winner === 'B' ? '标准模式' : x.winner)}</span>` : ''}</h4>
      <div class="tw"><table class="sc"><thead><tr><th>维度</th>${DIMS.map(([dd, mx]) => `<th>${dd}<small>/${mx}</small></th>`).join('')}<th>总分</th></tr></thead><tbody>
      <tr><td class="a-l">Decode</td>${DIMS.map(([dd]) => `<td>${esc(x.A?.[dd])}</td>`).join('')}<td><b>${esc(tot(x.A))}</b></td></tr>
      <tr><td class="b-l">标准模式</td>${DIMS.map(([dd]) => `<td>${esc(x.B?.[dd])}</td>`).join('')}<td><b>${esc(tot(x.B))}</b></td></tr></tbody></table></div>
      <p>${esc(x.summary ?? x.reason)}</p>
      <details><summary>${x.reason ? '到源码核对的记录' : '核对记录、错误、图和代价的评语'}</summary>
      ${(x.checked ?? x.verified)?.length ? `<h5>核对过的说法</h5><ul>${(x.checked ?? x.verified).map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
      ${x.reason ? '' : `<h5>Decode 的错误</h5>${x.A_errors?.length ? `<ul>${x.A_errors.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : '<p class="muted">无</p>'}
      <h5>标准模式的错误</h5>${x.B_errors?.length ? `<ul>${x.B_errors.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : '<p class="muted">无</p>'}
      <h5>图</h5><p>${esc(x.diagram_note)}</p><h5>代价</h5><p>${esc(x.cost_note)}</p>`}</details></div>` }).join('')
  return `<section class="q" id="${q.id}">
  <h2><span class="qid">${esc(q.id)}</span> ${esc(q.kind)}</h2><p class="ask">${esc(q.q)}</p>
  <div class="tw"><table class="cost"><thead><tr><th>模式</th><th>用时</th><th>总 token</th><th>新输入</th><th>缓存命中</th><th>输出</th><th>模型调用</th><th>工具</th></tr></thead><tbody>
  <tr><td class="a-l">Decode</td>${costCells(md)}</tr><tr><td class="b-l">标准模式</td>${costCells(ms)}</tr></tbody></table></div>
  <div class="scorebar">${sc.map(x => `<div><small>${esc(x.n)}</small><span class="a-l">Decode ${x.A ?? '—'}</span> · <span class="b-l">标准 ${x.B ?? '—'}</span></div>`).join('')}</div>
  <h3>Decode 的图</h3>
  <p class="muted">上面是整张图（用答案里的图数据单独画出，不受面板高度限制）；下面是 dsh 右侧面板的实际截图（图高于面板时只截到可见部分）。</p>
  <div class="shots">${(d?.answer?.views || []).map((v, i) => { const full = path.join(ddir, 'full', `${q.id}-full${i + 1}.png`)
    return `<figure><img loading="lazy" src="${img(full)}" alt="${esc(q.id)} 图 ${i + 1} 全图"><figcaption>图 ${i + 1}：${esc(v.title || '')}（${esc(v.type)}）· 全图</figcaption></figure>` }).join('')}</div>
  <details><summary>面板截图（${shots.length} 张）</summary><div class="shots">${shots.map((f, i) => `<figure><img loading="lazy" src="${img(f)}" alt="${esc(q.id)} 面板截图 ${i + 1}"><figcaption>面板截图 ${i + 1}</figcaption></figure>`).join('')}</div></details>
  <h3>两位评审</h3><div class="revs">${revBlocks}</div>
  <h3>回答原文</h3>
  <div class="ans"><details><summary class="a-l">Decode 回答（结论、段落、引文）</summary>${decodeHtml(d?.answer)}</details>
  <details><summary class="b-l">标准模式回答</summary><div class="md" data-md="${esc(ms?.finalText || s?.plain || '')}"></div>${fs.existsSync(stdShot) ? `<figure><img loading="lazy" src="${img(stdShot)}" alt="标准模式截图"><figcaption>标准模式页面截图</figcaption></figure>` : ''}</details></div>
</section>`
}).join('\n')

const diffs = dA.map(([d, mx, v], i) => [d, v - dB[i][2]])
const better = diffs.filter(x => x[1] > 0.05).map(([d, x]) => `${d} +${f1(x)}`), worse = diffs.filter(x => x[1] < -0.05).map(([d, x]) => `${d} ${f1(x)}`)
const split = rows.filter(r => r.sc.length > 1 && new Set(r.sc.map(s => s.w)).size > 1).map(r => r.q.id)
const findings = process.env.RC_FINDINGS ? fs.readFileSync(process.env.RC_FINDINGS, 'utf8') : [
  `<li><b>质量接近，标准模式略高</b>：两位评审平均 Decode ${f1(avgA)} 分、标准模式 ${f1(avgB)} 分，差 ${f1(avgB - avgA)} 分；按平均分 Decode 赢 ${winsA} 题、标准模式赢 ${winsB} 题。${split.length ? `两位评审在 ${split.join('、')} 上判断相反，差距在评审的个人偏差之内。` : ''}</li>`,
  `<li><b>Decode 强在</b>：${better.join('、') || '无'}。每段都有带行号和原文的引文，篇幅短、直接回答问题。</li>`,
  `<li><b>Decode 弱在</b>：${worse.join('、') || '无'}。主要问题是结论偶尔过度概括、漏掉关键分支（如 i4 子智能体流卡住后直接报错）、图与正文偶有不一致；面板截图里高图被截断，也拉低了评审对图的打分。</li>`,
  `<li><b>token 明显更省，时间持平</b>：5 题总 token Decode 是标准模式的 ${(kA / kB).toFixed(2)} 倍，新输入 ${(nA / nB).toFixed(2)} 倍；输出 token 多 ${((oA / oB - 1) * 100).toFixed(0)}%（组织段落和画图）；总用时 ${(tA / tB).toFixed(2)} 倍。原因推测：Decode 的提示让模型读得更少、更有目标，标准模式工具调用多、上下文累积大（推测，未逐条分析）。</li>`,
  `<li><b>怎么选</b>：快速建立整体结构、需要逐条核对证据时用 Decode；要完整的改动清单、细致的方案对照或排查故障时，标准模式更可靠。</li>`,
].join('')
const overall = reviews.map(([n, r]) => `<div class="rev"><h4>${esc(n)}</h4><p>${esc(r.overall)}</p></div>`).join('')
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(process.env.RC_TITLE_SHORT || 'Decode 对比评测')}</title>
<style>
:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1f;--mut:#6b6b70;--line:#e3e3e0;--a:#c2410c;--a-bg:#fff1e8;--b:#1d4ed8;--b-bg:#e9efff;--ok:#15803d;--warn:#b45309;--code:#f1f1ef}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#141416;--card:#1c1c1f;--ink:#ececee;--mut:#9a9aa2;--line:#2c2c31;--a:#fb923c;--a-bg:#3a2216;--b:#7aa2ff;--b-bg:#1b2546;--ok:#4ade80;--warn:#fbbf24;--code:#26262a}}
:root[data-theme=dark]{--bg:#141416;--card:#1c1c1f;--ink:#ececee;--mut:#9a9aa2;--line:#2c2c31;--a:#fb923c;--a-bg:#3a2216;--b:#7aa2ff;--b-bg:#1b2546;--ok:#4ade80;--warn:#fbbf24;--code:#26262a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.65 -apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif}
main{max-width:1180px;margin:0 auto;padding:28px 16px 80px}h1{font-size:26px;margin:0 0 6px}h2{font-size:20px;margin:0 0 6px}h3{font-size:16px;margin:22px 0 10px}h4{margin:0 0 8px;font-size:15px}h5{margin:12px 0 4px;font-size:13px;color:var(--mut)}
.muted,small{color:var(--mut)}.card,.q{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px;margin:18px 0}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:16px 0}.kpi{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px}.kpi b{display:block;font-size:22px}.kpi>span{color:var(--mut);font-size:13px}.kpi b span{font-size:20px;white-space:nowrap}
.a-l{color:var(--a);font-weight:600}.b-l{color:var(--b);font-weight:600}
table{border-collapse:collapse;width:100%;font-size:13.5px}th,td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}th{color:var(--mut);font-weight:600}th small{font-weight:400}
.tw{overflow-x:auto}.bar{height:8px;background:var(--line);border-radius:4px;overflow:hidden;min-width:80px}.bar span{display:block;height:100%}.bar .a{background:var(--a)}.bar .b{background:var(--b)}
.dims td:nth-child(2),.dims td:nth-child(4){width:30%}
.qid{font:600 13px ui-monospace,Consolas,monospace;background:var(--code);padding:2px 6px;border-radius:5px;margin-right:6px}.ask{font-size:16px;margin:4px 0 12px}
.scorebar{display:flex;flex-wrap:wrap;gap:16px;margin:10px 0}.scorebar small{display:block}
.shots{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr));gap:12px}figure{margin:0}figure img{width:100%;border:1px solid var(--line);border-radius:8px;cursor:zoom-in}figcaption{font-size:12.5px;color:var(--mut);margin-top:4px}
.revs{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(420px,100%),1fr));gap:12px}.rev{border:1px solid var(--line);border-radius:10px;padding:14px;min-width:0}
.pill{font-size:12px;font-weight:600;padding:2px 8px;border-radius:999px;background:var(--code);margin-left:6px}.pill.a{background:var(--a-bg);color:var(--a)}.pill.b{background:var(--b-bg);color:var(--b)}
details{margin:8px 0}summary{cursor:pointer}.ans details{border:1px solid var(--line);border-radius:10px;padding:10px 14px}
.take{font-weight:600;border-left:3px solid var(--a);padding-left:10px}.paras li{margin:8px 0}.ev{font-size:12.5px;color:var(--mut)}code{font:12.5px ui-monospace,Consolas,monospace;background:var(--code);padding:1px 4px;border-radius:4px;word-break:break-all}
.st.ok{color:var(--ok)}.st.warn{color:var(--warn)}.md{overflow-x:auto}.md pre{background:var(--code);padding:10px;border-radius:8px;overflow-x:auto}.md table{margin:8px 0}
nav.toc{display:flex;flex-wrap:wrap;gap:8px}nav.toc a{color:var(--b);text-decoration:none;font-size:14px;border:1px solid var(--line);padding:3px 10px;border-radius:999px;background:var(--card)}
#lb{position:fixed;inset:0;background:rgba(0,0,0,.82);display:none;align-items:center;justify-content:center;z-index:9;cursor:zoom-out}#lb img{max-width:96vw;max-height:94vh}
@media (max-width:640px){.revs{grid-template-columns:1fr}.shots{grid-template-columns:1fr}}
</style></head><body><main>
<h1>${esc(process.env.RC_TITLE || 'Decode 插件 vs 标准模式：5 题对比')}</h1>${process.env.RC_NOTE ? `<p>${esc(process.env.RC_NOTE)}</p>` : ''}
${process.env.RC_META ? `<p class="muted">${esc(process.env.RC_META)}</p>` : `<p class="muted">dsh 0.2.2-rc.1 · DeepSeek-V4.1-Flash · 推理等级 low· 两种模式并发运行，每题新会话 · 评审：Codex 与 Claude 子代理各自独立打分（百分制，6 个维度），并到源码核对说法</p>`}
<nav class="toc">${qs.map(q => `<a href="#${q.id}">${esc(q.id)} ${esc(q.kind)}</a>`).join('')}<a href="#method">方法与口径</a></nav>

<section class="card"><h2>结论</h2>
<div class="kpis">
<div class="kpi"><span>平均得分（两位评审平均）</span><b><span class="a-l">${f1(avgA)}</span> : <span class="b-l">${f1(avgB)}</span></b><span>Decode : 标准模式</span></div>
<div class="kpi"><span>按题胜负（平均分）</span><b><span class="a-l">${winsA}</span> : <span class="b-l">${winsB}</span></b><span>Decode : 标准模式</span></div>
<div class="kpi"><span>5 题总用时</span><b><span class="a-l">${tA}s</span> : <span class="b-l">${tB}s</span></b><span>Decode / 标准 = ${(tA / tB).toFixed(2)}×</span></div>
<div class="kpi"><span>5 题总 token（含缓存命中）</span><b><span class="a-l">${k(kA)}</span> : <span class="b-l">${k(kB)}</span></b><span>Decode / 标准 = ${(kA / kB).toFixed(2)}×</span></div>
<div class="kpi"><span>新输入 token（不含缓存）</span><b><span class="a-l">${k(nA)}</span> : <span class="b-l">${k(nB)}</span></b><span>Decode / 标准 = ${(nA / nB).toFixed(2)}×</span></div>
<div class="kpi"><span>输出 token（含推理）</span><b><span class="a-l">${k(oA)}</span> : <span class="b-l">${k(oB)}</span></b><span>Decode / 标准 = ${(oA / oB).toFixed(2)}×</span></div>
</div>
${process.env.RC_ROUNDS ? roundsHtml(JSON.parse(process.env.RC_ROUNDS), qs) : ''}
<h3>关键发现</h3><ul class="find">${findings}</ul>
${process.env.RC_EXTRA ? fs.readFileSync(process.env.RC_EXTRA, 'utf8') : ''}
${reviews.some(([, r]) => r.overall) ? `<h3>两位评审的总体结论</h3><div class="revs">${overall}</div>` : ''}
<h3>各维度平均分</h3><div class="tw"><table class="dims"><thead><tr><th>维度（满分）</th><th>Decode</th><th></th><th>标准模式</th><th></th></tr></thead><tbody>
${dA.map(([d, mx, v], i) => `<tr><td>${d}（${mx}）</td><td>${bar(v, mx, 'a')}</td><td class="a-l">${f1(v)}</td><td>${bar(dB[i][2], mx, 'b')}</td><td class="b-l">${f1(dB[i][2])}</td></tr>`).join('')}
</tbody></table></div>
<h3>逐题总览</h3><div class="tw"><table><thead><tr><th>题</th><th>类型</th>${reviews.map(([n]) => `<th>${esc(n)}<br><small>Decode / 标准</small></th>`).join('')}<th>平均<br><small>Decode / 标准</small></th><th>用时<br><small>Decode / 标准</small></th><th>总 token<br><small>Decode / 标准</small></th></tr></thead><tbody>
${rows.map(r => `<tr><td><a href="#${r.q.id}">${esc(r.q.id)}</a></td><td>${esc(r.q.kind)}</td>${r.sc.map(s => `<td><span class="a-l">${s.A ?? '—'}</span> / <span class="b-l">${s.B ?? '—'}</span></td>`).join('')}<td><span class="a-l">${f1(r.A)}</span> / <span class="b-l">${f1(r.B)}</span></td><td>${r.md?.secs ?? '—'}s / ${r.ms?.secs ?? '—'}s</td><td>${k(r.md?.usage.total || 0)} / ${k(r.ms?.usage.total || 0)}</td></tr>`).join('')}
</tbody></table></div></section>

${qSections}

<section class="card" id="method"><h2>方法与口径</h2><ul>${process.env.RC_METHOD ? fs.readFileSync(process.env.RC_METHOD, 'utf8') : `
<li>运行：全局 dsh 0.2.2-rc.1 网页版，每题新建会话，选模式、选 DeepSeek-V4.1-Flash、推理等级 Low，再发问题。Decode 和标准模式两路并发跑（脚本 <code>bench/rc-dsh.mjs</code>）。会话日志里记录的推理等级都是 <code>low</code>。</li>
<li>时间和 token：从 dsh 会话日志读取（<code>bench/session-metrics.mjs</code>）：用时是回合开始到结束；token 是本回合每次模型调用的 usage 求和。“总 token”含缓存命中部分，所以数字很大；新输入 = 未命中缓存的输入。</li>
<li>评分：两位评审拿到同一份说明（rubric）和 5 个题目文件；Decode 的图以截图给出。百分制：正确性 25、完整性 15、证据可核查 15、图式构建 20、可读性 15、聚焦 10。评审要求每题至少到被问仓库的源码核对 3 处说法。不是盲评：图和引文格式能看出哪份是 Decode。</li>
<li>局限：每题只跑一次，模型输出有随机性；5 题是我按 Decode 适用的问题类型挑的（跨模块流程、异常、改动影响、对照、入口），不代表随手问的问题；评审是模型，不是人。</li>
`}</ul></section>
</main><div id="lb"><img alt=""></div>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
<script>
document.querySelectorAll('.md').forEach(el=>{const t=el.dataset.md||'';try{el.innerHTML=window.marked?marked.parse(t.replace(/</g,'&lt;')):'';if(!window.marked)throw 0}catch(e){const p=document.createElement('pre');p.textContent=t;p.style.whiteSpace='pre-wrap';el.replaceChildren(p)}});
const lb=document.getElementById('lb');document.querySelectorAll('figure img').forEach(i=>i.addEventListener('click',()=>{lb.firstElementChild.src=i.src;lb.style.display='flex'}));lb.addEventListener('click',()=>lb.style.display='none');
</script></body></html>`
fs.writeFileSync(outFile, html)
console.log('wrote', outFile, (html.length / 1e6).toFixed(1) + 'MB', 'reviews', reviews.map(r => r[0]).join(','))
