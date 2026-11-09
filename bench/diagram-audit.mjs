// How readable the diagrams are, measured on the drawing itself: the same saved answers are drawn again with vendor/cw-uml,
// so a change to the library is compared with no noise from the model.
//   RC_PLAYWRIGHT=<dir with playwright> node bench/diagram-audit.mjs <out.json> <answers.json> [more answers.json]
// Per view: edge pairs that cross, length of edges drawn on top of each other, labels that overlap a label, labels an
// edge runs through, nodes an edge runs through, and text cut with an ellipsis.
import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'
const here = f => path.join(import.meta.dirname, f)
const { chromium } = createRequire(path.join(process.env.RC_PLAYWRIGHT, 'package.json'))('playwright')
const [outFile, ...files] = process.argv.slice(2)
const b = await chromium.launch({ executablePath: process.env.RC_CHROME, headless: true })
const p = await b.newPage({ viewport: { width: 1100, height: 900 } })
await p.setContent(`<html><head><style>${fs.readFileSync(here('../vendor/cw-uml.css'), 'utf8')}
body{margin:0;background:#fff;font-family:"Segoe UI","Microsoft YaHei",sans-serif} #board{width:1000px;padding:12px} .cu-pane{overflow:visible!important;height:auto!important;max-height:none!important}</style></head>
<body><div id="board"></div><script>${fs.readFileSync(here('../vendor/cw-uml.js'), 'utf8')}</script></body></html>`)

const measure = () => {
  // a sequence diagram keeps its heads in an svg of their own: the drawing is the largest one
  const svg = [...document.querySelectorAll('#board .cu-pane:not([hidden]) svg[viewBox]')].sort((a, c) => c.querySelectorAll('*').length - a.querySelectorAll('*').length)[0]; if (!svg) return null
  const box = e => { const r = e.getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top, b: r.bottom } }
  const hit = (a, c, m = 0) => a.l < c.r - m && c.l < a.r - m && a.t < c.b - m && c.t < a.b - m
  const ctm = svg.getScreenCTM()
  // every edge as a polyline in screen space
  const edges = [...svg.querySelectorAll('.cu-edge[data-id], .cu-edge')].map(g => {
    const s = g.querySelector('path:not(.cu-hit), polyline, line:not(.cu-hit)'); if (!s?.getTotalLength) return null
    const L = s.getTotalLength(), pts = []
    for (let d = 0; d <= L; d += 4) { const q = s.getPointAtLength(d); pts.push([q.x * ctm.a + ctm.e, q.y * ctm.d + ctm.f]) }
    return { id: g.dataset.id, pts, L }
  }).filter(Boolean)
  const cross = (a, c, d, e) => { const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return o(a, c, d) * o(a, c, e) < -0.01 && o(d, e, a) * o(d, e, c) < -0.01 }
  let crossings = 0, overlap = 0
  for (let i = 0; i < edges.length; i++) for (let j = i + 1; j < edges.length; j++) {
    const A = edges[i].pts, B = edges[j].pts; let x = false
    for (let u = 3; u < A.length - 4 && !x; u++) for (let v = 3; v < B.length - 4; v++) if (cross(A[u], A[u + 1], B[v], B[v + 1])) { x = true; break }
    if (x) crossings++
    for (let u = 3; u < A.length - 3; u++) if (B.some((q, v) => v > 2 && v < B.length - 3 && Math.abs(q[0] - A[u][0]) < 2.5 && Math.abs(q[1] - A[u][1]) < 2.5)) overlap += 4
  }
  const labels = [...svg.querySelectorAll('.cu-elabel, .cu-label, .cu-guard')].filter(e => e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none').map(box)
  const nodes = [...svg.querySelectorAll('.cu-node')].map(box).filter(n => n.r > n.l)
  let labelLabel = 0, labelEdge = 0, edgeNode = 0, labelNode = 0
  const canvas = svg.getBoundingClientRect(), lineOut = edges.filter(e => e.pts.some(p => p[0] < canvas.left - 1 || p[0] > canvas.right + 1 || p[1] < canvas.top - 1 || p[1] > canvas.bottom + 1)).length
  for (const l of labels) if (nodes.some(n => hit(l, n, 1))) labelNode++
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) if (hit(labels[i], labels[j], 1)) labelLabel++
  // an edge carries its own label on its line, so only edges other than the nearest are counted: a label crossed by more than one edge
  for (const l of labels) { const n = edges.filter(e => e.pts.some(q => q[0] > l.l && q[0] < l.r && q[1] > l.t && q[1] < l.b)).length; if (n > 1) labelEdge += n - 1 }
  for (const e of edges) for (const n of nodes) { const inner = e.pts.slice(4, -4).filter(q => q[0] > n.l + 2 && q[0] < n.r - 2 && q[1] > n.t + 2 && q[1] < n.b - 2); if (inner.length > 1) edgeNode++ }
  // a label away from its own line reads as the label of another line: that is a wrong diagram, not a neat one
  let labelFar = 0, labelWrong = 0, labelOut = 0, guardFar = 0
  const frame = box(svg)
  for (const l of labels) if (l.l < frame.l - 1 || l.r > frame.r + 1 || l.t < frame.t - 1 || l.b > frame.b + 1) labelOut++
  for (const g of svg.querySelectorAll('.cu-elabel[data-for]')) {
    const e = edges.find(x => x.id === g.dataset.for); if (!e) continue
    const r = box(g), d = Math.min(...e.pts.map(q => Math.hypot(Math.max(r.l - q[0], 0, q[0] - r.r), Math.max(r.t - q[1], 0, q[1] - r.b))))
    if (d > 6) labelFar++
    // a guard says which way a decision goes: away from the decision, it cannot be told whose it is
    if (svg.classList.contains('cu-act-d') && e.pts.length && Math.hypot(Math.max(r.l - e.pts[0][0], 0, e.pts[0][0] - r.r), Math.max(r.t - e.pts[0][1], 0, e.pts[0][1] - r.b)) > 50) guardFar++
    const other = Math.min(Infinity, ...edges.filter(x => x !== e).map(x => Math.min(...x.pts.map(q => Math.hypot(Math.max(r.l - q[0], 0, q[0] - r.r), Math.max(r.t - q[1], 0, q[1] - r.b))))))
    // a reader takes a label for the line at its middle: touching its own line at one end is not enough
    const mid = [(r.l + r.r) / 2, (r.t + r.b) / 2], to = x => Math.min(...x.pts.map(q => Math.hypot(q[0] - mid[0], q[1] - mid[1])))
    if (other + 1 < d || edges.some(x => x !== e && to(x) + 1 < to(e))) labelWrong++
  }
  const frameBox = box(svg), shownT = [...svg.querySelectorAll('text')].filter(t => getComputedStyle(t.closest('g') || t).display !== 'none' && t.getBoundingClientRect().width > 0)
  const cut = shownT.filter(t => /…$/.test(t.textContent) || t.getBoundingClientRect().right > frameBox.r + 1 || t.getBoundingClientRect().left < frameBox.l - 1).length
  // text cut with no mark: the whole name is in the title and only part of it is drawn
  let lost = 0
  for (const g of svg.querySelectorAll('.cu-kid, .cu-art')) { const t = g.querySelector('title')?.textContent.replace(/\s+/g, '') || '', d = [...g.querySelectorAll('text')].map(x => x.textContent).join('').replace(/\s+/g, ''); if (t && d !== t) lost++ }
  // a line through the text beside a decision
  let lineText = 0
  for (const t of svg.querySelectorAll('.cu-dname')) { const r = box(t); if (edges.some(e => e.pts.some(q => q[0] > r.l && q[0] < r.r && q[1] > r.t && q[1] < r.b))) lineText++ }
  // text and lines a reader cannot see: contrast against the page, with the opacity of the groups they are in
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
  const rgb = c => { cv.fillStyle = '#fff'; cv.fillRect(0, 0, 1, 1); cv.fillStyle = c; cv.fillRect(0, 0, 1, 1); return [...cv.getImageData(0, 0, 1, 1).data].slice(0, 3) }
  const lum = c => { const f = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2] }
  const contrast = (e, prop) => { let o = 1; for (let g = e; g && g !== svg; g = g.parentElement) o *= +getComputedStyle(g).opacity; const c = rgb(getComputedStyle(e)[prop]).map(v => v * o + 255 * (1 - o)); return 1.05 / (lum(c) + 0.05) }
  // arrows that end in one point cannot be told apart; a line that stops short of its box does not say it reaches it
  let headClash = 0, endGap = 0
  const ends = [...svg.querySelectorAll('.cu-edge')].map(g => { const s = g.querySelector('path:not(.cu-hit),polyline,line:not(.cu-hit)'); if (!s?.getTotalLength) return null; const L = s.getTotalLength(), q = s.getPointAtLength(L), o = s.getPointAtLength(0); return { b: g.dataset.b, a: g.dataset.a, end: [q.x * ctm.a + ctm.e, q.y * ctm.d + ctm.f], start: [o.x * ctm.a + ctm.e, o.y * ctm.d + ctm.f] } }).filter(Boolean)
  for (let i = 0; i < ends.length; i++) for (let j = i + 1; j < ends.length; j++) if (ends[i].b === ends[j].b && Math.hypot(ends[i].end[0] - ends[j].end[0], ends[i].end[1] - ends[j].end[1]) < 7) headClash++
  const nodeBox = id => { const n = svg.querySelector(`.cu-node[data-id="${CSS.escape(id || '')}"]`); return n ? box(n) : null }
  const away = (p, r) => Math.hypot(Math.max(r.l - p[0], 0, p[0] - r.r), Math.max(r.t - p[1], 0, p[1] - r.b))
  for (const e of ends) { const A = nodeBox(e.a), B = nodeBox(e.b); if (e.a === e.b) continue; if (A && away(e.start, A) > 6) endGap++; if (B && away(e.end, B) > 9) endGap++ }
  let faint = 0
  for (const t of svg.querySelectorAll('.cu-frag text')) if (contrast(t, 'fill') < 4.5) faint++
  for (const t of svg.querySelectorAll('.cu-frag .cu-fbox, .cu-dep .cu-line')) if (contrast(t, 'stroke') < 3) faint++
  const vb = svg.viewBox.baseVal
  return { edges: edges.length, crossings, overlap: Math.round(overlap), labelLabel, labelEdge, labelFar, labelWrong, labelOut, guardFar, labelNode, edgeNode, lineOut, cut, lost, lineText, faint, headClash, endGap, w: Math.round(vb.width), h: Math.round(vb.height) }
}

const rows = []
for (const f of files) for (const r of JSON.parse(fs.readFileSync(f, 'utf8')).result) for (const v of r.answer?.views || []) {
  await p.evaluate(({ v, W }) => { const el = document.getElementById('board'); el.innerHTML = ''
    const opts = v.type === 'sequence' ? { col: Math.max(56, Math.min(170, Math.floor((W - 20) / Math.max(2, v.spec.lifelines.length)))) } : { width: W }
    window.CWUML.board(el, [{ id: v.id, label: v.title || v.type, spec: v.spec, opts }]) }, { v, W: +process.env.AUDIT_W || 980 })
  const m = await p.evaluate(measure)
  if (m) rows.push({ file: path.basename(path.dirname(f)), q: r.id, type: v.type, ...m })
}
await b.close()
const byType = {}
for (const x of rows) { const t = byType[x.type] ||= { views: 0, edges: 0, crossings: 0, overlap: 0, labelLabel: 0, labelEdge: 0, labelFar: 0, labelWrong: 0, labelOut: 0, guardFar: 0, labelNode: 0, edgeNode: 0, lineOut: 0, cut: 0, lost: 0, lineText: 0, faint: 0, headClash: 0, endGap: 0 }; t.views++; for (const k of Object.keys(t)) if (k !== 'views') t[k] += x[k] }
fs.mkdirSync(path.dirname(outFile), { recursive: true }); fs.writeFileSync(outFile, JSON.stringify({ byType, rows }, null, 1))
for (const [t, s] of Object.entries(byType)) console.log(t.padEnd(11), JSON.stringify(s))
console.log('worst', rows.slice().sort((a, c) => (c.crossings + c.labelEdge) - (a.crossings + a.labelEdge)).slice(0, 5).map(x => `${x.file}/${x.q}/${x.type} c${x.crossings} ov${x.overlap} le${x.labelEdge}`).join(' | '))
