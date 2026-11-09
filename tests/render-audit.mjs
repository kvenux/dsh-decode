// Diagram audit: every view of the saved answers in tests/fixtures/answers.json is drawn the way the panel draws it
// (cw-uml board, panel width, zoom, pane height) and shown once per paragraph. Per answer it counts:
//   overflow  text wider than the box it sits in
//   cut       text shortened with '…' (the reader loses words)
//   midword   a word broken across two lines ("DS" | "H 要求")
//   overlap   a label over a name or another label, or two names over each other
//   hidden    a step the paragraph points at that is not fully inside the diagram pane after it moved there
// The counts are compared with tests/render-baseline.json: a count above its baseline fails. After a fix, write the
// lower counts with --update.
//
//   npm run test:render [-- --update] [-- --only q07,e9] [-- --verbose]
//   env: RC_PLAYWRIGHT = a folder whose node_modules has playwright (default: this package's own)
//        RC_CHROME     = a Chromium executable (default: playwright's)
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const here = p => new URL(p, import.meta.url)
const args = process.argv.slice(2), update = args.includes('--update'), verbose = args.includes('--verbose')
const only = (args[args.indexOf('--only') + 1] || '').split(',').filter(x => args.includes('--only') && x)
let chromium
try { ({ chromium } = createRequire(path.join(process.env.RC_PLAYWRIGHT || process.cwd(), 'package.json'))('playwright')) } catch {
  console.error('cannot run: playwright not found. Install it here (npm i -D playwright) or set RC_PLAYWRIGHT to a folder that has it.')
  process.exit(2)
}
// the panel in dsh web at 1600 x 1000: board 693 px wide (padding 8), 13 px system font. The diagram area takes its
// height from the panel split (src/client/app.js): here a fixed 520 px, less than the panel gives it, and without the
// panel's fit-to-pane scaling, so a step counts as hidden where a smaller panel would have to scroll to it
const BOARD = 693, AREA = 520, ZOOM = 1.15, VIEWPORT = { width: 1600, height: 1000 }
const answers = JSON.parse(fs.readFileSync(here('fixtures/answers.json'), 'utf8')).filter(a => !only.length || only.includes(a.id))
const app = fs.readFileSync(here('../src/client/app.js'), 'utf8')
const STYLE = app.match(/const STYLE = `([\s\S]*?)`\n/)[1]
const b = await chromium.launch({ ...(process.env.RC_CHROME ? { executablePath: process.env.RC_CHROME } : {}), headless: true })
// reduced motion: cw-uml scrolls the pane at once instead of smoothly, so the step is measured where it ends up
const p = await b.newPage({ viewport: VIEWPORT, reducedMotion: 'reduce' })
const errors = []; p.on('pageerror', e => errors.push(e.message))
await p.setContent(`<html><head><style>${fs.readFileSync(here('../vendor/cw-uml.css'), 'utf8')}\n${STYLE}
  body{margin:0;padding:10px;background:#fff;font:13px -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif}
  .rc-board{width:${BOARD - 16}px;box-sizing:content-box} *{transition:none!important;animation:none!important}</style></head>
  <body><div class="rc-panel"><div class="rc-pane diagram" style="height:${AREA}px;display:flex;flex-direction:column"><div class="rc-boardw"><div class="rc-board" id="board"></div></div></div></div><script>${fs.readFileSync(here('../vendor/cw-uml.js'), 'utf8')}</script></body></html>`)

const KEYS = ['overflow', 'cut', 'midword', 'overlap', 'hidden']
const result = {}
for (const a of answers) {
  const r = await p.evaluate(({ a, ZOOM }) => {
    const el = document.getElementById('board'); el.innerHTML = ''
    const w = Math.max(300, el.clientWidth - 16) / ZOOM
    // as the panel builds it (src/client/app.js AnswerPanel)
    const board = CWUML.board(el, a.views.map(v => ({ id: v.id, label: v.title || v.type, spec: v.spec,
      opts: v.type === 'sequence' ? { col: Math.max(56, Math.min(150, Math.floor((w - 28) / Math.max(2, v.spec.lifelines.length)))), zoom: ZOOM } : { width: w, zoom: ZOOM } })))
    // a sequence paragraph that names no message walks the messages since the previous paragraph's upto (app.js walkedNow)
    const walked = i => { const p = a.paras[i], v = a.views.find(x => x.id === p.view), msgs = v?.spec?.messages
      if (!msgs || !p.upto) return p.now
      const order = msgs.map(m => m.id); if (p.now.some(x => order.includes(x))) return p.now
      const prev = a.paras.slice(0, i).reverse().find(q => q.view === p.view && q.upto)?.upto, to = order.indexOf(p.upto), from = order.indexOf(prev ?? '') + 1
      return [...p.now, ...order.slice(from <= to ? from : to, to + 1).slice(-6)] }
    const R = e => e.getBoundingClientRect(), hit = (x, y) => Math.min(x.right, y.right) - Math.max(x.left, y.left) > 2 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 2
    const seen = { overflow: new Set(), cut: new Set(), midword: new Set(), overlap: new Set(), hidden: new Set() }
    a.paras.forEach((para, i) => {
      const view = para.view || a.views[0]?.id, now = walked(i), v = a.views.find(x => x.id === view), msgs = new Set((v?.spec?.messages || []).map(m => m.id))
      try { board.show({ view, now, all: !now.some(id => msgs.has(id)), ...(para.upto ? { upto: para.upto } : {}) }) } catch (e) { seen.overflow.add('show failed: ' + e.message); return }
      const pane = [...el.querySelectorAll('.cu-pane')].find(x => !x.hidden); if (!pane) return
      const root = pane.querySelector('svg') ? pane : null
      const src = JSON.stringify(v?.spec || {})
      const vis = e => { for (let x = e; x && x !== pane; x = x.parentElement) { const c = getComputedStyle(x); if (c.display === 'none' || c.opacity === '0' || c.visibility === 'hidden') return false } return true }
      if (root) {
        const texts = [...pane.querySelectorAll('svg text')].filter(t => t.textContent.trim() && vis(t) && !t.closest('.cu-pin'))
        for (const t of texts) {
          const s = t.textContent
          // a message's shortened label stands in for its number (its text did not fit the span): not words lost
          if (/…$/.test(s) && !src.includes(s) && !t.closest('.cu-slabel')) seen.cut.add(s)
          const box = t.parentElement.querySelector(':scope > rect')
          if (box && vis(box)) { const tb = R(t), bb = R(box); if (tb.width < bb.width + 40 && (tb.left < bb.left - 1 || tb.right > bb.right + 1)) seen.overflow.add(s) }
        }
        for (const g of new Set(texts.map(t => t.parentElement))) {
          const ls = [...g.querySelectorAll(':scope > text')].filter(vis).map(t => t.textContent).filter(Boolean)
          for (let k = 0; k + 1 < ls.length; k++)
            if (/[A-Za-z0-9]$/.test(ls[k]) && /^[A-Za-z0-9]/.test(ls[k + 1]) && src.includes(ls[k] + ls[k + 1]) && !src.includes(ls[k] + ' ' + ls[k + 1])) seen.midword.add(ls[k] + ' | ' + ls[k + 1])
        }
        const labels = [...pane.querySelectorAll('.cu-elabel, .cu-msg .cu-label, .cu-msg .cu-slabel')].filter(l => vis(l) && !l.classList.contains('cu-noroom') && !l.closest('.cu-pin')).map(l => ({ t: l.textContent, r: R(l) }))
        const names = [...pane.querySelectorAll('[data-id] > text, [data-id] > .cu-pname')].filter(n => vis(n) && !n.closest('.cu-pin')).map(n => ({ t: n.textContent, r: R(n), g: n.parentElement }))
        labels.forEach((l, k) => { names.forEach(n => { if (hit(l.r, n.r)) seen.overlap.add(`label "${l.t}" / name "${n.t}"`) }); labels.slice(k + 1).forEach(m => { if (hit(l.r, m.r)) seen.overlap.add(`label "${l.t}" / label "${m.t}"`) }) })
        // the lines of one name sit close together: only names of different elements count
        names.forEach((n, k) => names.slice(k + 1).forEach(m => { if (n.g !== m.g && hit(n.r, m.r)) seen.overlap.add(`name "${n.t}" / name "${m.t}"`) }))
        // the steps of this paragraph (a lifeline or a box taller than half the pane is a place, not a step) inside the pane
        const P = R(pane), pin = Math.round(pane.querySelector('.cu-pin svg')?.getBoundingClientRect().height || 0)
        for (const s of pane.querySelectorAll('.cu-now[data-id]')) {
          if (s.closest('.cu-pin')) continue
          const x = R(s); if (x.height > (P.height - pin) / 2) continue
          if (x.top < P.top + pin - 1 || x.bottom > P.bottom + 1 || x.left < P.left - 1 || x.right > P.right + 1) seen.hidden.add(`p${i + 1} ${s.dataset.id}`)
        }
      }
    })
    return Object.fromEntries(Object.entries(seen).map(([k, s]) => [k, [...s]]))
  }, { a, ZOOM })
  result[a.id] = r
}
await b.close()

const basePath = here('render-baseline.json')
const base = fs.existsSync(basePath) ? JSON.parse(fs.readFileSync(basePath, 'utf8')) : {}
let worse = 0
const total = Object.fromEntries(KEYS.map(k => [k, 0]))
for (const [id, r] of Object.entries(result)) {
  const n = Object.fromEntries(KEYS.map(k => [k, r[k].length])), was = base[id] || {}
  KEYS.forEach(k => { total[k] += n[k] })
  const up = KEYS.filter(k => n[k] > (was[k] ?? 0))
  if (up.length) worse++
  console.log(`${up.length ? 'WORSE' : 'ok   '} ${id.padEnd(4)} ${KEYS.map(k => `${k} ${n[k]}${was[k] != null && was[k] !== n[k] ? ` (was ${was[k]})` : ''}`).join(' · ')}`)
  for (const k of KEYS) if (verbose || up.includes(k)) for (const s of r[k].slice(0, 6)) console.log(`        ${k}: ${s.slice(0, 120)}`)
}
console.log('total', JSON.stringify(total), 'page errors', errors.length ? errors.slice(0, 3).join(' | ') : 'none')
if (update) {
  const next = { ...base }; for (const [id, r] of Object.entries(result)) next[id] = Object.fromEntries(KEYS.map(k => [k, r[k].length]))
  fs.writeFileSync(basePath, JSON.stringify(next, null, 1) + '\n'); console.log('baseline written:', path.resolve(new URL(basePath).pathname.replace(/^\/([A-Za-z]:)/, '$1')))
} else if (worse || errors.length) { console.log(`${worse} answer(s) worse than the baseline`); process.exit(1) }
