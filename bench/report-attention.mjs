// The attention-cost tables for the report: the reviewers' four sub-scores, the numbers that need no reviewer, and the
// check-step test.   node bench/report-attention.mjs <review dir> <questions.json> <standard-answers.json> <decode-answers.json> <out.html>
import fs from 'node:fs'; import path from 'node:path'
const [rdir, qfile, stdFile, decFile, outFile] = process.argv.slice(2)
const qs = JSON.parse(fs.readFileSync(qfile, 'utf8'))
const at = JSON.parse(fs.readFileSync(path.join(rdir, 'attention.json'), 'utf8')), ver = JSON.parse(fs.readFileSync(path.join(rdir, 'verify.json'), 'utf8')).rows
const rd = f => { const t = fs.readFileSync(path.join(rdir, f), 'utf8'); return JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)) }
const revs = [rd('codex.json'), rd('subagent.json')]
const std = JSON.parse(fs.readFileSync(stdFile, 'utf8')).result, dec = JSON.parse(fs.readFileSync(decFile, 'utf8')).result
const f1 = x => (Math.round(x * 10) / 10).toString(), avg = a => a.reduce((x, y) => x + y, 0) / a.length
const SUB = [['结论前置', 6], ['信息密度', 8], ['噪声', 6], ['记忆负荷', 10], ['注意力成本', 30]]
const sc = (id, side, d) => avg(revs.map(r => r.questions.find(q => q.id === id)[side][d]))
const norm = t => String(t || '').replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_#|]/g, '').replace(/\s+/g, ' ').trim()
const answerText = (id, side) => { if (side === 'A') { const a = dec.find(r => r.id === id).answer; return norm([a.take, ...a.paras.map(p => p.text)].join(' ')) } return norm(std.find(r => r.id === id).end.finalText) }
const offset = (id, side, first) => { const t = answerText(id, side), i = t.indexOf(norm(first).slice(0, 40)); return i < 0 ? null : t.slice(0, i).split(/\s+/).filter(Boolean).length }
const M = (id, mode) => at.find(x => x.id === id && x.mode === mode)
const V = id => ver.find(x => x.id === id)
const total = (mode, f) => qs.reduce((n, q) => n + (f(M(q.id, mode)) || 0), 0)
const checks = (id, s) => V(id)[s].toolUses - 1
const offs = qs.map(q => [offset(q.id, 'A', V(q.id).A.first), offset(q.id, 'B', V(q.id).B.first)])
const html = `<h3>注意力成本的子项（两位评审平均，越高越省力）</h3>
<div class="tw"><table><thead><tr><th>题</th>${SUB.map(([d, m]) => `<th colspan="2">${d}<small>/${m}</small></th>`).join('')}</tr>
<tr><th></th>${SUB.map(() => '<th class="a-l">Decode</th><th class="b-l">标准</th>').join('')}</tr></thead><tbody>
${qs.map(q => `<tr><td>${q.id}</td>${SUB.map(([d]) => `<td>${f1(sc(q.id, 'A', d))}</td><td>${f1(sc(q.id, 'B', d))}</td>`).join('')}</tr>`).join('')}
<tr><td><b>平均</b></td>${SUB.map(([d]) => `<td><b>${f1(avg(qs.map(q => sc(q.id, 'A', d))))}</b></td><td><b>${f1(avg(qs.map(q => sc(q.id, 'B', d))))}</b></td>`).join('')}</tr>
</tbody></table></div>
<h3>客观指标（脚本计算，不计入 100 分）</h3>
<p class="muted">Decode 的字数只算结论和段落：引文默认折叠，单独列出。图要读多久没有计入，这对 Decode 有利。阅读时间按 238 词/分钟估算。</p>
<div class="tw"><table><thead><tr><th>题</th><th colspan="2">字数</th><th colspan="2">阅读（分钟）</th><th colspan="2">结论前的词数</th><th colspan="2">带文件和行号的块</th><th colspan="2">代码名/100 词</th><th>Decode 引文（已核实/总数，词数）</th><th>图</th></tr>
<tr><th></th>${'<th class="a-l">Decode</th><th class="b-l">标准</th>'.repeat(5)}<th></th><th></th></tr></thead><tbody>
${qs.map((q, i) => { const a = M(q.id, 'decode'), b = M(q.id, 'standard'); return `<tr><td>${q.id}</td><td>${a.words}</td><td>${b.words}</td><td>${a.readMin}</td><td>${b.readMin}</td><td>${offs[i][0] ?? '—'}</td><td>${offs[i][1] ?? '—'}</td><td>${a.located}/${a.blocks}</td><td>${b.located}/${b.blocks}</td><td>${a.termsPer100}</td><td>${b.termsPer100}</td><td>${a.quotesVerified}/${a.quotes}，${a.quoteWords} 词</td><td>${a.diagrams}</td></tr>` }).join('')}
<tr><td><b>合计</b></td><td><b>${total('decode', x => x.words)}</b></td><td><b>${total('standard', x => x.words)}</b></td><td><b>${f1(total('decode', x => x.readMin))}</b></td><td><b>${f1(total('standard', x => x.readMin))}</b></td><td></td><td></td><td><b>${total('decode', x => x.located)}/${total('decode', x => x.blocks)}</b></td><td><b>${total('standard', x => x.located)}/${total('standard', x => x.blocks)}</b></td><td></td><td></td><td></td><td></td></tr>
</tbody></table></div>
<p class="muted">“代码名”只数形似代码的词。Decode 的段落有意用普通英语写，所以数字接近 0。这不等于记忆负荷低：读者还要把普通英语的说法对回代码。“结论前的词数”依据核对代理摘出的第一句回答；是代理的判断。</p>
<h3>核对步数（每份回答：一个代理挑 3 条关键结论到源码核对）</h3>
<div class="tw"><table><thead><tr><th>题</th><th class="a-l">Decode 工具调用</th><th class="b-l">标准 工具调用</th><th class="a-l">Decode 结论成立</th><th class="b-l">标准 结论成立</th></tr></thead><tbody>
${qs.map(q => `<tr><td>${q.id}</td><td>${checks(q.id, 'A')}</td><td>${checks(q.id, 'B')}</td><td>${V(q.id).A.confirmed}/3</td><td>${V(q.id).B.confirmed}/3</td></tr>`).join('')}
<tr><td><b>合计</b></td><td><b>${qs.reduce((n, q) => n + checks(q.id, 'A'), 0)}</b></td><td><b>${qs.reduce((n, q) => n + checks(q.id, 'B'), 0)}</b></td><td><b>${qs.reduce((n, q) => n + V(q.id).A.confirmed, 0)}/15</b></td><td><b>${qs.reduce((n, q) => n + V(q.id).B.confirmed, 0)}/15</b></td></tr>
</tbody></table></div>
<p class="muted">工具调用次数来自运行记录（不含读回答文件那一次）。代理只看文字，不看图；结论由它自己挑，并且看到能确认的代码就停。所以“全部成立”不说明回答没有错：两位评审在同样的回答里找到了错误（见逐题记录）。</p>`
fs.writeFileSync(outFile, html); console.log('offsets', JSON.stringify(offs), 'checks', qs.reduce((n, q) => n + checks(q.id, 'A'), 0), qs.reduce((n, q) => n + checks(q.id, 'B'), 0))
