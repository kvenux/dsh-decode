// Decode in dsh web on one workspace, one new session per question. Screenshots + answers to out/rc/.
//   node bench/rc-dsh.mjs <dsh url with token> <workspace name> [qid,...] [--model DeepSeek-V4.1-Flash]
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os'; import zlib from 'node:zlib'; import {createRequire} from 'node:module';
// the turn's end as the session log records it (newest session of the workspace written after `since`)
const SESSIONS_ROOT = process.env.RC_SESSIONS || path.join(os.homedir(), '.dsh', 'sessions')
function turnEnd(since, qtext, decode) {
  try {
    // the session file is created before the mode and model are picked: match on its turn's start, not the file's birth
    const files = fs.readdirSync(SESSIONS_ROOT).filter(w => !process.env.RC_LOCK || w.includes(workspace)).flatMap(w => { try { return fs.readdirSync(path.join(SESSIONS_ROOT, w)).map(d => path.join(SESSIONS_ROOT, w, d, 'session.v4.jsonl.zstd')) } catch { return [] } }).filter(f => fs.existsSync(f) && fs.statSync(f).mtimeMs >= since - 5000)
    for (const f of files) {
      const b = fs.readFileSync(f), mg = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]); let idx = [], p = 0, out = ''
      while ((p = b.indexOf(mg, p)) >= 0) { idx.push(p); p += 4 }
      for (let i = 0; i < idx.length; i++) { try { out += zlib.zstdDecompressSync(b.subarray(idx[i], idx[i + 1] ?? b.length)).toString() } catch {} }
      const ev = out.split('\n').map(l => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
      const start = ev.find(x => x.type === 'turn/start'); if (!start || start.time < since - 3000) continue
      // runs may share the workspace: the session must hold this question, asked in this mode (Decode offers submit_answer)
      if (qtext && !ev.some(x => x.type === 'user/message' && (x.data?.content || []).some(c => c.text === qtext))) continue
      if (decode !== undefined && ev.some(x => x.type === 'request/header' && (x.data?.header?.tools || []).some(t => t.name === 'submit_answer')) !== decode) continue
      const end = ev.find(x => x.type === 'turn/end')
      if (!end) return null
      // tokens and the reply as the session log records them (summed over the turn's model calls)
      const usage = {input: 0, output: 0, cacheRead: 0, total: 0, calls: 0}
      for (const e of ev) { const u = e.type === 'assistant/message' && e.data?.usage; if (u) { usage.input += u.inputTokens || 0; usage.output += u.outputTokens || 0; usage.cacheRead += u.cacheReadTokens || 0; usage.total += u.totalTokens || 0; usage.calls++ } }
      const hdr = ev.find(x => x.type === 'request/header')?.data?.header?.config || {}
      const last = ev.filter(x => x.type === 'assistant/message').at(-1)
      const finalText = (last?.data?.message?.content || []).filter(c => c.type === 'text').map(c => c.text).join(String.fromCharCode(10))
      const tools = {}; for (const e of ev) if (e.type === 'tool/call') { const n = e.data?.call?.name || e.data?.name || e.data?.toolName || '?'; tools[n] = (tools[n] || 0) + 1 }
      return {reason: end.data?.reason?.kind, error: end.data?.reason?.error?.message, retries: (out.match(/"type":"llm\/retry"/g) || []).length, secs: Math.round((end.time - start.time) / 1000),
        usage, model: hdr.model, effort: hdr.reasoningEffort, steps: ev.filter(x => x.type === 'step/start').length, tools, finalText, file: f}
    }
    return null
  } catch { return null }
}
const {chromium} = createRequire(path.join(process.env.RC_PLAYWRIGHT || process.cwd(), 'package.json'))('playwright');
const [url, workspace, ids] = process.argv.slice(2), only = ids && !ids.startsWith('--') ? ids.split(',') : null;
const MODE = process.env.RC_MODE || 'Decode';
const mi = process.argv.indexOf('--model'), model = mi > 0 ? process.argv[mi + 1] : 'DeepSeek-V4.1-Flash';
// RC_Q="text": one probe question instead of the bench set
const Q = process.env.RC_Q ? [{id: 'probe', q: process.env.RC_Q}] : JSON.parse(fs.readFileSync(process.env.RC_QFILE || path.join(import.meta.dirname, 'questions.json'), 'utf8')).filter(q => !only || only.includes(q.id));
const oi = process.argv.indexOf('--out'), out = path.join(import.meta.dirname, 'out', oi > 0 ? process.argv[oi + 1] : 'rc'); fs.mkdirSync(out, {recursive: true});
const prev = (() => { try { return JSON.parse(fs.readFileSync(path.join(out, 'answers.json'), 'utf8')).result } catch { return [] } })();
const result = prev.filter(r => !Q.some(q => q.id === r.id));
const ctx = await chromium.launchPersistentContext(process.env.RC_PW_PROFILE || path.join(import.meta.dirname, 'out', 'pw-profile'), {executablePath: process.env.RC_CHROME, headless: true, viewport: {width: 1600, height: 1000}, colorScheme: process.env.RC_SCHEME || 'dark', ...(process.env.RC_LOCALE ? {locale: process.env.RC_LOCALE} : {})});  // RC_LOCALE=en-US: dsh's own UI in English  // dsh follows the system theme; the user's is dark
const p = ctx.pages()[0] || await ctx.newPage();
const errors = []; p.on('pageerror', e => errors.push('[page] ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errors.push('[console] ' + m.text().slice(0, 300)) });
await p.goto(url, {waitUntil: 'load', timeout: 60000}); await p.waitForTimeout(4000);
const cont = p.getByRole('button', {name: /^(继续|Continue)$/}); if (await cont.count()) { await cont.click(); await p.waitForTimeout(800); }
// RC_LOCK=<folder>: one browser at a time from "new session" to "send", because browsers that open a new session in the same workspace at once share one empty session
const LOCK = process.env.RC_LOCK
const lock = async () => { if (!LOCK) return; for (;;) { try { fs.mkdirSync(LOCK); return } catch { try { if (Date.now() - fs.statSync(LOCK).mtimeMs > 90000) fs.rmSync(LOCK, {recursive: true, force: true}) } catch {} await p.waitForTimeout(500 + Math.random() * 500) } } }
for (const q of Q) {
  await lock()
  await p.getByText(workspace, {exact: true}).first().hover(); await p.waitForTimeout(300);
  await p.getByRole('button', {name: new RegExp(`^(在“${workspace}”中新建会话|New session in ${workspace})$`)}).click(); await p.waitForTimeout(1500);
  // RC_MODE: the mode to ask in (default Decode; '标准模式' = dsh without the plugin, for a baseline)
  const presetBtn = p.getByRole('button', {name: /Decode|标准模式|PTC 模式|极简模式|创造模式|Standard mode|PTC mode|Minimal mode|Creator mode/}).first();
  if (!(await presetBtn.innerText()).includes(MODE)) { await presetBtn.click(); await p.waitForTimeout(600); await p.getByText(MODE, {exact: true}).last().click(); await p.waitForTimeout(600); }
  await p.getByRole('button', {name: /DeepSeek-|选择模型|Select model/}).first().click(); await p.waitForTimeout(600);
  const sub = p.locator('[role=menu], [role=dialog]').getByText(/DeepSeek-V4/).first(); if (await sub.count()) { await sub.click(); await p.waitForTimeout(600); }
  await p.getByText(model, {exact: true}).last().click(); await p.waitForTimeout(400); await p.keyboard.press('Escape');
  // RC_EFFORT: the reasoning level (Low, Medium, High...): the same menu, second row
  if (process.env.RC_EFFORT) { await p.getByRole('button', {name: /DeepSeek-|选择模型|Select model/}).first().click(); await p.waitForTimeout(600);
    await p.locator('[role=menu], [role=dialog]').getByText(/推理等级|Effort/).first().click(); await p.waitForTimeout(600);
    await p.getByText(process.env.RC_EFFORT, {exact: true}).last().click(); await p.waitForTimeout(400); await p.keyboard.press('Escape'); await p.waitForTimeout(300) }
  const box = p.locator('[contenteditable=true], textarea').first(); await box.click(); await box.fill(q.q);
  await p.getByRole('button', {name: /^(发送消息|Send message)$/}).click();
  if (LOCK) { await p.waitForTimeout(1500); fs.rmSync(LOCK, {recursive: true, force: true}) }
  const t0 = Date.now(); let ok = false, retries = 0, end = null, seen = 0, liveAt = 0, live2 = 0, writingAt = 0;
  while (Date.now() - t0 < 900000) {
    await p.waitForTimeout(5000);
    // the "time is up" notice while the turn runs (a finished turn folds it away with its steps)
    // the live map: the panel should open with the first file read, long before the answer
    if (!liveAt && await p.locator('.rc-live.open .rc-tm').count()) { liveAt = Math.round((Date.now() - t0) / 1000); await p.waitForTimeout(1500); await p.screenshot({path: path.join(out, `${q.id}-0-live.png`)}) }
    if (liveAt && !live2 && Date.now() - t0 > 40000 && await p.locator('.rc-live.open').count()) { live2 = 1; await p.screenshot({path: path.join(out, `${q.id}-0-live2.png`)}) }
    // the live panel after reading stops: "writing the answer" with the time so far
    if (!writingAt && await p.locator('.rc-live.open .rc-ph b', {hasText: /正在整理回答|Writing the answer/}).count()) { writingAt = Math.round((Date.now() - t0) / 1000); await p.screenshot({path: path.join(out, `${q.id}-0-writing.png`)}) }
    const live = p.getByText(/查证时间到|Time is up/).first()
    if (!seen && await live.count() && await live.isVisible()) { seen = Math.round((Date.now() - t0) / 1000); await live.scrollIntoViewIfNeeded(); await p.screenshot({path: path.join(out, `${q.id}-3-notice-live.png`)}) }
    retries = Math.max(retries, await p.locator('.rc-retry').count());
    if (await p.locator('.rc-card').count()) { ok = true; break }
    end = turnEnd(t0, q.q, MODE.startsWith("Decode")); if (end && end.reason !== 'completed' && end.reason !== 'concluded') break
    if (end) { await p.waitForTimeout(5000); ok = !!(await p.locator('.rc-card').count()); break }
  }
  const secs = Math.round((Date.now() - t0) / 1000);
  await p.waitForTimeout(3000);
  await p.screenshot({path: path.join(out, `${q.id}-1-answer.png`)});
  const paras = p.locator('.rc-card .rc-para');
  // the conclusion should be in view when the answer arrives
  const takeSeen = await p.evaluate(() => { const e = document.querySelector('.rc-card .rc-take'); if (!e) return null; const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight })
  // the map in the answer panel is folded by default: open it for the hover check, fold it back after
  const fold = p.locator('.rc-panel .rc-fold[aria-expanded=false]'); const folded = await fold.count() > 0; if (folded) { await fold.first().click(); await p.waitForTimeout(800) }
  if (await paras.count() > 2) { await paras.nth(2).scrollIntoViewIfNeeded(); await paras.nth(2).hover(); await p.waitForTimeout(1500); await p.screenshot({path: path.join(out, `${q.id}-2-para3.png`)});
    // the paragraph's evidence is folded; the reader opens one to see the code
    const src = p.locator('.rc-src-h').first(); if (await src.count()) { await src.click(); await p.waitForTimeout(1500); await p.screenshot({path: path.join(out, `${q.id}-4-evidence.png`)}); } }
  // every diagram of the answer: open its tab in the panel and shoot the page
  const vtabs = p.locator('.rc-board .cu-tabs [data-view]'), nv = await vtabs.count(); const viewShots = []
  for (let i = 0; i < nv; i++) { await vtabs.nth(i).click(); await p.waitForTimeout(1200); const f = `${q.id}-5-view${i + 1}.png`; await p.screenshot({path: path.join(out, f)}); viewShots.push(f) }
  if (!nv && await p.locator('.rc-board .cu-pane svg, .rc-board .cu-table').count()) { const f = `${q.id}-5-view1.png`; await p.screenshot({path: path.join(out, f)}); viewShots.push(f) }
  const ui = await p.evaluate(() => ({card: !!document.querySelector('.rc-card'), board: !!document.querySelector('.rc-board .cu-pane svg, .rc-board .cu-table'), mapCur: document.querySelectorAll('.rc-tm rect.f.cur').length, mapCited: document.querySelectorAll('.rc-tm rect.f.cited').length}));
  ui.takeSeen = takeSeen; ui.mapFolded = folded; ui.writingAt = writingAt
  if (folded) { const back = p.locator('.rc-panel .rc-fold[aria-expanded=true]'); if (await back.count()) await back.first().click() }
  const answer = await p.evaluate(() => { const a = window.__decodeAnswers || {}; return Object.values(a).at(-1) || null });
  // the one-time "submit now" notice: where it shows and how it looks
  // the chat hides injected notices (dsh shows them under 轨迹); the card marks an answer written at the time limit
  const notice = p.locator('.rc-hurried').first(), hurried = seen || await notice.count() > 0
  if (hurried) { await notice.scrollIntoViewIfNeeded(); await p.waitForTimeout(800); await p.screenshot({path: path.join(out, `${q.id}-3-notice.png`)}) }
  const stat = await p.evaluate(() => document.querySelector('footer, [class*=footer]')?.innerText?.slice(0, 200) || '');
  end = end || turnEnd(t0, q.q, MODE.startsWith("Decode"))
  // an ordinary reply (no card): the last assistant text, for questions that need no diagram
  const plain = ui.card ? '' : await p.evaluate(() => { const m = [...document.querySelectorAll('[data-message-role=assistant], [class*=assistant], [class*=markdown]')].at(-1); return m?.innerText?.slice(0, 20000) || '' })
  result.push({id: q.id, q: q.q, ok, secs, liveAt, retries, hurried, end, ui, answer, plain: plain || (!ui.card && end?.finalText) || '', stat, viewShots});
  console.log(q.id, ok, secs + "s", "live@" + liveAt + "s", "retries", retries, 'hurried', hurried, 'end', JSON.stringify(end), JSON.stringify(ui), answer?.take || ('plain: ' + plain.replace(/\s+/g, ' ').slice(0, 120)));
  fs.writeFileSync(path.join(out, 'answers.json'), JSON.stringify({engine: 'dsh ' + model + ' · ' + MODE, result, errors}, null, 1));
  await p.goto(url, {waitUntil: 'load'}); await p.waitForTimeout(3000);
}
console.log('errors', JSON.stringify(errors.slice(0, 10)));
await ctx.close();
