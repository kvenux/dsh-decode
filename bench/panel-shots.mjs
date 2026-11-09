// Real dsh web, saved sessions only (no new question, no tokens): per session, viewport shots of the card and panel.
//   a = card top, b = a middle paragraph chosen (diagram follows), c = files as a list, d = files as the treemap,
//   e = the paragraph quoted in the input box, f = an evidence place in the input box (both with --ask)
// With --live it shows the live panel (g = list, h = map) from the answer's files, without a running question.
// With --layouts it shoots the three layouts (L1 stacked, sized to the diagram; L2 after dragging the bar, then a double
// click gives the split back; L3 side by side; L4/L5 tabs), each with the diagram's scale and whether all of it is in view.
// With --ask it also checks the ask actions (evidence "追问", "复制", the card's "追问这段") and clears the input box
// after each; nothing is sent.
//
//   node bench/panel-shots.mjs <dsh web url with token> <list file: "key sessionId question" per line> <out dir> [--ask] [--live] [--layouts]
//   env: RC_PLAYWRIGHT = a folder whose node_modules has playwright (default: this package's own)
//        RC_CHROME     = a Chromium executable (default: playwright's)
//        RC_THEME      = light | dark (default light)
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const args = process.argv.slice(2), ask = args.includes('--ask'), live = args.includes('--live'), layouts = args.includes('--layouts')
const [url, listFile, outDir] = args.filter(a => !a.startsWith('--'))
if (!url || !listFile || !outDir) { console.error('usage: node bench/panel-shots.mjs <url> <list file> <out dir> [--ask] [--live]'); process.exit(2) }
const req = createRequire(path.join(process.env.RC_PLAYWRIGHT || process.cwd(), 'package.json'))
const { chromium } = req('playwright')
fs.mkdirSync(outDir, { recursive: true })
const list = fs.readFileSync(listFile, 'utf8').trim().split(/\r?\n/).map(l => { const [k, id, ...q] = l.split(' '); return { k, id, q: q.join(' ') } })
const ctx = await chromium.launchPersistentContext(path.join(process.env.TEMP || '/tmp', 'rc-pw-shots'), {
  ...(process.env.RC_CHROME ? { executablePath: process.env.RC_CHROME } : {}), headless: true,
  viewport: { width: 1600, height: 1000 }, colorScheme: process.env.RC_THEME === 'dark' ? 'dark' : 'light' })
await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(url).origin }).catch(() => {})
const p = ctx.pages()[0] || await ctx.newPage()
const errors = []; p.on('pageerror', e => errors.push(e.message))
const log = []
const composerText = () => p.evaluate(() => document.querySelector('[data-composer-input]')?.innerText.trim() || '')
const clearComposer = async () => { const c = p.locator('[data-composer-input]').first(); await c.click(); await p.keyboard.press('Control+A'); await p.keyboard.press('Delete'); await p.waitForTimeout(300) }

for (const it of list) {
  const out = { k: it.k, id: it.id }
  try {
    await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(3500)
    for (let i = 0; i < 6; i++) { const more = p.getByText(/^展开其余|^Show the rest/).first(); if (!(await more.count())) break; await more.click(); await p.waitForTimeout(600) }
    const row = p.locator(`[data-row-key^="session:session-${it.id}"]`).first()
    await row.scrollIntoViewIfNeeded(); await row.click(); await p.waitForTimeout(4500)
    const card = p.locator('.rc-card').last()
    if (!(await card.count())) { log.push({ ...out, err: 'no card' }); continue }
    await p.locator('.rc-meta').last().evaluate(e => e.scrollIntoView({ block: 'start' })); await p.waitForTimeout(900)
    await p.screenshot({ path: `${outDir}/${it.k}-a.png` })
    const paras = card.locator('.rc-para'), n = await paras.count(), i = Math.max(1, Math.floor(n * 0.45))
    await paras.nth(i).evaluate(e => e.scrollIntoView({ block: 'center' })); await paras.nth(i).hover(); await p.waitForTimeout(1500)
    await p.screenshot({ path: `${outDir}/${it.k}-b.png` })
    Object.assign(out, { paras: n, para: i + 1 })
    // files: opened, then the list and the treemap
    const panel = p.locator('.rc-panel').last()
    for (const [mode, shot] of [['list', 'c'], ['map', 'd']]) {
      await panel.locator('.rc-seg:not(.rc-seqas) button').nth(mode === 'list' ? 0 : 1).click(); await p.waitForTimeout(1200)
      await p.screenshot({ path: `${outDir}/${it.k}-${shot}.png` })
      if (mode === 'list') {
        out.rowsDefault = await panel.locator('.rc-tree .rc-row').count()
        // the flat list of this paragraph's files at the top of the pane: where it is, what it holds; the first file opened
        Object.assign(out, await panel.evaluate(el => {
          const pane = el.querySelector('.rc-pane.files')?.getBoundingClientRect(), flat = el.querySelector('.rc-flat')
          const rows = [...(flat?.querySelectorAll('.rc-row.file') || [])]
          return { fsum: el.querySelector('.rc-fsum')?.innerText || null, legend: el.querySelector('.rc-pane.files .rc-tlegend')?.innerText.replace(/\s+/g, ' ') || null,
            flatRows: rows.length, flatCur: rows.filter(r => r.classList.contains('cur')).length,
            flatBottom: rows.length && pane ? Math.round(rows[rows.length - 1].getBoundingClientRect().bottom - pane.top) : null,
            flatNameCut: rows.filter(r => { const b = r.querySelector('.rc-base'); return b.scrollWidth > b.clientWidth + 1 || b.getBoundingClientRect().right > r.getBoundingClientRect().right + 1 }).length }
        }))
        const row = panel.locator('.rc-flat .rc-row.file.cur').first()
        if (await row.count()) { await row.click(); await p.waitForTimeout(1200)
          out.peek = await panel.locator('.rc-flat .rc-peek .rc-code div.hot').count()
          await row.hover(); await p.screenshot({ path: `${outDir}/${it.k}-c1.png` }); await row.click() }
        // the whole answer: every cited file once, with links to its paragraphs
        const scope = panel.locator('.rc-flat .rc-seg button')
        if (await scope.count()) { await scope.nth(1).click(); await p.waitForTimeout(600)
          const more = panel.locator('.rc-flat > .rc-row.more'); if (await more.count()) { await more.click(); await p.waitForTimeout(300) }
          out.allRows = await panel.locator('.rc-flat .rc-row.file').count()
          out.allCited = await p.evaluate(() => new Set(window.__decode.store.get().meta.answer.paras.flatMap(x => x.evidence.map(e => e.file))).size)
          out.paraLinks = await panel.locator('.rc-flat .rc-plinks button').count()
          await p.screenshot({ path: `${outDir}/${it.k}-c3.png` })
          await scope.nth(0).click(); await p.waitForTimeout(400) }
        // find: "web" in the box, the matches replace the tree; Esc gives the tree back
        const find = panel.locator('.rc-find')
        if (await find.count()) { await find.fill('web'); await p.waitForTimeout(500)
          out.find = await panel.evaluate(el => ({ head: el.querySelector('.rc-matches .rc-bt')?.innerText, first: el.querySelector('.rc-matches .rc-row.file')?.title.split('\n')[0], tree: !!el.querySelector('.rc-tree') }))
          await p.screenshot({ path: `${outDir}/${it.k}-c4.png` })
          await find.press('Escape'); await p.waitForTimeout(300); out.findCleared = await panel.evaluate(el => !!el.querySelector('.rc-tree') && el.querySelector('.rc-find').value === '') }
        // collapse all, then open the cited folders again
        const fold = panel.locator('.rc-fold')
        if (await fold.count()) { const open = () => panel.evaluate(el => el.querySelectorAll('.rc-tree .rc-row.dir[aria-expanded=true]').length)
          const o0 = await open(); await fold.click(); await p.waitForTimeout(300); const o1 = await open(); await fold.click(); await p.waitForTimeout(300)
          out.fold = [o0, o1, await open()] }
        // the top folders the answer does not use (listed, folded): the first one opened, then a "…" opened
        out.idleTop = await panel.locator('.rc-tree > .rc-kids > .rc-more-w > .rc-tn.idle').count()
        const d = panel.locator('.rc-tree > .rc-kids > .rc-more-w > .rc-tn.idle > .rc-row.dir').first()
        if (await d.count()) { await d.click(); await p.waitForTimeout(400)
          const dots = panel.locator('.rc-tree .rc-row.more'); out.dots = await dots.count()
          if (out.dots) { await dots.first().click(); await p.waitForTimeout(400) }
          await d.evaluate(e => e.scrollIntoView({ block: 'start' })); await p.waitForTimeout(500)
          await p.screenshot({ path: `${outDir}/${it.k}-c2.png` })
          out.browse = await panel.evaluate(el => ({ rows: el.querySelectorAll('.rc-tree .rc-row.idle').length, overflowX: el.scrollWidth > el.clientWidth + 1 })) }
      }
      if (mode === 'list') Object.assign(out, await panel.evaluate(el => {
        const rows = [...el.querySelectorAll('.rc-tree .rc-row.file')]
        // a file name cut (its folder may shorten, the name may not); a folder row wider than the panel
        const heads = [...el.querySelectorAll('.rc-tree .rc-row.dir')]
        return { folders: el.querySelectorAll('.rc-tree .rc-tn').length, files: rows.length, curFiles: el.querySelectorAll('.rc-tree .rc-row.file.cur').length,
          ranges: el.querySelectorAll('.rc-tree .rc-ranges').length, evPara: el.querySelectorAll(':scope > div > .rc-src').length, more: el.querySelectorAll('.rc-tree .rc-row.more').length,
          icons: el.querySelectorAll('.rc-tree .rc-row.file .rc-ic svg').length, rowH: Math.round(el.querySelector('.rc-tree .rc-row.file')?.getBoundingClientRect().height || 0),
          labels: el.querySelectorAll('.rc-tree .rc-label').length,
          nameCut: rows.filter(r => { const b = r.querySelector('.rc-base'); return b.scrollWidth > b.clientWidth + 1 || b.getBoundingClientRect().right > r.getBoundingClientRect().right + 1 }).length,
          headCut: heads.filter(x => { const n = x.querySelector('.rc-name'); return n.scrollWidth > n.clientWidth + 1 }).length, overflowX: el.scrollWidth > el.clientWidth + 1 }
      }))
    }
    await panel.locator('.rc-seg:not(.rc-seqas) button').first().click(); await p.waitForTimeout(400)
    if (layouts) {
      // L1 stacked, L2 stacked after dragging the bar up, L3 side by side, L4/L5 tabs (diagram, files); back to stacked
      await p.evaluate(() => { for (const l of ['stack', 'side']) localStorage.removeItem('decode.split.' + l) })
      const L = panel.locator('.rc-layout button'), size = () => panel.evaluate(el => {
        const d = el.querySelector('.rc-pane.diagram')?.getBoundingClientRect(), f = el.querySelector('.rc-pane.files')?.getBoundingClientRect(), b = el.querySelector('.rc-board')
        // the diagram shown: its scale, and whether all of it is in its box
        const box = b?.querySelector('.cu-pane:not([hidden])'), sv = box?.querySelector(':scope > svg[viewBox]')
        return { d: d ? [Math.round(d.width), Math.round(d.height)] : null, f: f ? [Math.round(f.width), Math.round(f.height)] : null, board: b ? b.clientWidth : 0,
          split: el.querySelector('.rc-split')?.style.getPropertyValue('--split'), fit: sv ? +sv.dataset.fit : null,
          whole: sv ? sv.getBoundingClientRect().height <= box.clientHeight + 1 && sv.getBoundingClientRect().width <= box.clientWidth + 1 : null,
          svgW: Math.round(Math.max(0, ...[...(b?.querySelectorAll('svg') || [])].map(x => x.getBoundingClientRect().width))), overflowX: el.scrollWidth > el.clientWidth + 1, overflowY: el.scrollHeight > el.clientHeight + 1 } })
      out.layouts = {}
      await L.nth(0).click(); await p.waitForTimeout(1200); await p.screenshot({ path: `${outDir}/${it.k}-L1.png` }); out.layouts.stack = await size()
      const bar = panel.locator('.rc-divider'), bb = await bar.boundingBox()
      if (bb) { await p.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.mouse.down(); await p.mouse.move(bb.x + bb.width / 2, bb.y - 150, { steps: 6 }); await p.mouse.up(); await p.waitForTimeout(900) }
      await p.screenshot({ path: `${outDir}/${it.k}-L2.png` }); out.layouts.dragged = await size()
      // a double click on the bar: the stacked panes are sized to the diagram again
      await bar.dblclick(); await p.waitForTimeout(900); out.layouts.reset = await size()
      await L.nth(1).click(); await p.waitForTimeout(1500); await p.screenshot({ path: `${outDir}/${it.k}-L3.png` }); out.layouts.side = await size()
      await L.nth(2).click(); await p.waitForTimeout(1200); await p.screenshot({ path: `${outDir}/${it.k}-L4.png` }); out.layouts.tabDiagram = await size()
      await panel.locator('.rc-tabs button').nth(1).click(); await p.waitForTimeout(1000); await p.screenshot({ path: `${outDir}/${it.k}-L5.png` }); out.layouts.tabFiles = await size()
      await panel.locator('.rc-tabs button').nth(0).click(); await L.nth(0).click(); await p.waitForTimeout(600)
    }
    if (live) {
      // the live panel without a running question: the answer's files replayed as reads, the last one being read now
      const r = await p.evaluate(() => {
        const st = window.__decode?.store; if (!st?.get().meta) return 'no store'
        const m = st.get().meta, files = [...new Set([...m.answer.paras.flatMap(x => x.evidence.map(e => e.file)), ...m.reads.map(x => x.file)])]
        const k = Math.max(1, files.length - 1)
        st.set({ view: 'live', live: { turn: 1e9, open: true, reads: files.slice(0, k), hits: files.slice(0, 3), current: files[k], query: '', root: m.root,
          sessionId: 'bench', en: null, t0: Date.now() - 40000, last: Date.now(), seenAt: Date.now() } })
        return files.length
      })
      out.liveFiles = r; await p.waitForTimeout(1200)
      const lp = p.locator('.rc-live').last()
      for (const [mode, shot] of [['list', 'g'], ['map', 'h']]) {
        await lp.locator('.rc-seg button').nth(mode === 'list' ? 0 : 1).click(); await p.waitForTimeout(1000)
        await p.screenshot({ path: `${outDir}/${it.k}-${shot}.png` })
        if (mode === 'list') { out.liveCur = await lp.locator('.rc-tree .rc-row.file.cur').count() }
      }
      await lp.locator('.rc-seg button').first().click()
      await p.evaluate(() => window.__decode.store.set({ view: 'answer', live: null })); await p.waitForTimeout(400)
    }
    if (ask) {
      // evidence: ask puts "@path 第 s–e 行：" into the input box; copy puts "path:s-e" on the clipboard
      const ev = panel.locator('.rc-flat .rc-row.file.cur').first()
      if (await ev.count()) {
        await clearComposer()
        await ev.evaluate(e => e.scrollIntoView({ block: 'center' }))
        await ev.hover(); await ev.locator('.rc-acts button').first().click(); await p.waitForTimeout(500)
        out.askEvidence = await composerText()
        await p.screenshot({ path: `${outDir}/${it.k}-f.png` })
        await clearComposer()
        await ev.hover(); await ev.locator('.rc-acts button').nth(1).click(); await p.waitForTimeout(300)
        out.copy = await p.evaluate(() => navigator.clipboard.readText().catch(e => 'ERR ' + e.message))
        out.copyLabel = await ev.locator('.rc-acts button').nth(1).innerText()
      }
      // card: the paragraph being read shows "追问这段", which quotes it in the input box
      await paras.nth(i).evaluate(e => e.scrollIntoView({ block: 'center' })); await paras.nth(i).hover(); await p.waitForTimeout(500)
      await paras.nth(i).locator('.rc-ask').click(); await p.waitForTimeout(600)
      await p.screenshot({ path: `${outDir}/${it.k}-e.png` })
      out.askPara = (await composerText()).slice(0, 80)
      await clearComposer()
      out.leftInBox = await composerText()
    }
  } catch (e) { out.err = String(e.message).slice(0, 200) }
  log.push(out); console.log(JSON.stringify(out))
}
console.log('errors', errors.slice(0, 5).join(' | ') || 'none')
await ctx.close()
