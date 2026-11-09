// Blind judge (Opus via Claude Code, read-only in the repository): per question, two answers as A/B in a fixed random
// order; scores what a reader gets, checks claims against the code. Writes out/judge/<qid>/ and out/judge/summary.json.
//   node bench/judge.mjs <repo> [qid,...]
import crypto from 'node:crypto'; import fs from 'node:fs'; import path from 'node:path';
if (!process.env.RC_CW_DESKTOP) throw new Error('set RC_CW_DESKTOP to the codewiki-next apps/desktop folder');
const T = 'file:///' + process.env.RC_CW_DESKTOP + '/main/';
const {claudeEnv, claudeSetup, CLAUDE_DEFAULTS} = await import(T + 'claudecfg.mjs');
const {findClaude, runProcess, jsonOfText} = await import(T + 'gen/engines.mjs');
const repo = path.resolve(process.argv[2]), only = process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3].split(',') : null, reuse = process.argv.includes('--reuse');
// --lang-neutral: the two answers may be in different languages (an English answer against the Chinese one to the same question)
const neutral = process.argv.includes('--lang-neutral');
const outName = (() => { const i = process.argv.indexOf('--out'); return i > 0 ? process.argv[i + 1] : 'judge' })()
// a judge's JSON with a stray closing brace or text around it
const lenient = text => { try { return jsonOfText(text) } catch {} const a = text.indexOf('{'); let t = text.slice(a, text.lastIndexOf('}') + 1); for (let k = 0; k < 4 && t; k++) { try { return JSON.parse(t) } catch { t = t.slice(0, t.lastIndexOf('}', t.length - 2) + 1) } } throw new Error('not JSON') }
const here = import.meta.dirname, outDir = path.join(here, 'out', outName); fs.mkdirSync(outDir, {recursive: true});
const cfg = claudeSetup({...CLAUDE_DEFAULTS}).config;
const load = k => JSON.parse(fs.readFileSync(path.join(here, 'out', k, 'answers.json'), 'utf8')).result;
const rcName = (() => { const i = process.argv.indexOf('--rc'); return i > 0 ? process.argv[i + 1] : 'rc' })()
const cwName = (() => { const i = process.argv.indexOf('--cw'); return i > 0 ? process.argv[i + 1] : 'cw' })()
const cw = load(cwName), rc = load(rcName);
const plain = s => String(s || '').replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$1')
const spec = v => { const s = typeof v.spec === 'string' ? (() => { try { return JSON.parse(v.spec) } catch { return {} } })() : (v.spec || v);
  const name = id => (s.lifelines || s.nodes || s.states || []).find(x => x.id === id)?.name || id;
  if (s.messages) return s.messages.map((m, i) => `${i + 1}. ${name(m.from)} → ${name(m.to)}：${m.text}`).join('\n');
  // the view types added later: what a reader sees, as text
  const kids = x => (x.children || []).length ? `（${x.children.map(k => k.name + ((k.children || []).length ? kids(k) : '')).join('、')}）` : '';
  if (s.packages) { const pn = id => s.packages.find(p => p.id === id)?.name || id;
    return 'packages: ' + s.packages.map(p => p.name + kids(p)).join('；') + '\ndeps: ' + (s.deps || []).map(d => `${pn(d[0])}→${pn(d[1])}`).join('；'); }
  if (s.classes) { const cn = id => s.classes.find(c => c.id === id)?.name || id, K = {has: '包含', ref: '指向', is: '是一种'};
    return s.classes.map(c => `${c.name}：${(c.fields || []).map(f => typeof f === 'string' ? f : f.name + (f.type ? ': ' + f.type : '')).join('、')}`).join('\n') + '\n关系：' + (s.rels || []).map(r => `${cn(r.from)} ${K[r.kind] || r.kind} ${cn(r.to)}${r.label ? '（' + r.label + '）' : ''}`).join('；'); }
  // a use case diagram: who does what (before the deployment branch: both have links)
  if (s.cases) { const nm = id => [...(s.actors || []), ...s.cases].find(x => x.id === id)?.name || id;
    return `系统：${s.system || ''}
参与者：${(s.actors || []).map(a => a.name).join('、')}
用例：${s.cases.map(c => c.name).join('、')}
谁做什么：${(s.links || []).map(l => `${nm(l[0])} — ${nm(l[1])}`).join('；')}`
      + ((s.includes || []).length ? `
包含：${s.includes.map(l => `${nm(l[0])} ${l[2] || 'include'} ${nm(l[1])}`).join('；')}` : ''); }
  if (s.links || (s.nodes || []).some(n => n.children)) { const all = []; const walk = l => l.forEach(n => { all.push(n); walk(n.children || []); }); walk(s.nodes || []); const nn = id => all.find(n => n.id === id)?.name || id;
    return 'nodes: ' + (s.nodes || []).map(n => n.name + kids(n)).join('；') + '\nlinks: ' + (s.links || []).map(l => `${nn(l[0])} — ${nn(l[1])}${l[2] ? '：' + l[2] : ''}`).join('；'); }
  if (s.rules) return [[...(s.conditions || []).map(c => c.name), ...(s.results || []).map(r => r.name)].join(' | '), ...s.rules.map(r => [...(s.conditions || []).map(c => r.when?.[c.id] ?? '—'), ...(s.results || []).map(x => r.then?.[x.id] ?? '')].join(' | '))].join('\n');
  if (s.rows && s.cols) return s.rows.map(r => `${r.name}：${s.cols.map(c => `${c.name}=${s.cell?.[r.id]?.[c.id] || '—'}`).join('，')}`).join('\n');
  if (s.deps) return 'nodes: ' + s.nodes.map(n => n.name).join('、') + '\ndeps: ' + s.deps.map(d => `${name(d[0])}→${name(d[1])}`).join('；');
  if (s.transitions) return s.transitions.map(t => `${name(t.from)} → ${name(t.to)}：${t.label || ''}`).join('\n');
  if (s.flows) return s.flows.map(f => `${name(f.from)} → ${name(f.to)}${f.guard ? '［' + f.guard + '］' : ''}`).join('\n');
  return JSON.stringify(s).slice(0, 1500) }
function render(a) {
  if (!a) return '（没有给出回答）'
  const views = (a.views || []).map(v => `### 图：${v.title || v.type}（${v.type}）\n${spec(v)}`).join('\n\n')
  const paras = (a.paras || []).map((p, i) => `${i + 1}. ${plain(p.text)}` + ((p.evidence || []).length ? '\n   证据：' + p.evidence.map(e => `[${e.file}:${e.start ?? e.line ?? ''}${e.end && e.end !== e.start ? '-' + e.end : ''}]`).join(' ') : '')).join('\n')
  const V = {holds: '成立', refuted: '被推翻', partly: '部分成立', open: '没能验证'}
  const jud = (a.judgments || []).map((j, i) => `${i + 1}. ［${V[j.verdict] || j.verdict}］假设：${plain(j.claim)}；查了：${plain(j.checked)}；结论：${plain(j.outcome)}${j.risk ? '；风险：' + plain(j.risk) : ''}` + ((j.evidence || []).length ? '\n   证据：' + j.evidence.map(e => `[${e.file}:${e.start ?? ''}${e.end && e.end !== e.start ? '-' + e.end : ''}]${e.note ? ' ' + plain(e.note) : ''}`).join(' ') : '')).join('\n')
  return `结论：${a.take}\n\n${paras}\n\n${views}${jud ? '\n\n### 关键判断（可展开的查证过程）\n' + jud : ''}\n\n追问建议：${(a.followups || []).join(' / ')}`
}
async function opus(dir, prompt) {
  if (reuse && fs.existsSync(path.join(dir, 'answer.txt'))) { try { return {value: lenient(fs.readFileSync(path.join(dir, 'answer.txt'), 'utf8')), cost: null} } catch {} }
  fs.mkdirSync(dir, {recursive: true}); fs.writeFileSync(path.join(dir, 'prompt.md'), prompt)
  const {exe, pre, node} = findClaude(cfg.exe), {env} = claudeEnv(cfg); if (node) env.ELECTRON_RUN_AS_NODE = '1'
  const tools = 'Read,Grep,Glob'
  for (let t = 0; t < 2; t++) {
    let result = null
    const r = await runProcess({exe, args: [...pre, '-p', '--output-format', 'stream-json', '--verbose', '--model', 'claude-opus-5-5', '--restricted', '--no-session-persistence', '--strict-mcp-config',
      '--tools', tools, '--allowedTools', tools, '--permission-prompts', 'none'], cwd: repo, env, input: prompt, dir, timeoutMs: 40 * 60000, onLine: e => { if (e.type === 'result') result = e }})
    const text = String(result?.result || ''); fs.writeFileSync(path.join(dir, 'answer.txt'), text)
    try { return {value: lenient(text), cost: result?.total_cost_usd ?? null} } catch { console.log(dir, 'not JSON', r.why || r.code) }
  }
  return null
}
const jobs = []
for (const c of cw) {
  if (only && !only.includes(c.id)) continue
  const r = rc.find(x => x.id === c.id); if (!r) continue
  const flip = crypto.createHash('sha1').update('rc-bench' + c.id).digest()[0] & 1
  const [A, B] = flip ? [r, c] : [c, r]
  const prompt = `你是评审。当前目录是一个开源代码仓库（只读：不要修改任何文件，不要运行命令）。
读者是不一定写代码的人，他问了这个仓库一个问题。两个问答工具各给了一份回答（A 和 B）。回答在界面里以文字段落为主，右侧有一张随段落切换的图（下面以文字列出图的内容），每段附代码证据 [文件:行]。

问题：${c.q}
${neutral ? '\n两份回答可能分别面向英文读者和中文读者（同一个问题的两个语言版本）。回答所用的语言不算优点也不算缺点，只比内容是否答到问题、是否符合代码、证据和图。\n' : ''}
===== 回答 A =====
${render(A.answer)}

===== 回答 B =====
${render(B.answer)}

请：
1. 自己搜索、阅读相关代码，核对两份回答里的关键说法（每份至少核对 6 条，优先核对结论和关键步骤）。
2. 分别打分（1–10）：读者能否看懂并得到问题的答案、是否符合代码、证据是否支撑、图是否帮助理解。
3. 列出每份的错误（与代码不符或误导的说法，写明哪段、为什么、正确是什么）和主要缺点。

只输出 JSON：{"A":{"score":数字,"errors":[{"para":段号,"claim":"","why":""}],"weaknesses":[""],"strengths":[""]},"B":{同上},"better":"A|B|tie","reason":""}`
  jobs.push(opus(path.join(outDir, c.id), prompt).then(v => {
    if (!v) return {id: c.id, error: 'no judge result'}
    const m = {A: flip ? 'rc' : 'cw', B: flip ? 'cw' : 'rc'}, j = v.value
    const row = {id: c.id, rc: j[flip ? 'A' : 'B'], cw: j[flip ? 'B' : 'A'], better: j.better === 'tie' ? 'tie' : m[j.better], reason: j.reason, cost: v.cost}
    console.log(c.id, 'rc', row.rc?.score, 'cw', row.cw?.score, 'better', row.better); return row
  }))
}
const rows = await Promise.all(jobs)
const avg = k => { const s = rows.map(r => r[k]?.score).filter(x => typeof x === 'number'); return s.length ? +(s.reduce((a, b) => a + b, 0) / s.length).toFixed(2) : null }
const summary = {repo, at: new Date().toISOString(), rows, avg: {rc: avg('rc'), cw: avg('cw')}}
fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 1))
console.log('avg', JSON.stringify(summary.avg))
