// Screenshots of whole answers as the reader sees them: open each finished session in dsh web and page down the chat column.
//   RC_PLAYWRIGHT=<dir with playwright> RC_CHROME=<chrome> node bench/answer-shots.mjs <dsh url> <jobs.json> [lanes, default 4]
// jobs.json: [{"session":"session-<uuid>","out":"<folder>"}]. Writes <folder>/page-01.png and so on. A folder with pages is not done again.
// Only the chat column is shot: the page header and the sidebar name the mode, which a blind judge must not see.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'
const { chromium } = createRequire(path.join(process.env.RC_PLAYWRIGHT, 'package.json'))('playwright')
const [url, jobFile, lanesArg] = process.argv.slice(2), LANES = +(lanesArg || 4), OUT = path.join(import.meta.dirname, 'out')
const SEED = process.env.RC_PW_SEED || path.join(OUT, 'pw-profile-std'), SCROLL = '[class*="_scrollBody"]'
const done = j => fs.existsSync(j.out) && fs.readdirSync(j.out).some(f => /^page-\d+\.png$/.test(f))
const jobs = JSON.parse(fs.readFileSync(jobFile, 'utf8')).filter(j => !done(j)), fails = []
console.log('jobs', jobs.length)
const expandAll = async p => {
  for (let i = 0; i < 40; i++) {
    const closed = p.locator('[data-row-key^="workspace:"][aria-expanded="false"]'), more = p.getByText(/^Show \d+ more sessions?$/)
    if (await closed.count()) { await closed.first().click(); await p.waitForTimeout(400); continue }
    if (await more.count()) { await more.first().click(); await p.waitForTimeout(500); continue }
    return
  }
}
const shoot = async (p, j) => {
  const row = p.locator(`[data-row-key="session:${j.session}"]`)
  if (!await row.count()) await expandAll(p)
  await row.first().scrollIntoViewIfNeeded(); await row.first().click(); await p.waitForTimeout(3500)
  await p.locator(SCROLL).first().waitFor({ timeout: 20000 })
  const body = p.locator(SCROLL).first()
  fs.mkdirSync(j.out, { recursive: true })
  const { client, full } = await body.evaluate(e => ({ client: e.clientHeight, full: e.scrollHeight })), step = client - 200 // the message box covers the bottom of the column; pages overlap so that no line is lost
  let n = 0
  for (let top = 0; ; top += step) {
    await body.evaluate((e, t) => { e.scrollTop = t }, top); await p.waitForTimeout(500)
    await body.screenshot({ path: path.join(j.out, `page-${String(++n).padStart(2, '0')}.png`) })
    if (top + client >= full || n >= 30) break
  }
  console.log('done', j.out, n)
}
const lane = async l => {
  const profile = path.join(OUT, `pw-profile-l${l}`); if (!fs.existsSync(profile)) fs.cpSync(SEED, profile, { recursive: true })
  const ctx = await chromium.launchPersistentContext(profile, { executablePath: process.env.RC_CHROME, headless: true, viewport: { width: 1600, height: 1000 }, colorScheme: process.env.RC_SCHEME || 'dark', locale: 'en-US' })
  const p = ctx.pages()[0] || await ctx.newPage()
  await p.goto(url, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(4000)
  for (let j; (j = jobs.shift());) { try { await shoot(p, j) } catch (e) { if (j.retry) { fails.push(j.out); console.log('FAILED', j.out, e.message.slice(0, 120)) } else { j.retry = 1; jobs.push(j); console.log('retry', j.out) } } }
  await ctx.close()
}
await Promise.all(Array.from({ length: LANES }, (_, l) => lane(l)))
console.log('fails', JSON.stringify(fails))
