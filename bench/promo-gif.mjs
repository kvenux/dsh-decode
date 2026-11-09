// A short GIF of one saved Decode answer (no new question, no tokens): the card top, then each paragraph in turn
// (the diagram follows), then one quote opened. Frames go to <out>/frames, the GIF to <out>/<name>.gif (needs ffmpeg).
//   node bench/promo-gif.mjs <dsh web url with token> <sessionId> <out dir> [name]
//   env: RC_PLAYWRIGHT (a folder with playwright in node_modules), RC_CHROME, RC_THEME = light | dark (default dark),
//        RC_LOCALE (default en-US: dsh's own UI in English)
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { execFileSync } from 'node:child_process'

const [url, id, outDir, name = 'decode'] = process.argv.slice(2)
if (!url || !id || !outDir) { console.error('usage: node bench/promo-gif.mjs <url> <sessionId> <out dir> [name]'); process.exit(2) }
const { chromium } = createRequire(path.join(process.env.RC_PLAYWRIGHT || process.cwd(), 'package.json'))('playwright')
const frames = path.join(outDir, 'frames'); fs.rmSync(frames, { recursive: true, force: true }); fs.mkdirSync(frames, { recursive: true })
const ctx = await chromium.launchPersistentContext(path.join(process.env.TEMP || '/tmp', 'rc-pw-gif'), {
  ...(process.env.RC_CHROME ? { executablePath: process.env.RC_CHROME } : {}), headless: true,
  viewport: { width: 1440, height: 900 }, colorScheme: process.env.RC_THEME === 'light' ? 'light' : 'dark', locale: process.env.RC_LOCALE || 'en-US' })
const p = ctx.pages()[0] || await ctx.newPage()
let n = 0; const shot = async (hold = 1) => { for (let i = 0; i < hold; i++) await p.screenshot({ path: path.join(frames, `f${String(n++).padStart(3, '0')}.png`) }) }

await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(3500)
const cont = p.getByRole('button', { name: /^(继续|Continue)$/ }); if (await cont.count()) { await cont.click(); await p.waitForTimeout(800) }
for (let i = 0; i < 6; i++) { const more = p.getByText(/^展开其余|^Show the rest|^Show \d+ more/).first(); if (!(await more.count())) break; await more.click(); await p.waitForTimeout(600) }
const row = p.locator(`[data-row-key^="session:session-${id}"], [data-row-key^="session:${id}"]`).first()
await row.scrollIntoViewIfNeeded(); await row.click(); await p.waitForTimeout(5000)
// the sidebar off: more room for the card and the panel
const fold = p.getByRole('button', { name: /^(Collapse sidebar|收起侧边栏)$/ }).first(); if (await fold.count()) { await fold.click(); await p.waitForTimeout(1200) }
const card = p.locator('.rc-card').last()
if (!(await card.count())) { console.error('no card'); process.exit(1) }
await p.locator('.rc-meta').last().evaluate(e => e.scrollIntoView({ block: 'start' })); await p.mouse.move(5, 5); await p.waitForTimeout(1200)
await shot(3)
const paras = card.locator('.rc-para'), np = await paras.count()
for (let i = 0; i < Math.min(np, 6); i++) {
  await paras.nth(i).evaluate(e => e.scrollIntoView({ block: 'center' })); await paras.nth(i).hover(); await p.waitForTimeout(1400); await shot(2)
}
// one quote opened: the code the paragraph rests on (the cited file of this paragraph in the panel)
const stills = {}
const cited = p.locator('.rc-panel .rc-flat .rc-row.file.cur').first()
if (await cited.count()) { await cited.click(); await p.waitForTimeout(1400); await cited.hover(); await p.waitForTimeout(400); stills.evidence = n; await shot(3) }
// "Ask about this": the paragraph goes into the input box; nothing is sent. The box is cleared after.
const askBtn = paras.nth(Math.min(np, 6) - 1).locator('.rc-ask').first()
if (await askBtn.count()) { await paras.nth(Math.min(np, 6) - 1).hover(); await askBtn.click(); await p.waitForTimeout(1000); stills.ask = n; await shot(3)
  const c = p.locator('[data-composer-input]').first(); await c.click(); await p.keyboard.press('Control+A'); await p.keyboard.press('Delete') }
fs.writeFileSync(path.join(outDir, 'stills.json'), JSON.stringify(stills))
await ctx.close()

const gif = path.join(outDir, `${name}.gif`)
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '1', '-i', path.join(frames, 'f%03d.png'),
  '-vf', 'scale=1200:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=192[p];[b][p]paletteuse=dither=bayer:bayer_scale=4', '-loop', '0', gif])
console.log(gif, (fs.statSync(gif).size / 1e6).toFixed(2) + ' MB', n + ' frames')
