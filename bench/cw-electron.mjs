// codewiki-next Electron Q&A on one repository, one new session per question. Screenshots + answers to out/cw/.
//   node bench/cw-electron.mjs <repo> [qid,...]
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import {createRequire} from 'node:module';
const desk = process.env.RC_CW_DESKTOP; if (!desk) throw new Error('set RC_CW_DESKTOP to the codewiki-next apps/desktop folder');
const {_electron: electron} = createRequire(desk + '/package.json')('playwright');
const {canon, projectId} = await import('file:///' + desk + '/main/project.mjs');
const repo = canon(process.argv[2]), only = process.argv[3]?.split(',');
const Q = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'questions.json'), 'utf8')).filter(q => !only || only.includes(q.id));
const oi = process.argv.indexOf('--out'), out = path.join(import.meta.dirname, 'out', oi > 0 ? process.argv[oi + 1] : 'cw'); fs.mkdirSync(out, {recursive: true});
const userData = path.join(os.tmpdir(), 'cw-bench-electron'); fs.rmSync(userData, {recursive: true, force: true}); fs.mkdirSync(userData, {recursive: true});
fs.copyFileSync(path.join(process.env.APPDATA, 'cw-desktop', 'engines.json'), path.join(userData, 'engines.json'));
const errors = [];
const eapp = await electron.launch({args: [desk, '--project', repo], env: {...process.env, CW_DESKTOP_USERDATA: userData}, timeout: 60000});
const page = await eapp.firstWindow();
page.on('pageerror', e => errors.push('[page] ' + e.message)); page.on('console', m => { if (m.type() === 'error') errors.push('[console] ' + m.text()); });
await page.setViewportSize({width: 1600, height: 1000}).catch(() => {});
await page.waitForFunction(() => window.__cwReady === true, null, {timeout: 60000});
const qaDir = path.join(userData, 'projects', projectId(repo), 'qa');
const prev = (() => { try { return JSON.parse(fs.readFileSync(path.join(out, 'answers.json'), 'utf8')).result } catch { return [] } })();
const result = prev.filter(r => !Q.some(q => q.id === r.id));
for (const q of Q) {
  const t0 = Date.now();
  await page.locator('#qaNew').click(); await page.waitForSelector('.hello', {timeout: 20000});
  await page.locator('#qaInput').fill(q.q); await page.locator('#qaSend').click();
  let ok = true;
  try { await page.locator('.turn').last().locator('.take').waitFor({timeout: 900000}) } catch { ok = false }
  const secs = Math.round((Date.now() - t0) / 1000);
  await page.waitForTimeout(3000);
  await page.screenshot({path: path.join(out, `${q.id}-1-answer.png`)});
  const rp = page.locator('.turn').last().locator('.rp');
  if (await rp.count() > 2) { await rp.nth(2).scrollIntoViewIfNeeded(); await rp.nth(2).hover(); await page.waitForTimeout(1200); await page.screenshot({path: path.join(out, `${q.id}-2-para3.png`)}); }
  const sess = fs.readdirSync(qaDir).filter(f => f.endsWith('.json')).map(f => JSON.parse(fs.readFileSync(path.join(qaDir, f), 'utf8'))).find(s => s.turns?.[0]?.question === q.q);
  const turn = sess?.turns?.[0];
  result.push({id: q.id, q: q.q, ok: ok && turn?.status === 'done', secs, status: turn?.status, error: turn?.error, answer: turn?.answer || null, usage: turn?.usage || null});
  console.log(q.id, turn?.status, secs + 's', turn?.answer?.take || turn?.error || '');
  fs.writeFileSync(path.join(out, 'answers.json'), JSON.stringify({engine: 'codex gpt-6.1-sol medium', result, errors}, null, 1));
}
console.log('errors', JSON.stringify(errors.slice(0, 10)));
await eapp.close();
