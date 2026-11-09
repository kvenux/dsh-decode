// Every diagram of each Decode answer drawn whole (not cut by the panel height), one PNG per view, at the layout width of
// the real panel (674 px wide, shown 1.15 times larger): what a reader sees.
//   RC_PLAYWRIGHT=<dir with playwright> node bench/full-diagrams.mjs <answers.json> <out dir>
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'
const here = f => path.join(import.meta.dirname, f)
const { chromium } = createRequire(path.join(process.env.RC_PLAYWRIGHT, 'package.json'))('playwright')
const [ansFile, outDir] = process.argv.slice(2), W = +process.env.RC_FULL_W || 572
const res = JSON.parse(fs.readFileSync(ansFile, 'utf8')).result
fs.mkdirSync(outDir, { recursive: true })
const b = await chromium.launch({ executablePath: process.env.RC_CHROME, headless: true })
const p = await b.newPage({ viewport: { width: 1100, height: 900 }, deviceScaleFactor: 1.5 })
await p.setContent(`<html><head><style>${fs.readFileSync(here('../vendor/cw-uml.css'), 'utf8')}
body{margin:0;background:#fff;font-family:"Segoe UI","Microsoft YaHei",sans-serif} #board{width:${W + 20}px;padding:12px} .cu-pane{overflow:visible!important;height:auto!important;max-height:none!important}</style></head>
<body><div id="board"></div><script>${fs.readFileSync(here('../vendor/cw-uml.js'), 'utf8')}</script></body></html>`)
const out = {}
for (const r of res) {
  const a = r.answer; if (!a) continue
  out[r.id] = []
  for (const [i, v] of a.views.entries()) {
    await p.evaluate(({ v, W }) => { const el = document.getElementById('board'); el.innerHTML = ''
      const opts = v.type === 'sequence' ? { col: Math.max(56, Math.min(150, Math.floor((W - 28) / Math.max(2, v.spec.lifelines.length)))) } : { width: W }
      window.CWUML.board(el, [{ id: v.id, label: v.title || v.type, spec: v.spec, opts }]) }, { v, W })
    await p.waitForTimeout(400)
    const f = `${r.id}-full${i + 1}.png`
    await p.locator('#board').screenshot({ path: path.join(outDir, f) })
    out[r.id].push(f); console.log(f)
  }
}
fs.writeFileSync(path.join(outDir, 'full.json'), JSON.stringify(out, null, 1))
await b.close()
