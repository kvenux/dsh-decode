// The cross-round table for the report: each configuration's score, dimensions, time and tokens.
// Rounds come from RC_ROUNDS, a JSON list of {label, review: <dir with metrics.json, codex.json, subagent.json>, side: 'A'|'B', mode: 'decode'|'standard'}.
import fs from 'node:fs'; import path from 'node:path'

const DIMS = [['正确性', 25], ['完整性', 15], ['证据可核查', 15], ['图式构建', 20], ['可读性', 15], ['聚焦', 10]]
const readJson = f => { try { const t = fs.readFileSync(f, 'utf8'); return JSON.parse(t.slice(t.indexOf('{'))) } catch { return null } }
const avg = a => { const v = a.filter(x => x != null && !Number.isNaN(x)); return v.length ? v.reduce((x, y) => x + y, 0) / v.length : null }
const f1 = x => x == null ? '—' : (Math.round(x * 10) / 10).toString()
const k = n => n >= 1e6 ? (n / 1e6).toFixed(2) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'K' : String(n)
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')

export function roundsHtml(spec, qs) {
  const rows = spec.map(r => {
    const met = JSON.parse(fs.readFileSync(path.join(r.review, 'metrics.json'), 'utf8')).filter(x => x.mode === r.mode)
    const revs = ['codex.json', 'subagent.json'].map(f => readJson(path.join(r.review, f))).filter(Boolean)
    const tot = s => s ? (s.total ?? DIMS.reduce((a, [d]) => a + (+s[d] || 0), 0)) : null
    const perQ = qs.map(q => avg(revs.map(v => tot(v.questions?.find(x => x.id === q.id)?.[r.side]))))
    const dims = DIMS.map(([d]) => avg(revs.flatMap(v => (v.questions || []).map(x => x[r.side] ? +x[r.side][d] : null))))
    const s = f => met.reduce((a, x) => a + f(x), 0)
    return { label: r.label, score: avg(perQ), perQ, dims, secs: s(x => x.secs || 0), total: s(x => x.usage.total), input: s(x => x.usage.input), output: s(x => x.usage.output), calls: s(x => x.usage.calls) }
  })
  return `<h3>四种配置对比（两轮）</h3>
<p class="muted">分数是该轮两位评审的平均。不同轮次由不同的评审调用打分，同一配置两次运行之间也有随机差异：标准模式两轮之差可以当作“噪声”的参照。</p>
<div class="tw"><table><thead><tr><th>配置</th><th>平均分</th>${DIMS.map(([d, m]) => `<th>${d}<small>/${m}</small></th>`).join('')}<th>5 题用时</th><th>总 token</th><th>新输入</th><th>输出</th><th>模型调用</th></tr></thead><tbody>
${rows.map(r => `<tr><td><b>${esc(r.label)}</b></td><td><b>${f1(r.score)}</b></td>${r.dims.map(d => `<td>${f1(d)}</td>`).join('')}<td>${r.secs}s</td><td>${k(r.total)}</td><td>${k(r.input)}</td><td>${k(r.output)}</td><td>${r.calls}</td></tr>`).join('')}
</tbody></table></div>
<div class="tw"><table><thead><tr><th>题</th>${rows.map(r => `<th>${esc(r.label)}</th>`).join('')}</tr></thead><tbody>
${qs.map((q, i) => `<tr><td>${esc(q.id)}</td>${rows.map(r => `<td>${f1(r.perQ[i])}</td>`).join('')}</tr>`).join('')}
</tbody></table></div>`
}
