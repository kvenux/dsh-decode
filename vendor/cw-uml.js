// Copyright (c) 2026 Keven Sun. MIT License.
// cw-uml: interactive UML views for documents that follow the reader.
// A project gives a spec (data only); the library lays it out, draws SVG with stable ids, animates state changes and
// reports selections. No dependencies.
//   const d = CWUML.render(el, spec, opts)   one diagram: d.paint(state), d.select(id), d.box(id), d.toMermaid(), d.on('select', fn)
//   const b = CWUML.board(el, views, opts)   tabs over several diagrams: b.show(state) switches to state.view and paints it
//   CWUML.layout(rows, size, opts, edges)    the layered placement and edge routes alone: {P: {id: {x, y, w, h, cx, cy}}, W, H, routes}
// Diagram types (every element has an id; states, selections and notes refer to ids):
//   sequence       lifelines [{id, name, short?, kind?: actor|part|external, color?}], messages [{id, from, to, text, kind?: call|return|async}],
//                  frags [{id, kind: loop|alt|opt|par, label?, from?, to?, operands?: [{guard, from, to}]}]
//   communication  the same spec as a sequence, drawn as objects with numbered messages on their links
//   component      nodes [{id, name, layer, kind?, color?, badge?}], deps [[from, to]]
//   package        packages [{id, name, layer, children?: [{id, name}]}], deps [[from, to]], reverse? [[from, to]] (drawn red)
//   state          states [{id, name, kind?: initial|final|normal}], transitions [{id, from, to, label?}]
//   activity       nodes [{id, kind: start|end|action|decision|merge|fork|join|ref, name?, lane?, ref?}], flows [{id, from, to, guard?}], lanes? [{id, name}]
//   overview       an activity whose 'ref' nodes name other views of a board (an interaction overview); choosing one opens that view
//   usecase        system, actors [{id, name, side?: left|right}], cases [{id, name, group?}], groups? [{id, name}], links [[actor, case]], includes? [[from, to, include|extend]]
//   deployment     nodes [{id, name, kind?: device|cloud|env, row?, col?, span? (columns), children?: [{id, name}]}], links [[from, to, label?]]; opts cols, gap, kidCols (children in columns)
//   timing         lifelines [{id, name, states: [low..high]}], until, changes [{life, t, state}], marks? [{t, label}]
//   table          a decision table (HTML): conditions [{id, name, values}], results [{id, name}], rules [{id, when: {cond: value}, then: {result: text}}]
//   notes          on any SVG type: notes [{id, on: [ids], text}] are constraint notes tied to the elements they constrain
// Options: edges: 'ortho' (default: horizontal and vertical segments only) | 'straight'; width; font.
// States (all optional): now [ids], lit [ids]; sequence/communication: upto, frag, branch {fragId: operand index | null};
// state: via (transition id); activity: path [node ids], blocked (node id); timing: t; table: when {cond: value}.
(function (root) {
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  // a class-name part from the spec (kind of a node, message, frame or relation): letters, digits, _ and - only
  const clsPart = s => String(s).replace(/[^A-Za-z0-9_-]/g, '');
  // a colour from the spec: #hex, a colour name or a CSS variable; anything else (a second declaration, url()) is dropped
  const cc = s => /^(#[0-9a-fA-F]{3,8}|[a-zA-Z]{1,30}|var\(--[A-Za-z0-9_-]{1,40}\))$/.test(String(s)) ? String(s) : '';
  const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // width of a label in px: CJK and full-width characters are one em, the rest about 0.56 em
  // text width estimate: a CJK character is one em; Latin letters by their width in common UI fonts (one average for all
  // letters missed wide words like "Spawned command" by 13 %), and 5 % more for the bold a current element gets
  const LW = {i: .24, j: .24, l: .24, I: .27, f: .31, t: .33, r: .35, ' ': .27, '.': .25, ',': .25, ':': .25, ';': .25, "'": .2, '"': .36, '|': .24, '!': .27, '(': .3, ')': .3, '[': .3, ']': .3, '{': .3, '}': .3, '/': .39, '\\': .39, '-': .36, '_': .5, s: .43, c: .47, z: .45, x: .48, v: .49, y: .49, k: .5, a: .53, e: .53, m: .86, w: .75, M: .87, W: .93};
  const chW = ch => /[⺀-￿]/.test(ch) ? 1 : LW[ch] ?? (/[A-Z]/.test(ch) ? .66 : .56);
  // in a browser the width is measured in the font the drawing inherits (set by render), in bold so a name that turns bold
  // when current still fits; elsewhere the table above
  let FONT = 'system-ui, sans-serif', ctx2d = null; const measured = new Map();
  const textW = (s, size) => { s = String(s);
    if (typeof document !== 'undefined') try { ctx2d ||= document.createElement('canvas').getContext('2d'); const key = FONT + '\u0000' + s; let w = measured.get(key);
      if (w == null) { ctx2d.font = `700 100px ${FONT}`; w = ctx2d.measureText(s).width / 100; if (measured.size > 20000) measured.clear(); measured.set(key, w); } return w * size; } catch {}
    return [...s].reduce((w, ch) => w + chW(ch), 0) * size * 1.05; };
  // where the words of a text end (Chinese has no spaces: Intl.Segmenter knows its words), cached per text
  const wordCache = new Map();
  const wordEnds = s => { if (wordCache.has(s)) return wordCache.get(s); let b = null;
    try { b = new Set(); let at = 0; for (const {segment} of new Intl.Segmenter('zh', {granularity: 'word'}).segment(s)) b.add(at += segment.length); } catch { b = null; }
    if (wordCache.size > 4000) wordCache.clear(); wordCache.set(s, b); return b; };
  const wrap = (s, size, max) => { // by character; a Latin word that does not fit moves to the next line whole
    const ls = [''], str = String(s).replace(/\s*\n\s*/g, ' '), wb = wordEnds(str); let at = 0;
    for (const ch of str) {
      const cur = ls[ls.length - 1], i = at; at += ch.length;
      // a Latin word is everything between spaces, punctuation included: "(api.deepseek.com)" stays whole
      // a closing mark (，。、）…) never starts a line: it stays at the end of the line before, a little past the width
      if (textW(cur + ch, size) > max && cur.trim() && !CLOSE.test(ch)) { const sp = cur.lastIndexOf(' '), lat = c => /[^\s\u2e80-\uffff]/.test(c || ''); const cut = Math.max(cur.lastIndexOf('_'), cur.lastIndexOf('.'), cur.lastIndexOf('/'), cur.lastIndexOf('-'));
        const ws = cur.search(/[^\s⺀-￿]+$/);
        if (lat(ch) && lat(cur.at(-1)) && sp > 0 && sp === ws - 1) { ls[ls.length - 1] = cur.slice(0, sp); ls.push(cur.slice(sp + 1)); }
        // after Chinese text ("模式：Code"), the word goes down whole as well
        else if (lat(ch) && lat(cur.at(-1)) && ws > 0 && cur.slice(0, ws).trim()) { ls[ls.length - 1] = cur.slice(0, ws); ls.push(cur.slice(ws)); }
        // a word wider than the line ("submit_answer"): broken after its last _ . / - rather than inside a part
        else if (lat(ch) && lat(cur.at(-1)) && cut > 0 && cut > sp && cut < cur.length - 1) { ls[ls.length - 1] = cur.slice(0, cut + 1); ls.push(cur.slice(cut + 1)); }
        // a long identifier breaks where a new word starts in it (SessionEvent / Map)
        else if (lat(ch) && lat(cur.at(-1)) && (cap => cap > sp + 1 && (ls[ls.length - 1] = cur.slice(0, cap), ls.push(cur.slice(cap)), true))(cur.search(/[a-z0-9][A-Z][^A-Z]*$/) + 1)) {}
        // and an opening bracket never ends one: it goes down with what it opens
        else if (OPEN.test(cur.at(-1)) && cur.length > 1) { ls[ls.length - 1] = cur.slice(0, -1); ls.push(cur.at(-1)); }
        // a Chinese word stays whole (写文件, 对话框): the part of it already on this line goes down with the rest
        else if ((k => k > 0 && k <= 4 && k < cur.length - 1 && /^[\u3400-\u9fff]+$/.test(cur.slice(-k)) && (ls[ls.length - 1] = cur.slice(0, -k), ls.push(cur.slice(-k)), true))(wb && !wb.has(i) ? i - Math.max(0, ...[...wb].filter(j => j < i)) : 0)) {}
        else ls.push(''); }
      ls[ls.length - 1] += ch;
    }
    return ls.map(l => l.trim()).filter((l, i) => l || !i);
  };
  const CLOSE = /[，。、；：？！）》」』】〕,;:!?)\]]/, OPEN = /[（《「『【〔(\[]/;
  // the same number of lines as wrap, but as narrow as they can be: no last line of one or two characters ("并等 / 待")
  const evenWrap = (s, size, max) => { const ls = wrap(s, size, max); if (ls.length < 2) return ls;
    let lo = max / ls.length * 0.8, hi = max;
    for (let i = 0; i < 9; i++) { const m = (lo + hi) / 2; if (wrap(s, size, m).length <= ls.length) hi = m; else lo = m; }
    const out = wrap(s, size, hi); return out.length <= ls.length ? out : ls; };
  const emitter = () => { const fns = {}; return {on(e, f) { (fns[e] ||= []).push(f); return this; }, emit(e, ...a) { (fns[e] || []).forEach(f => f(...a)); }}; };
  const setOf = x => new Set(x || []);
  const toggle = (el, cls, on) => el && el.classList.toggle(cls, !!on);
  const mid = s => s.replace(/[^\w]/g, '_');
  const dPath = pts => 'M' + pts.map(p => `${+p[0].toFixed(1)},${+p[1].toFixed(1)}`).join(' L');
  const defs = uid => `<defs><marker id="cu-ah-${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z"/></marker>`
    + `<marker id="cu-oh-${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto"><path class="cu-open" d="M0,0 L10,5 L0,10"/></marker>`
    + `<marker id="cu-dia-${uid}" viewBox="0 0 12 8" refX="12" refY="4" markerWidth="12" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0,4 L6,0 L12,4 L6,8 z"/></marker>`
    + `<marker id="cu-tri-${uid}" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="11" markerHeight="11" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path class="cu-tri" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  // the heads of a tall diagram stay at the top of a box that scrolls: a sticky copy of the head strip, kept in step with
  // the classes of the originals; pointing at or clicking a copy acts on its original
  function pinHeads(el, svg, W, h, sel, drop) {
    if (typeof MutationObserver === 'undefined' || typeof document === 'undefined') return;
    const pin = document.createElement('div'), s = svg.cloneNode(false), twin = new Map();
    pin.className = 'cu-pin'; s.setAttribute('viewBox', `0 0 ${W} ${h}`); s.setAttribute('aria-hidden', 'true'); s.removeAttribute('role'); s.removeAttribute('aria-label');
    s.innerHTML = `<rect class="cu-pinbg" width="${W}" height="${h}"/>`;
    svg.querySelectorAll(sel).forEach(o => { const c = o.cloneNode(true); c.querySelectorAll(drop).forEach(x => x.remove()); c.removeAttribute('tabindex'); c.removeAttribute('role'); c.dataset.pin = o.dataset.id; delete c.dataset.id; twin.set(o, c); s.append(c); });
    pin.append(s); el.insertBefore(pin, svg);
    new MutationObserver(ms => ms.forEach(m => { const c = twin.get(m.target); if (c) c.setAttribute('class', m.target.getAttribute('class')); })).observe(svg, {subtree: true, attributes: true, attributeFilter: ['class']});
    const orig = t => { const c = t.closest('[data-pin]'); return (c && svg.querySelector(`[data-id="${CSS.escape(c.dataset.pin)}"]`)) || svg; };
    s.addEventListener('click', e => orig(e.target).dispatchEvent(new MouseEvent('click', {bubbles: true})));
    s.addEventListener('pointerover', e => orig(e.target).dispatchEvent(new PointerEvent('pointerover', {bubbles: true})));
    s.addEventListener('pointerleave', () => svg.dispatchEvent(new PointerEvent('pointerleave')));
  }
  const svgWrap = (cls, W, H, title, uid, body) => `<svg class="cu ${cls}" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%;height:auto" role="img" aria-label="${esc(title)}">${defs(uid)}${body}<circle class="cu-token" r="4.5" cx="-20" cy="-20"/></svg>`;
  // balanced: two lines split where the longer one is shortest (never inside a Latin word)
  const balance = (txt, size, max, ls) => { if (ls.length !== 2) return ls; const s = String(txt); let best = null, cuts = null;
    // break between words (会话/客户端, 模型/适配器): runs of single characters are one unit, a lone one joins the word before
    try { const ws = [], cjk = /[\u3400-\u9fff]/; let run = ''; const put = () => { if (run.length === 1 && cjk.test(ws.at(-1)?.at(-1) || '')) ws[ws.length - 1] += run; else if (run) ws.push(run); run = ''; };
      for (const {segment: w} of new Intl.Segmenter('zh', {granularity: 'word'}).segment(s)) { if (w.length === 1 && cjk.test(w)) run += w; else { put(); ws.push(w); } } put();
      let at = 0; cuts = new Set(ws.map(w => (at += w.length))); } catch {}
    for (let i = 1; i < s.length; i++) { if (cuts ? !cuts.has(i) : /\w/.test(s[i - 1]) && /\w/.test(s[i])) continue; const a = s.slice(0, i).trim(), b = s.slice(i).trim(); if (!a || !b) continue;
      const w = Math.max(textW(a, size), textW(b, size)); if (w <= max && (!best || w <= best.w)) best = {a, b, w}; }
    return best ? [best.a, best.b] : ls; };
  // a name in at most n lines (two are balanced), never cut without a sign: a word too wide for the box, or a name that
  // needs more lines, first makes the text smaller (down to 80 %); what still does not fit ends with '…'
  const fitLines = (txt, size, max, n = 2, even = false) => {
    const words = String(txt).match(/[A-Za-z0-9_./:@()\-]+/g) || []; let sz = size, ls;
    for (;; sz -= 0.5) {
      ls = even ? balance(txt, sz, max, wrap(txt, sz, max)) : evenWrap(txt, sz, max);
      if ((ls.length <= n && words.every(w => textW(w, sz) <= max)) || sz - 0.5 < size * 0.8) break;
    }
    if (ls.length > n) { ls = ls.slice(0, n); let s = ls[n - 1]; while (s && textW(s + '…', sz) > max) s = s.slice(0, -1); ls[n - 1] = s.trimEnd() + '…'; }
    return {ls, sz};
  };
  const tallFor = (txt, size, max, base) => base + Math.max(0, fitLines(txt, size, max, 4).ls.length - 2) * (size + 2);
  const clip = (s, size, max) => { s = String(s); if (textW(s, size) <= max) return s; while (s && textW(s + '…', size) > max) s = s.slice(0, -1); return s.trimEnd() + '…'; };
  const lines = (txt, x, y, size, max, n = 2, even = false) => { const {ls, sz} = fitLines(txt, size, max, n, even), st = sz < size ? ` style="font-size:${sz}px"` : ''; return ls.map((s, k) => `<text x="${x}" y="${y + (k - (ls.length - 1) / 2) * (sz + 2)}"${st}>${esc(s)}</text>`).join(''); };
  const midOf = pts => { // where an edge label goes: the middle of its longest horizontal run (each run has its own track), else of its longest segment
    let best = -1, at = pts[0], bestH = -1, atH = null;
    for (let i = 1; i < pts.length; i++) {
      const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), m = [(pts[i][0] + pts[i - 1][0]) / 2, (pts[i][1] + pts[i - 1][1]) / 2];
      if (l > best) { best = l; at = m; }
      if (Math.abs(pts[i][1] - pts[i - 1][1]) < 0.5 && l >= 24 && l > bestH) { bestH = l; atH = m; }
    }
    return atH || at;
  };
  const clipRect = (b, toward) => { // where the line from the centre of box b toward a point leaves the box
    const cx = b.x + b.w / 2, cy = b.y + b.h / 2, dx = toward[0] - cx, dy = toward[1] - cy;
    if (!dx && !dy) return [cx, cy];
    const k = Math.min(dx ? (b.w / 2) / Math.abs(dx) : Infinity, dy ? (b.h / 2) / Math.abs(dy) : Infinity);
    return [cx + dx * k, cy + dy * k];
  };
  const clipEllipse = (c, rx, ry, toward) => { const dx = toward[0] - c[0], dy = toward[1] - c[1], k = 1 / (Math.sqrt((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry)) || 1); return [c[0] + dx * k, c[1] + dy * k]; };
  const boxOf = P => id => P[id] ? {x: P[id].x, y: P[id].y, w: P[id].w, h: P[id].h} : null;

  // a token that runs along polylines one after another
  function flier(svg) {
    const token = svg.querySelector('.cu-token');
    let timer = null, run = 0;
    return function fly(list, dur = 420) {
      clearTimeout(timer); const me = ++run;
      if (!list.length || reduced()) { token.classList.remove('on'); return; }
      const [{pts, el}, ...rest] = list, segs = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), total = segs.reduce((a, b) => a + b, 0) || 1;
      el && el.classList.add('cu-enter'); token.classList.add('on');
      const t0 = performance.now();
      const step = t => {
        if (me !== run) { el && el.classList.remove('cu-enter'); return; }
        const k = Math.min(1, (t - t0) / dur), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
        let d = e * total, i = 0; while (i < segs.length - 1 && d > segs[i]) d -= segs[i++];
        const f = segs[i] ? Math.min(1, d / segs[i]) : 0;
        token.setAttribute('cx', pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f); token.setAttribute('cy', pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f);
        if (k < 1) requestAnimationFrame(step);
        else { el && el.classList.remove('cu-enter'); if (rest.length) timer = setTimeout(() => fly(rest, dur), 60); else token.classList.remove('on'); }
      };
      requestAnimationFrame(step);
    };
  }

  // ---------------------------------------------------------------- layered layout and edge routes
  // rows: arrays of ids, top to bottom; size(id) -> {w, h}; edges: [[from, to]]. Returns positions and one route per edge.
  // 'ortho' (default) routes use only horizontal and vertical segments: every edge leaves its box at its own port on the
  // bottom edge and enters at its own port on the top edge; its horizontal run gets its own track in the gap between rows
  // (the gap grows with the number of tracks), so no two edges share a segment. An edge that skips rows runs down a side
  // corridor beside the rows it skips; an edge that goes up (closing a cycle) leaves the top of its box and enters the bottom
  // of its target, through the gap between them or, past rows in between, up a corridor on the right.
  // 'straight' routes are one segment between the two boxes.
  // The order inside each row decides how many edges cross. Every edge counts, those that skip rows and those that go up
  // (a cycle is often what the diagram is about): sweep down and up, each box moving to the average position of its
  // neighbours, keep the order with the fewest crossings, then swap neighbours while that lowers the count.
  function orderRows(rows, edges) {
    const rowOf = {}; rows.forEach((r, ri) => r.forEach(id => { rowOf[id] = ri; }));
    const E = edges.filter(([a, b]) => a !== b && rowOf[a] !== undefined && rowOf[b] !== undefined && rowOf[a] !== rowOf[b]);
    if (E.length < 2) return rows;
    const at = R => { const p = {}; R.forEach(r => r.forEach((id, k) => { p[id] = (k + 0.5) / r.length; })); return p; };
    // crossings in each gap between rows, an edge that spans several gaps being a straight line through them
    const count = R => { const p = at(R); let n = 0;
      for (let g = 0; g < R.length - 1; g++) {
        const here = E.map(([a, b]) => { const u = Math.min(rowOf[a], rowOf[b]), v = Math.max(rowOf[a], rowOf[b]); if (u > g || v < g + 1) return null;
          const top = rowOf[a] === u ? a : b, bot = top === a ? b : a, x = r => p[top] + (p[bot] - p[top]) * (r - u) / (v - u); return [x(g), x(g + 1)]; }).filter(Boolean);
        for (let i = 0; i < here.length; i++) for (let j = i + 1; j < here.length; j++) if ((here[i][0] - here[j][0]) * (here[i][1] - here[j][1]) < -1e-9) n++;
      }
      return n; };
    const sweep = (R, list) => { for (const ri of list) { if (R[ri].length < 2) continue; const p = at(R);
        const key = id => { let s = 0, w = 0; for (const [a, b] of E) { const o = a === id ? b : b === id ? a : null; if (o === null) continue; const k = 1 / Math.abs(rowOf[o] - ri); s += p[o] * k; w += k; } return w ? s / w : p[id]; };
        R[ri] = R[ri].map((id, k) => [id, key(id), k]).sort((x, y) => x[1] - y[1] || x[2] - y[2]).map(x => x[0]); } };
    let best = rows.map(r => [...r]), low = count(best);
    const down = rows.map((_, i) => i), R = rows.map(r => [...r]);
    for (let it = 0; it < 12 && low; it++) { sweep(R, it % 2 ? [...down].reverse() : down); const c = count(R); if (c < low) { low = c; best = R.map(r => [...r]); } }
    for (let again = true, n = 0; again && low && n < 6; n++) { again = false;
      for (const r of best) for (let k = 0; k + 1 < r.length; k++) { [r[k], r[k + 1]] = [r[k + 1], r[k]]; const c = count(best); if (c < low) { low = c; again = true; } else [r[k], r[k + 1]] = [r[k + 1], r[k]]; } }
    return best;
  }
  function layered(rows, size, opts, edges = []) {
    rows = orderRows(rows, edges);
    const mode = opts.edges || 'ortho', padX = 6, P = {}, rowOf = {};
    let W = Math.max(opts.width || 0, ...rows.map(r => r.reduce((s, id) => s + size(id).w, 0) + padX * (r.length + 1)));
    rows.forEach((r, ri) => {
      const gap = (W - r.reduce((s, id) => s + size(id).w, 0)) / (r.length + 1);
      let x = gap;
      r.forEach(id => { const s = size(id); P[id] = {x, w: s.w, h: s.h, cx: x + s.w / 2}; rowOf[id] = ri; x += s.w + gap; });
    });
    const rowH = rows.map(r => Math.max(...r.map(id => P[id].h)));
    const span = (r1, r2) => { const ids = rows.slice(r1, r2 + 1).flat(); return [Math.min(...ids.map(i => P[i].x)), Math.max(...ids.map(i => P[i].x + P[i].w + (opts.ink ? opts.ink(i) : 0)))]; };
    const E = edges.map(([a, b], i) => ({i, a, b, ra: rowOf[a], rb: rowOf[b]}));
    const lane = {left: 0, right: 0}, bundles = {};
    for (const e of E) {
      e.kind = e.a === e.b ? 'self' : e.ra === e.rb ? 'same' : e.rb === e.ra + 1 ? 'adj' : e.rb > e.ra ? 'skip' : 'up';
      if (e.kind === 'skip') { const [lo, hi] = span(e.ra + 1, e.rb - 1); e.side = (P[e.a].cx + P[e.b].cx) / 2 < (lo + hi) / 2 ? 'left' : 'right'; e.lo = lo; e.hi = hi; }
    }
    // opts.bundle: the edges that skip rows into one box on one side share one corridor, so they join before the box
    // (a merge drawn as lines that meet) instead of standing side by side as a sheaf of parallel lines
    for (const e of E) if (e.kind === 'skip') { const key = opts.bundle ? e.b + '\u0000' + e.side : e.i; (bundles[key] ||= []).push(e); }
    for (const g of Object.values(bundles)) { const left = g[0].side === 'left', k = lane[g[0].side]++, x = left ? Math.min(...g.map(e => e.lo)) - 10 - k * 10 : Math.max(...g.map(e => e.hi)) + 10 + k * 10;
      g.forEach(e => { e.cx = x; e.lead = g[0]; }); }
    for (const e of E) if (e.kind === 'up' && e.ra - e.rb > 1) { const [, hi] = span(e.rb + 1, e.ra - 1); e.cx = hi + 10 + lane.right++ * 10; }
    const down = e => e.kind === 'adj' || e.kind === 'skip';
    const spread = (b, n, k) => n === 1 || b.w < 40 ? b.cx : b.x + b.w * 0.2 + b.w * 0.6 * k / (n - 1); // small shapes (diamonds, dots) share one port
    // ports: the order along the bottom (top) edge follows where each edge is heading (coming from), so they do not cross
    for (const id in P) {
      const outs = E.filter(e => e.a === id && down(e)).sort((p, q) => (p.kind === 'skip' ? p.cx : P[p.b].cx) - (q.kind === 'skip' ? q.cx : P[q.b].cx));
      outs.forEach((e, k) => { e.sx = spread(P[id], outs.length, k); });
    }
    for (const id in P) {
      const ins = E.filter(e => e.b === id && down(e) && (!e.lead || e.lead === e)).sort((p, q) => (p.kind === 'skip' ? p.cx : p.sx) - (q.kind === 'skip' ? q.cx : q.sx));
      // opts.bundle: every line into a box comes in at one port, the middle of its top (they meet just above it)
      ins.forEach((e, k) => { e.dx = opts.bundle ? P[id].cx : spread(P[id], ins.length, k); });
      E.forEach(e => { if (e.b === id && e.lead && e.lead !== e) e.dx = e.lead.dx; });
    }
    // a lone edge between boxes that overlap horizontally becomes one vertical segment
    for (const e of E) if (e.kind === 'adj' && E.filter(x => x.a === e.a && down(x)).length === 1 && E.filter(x => x.b === e.b && down(x)).length === 1) {
      const lo = Math.max(P[e.a].x, P[e.b].x) + 10, hi = Math.min(P[e.a].x + P[e.a].w, P[e.b].x + P[e.b].w) - 10;
      if (lo <= hi) e.sx = e.dx = Math.max(lo, Math.min(hi, (P[e.a].cx + P[e.b].cx) / 2));
    }
    // a port then heads for where its edge goes: straight above its target in the row below when it can, at the end
    // facing the side lane for an edge that skips rows (spread evenly, a skipping edge's run crossed the next row's
    // arrow at the same point and read as one more arrow into that box); ports keep 10 apart
    // (the right end stays clear when an edge going up comes into this box's bottom there)
    for (const id in P) { const b = P[id], outs = E.filter(e => e.a === id && down(e)); if (b.w < 40 || outs.length < 2) continue;
      const hiX = E.some(e => e.b === id && e.kind === 'up') ? b.x + b.w * 0.8 - 6 : b.x + b.w - 8;
      const want = outs.map(e => ({e, x: e.kind === 'skip' ? (e.cx > b.cx ? hiX : b.x + 8) : Math.max(b.x + 8, Math.min(hiX, e.dx)), k: e.kind === 'skip' ? e.cx : e.dx}))
        .sort((p, q) => p.x - q.x || p.k - q.k);
      for (let i = 1; i < want.length; i++) want[i].x = Math.max(want[i].x, want[i - 1].x + 10);
      for (let i = want.length - 1; i >= 0; i--) want[i].x = Math.min(want[i].x, i === want.length - 1 ? hiX + 2 : want[i + 1].x - 10);
      want.forEach(w => { w.e.sx = w.x; }); }
    // an edge going up leaves from the top of its box near the right end and enters the bottom of its target there
    const upPort = (b, k) => b.w < 40 ? b.cx : b.x + b.w * 0.9 - k * 8;
    for (const id in P) { E.filter(e => e.a === id && e.kind === 'up').forEach((e, k) => { e.sx = upPort(P[id], k); }); E.filter(e => e.b === id && e.kind === 'up').forEach((e, k) => { const b = P[id], stems = E.filter(o => o.a === id && down(o)).map(o => o.sx); let x = upPort(b, k); for (const q of stems) if (b.w >= 40 && Math.abs(x - q) < 14) x = q + 14 <= b.x + b.w - 4 ? q + 14 : q - 14; e.dx = x; }); }
    // opts.decision: the ways out of a decision leave at its corners, as UML draws them: the branch heading furthest left at
    // the left corner, the one heading furthest right at the right corner, the rest at the bottom. Two branches then never
    // share a stem, and each guard stands at the corner its own line leaves. A corner line runs level to above its target
    // when nothing else in the row is in the way, else it steps out 12 and goes down to its track like any other edge.
    const corners = {}, inkOf = id => opts.ink ? opts.ink(id) : 0;
    const clear = (id, x1, x2) => { const lo = Math.min(x1, x2) - 6, hi = Math.max(x1, x2) + 6; return rows[rowOf[id]].every(o => o === id || P[o].x + P[o].w + inkOf(o) < lo || P[o].x > hi); };
    if (opts.decision && mode !== 'straight') for (const id in P) { if (!opts.decision(id)) continue;
      const A = P[id], head = e => e.kind === 'skip' ? e.cx : e.dx, outs = E.filter(e => e.a === id && down(e)).sort((p, q) => head(p) - head(q));
      if (outs.length < 2) continue;
      const take = (e, dir) => { const x0 = A.cx + dir * A.w / 2, stub = x0 + dir * 12;
        if ((head(e) - x0) * dir > 4 && clear(id, x0, head(e))) { e.corner = dir; e.x0 = e.sx = x0; e.direct = true; }
        else if (clear(id, x0, stub)) { e.corner = dir; e.x0 = x0; e.sx = stub; } };
      if (head(outs[0]) < A.cx - 1) take(outs[0], -1);
      const last = outs.at(-1); if (last !== outs[0] && head(last) > A.cx + 1) take(last, 1);
      corners[id] = {L: outs[0].corner === -1, R: last.corner === 1};
      // a branch out of the bottom into the only line into a box below the decision goes straight down
      outs.filter(e => !e.corner).forEach(e => { e.sx = A.cx; const B = P[e.b];
        if (e.kind === 'adj' && B.w >= 40 && A.cx >= B.x + 10 && A.cx <= B.x + B.w - 10 && E.filter(o => o.b === e.b && down(o)).length === 1) e.dx = A.cx; });
    }
    // tracks: the horizontal runs in each gap; runs that overlap get different tracks, and so do runs that nearly touch end
    // to end (at one height, two lines 20 apart read as one line)
    const runs = rows.map(() => []), shared = {};
    // opts.bundle: the last runs into one port of a box, in one gap, are one run on one track: the lines meet and go in as one
    const put = (g, r, e, into) => { if (opts.bundle && into) { const k = g + ' ' + e.b + ' ' + e.dx, s = shared[k];
        if (s) { const lo = Math.min(s.x1, s.x2, r.x1, r.x2), hi = Math.max(s.x1, s.x2, r.x1, r.x2); s.x1 = lo; s.x2 = hi; return s; } shared[k] = r; }
      runs[g].push(r); return r; };
    for (const e of E) {
      if (mode === 'straight') continue;
      if (e.kind === 'adj' && !e.direct && Math.abs(e.sx - e.dx) > 0.5) e.r0 = put(e.ra, {x1: e.sx, x2: e.dx}, e, true);
      if (e.kind === 'skip') { if (!e.direct) e.r0 = put(e.ra, {x1: e.sx, x2: e.cx}, e, false); e.r1 = put(e.rb - 1, {x1: e.cx, x2: e.dx}, e, true); }
      if (e.kind === 'up' && e.cx === undefined) runs[e.rb].push(e.r0 = {x1: e.sx, x2: e.dx});
      else if (e.kind === 'up') { runs[e.ra - 1].push(e.r0 = {x1: e.sx, x2: e.cx}); runs[e.rb].push(e.r1 = {x1: e.cx, x2: e.dx}); }
    }
    const nTracks = runs.map(rs => {
      const ends = [];
      rs.sort((p, q) => Math.min(p.x1, p.x2) - Math.min(q.x1, q.x2)).forEach(r => { const lo = Math.min(r.x1, r.x2), hi = Math.max(r.x1, r.x2); let t = ends.findIndex(x => x < lo - 28); if (t < 0) { t = ends.length; ends.push(0); } ends[t] = hi; r.t = t; });
      return ends.length;
    });
    const gapH = rows.map((r, ri) => Math.max(opts.gapY || 26, (nTracks[ri] + 1) * (opts.trackGap || 8)));
    const rowBot = [];
    let y = opts.top || 14;
    rows.forEach((r, ri) => { rowBot[ri] = y + rowH[ri]; r.forEach(id => { P[id].y = y + (rowH[ri] - P[id].h) / 2; P[id].cy = y + rowH[ri] / 2; }); y += rowH[ri] + (ri < rows.length - 1 ? gapH[ri] : 0); });
    const H = y + 14, ty = (g, r) => rowBot[g] + gapH[g] * (r.t + 1) / (nTracks[g] + 1);
    const routes = E.map(e => {
      const A = P[e.a], B = P[e.b];
      if (e.kind === 'self') { const x = A.x + A.w, yy = A.cy; return [[x, yy - 6], [x + 14, yy - 6], [x + 14, yy + 6], [x + 1, yy + 6]]; }
      if (e.kind === 'same') { const dir = B.cx > A.cx ? 1 : -1; return [[A.cx + dir * A.w / 2, A.cy], [B.cx - dir * (B.w / 2 + 1), B.cy]]; }
      if (e.kind === 'up') { if (mode === 'straight') return [[A.cx + 8, A.y], [B.cx + 8, B.y + B.h + 1]]; if (e.cx === undefined) { const yt = ty(e.rb, e.r0); return [[e.sx, A.y], [e.sx, yt], [e.dx, yt], [e.dx, B.y + B.h + 1]]; } const ya = ty(e.ra - 1, e.r0), yb = ty(e.rb, e.r1); return [[e.sx, A.y], [e.sx, ya], [e.cx, ya], [e.cx, yb], [e.dx, yb], [e.dx, B.y + B.h + 1]]; }
      const y1 = A.y + A.h, y2 = B.y - 1;
      if (mode === 'straight') return [[A.cx, y1], [B.cx, y2]];
      if (e.direct) { const yb = e.kind === 'skip' ? ty(e.rb - 1, e.r1) : 0; return e.kind === 'skip' ? [[e.x0, A.cy], [e.cx, A.cy], [e.cx, yb], [e.dx, yb], [e.dx, y2]] : [[e.x0, A.cy], [e.dx, A.cy], [e.dx, y2]]; }
      let r;
      if (e.kind === 'adj') r = e.r0 ? [[e.sx, y1], [e.sx, ty(e.ra, e.r0)], [e.dx, ty(e.ra, e.r0)], [e.dx, y2]] : [[e.sx, y1], [e.dx, y2]];
      else { const ya = ty(e.ra, e.r0), yb = ty(e.rb - 1, e.r1); r = [[e.sx, y1], [e.sx, ya], [e.cx, ya], [e.cx, yb], [e.dx, yb], [e.dx, y2]]; }
      return e.corner ? [[e.x0, A.cy], [e.sx, A.cy], ...r.slice(1)] : r;
    });
    // corridors may lie outside the boxes: shift right and widen so that everything is inside
    const xs = [...Object.values(P).flatMap(p => [p.x, p.x + p.w]), ...routes.flat().map(p => p[0])], shift = Math.max(0, 4 - Math.min(...xs));
    if (shift) { Object.values(P).forEach(p => { p.x += shift; p.cx += shift; }); routes.forEach(r => r.forEach(p => { p[0] += shift; })); }
    W = Math.max(W + shift, Math.max(...xs) + shift + 6);
    return {P, W, H, routes, rowOf, corners};
  }
  // rows by longest path from the sources, ignoring the edges that close a cycle (found by depth-first search from the start)
  function rowsOf(ids, edges, start) {
    const out = new Map(ids.map(i => [i, []])), back = new Set(), seen = {};
    edges.forEach(([a, b], k) => out.get(a) && out.get(a).push([b, k]));
    const dfs = v => { seen[v] = 1; for (const [w, k] of out.get(v) || []) { if (seen[w] === 1) back.add(k); else if (!seen[w]) dfs(w); } seen[v] = 2; };
    [start, ...ids].forEach(v => { if (v && !seen[v]) dfs(v); });
    const layer = {}, indeg = new Map(ids.map(i => [i, 0]));
    edges.forEach(([, b], k) => { if (!back.has(k)) indeg.set(b, indeg.get(b) + 1); });
    const queue = ids.filter(i => !indeg.get(i)); queue.forEach(i => { layer[i] = 0; });
    while (queue.length) { const v = queue.shift(); for (const [w, k] of out.get(v)) { if (back.has(k)) continue; layer[w] = Math.max(layer[w] || 0, layer[v] + 1); indeg.set(w, indeg.get(w) - 1); if (!indeg.get(w)) queue.push(w); } }
    const rows = []; ids.forEach(i => (rows[layer[i] || 0] ||= []).push(i));
    const pos = {}; rows.forEach(r => r && r.forEach((id, k) => { pos[id] = k; }));
    for (let r = 1; r < rows.length; r++) { // each row follows the average position of its parents
      if (!rows[r]) continue;
      const bc = id => { const ps = edges.filter(([a, b], k) => b === id && !back.has(k) && rows[r - 1] && rows[r - 1].includes(a)).map(([a]) => pos[a]); return ps.length ? ps.reduce((x, y) => x + y, 0) / ps.length : pos[id]; };
      rows[r] = rows[r].map(id => [id, bc(id)]).sort((x, y) => x[1] - y[1]).map(x => x[0]); rows[r].forEach((id, k) => { pos[id] = k; });
    }
    return rows.filter(Boolean);
  }
  const edgeSvg = (cls, id, a, b, pts, uid, open) => `<g class="cu-edge ${cls}"${id ? ` data-id="${esc(id)}"` : ''} data-a="${esc(a)}" data-b="${esc(b)}"><path class="cu-hitp" d="${dPath(pts)}"/><path class="cu-line" d="${dPath(pts)}" marker-end="url(#cu-${open ? 'oh' : 'ah'}-${uid})"/></g>`;
  // labels sit in a layer above every edge, so that no other edge runs over them; render() mirrors the edge's state onto its label
  // an edge label: lines of at most 150 px (a long English label would cross half the drawing), at most three, the whole
  // label on hover when cut
  const labelBox = (label, max = 150) => { let ls = evenWrap(label, 10.5, max); if (ls.length > 3) ls = [ls[0], ls[1], clip(ls.slice(2).join(' '), 10.5, max)];
    return {ls, w: Math.max(...ls.map(s => textW(s, 10.5))) + 8, h: ls.length * 13 + 2}; };
  const edgeLabel = (id, pts, label, at = midOf(pts), max) => { if (!label) return ''; const [x, y] = at, {ls, w, h} = labelBox(label, max);
    return `<g class="cu-elabel" data-for="${esc(id)}"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="3"/>${ls.map((s, k) => `<text x="${x}" y="${y + (k - (ls.length - 1) / 2) * 13}">${esc(s)}</text>`).join('')}${ls.join(' ') !== String(label) ? `<title>${esc(label)}</title>` : ''}</g>`; };
  // the labels of several edges, none over another: each tries its edge's middle, then the middles of its other segments
  // (longest first), then steps above and below those, and takes the first place no earlier label holds
  // the labels of several edges: each tries its edge's middle, the middles of its other segments (longest first), then
  // points along the edge, then steps above and below those; the first place that covers no earlier label and none of
  // the boxes given wins, else the place that covers least
  const edgeLabels = (items, boxes = [], W = Infinity, H = Infinity, atStart = false, placed = null) => {
    const held = [], over = (a, b) => Math.max(0, Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2) + 2) * Math.max(0, Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2) + 2);
    // a label reads as the label of the line it sits on: another edge under it, or the head of its own arrow, makes it read wrong
    const dots = items.map(({pts}) => { const o = []; for (let i = 1; i < pts.length; i++) { const n = Math.max(1, Math.ceil(Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) / 5)); for (let k = 0; k <= n; k++) o.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k / n, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k / n]); } return o; });
    const inR = (r, p) => Math.abs(p[0] - r.x) < r.w / 2 + 2 && Math.abs(p[1] - r.y) < r.h / 2 + 2;
    const gap = (r, d) => Math.min(...d.map(p => Math.hypot(Math.max(Math.abs(p[0] - r.x) - r.w / 2, 0), Math.max(Math.abs(p[1] - r.y) - r.h / 2, 0))));
    // a reader takes a label for the line at its middle, whatever its ends touch
    const toMid = (r, d) => Math.min(...d.map(p => Math.hypot(p[0] - r.x, p[1] - r.y)));
    const cost = (r, me) => (atStart ? 3 * Math.hypot(Math.max(Math.abs(items[me].pts[0][0] - r.x) - r.w / 2, 0), Math.max(Math.abs(items[me].pts[0][1] - r.y) - r.h / 2, 0)) : 0) + (dots.some((d, k) => k !== me && d.length && toMid(r, d) + 1 < toMid(r, dots[me])) ? 8000 : 0) + (r.x - r.w / 2 < 1 || r.x + r.w / 2 > W - 1 || r.y - r.h / 2 < 1 || r.y + r.h / 2 > H - 1 ? 50000 : 0) + held.reduce((s, q) => s + over(r, q) * 100, 0) + boxes.reduce((s, b) => s + (b && b.w ? over(r, {x: b.x + b.w / 2, y: b.y + b.h / 2, w: b.w, h: b.h}) * 100 : 0), 0)
      + dots.reduce((s, d, k) => s + (k === me ? 0 : d.filter(p => inR(r, p)).length * (atStart ? 400 : 60)), 0)
      + (items[me].pts.slice(-1).some(p => inR(r, p)) || dots[me].slice(-4).some(p => inR(r, p)) ? 800 : 0)
      // a label away from its line reads as the label of whatever line is nearest: this outweighs everything else
      + (gap(r, dots[me]) === 0 ? 0 : gap(r, dots[me]) > 5 ? 2e6 + 40 * gap(r, dots[me]) : dots.some((d, k) => k !== me && d.length && gap(r, d) < gap(r, dots[me]) + 2) ? 2000 : 30);
    const along = pts => { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      return [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74, 0.18, 0.82, 0.46, 0.54, 0.38, 0.62, 0.3, 0.7, 0.22, 0.78, 0.14, 0.86, 0.1, 0.9].map(f => { const d = f * L.at(-1); let i = 1; while (i < pts.length - 1 && L[i] < d) i++; const s = (d - L[i - 1]) / ((L[i] - L[i - 1]) || 1); return [pts[i - 1][0] + s * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + s * (pts[i][1] - pts[i - 1][1])]; }); };
    return items.map(({id, pts, label}, me) => {
      if (!label) return '';
      const segs = pts.slice(1).map((p, i) => [Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), [(p[0] + pts[i][0]) / 2, (p[1] + pts[i][1]) / 2]]).sort((a, b) => b[0] - a[0]).map(s => s[1]);
      const base = [midOf(pts), ...segs, ...along(pts)];
      let at = null, best = Infinity, fit = null;
      for (const max of [150, 100, 70]) {
        const {w, h, ls} = labelBox(label, max), extra = (ls.length - 1) * 12;
        if (fit && (h === fit.h || wrap(label, 10.5, max).length > 3)) continue;
        // beside the edge too: a label left or right of a vertical run leaves the boxes next to it free
        const step = h + 2, side = w / 2 + 3, up = h / 2 + 3, near = base.flatMap(([x, y]) => [[x - side, y], [x + side, y], [x - side, y - up], [x + side, y - up], [x - side, y + up], [x + side, y + up]]);
        const tries = [...base, ...near, ...[1, -1, 2, -2, 3, -3].flatMap(k => [...base, ...near].map(([x, y]) => [x, y + step * k]))];
        for (const [x, y] of tries) { const c = cost({x, y, w, h}, me) + extra; if (c < best) { best = c; at = [x, y]; fit = {w, h, max}; } if (!atStart && c === extra) break; }
        if (!atStart && best <= extra) break;
      }
      held.push({x: at[0], y: at[1], w: fit.w, h: fit.h}); if (placed) placed[me] = held.at(-1); return edgeLabel(id, pts, label, at, fit.max);
    }).join('');
  };

  // ---------------------------------------------------------------- sequence diagram
  function sequence(el, spec, opts) {
    const L = spec.lifelines, Msg = spec.messages, at = id => Msg.findIndex(m => m.id === id), F = (spec.frags || []).map(f => ({...f, operands: (f.operands || [{guard: f.label || '', from: f.from, to: f.to}]).slice().sort((p, q) => at(p.from) - at(q.from))}));
    const col = opts.col || 64, size = opts.font || 12, row = opts.row || 30;
    // the heads take a third line when a name needs it (English names are about twice as wide as Chinese ones)
    const hl = Math.min(3, Math.max(2, ...L.map(l => fitLines(l.short || l.name, size, col - 8, 3, true).ls.length))), head = hl * (size + 3) + 12;
    const X = Object.fromEntries(L.map((l, i) => [l.id, i * col + col / 2])), mi = Object.fromEntries(Msg.map((m, i) => [m.id, i]));
    const opOf = {}; F.forEach(f => f.operands.forEach((o, k) => { for (let i = mi[o.from]; i <= mi[o.to]; i++) (opOf[Msg[i].id] ||= []).push([f.id, k]); }));
    // a fragment's title, and each further operand's guard, gets its own strip above its first message
    const gapB = Msg.map(m => F.reduce((n, f) => n + f.operands.filter(o => o.from === m.id).length, 0) * 24), gapA = Msg.map(m => F.filter(f => f.operands.at(-1).to === m.id).length * 6);
    const off = []; Msg.forEach((m, i) => { off[i] = (i ? off[i - 1] + gapA[i - 1] : 0) + gapB[i]; });
    const W = L.length * col, top = head + 16, H = top + Msg.length * row + (Msg.length ? off[Msg.length - 1] + gapA[Msg.length - 1] : 0) + 10;
    const Y = i => top + i * row + row / 2 + off[i], parts = [];
    // nested fragments: one that starts (ends) at the same message as a larger one sits inside it, its title strip below
    // the larger one's and its box inset, so both stay readable
    const span = f => [mi[f.operands[0].from], mi[f.operands.at(-1).to]], FG = {};
    for (const f of F) {
      const [s0, e0] = span(f), wider = g => { const [s1, e1] = span(g); return g !== f && s1 <= s0 && e1 >= e0 && (e1 - s1 > e0 - s0 || F.indexOf(g) < F.indexOf(f)); };
      const depth = F.filter(wider).length, above = F.filter(g => wider(g) && span(g)[0] === s0).length, below = F.filter(g => g !== f && span(g)[1] === e0 && !wider(g)).length;
      const x = 2 + depth * 5, w = W - 4 - depth * 10, y1 = Y(s0) - row / 2 - 22 - 24 * (F.filter(g => g !== f && span(g)[0] === s0).length - above), y2 = Y(e0) + row / 2 + 2 + 6 * below;
      FG[f.id] = {x, y: y1, w, h: y2 - y1};
    }
    for (const f of F) {
      const {x, y: y1, w, h} = FG[f.id], tw = textW(f.kind, size - 2) + 14;
      parts.push(`<g class="cu-frag cu-f-${clsPart(f.kind)}" data-id="${esc(f.id)}"><rect class="cu-fbox" x="${x}" y="${y1}" width="${w}" height="${h}" rx="4"/><path class="cu-fragtag" d="M${x},${y1} h${tw} v10 l-6,6 H${x} z"/><text class="cu-ftag" x="${x + 4}" y="${y1 + 9}">${esc(f.kind)}</text>`
        + f.operands.map((o, k) => { const oy = k ? Y(mi[o.from]) - row / 2 - 22 : y1, g = o.guard ? (f.kind === 'loop' ? o.guard : `[${o.guard}]`) : '';
          return `${k ? `<line class="cu-sep" x1="${x}" x2="${x + w}" y1="${oy}" y2="${oy}"/>` : ''}<text class="cu-guard" data-op="${k}" x="${k ? x + 6 : x + tw + 4}" y="${oy + 9}">${esc(clip(g, size - 1.5, w - (k ? 12 : tw + 10)))}</text>`; }).join('')
        + `<title>${esc(f.kind + ' ' + f.operands.map(o => o.guard).join(' / '))}</title></g>`);
    }
    for (const l of L) {
      const x = X[l.id];
      parts.push(`<g class="cu-life cu-k-${clsPart(l.kind || 'part')}" data-id="${esc(l.id)}" tabindex="0" role="button" aria-label="${esc(l.name)}"${l.color ? ` style="--cu-c:${esc(cc(l.color))}"` : ''}>`
        + `<line class="cu-lifeline" x1="${x}" y1="${head}" x2="${x}" y2="${H - 4}"/><rect x="${x - col / 2 + 3}" y="4" width="${col - 6}" height="${head - 8}" rx="${l.kind === 'actor' ? (head - 8) / 2 : 6}"/>`
        + `${lines(l.short || l.name, x, 4 + (head - 8) / 2, size, col - 8, hl, true)}<title>${esc(l.name)}</title></g>`);
    }
    // a message to itself is a small loop on the right of its lifeline, from just above the row back to just below it
    const SELF = Math.min(26, col / 2 - 4), selfPts = (a, y) => [[a + 3, y - 7], [a + SELF, y - 7], [a + SELF, y + 7], [a + 4, y + 7]];
    Msg.forEach((m, i) => {
      const self = m.from === m.to, a = X[m.from], b = self ? a + SELF : X[m.to], y = Y(i), dir = b >= a ? 1 : -1, x1 = a + dir * 3, x2 = b - dir * 4, mx = (a + b) / 2;
      const full = clip(m.text, size - 1, W - 14), fits = textW(m.text, size - 1) <= Math.abs(b - a) - 8, lw = textW(full, size - 1) + 10, lx = Math.max(2 + lw / 2, Math.min(W - 2 - lw / 2, mx));
      // text too long for the span: its start, cut with "…", in place of the number (the full text when it is the message being told, and in the title)
      // a message to itself: its text goes right of the loop; when it does not fit there and the left has more room, left of the lifeline (cut only when neither side holds it)
      const roomR = W - 2 - (a + SELF) - 12, roomL = a - 6 - 12, onLeft = self && textW(m.text, size - 1) > roomR && roomL > roomR;
      const room = onLeft ? roomL : roomR, two = !self ? [] : wrap(m.text, size - 1, room), cut = two.length > 2 ? [two[0], clip(two.slice(1).join(' '), size - 1, room)] : two, short = [...(cut[0] || '')].length >= 4 ? cut : null, sw = short ? Math.max(...short.map(t => textW(t, size - 1))) + 10 : 0, sx = onLeft ? a - 6 - sw / 2 : a + SELF + 4 + sw / 2, sh = (size + 2) * (short ? short.length : 1) + 2;
      const arrow = self ? `<path class="cu-arrow" d="${dPath(selfPts(a, y))}" marker-end="url(#cu-ah-${opts.uid})"/>` : `<line class="cu-arrow" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" marker-end="url(#cu-ah-${opts.uid})"/>`;
      parts.push(`<g class="cu-msg cu-m-${clsPart(m.kind || 'call')}${fits ? ' cu-fits' : ''}${short ? ' cu-short' : ''}${self ? ' cu-self' : ''}" data-id="${esc(m.id)}" tabindex="0" role="button" aria-label="${esc(m.text)}">`
        + `<line class="cu-hit" x1="${a}" y1="${y}" x2="${b}" y2="${y}"/>${arrow}`
        + `<g class="cu-num"><circle cx="${mx}" cy="${y - 8}" r="7"/><text x="${mx}" y="${y - 8}">${i + 1}</text></g>`
        + `<g class="cu-label"><rect x="${lx - lw / 2}" y="${y - size - 7}" width="${lw}" height="${size + 4}" rx="3"/><text x="${lx}" y="${y - size / 2 - 5}">${esc(full)}</text></g>`
        + (short ? `<g class="cu-slabel"><rect x="${sx - sw / 2}" y="${y - 3 - sh / 2}" width="${sw}" height="${sh}" rx="3"/>${short.map((t, n) => `<text x="${sx}" y="${y - 3 + (n - (short.length - 1) / 2) * (size + 2) - 2}">${esc(t)}</text>`).join('')}</g>` : '')
        + `<title>${i + 1}. ${esc(m.text)}</title></g>`);
    });
    el.innerHTML = svgWrap('cu-seq', W, H, spec.title || '时序图', opts.uid, parts.join(''));
    const svg = el.firstChild, g = id => svg.querySelector(`[data-id="${CSS.escape(id)}"]`), fly = flier(svg);
    pinHeads(el, svg, W, head, '.cu-life', '.cu-lifeline');
    let prev = -1;
    return {
      svg, width: W, height: H,
      ids: () => [...L.map(l => l.id), ...Msg.map(m => m.id), ...F.map(f => f.id)],
      box(id) {
        if (X[id] !== undefined) return {x: X[id] - col / 2 + 3, y: 4, w: col - 6, h: head - 8};
        if (mi[id] !== undefined) { const m = Msg[mi[id]]; return m.from === m.to ? {x: X[m.from], y: Y(mi[id]) - 8, w: SELF, h: 16} : {x: Math.min(X[m.from], X[m.to]), y: Y(mi[id]) - 6, w: Math.abs(X[m.to] - X[m.from]), h: 12}; }
        if (FG[id]) return {...FG[id]};
        return null;
      },
      paint(state = {}) {
        const upto = state.upto === undefined || state.upto === null ? Msg.length - 1 : state.upto === '' ? -1 : mi[state.upto];
        const now = setOf(state.now), active = new Set(), hot = new Set(now), br = state.branch || {};
        // a message is skipped when its fragment took another operand, or an opt fragment was not entered (branch null)
        const skipped = m => (opOf[m.id] || []).some(([f, k]) => br[f] === null || (br[f] !== undefined && br[f] !== k));
        Msg.forEach((m, i) => {
          const e = g(m.id), shown = i <= upto, isNow = now.has(m.id), skip = skipped(m);
          toggle(e, 'cu-shown', shown && !skip); toggle(e, 'cu-future', !shown && !skip); toggle(e, 'cu-skip', skip); toggle(e, 'cu-now', isNow && !skip);
          if (shown && !skip) { active.add(m.from); active.add(m.to); }
          if (isNow && !skip) { hot.add(m.from); hot.add(m.to); }
        });
        L.forEach(l => { const e = g(l.id); toggle(e, 'cu-active', active.has(l.id)); toggle(e, 'cu-now', hot.has(l.id)); });
        toggle(svg, 'cu-all', state.all);
        F.forEach(f => {
          const e = g(f.id); toggle(e, 'cu-shown', mi[f.operands[0].from] <= upto); toggle(e, 'cu-now', state.frag === f.id || (br[f.id] !== undefined && mi[f.operands[0].from] <= upto));
          e.querySelectorAll('.cu-guard').forEach(t => { toggle(t, 'cu-chosen', br[f.id] === +t.dataset.op); toggle(t, 'cu-out', br[f.id] === null || (br[f.id] !== undefined && br[f.id] !== +t.dataset.op)); });
        });
        const fresh = upto > prev ? Msg.map((m, i) => i).filter(i => i > prev && i <= upto && !skipped(Msg[i]) && (now.has(Msg[i].id) || upto - prev <= 4)) : [];
        prev = upto;
        fly(fresh.slice(-4).map(i => { const m = Msg[i]; return {pts: m.from === m.to ? selfPts(X[m.from], Y(i)) : [[X[m.from], Y(i)], [X[m.to], Y(i)]], el: g(m.id)}; }));
      },
      toMermaid() {
        const out = ['sequenceDiagram', ...L.map(l => `  ${l.kind === 'actor' ? 'actor' : 'participant'} ${mid(l.id)} as ${l.name}`)];
        Msg.forEach(m => {
          F.forEach(f => f.operands.forEach((o, k) => { if (o.from === m.id) out.push(k ? `  ${f.kind === 'par' ? 'and' : 'else'} ${o.guard}` : `  ${f.kind} ${o.guard}`); }));
          out.push(`  ${mid(m.from)}${m.kind === 'return' ? '-->>' : m.kind === 'async' ? '-)' : '->>'}${mid(m.to)}: ${m.text}`);
          F.forEach(f => { if (f.operands.at(-1).to === m.id) out.push('  end'); });
        });
        return out.join('\n');
      },
    };
  }

  // ---------------------------------------------------------------- communication diagram (the spec of a sequence)
  function communication(el, spec, opts) {
    const L = spec.lifelines, Msg = spec.messages, size = opts.font || 12, n = L.length;
    const W = opts.width || 340, R = Math.max(Math.min(W / 2 - 52, 40 + n * 14), Math.min(W / 2 - 80, 60 + n * 30)), H = 2 * R + 70, C = [W / 2, H / 2], P = {};
    const key = (a, b) => [a, b].sort().join('|'), links = {};
    Msg.forEach((m, i) => (links[key(m.from, m.to)] ||= []).push(i));
    // a hub (one object linked to most of the others) sits in the middle and the others round it: on the circle with
    // the rest, every link left from one point at the rim and the labels piled up there (a part's collaborations, where
    // the part talks to all the others: 23 of syncthing's 54 figures had labels over each other, the quality report)
    const deg = id => Object.keys(links).filter(k => k.split('|').includes(id) && k.split('|')[0] !== k.split('|')[1]).length;
    const hub = n >= 4 ? L.map(l => l.id).sort((a, b) => deg(b) - deg(a))[0] : null, isHub = hub && deg(hub) >= Math.max(3, Math.ceil((n - 1) * 0.6));
    const ring = isHub ? L.filter(l => l.id !== hub) : L;
    const place = (l, cx, cy) => { const w = Math.min(96, Math.max(54, textW(l.short || l.name, size) + 14)); P[l.id] = {cx, cy, w, h: 26, x: cx - w / 2, y: cy - 13}; };
    ring.forEach((l, i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / ring.length; place(l, C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)); });
    if (isHub) place(L.find(l => l.id === hub), C[0], C[1]);
    const ends = (a, b) => [clipRect(P[a], [P[b].cx, P[b].cy]), clipRect(P[b], [P[a].cx, P[a].cy])];
    // a link's labels stack at a point along it: the middle, else further along either way, the first spot where they
    // cross no object and no label already placed (at the middle only, the labels of crossing links covered each other
    // and the objects); a label wraps onto a second line at a width and is cut only past that, its full text in its title
    // (cut at one line, 18 of syncthing's 18 communication figures hid what their messages say, the quality report)
    const MAXW = Math.max(90, Math.min(170, W * 0.42)), LH = 13;
    const wrap = t => { const out = ['']; for (const ch of t) { const cur = out[out.length - 1];
      if (textW(cur + ch, 10.5) > MAXW - 8) { if (out.length === 2) { out[1] = cur.replace(/.$/, '…'); return out; } out.push(ch); } else out[out.length - 1] = cur + ch; } return out; };
    const hit = (r, q) => r.x < q.x + q.w && q.x < r.x + r.w && r.y < q.y + q.h && q.y < r.y + r.h;
    const placed = L.map(l => ({x: P[l.id].x - 2, y: P[l.id].y - 2, w: P[l.id].w + 4, h: P[l.id].h + 4}));
    const parts = Object.entries(links).map(([k, ms]) => {
      const [a, b] = k.split('|'), [p, q] = ends(a, b);
      // (a label that begins with its sender's name spends its width on what the arrow already says)
      const bare = m => { const nm = L.find(l => l.id === m.from)?.name || ''; return nm && m.text.startsWith(nm) && m.text.length > nm.length + 2 ? m.text.slice(nm.length) : m.text; };
      const labels = ms.map(i => { const m = Msg[i], ls = wrap(`${i + 1}${P[m.to].cx >= P[m.from].cx ? '→' : '←'} ${bare(m)}`); return {i, m, ls, w: Math.max(...ls.map(x => textW(x, 10.5))) + 8, h: ls.length * LH + 1}; });
      const total = labels.reduce((n, l) => n + l.h + 1, -1);
      // (a spot along the link, or beside it: two-line labels on short links had no free spot on the link itself)
      const len = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1, nx = -(q[1] - p[1]) / len, ny = (q[0] - p[0]) / len;
      const at = (f, o = 0) => { const cx = p[0] + (q[0] - p[0]) * f + nx * o, cy = p[1] + (q[1] - p[1]) * f + ny * o; let y = cy - total / 2;
        return labels.map(l => { const r = {x: cx - l.w / 2, y, w: l.w, h: l.h, cx, cy: y + l.h / 2}; y += l.h + 1; return r; }); };
      const cost = rs => rs.reduce((n, r) => n + placed.filter(o => hit(r, o)).length + (r.x < 0 || r.x + r.w > W || r.y < 0 || r.y + r.h > H ? 1 : 0), 0);
      let best = null;
      // (from a hub the spokes meet in the middle: their labels go out along them first)
      const tries = isHub && (a === hub || b === hub) ? (a === hub ? [0.6, 0.7, 0.5, 0.8, 0.42] : [0.4, 0.3, 0.5, 0.2, 0.58]) : [0.5, 0.38, 0.62, 0.28, 0.72, 0.2, 0.8];
      // (beside it: above or below a level link, left or right of an upright one, just clear of the link)
      const side = Math.abs(nx) * (Math.max(...labels.map(l => l.w)) / 2 + 4) + Math.abs(ny) * (total / 2 + 4);
      outer: for (const o of [0, side, -side, 2 * side, -2 * side]) for (const f of tries) { const rs = at(f, o), c = cost(rs) + (o ? 0.5 : 0); if (!best || c < best.c) best = {rs, c}; if (c < 0.5) break outer; }
      placed.push(...best.rs);
      return `<g class="cu-link" data-link="${esc(k)}"><line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>${labels.map(({i, m, ls, w, h}, j) => { const r = best.rs[j];
        return `<g class="cu-msg cu-cm" data-id="${esc(m.id)}" tabindex="0" role="button" aria-label="${esc(m.text)}"><rect x="${r.x}" y="${r.y}" width="${w}" height="${h}" rx="3"/>${ls.map((x, k) => `<text x="${r.cx}" y="${Math.round((r.y + LH / 2 + 0.5 + k * LH) * 10) / 10}">${esc(x)}</text>`).join('')}<title>${i + 1}. ${esc(m.text)}</title></g>`; }).join('')}</g>`;
    });
    const objs = L.map(l => { const p = P[l.id]; return `<g class="cu-node cu-k-${clsPart(l.kind || 'part')}" data-id="${esc(l.id)}" tabindex="0" role="button" aria-label="${esc(l.name)}"${l.color ? ` style="--cu-c:${esc(cc(l.color))}"` : ''}><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${l.kind === 'actor' ? 13 : 4}"/>${lines(l.short || l.name, p.cx, p.cy, size, p.w - 6, 1)}<title>${esc(l.name)}</title></g>`; });
    el.innerHTML = svgWrap('cu-comm', W, H, spec.title || '通信图', opts.uid, parts.join('') + objs.join(''));
    const svg = el.firstChild, fly = flier(svg), g = id => svg.querySelector(`[data-id="${CSS.escape(id)}"]`);
    let prev = -1;
    return {
      svg, width: W, height: H, ids: () => [...L.map(l => l.id), ...Msg.map(m => m.id)], box: boxOf(P),
      paint(state = {}) {
        const upto = state.upto === undefined || state.upto === null ? Msg.length - 1 : state.upto === '' ? -1 : Msg.findIndex(m => m.id === state.upto);
        const now = setOf(state.now), hot = new Set(now), on = new Set();
        Msg.forEach((m, i) => { const e = g(m.id); toggle(e, 'cu-shown', i <= upto); toggle(e, 'cu-future', i > upto); toggle(e, 'cu-now', now.has(m.id)); if (i <= upto) on.add(key(m.from, m.to)); if (now.has(m.id)) { hot.add(m.from); hot.add(m.to); } });
        svg.querySelectorAll('.cu-link').forEach(l => { toggle(l, 'cu-lit', on.has(l.dataset.link)); toggle(l, 'cu-now', Msg.some(m => now.has(m.id) && key(m.from, m.to) === l.dataset.link)); });
        L.forEach(l => toggle(g(l.id), 'cu-now', hot.has(l.id)));
        const fresh = upto > prev ? Msg.map((m, i) => i).filter(i => i > prev && i <= upto && (now.has(Msg[i].id) || upto - prev <= 4)) : [];
        prev = upto;
        fly(fresh.slice(-4).map(i => ({pts: ends(Msg[i].from, Msg[i].to)})));
      },
      toMermaid: () => ['flowchart LR', ...L.map(l => `  ${mid(l.id)}["${l.name}"]`), ...Msg.map((m, i) => `  ${mid(m.from)} -- "${i + 1}: ${m.text}" --> ${mid(m.to)}`)].join('\n'),
    };
  }

  // ---------------------------------------------------------------- component diagram (layered by dependency)
  function component(el, spec, opts) {
    const N = spec.nodes, has = new Set(N.map(n => n.id)), D = spec.deps.filter(([a, b]) => has.has(a) && has.has(b)), size = opts.font || 12.5, h = opts.nodeH || 30;
    const layers = [...new Set(N.map(n => n.layer))].sort((a, b) => b - a), bands = spec.layers?.length ? spec.layers : null;
    // a node is wide enough for its whole name on one line; a layer with more nodes than fit across is folded into rows
    const W0 = opts.width || 300, need = Math.min(150, Math.max(64, ...N.map(n => textW(n.name, size) + 18))), per = Math.max(1, Math.floor((W0 - 6) / (need + 6)));
    const rows = layers.flatMap(l => { const ids = N.filter(n => n.layer === l).map(n => n.id), k = Math.ceil(ids.length / per), m = Math.ceil(ids.length / k); return Array.from({length: k}, (_, i) => ids.slice(i * m, (i + 1) * m)); });
    const nw = Math.max(need, Math.min(opts.nodeW || 140, ...rows.map(r => (W0 - 6 * (r.length + 1)) / r.length)));
    const hh = Math.max(h, ...N.map(n => tallFor(n.name, size, nw - 8, h)));
    const lay = layered(rows, () => ({w: nw, h: hh}), {...opts, width: W0, gapY: opts.gapY || (bands ? 40 : 24), top: bands ? 30 : 14}, D), {P, W, H} = lay;
    // the layers as horizontal bands behind the nodes, each named at its top left
    const bandLabels = [], bandSvg = bands ? bands.map(b => { const ids = N.filter(n => n.layer === b.layer).map(n => n.id); if (!ids.length) return '';
      const y1 = Math.min(...ids.map(i => P[i].y)) - 20, y2 = Math.max(...ids.map(i => P[i].y + P[i].h)) + 7;
      bandLabels.push(`<rect class="cu-bandlab" x="7" y="${y1 + 4}" width="${textW(b.name, 11) + 10}" height="16" rx="4"/><text x="12" y="${y1 + 12}">${esc(b.name)}</text>`);
      return `<g class="cu-band" data-layer="${esc(String(b.layer))}"><rect x="3" y="${y1}" width="${W - 6}" height="${y2 - y1}" rx="8"/></g>`; }).join('') : '';
    const out = new Map(N.map(n => [n.id, D.filter(d => d[0] === n.id).map(d => d[1])]));
    // cycles are allowed in the deps: each node is visited once
    const reach = (a, b, skip, seen = new Set([a])) => (out.get(a) || []).some(x => x !== skip && !seen.has(x) && (seen.add(x), x === b || reach(x, b, null, seen)));
    const routes = curvedRoutes(D, P, W, H, lay.routes);
    const node = n => { const p = P[n.id]; return `<g class="cu-node cu-k-${clsPart(n.kind || 'part')}" data-id="${esc(n.id)}" tabindex="0" role="button" aria-label="${esc(n.name)}"${n.color ? ` style="--cu-c:${esc(cc(n.color))}"` : ''}>`
      + `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="6"/>${lines(n.name, p.cx, p.cy, size, p.w - 8, 4)}${n.badge ? `<text class="cu-badge" x="${p.x + p.w - 2}" y="${p.y - 4}">${esc(n.badge)}</text>` : ''}<title>${esc(n.name)}</title></g>`; };
    el.innerHTML = svgWrap('cu-comp', W, H, spec.title || '组件图', opts.uid, `${bandSvg}<g class="cu-deps">${D.map(([a, b], k) => edgeSvg(`cu-dep${reach(a, b, b) ? ' cu-implied' : ''}`, null, a, b, routes[k], opts.uid)).join('')}</g>${N.map(node).join('')}<g class="cu-trail"></g><g class="cu-band cu-bandlabs">${bandLabels.join('')}</g>`);
    const svg = el.firstChild;
    let picked = null, last = {};
    // a route over the map (spec.trail: the messages of one use, IcePanel's flows): each hand-off a numbered curve from
    // module to module; the step at 'upto' (or named in 'now') runs, those before stay drawn, those after are faint; the
    // modules off the route fade. A message from outside the map (the actor) only lights where it lands
    const T = (spec.trail || []).filter(m => has.has(m.to));
    const edge = (a, b, bend) => { const A = P[a], B = P[b], dx = B.cx - A.cx, dy = B.cy - A.cy, d = Math.hypot(dx, dy) || 1;
      const cut = (p, ux, uy) => { const t = Math.min(Math.abs(p.w / 2 / (ux || 1e-9)), Math.abs(p.h / 2 / (uy || 1e-9))); return [p.cx + ux * t, p.cy + uy * t]; };
      const [x1, y1] = cut(A, dx / d, dy / d), [x2, y2] = cut(B, -dx / d, -dy / d), mx = (x1 + x2) / 2 - dy / d * bend, my = (y1 + y2) / 2 + dx / d * bend;
      return {d: `M${x1.toFixed(1)},${y1.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`, lx: (x1 + 2 * mx + x2) / 4, ly: (y1 + 2 * my + y2) / 4}; };
    const trail = state => {
      const now = setOf(state.now), at = T.findIndex(m => m.id === state.upto || now.has(m.id)), on = new Set(), seen = new Map();
      const g = svg.querySelector('.cu-trail');
      g.innerHTML = T.map((m, k) => { const cls = at < 0 ? 'cu-tr' : k < at ? 'cu-tr cu-tr-done' : k === at ? 'cu-tr cu-tr-now' : 'cu-tr cu-tr-next';
        if (at < 0 || k <= at) { on.add(m.to); if (has.has(m.from)) on.add(m.from); }
        if (!has.has(m.from) || m.from === m.to) { const p = P[m.to], i = seen.get(m.to) || 0; seen.set(m.to, i + 1);
          return `<g class="${cls}" data-id="${esc(m.id)}"><circle class="cu-trn" cx="${p.x + p.w - 6 - i * 15}" cy="${p.y - 1}" r="7"/><text x="${p.x + p.w - 6 - i * 15}" y="${p.y + 2.5}">${k + 1}</text><title>${esc(m.text || '')}</title></g>`; }
        const pair = [m.from, m.to].sort().join('|'), i = seen.get(pair) || 0; seen.set(pair, i + 1);
        const e = edge(m.from, m.to, 18 + i * 14);
        return `<g class="${cls}" data-id="${esc(m.id)}"><path class="cu-trl" d="${e.d}" marker-end="url(#cu-ah-${opts.uid})"/><circle class="cu-trn" cx="${e.lx.toFixed(1)}" cy="${e.ly.toFixed(1)}" r="7"/><text x="${e.lx.toFixed(1)}" y="${(e.ly + 3.5).toFixed(1)}">${k + 1}</text><title>${esc(m.text || '')}</title></g>`; }).join('');
      const cur = at >= 0 ? T[at] : null;
      svg.querySelectorAll('.cu-node').forEach(n => { const id = n.dataset.id; toggle(n, 'cu-dim', !on.has(id) && !T.some(m => m.to === id || m.from === id));
        toggle(n, 'cu-off', !on.has(id)); toggle(n, 'cu-now', !!cur && (cur.to === id || cur.from === id)); toggle(n, 'cu-lit', on.has(id)); });
      svg.querySelectorAll('.cu-dep').forEach(p => toggle(p, 'cu-hide', true));
    };
    const self = {
      svg, width: W, height: H, ids: () => N.map(n => n.id), box: boxOf(P), routes: () => D.map(([a, b], k) => ({a, b, pts: routes[k]})),
      paint(state = {}) {
        last = state;
        const now = setOf(state.now), lit = setOf(state.lit), focus = id => now.has(id) || picked === id;
        svg.querySelectorAll('.cu-node').forEach(g => { toggle(g, 'cu-now', now.has(g.dataset.id)); toggle(g, 'cu-lit', lit.has(g.dataset.id) || now.has(g.dataset.id)); });
        // drawn: the dependencies no longer path implies, plus every direct one of a part in focus
        svg.querySelectorAll('.cu-dep').forEach(p => { const f = focus(p.dataset.a); toggle(p, 'cu-on', f); toggle(p, 'cu-hide', p.classList.contains('cu-implied') && !f); });
        if (T.length) trail(state);
      },
      pickFocus(id) { picked = id; self.paint(last); },
      toMermaid: () => ['flowchart TB', ...N.map(n => `  ${mid(n.id)}["${n.name}"]`), ...D.map(([a, b]) => `  ${mid(a)} --> ${mid(b)}`)].join('\n'),
    };
    return self;
  }

  // ---------------------------------------------------------------- package diagram
  function packageView(el, spec, opts) {
    const K = spec.packages, byId = Object.fromEntries(K.map(k => [k.id, k])), layers = [...new Set(K.map(k => k.layer || 0))].sort((a, b) => b - a), rows = layers.map(l => K.filter(k => (k.layer || 0) === l).map(k => k.id));
    const W0 = opts.width || 340;
    const sizeOf = id => { const r = rows.find(r => r.includes(id)), w = Math.min(opts.nodeW || 170, (W0 - 10 * (r.length + 1)) / r.length), kids = byId[id].children || [], per = Math.max(1, Math.floor((w - 8) / (opts.kidW || 64))), cw = (w - 8 - (per - 1) * 4) / per, rowHs = [];
      kids.forEach((c, i) => { const r = Math.floor(i / per); rowHs[r] = Math.max(rowHs[r] || 0, wrap(c.name, 10.5, cw - 4).length * 13 + 3); });
      return {w, h: 24 + rowHs.reduce((a, b) => a + b + 4, 0) + (kids.length ? 4 : 0), per, cw, rowHs}; };
    const rev = new Set((spec.reverse || []).map(([a, b]) => a + '>' + b)), D = [...spec.deps, ...(spec.reverse || []).filter(([a, b]) => !spec.deps.some(([x, y]) => x === a && y === b))];
    const lay = layered(rows, sizeOf, {...opts, width: W0, gapY: 34, top: 20}, D), {P, W, H} = lay;
    const routes = lay.routes, kidAt = {}, tabW = k => Math.min(P[k.id].w * 0.5, textW(k.name, 11) + 14);
    // the tab sits on the top of the box and hides an arrow that ends under it: the arrow ends past the tab
    for (const k of K) { const q = P[k.id], ins = D.map(([, b], i) => b === k.id && routes[i] && Math.abs(routes[i].at(-1)[1] - q.y) <= 4 ? i : -1).filter(i => i >= 0).sort((m, n) => routes[m].at(-1)[0] - routes[n].at(-1)[0]); const lo = q.x + tabW(k) + 8, hi = q.x + q.w - 8;
      if (!ins.length || ins.every(i => routes[i].at(-1)[0] >= lo) && ins.every((i, j) => !j || routes[i].at(-1)[0] - routes[ins[j - 1]].at(-1)[0] >= 12)) continue;
      ins.forEach((i, j) => { const r = routes[i], n = r.length, x = ins.length === 1 ? Math.max(lo, Math.min(hi, r[n - 1][0])) : lo + (hi - lo) * j / (ins.length - 1); if (n > 2 && Math.abs(r[n - 2][0] - r[n - 1][0]) < 0.5) r[n - 2] = [x, r[n - 2][1]]; else if (n === 2 && Math.abs(r[0][0] - x) > 0.5) r.splice(1, 0, [r[0][0], r[0][1] + 8], [x, r[0][1] + 8]); r[r.length - 1] = [x, r[r.length - 1][1]]; }); }
    const pkg = k => { const p = P[k.id], s = sizeOf(k.id), kids = k.children || [], cw = s.cw;
      return `<g class="cu-node cu-pkg" data-id="${esc(k.id)}" tabindex="0" role="button" aria-label="${esc(k.name)}"${k.color ? ` style="--cu-c:${esc(cc(k.color))}"` : ''}><path class="cu-tab" d="M${p.x},${p.y} v-9 h${tabW(k)} v9 z"/><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="2"/>`
        + `<text class="cu-pname" x="${p.x + 6}" y="${p.y + 12}">${esc(k.name)}</text>` + kids.map((c, i) => { const x = p.x + 4 + (i % s.per) * (cw + 4), r = Math.floor(i / s.per), y = p.y + 22 + s.rowHs.slice(0, r).reduce((a, b) => a + b + 4, 0), h = s.rowHs[r], ls = wrap(c.name, 10.5, cw - 4); kidAt[c.id] = {x, y, w: cw, h};
          return `<g class="cu-kid" data-id="${esc(c.id)}"><rect x="${x}" y="${y}" width="${cw}" height="${h}" rx="3"/>${ls.map((t, n) => `<text x="${x + cw / 2}" y="${y + h / 2 + (n - (ls.length - 1) / 2) * 13}">${esc(t)}</text>`).join('')}<title>${esc(c.name)}</title></g>`; }).join('') + `<title>${esc(k.name)}</title></g>`; };
    const body = K.map(pkg).join('');
    el.innerHTML = svgWrap('cu-pkgd', W, H, spec.title || '包图', opts.uid, `<g>${D.map(([a, b], k) => edgeSvg(`cu-dep cu-use${rev.has(a + '>' + b) ? ' cu-rev' : ''}`, null, a, b, routes[k], opts.uid, true)).join('')}</g>${body}`);
    const svg = el.firstChild;
    return {
      svg, width: W, height: H, ids: () => [...K.map(k => k.id), ...K.flatMap(k => (k.children || []).map(c => c.id))], box: id => boxOf(P)(id) || kidAt[id] || null, routes: () => D.map(([a, b], k) => ({a, b, pts: routes[k]})),
      paint(state = {}) { const now = setOf(state.now), lit = setOf(state.lit); svg.querySelectorAll('.cu-pkg,.cu-kid').forEach(g => { toggle(g, 'cu-now', now.has(g.dataset.id)); toggle(g, 'cu-lit', lit.has(g.dataset.id)); }); svg.querySelectorAll('.cu-dep').forEach(p => toggle(p, 'cu-on', now.has(p.dataset.a) || now.has(p.dataset.b))); },
      toMermaid: () => ['flowchart TB', ...K.map(k => `  subgraph ${mid(k.id)}["${k.name}"]\n${(k.children || []).map(c => `    ${mid(c.id)}["${c.name}"]`).join('\n') || `    ${mid(k.id)}_x[" "]`}\n  end`), ...D.map(([a, b]) => `  ${mid(a)} -.->|${rev.has(a + '>' + b) ? 'reverse' : 'use'}| ${mid(b)}`)].join('\n'),
    };
  }

  // ---------------------------------------------------------------- class diagram: records, their key fields, and how they refer to each other
  // spec: {classes: [{id, name, fields?: ['name: type' | {id?, name, type?}]}], rels: [{id?, from, to, kind?: 'has'|'ref'|'is', label?}]}
  // has: from holds to (a filled diamond at from); ref: from names to, for example by its id (a dashed arrow to to);
  // is: from is a kind of to (a hollow triangle at to). Rows by longest path: a holder or a namer sits above what it
  // points at, a general kind above its special kinds. A field with an id can be pointed at by a paragraph.
  function classView(el, spec, opts) {
    const C = spec.classes, byId = Object.fromEntries(C.map(c => [c.id, c])), size = opts.font || 12, fsz = 10.5, fh = 15, W0 = opts.width || 340, maxF = opts.maxFields || 8;
    const R = (spec.rels || []).filter(r => byId[r.from] && byId[r.to] && r.from !== r.to).map((r, i) => ({...r, id: r.id || `rel${i + 1}`, kind: ['has', 'ref', 'is'].includes(r.kind) ? r.kind : 'ref'}));
    const E = R.map(r => r.kind === 'is' ? [r.to, r.from] : [r.from, r.to]);
    const F = Object.fromEntries(C.map(c => { const fs = (c.fields || []).map(f => typeof f === 'string' ? {name: f} : {id: f.id, name: f.type ? `${f.name}: ${f.type}` : String(f.name || '')});
      return [c.id, fs.length > maxF ? [...fs.slice(0, maxF - 1), {name: `… +${fs.length - maxF + 1}`}] : fs]; }));
    const rows = rowsOf(C.map(c => c.id), E, C[0].id);
    const want = id => Math.max(84, textW(byId[id].name, size) + 20, ...F[id].map(f => textW(f.name, fsz) + 14));
    // a field that does not fit the box takes a second line (the box grows) rather than losing its end
    const fieldLines = (t, w) => wrap(t, fsz, w - 12), nameLines = (t, w) => wrap(t, size, w - 10), headOf = (id, w) => 24 + (nameLines(byId[id].name, w).length - 1) * (size + 3);
    const sizeOf = id => { const r = rows.find(r => r.includes(id)), fit = (W0 - 10 * (r.length + 1)) / r.length, w = Math.max(72, Math.min(want(id), fit, opts.nodeW || 220));
      return {w, h: headOf(id, w) + F[id].reduce((n, f) => n + fieldLines(f.name, w).length, 0) * fh + (F[id].length ? 6 : 0)}; };
    const lay = layered(rows, sizeOf, {...opts, width: W0, gapY: 40, top: 10}, E), {P, W, H} = lay, routes = lay.routes;
    const box = c => { const p = P[c.id], fs = F[c.id], head = headOf(c.id, p.w);
      return `<g class="cu-node cu-cls" data-id="${esc(c.id)}" tabindex="0" role="button" aria-label="${esc(c.name)}"${c.color ? ` style="--cu-c:${esc(cc(c.color))}"` : ''}><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="4"/>`
        + nameLines(c.name, p.w).map((s, k) => `<text class="cu-cname" x="${p.cx}" y="${p.y + 12 + k * (size + 3)}">${esc(s)}</text>`).join('') + (fs.length ? `<line class="cu-csep" x1="${p.x}" x2="${p.x + p.w}" y1="${p.y + head}" y2="${p.y + head}"/>` : '')
        + (y0 => fs.map(f => { const ls = fieldLines(f.name, p.w), y = y0; y0 += ls.length * fh; return `<g class="cu-field"${f.id ? ` data-id="${esc(f.id)}"` : ''}><rect x="${p.x + 2}" y="${y}" width="${p.w - 4}" height="${ls.length * fh - 1}" rx="2"/>${ls.map((s, k) => `<text x="${p.x + 7}" y="${y + fh / 2 + k * fh}">${esc(s)}</text>`).join('')}<title>${esc(f.name)}</title></g>`; }))(p.y + head + 3).join('')
        + `<title>${esc(c.name)}</title></g>`; };
    const rel = (r, k) => { const d = dPath(routes[k]), m = r.kind === 'has' ? `marker-start="url(#cu-dia-${opts.uid})"` : r.kind === 'is' ? `marker-start="url(#cu-tri-${opts.uid})"` : `marker-end="url(#cu-oh-${opts.uid})"`;
      return `<g class="cu-edge cu-rel cu-r-${clsPart(r.kind)}" data-id="${esc(r.id)}" data-a="${esc(r.from)}" data-b="${esc(r.to)}"><path class="cu-hitp" d="${d}"/><path class="cu-line" d="${d}" ${m}/></g>`; };
    el.innerHTML = svgWrap('cu-class-d', W, H, spec.title || '类图', opts.uid, `<g>${R.map(rel).join('')}</g><g class="cu-elabels">${edgeLabels(R.map((r, k) => ({id: r.id, pts: routes[k], label: r.label})), Object.values(P), W, H)}</g>${C.map(box).join('')}`);
    const svg = el.firstChild;
    return {
      svg, width: W, height: H, ids: () => [...C.map(c => c.id), ...C.flatMap(c => F[c.id].filter(f => f.id).map(f => f.id)), ...R.map(r => r.id)], box: boxOf(P), routes: () => R.map((r, k) => ({a: E[k][0], b: E[k][1], pts: routes[k]})),
      // a class or a relation being read is current; the relations at a current class and the ends of a current relation are lit
      paint(state = {}) {
        const now = setOf(state.now), lit = setOf(state.lit); R.forEach(r => { if (now.has(r.id)) { lit.add(r.from); lit.add(r.to); } });
        svg.querySelectorAll('.cu-field[data-id]').forEach(g => toggle(g, 'cu-now', now.has(g.dataset.id)));
        svg.querySelectorAll('.cu-cls').forEach(g => { const id = g.dataset.id; toggle(g, 'cu-now', now.has(id)); toggle(g, 'cu-lit', !now.has(id) && (lit.has(id) || !!g.querySelector('.cu-field.cu-now'))); });
        svg.querySelectorAll('.cu-rel').forEach(g => { const on = now.has(g.dataset.id); toggle(g, 'cu-now', on); toggle(g, 'cu-lit', !on && (now.has(g.dataset.a) || now.has(g.dataset.b) || lit.has(g.dataset.id))); });
      },
      toMermaid: () => ['classDiagram', ...C.map(c => `  class ${mid(c.id)}["${c.name}"] {\n${F[c.id].map(f => `    ${f.name}`).join('\n')}\n  }`), ...R.map(r => `  ${mid(r.kind === 'is' ? r.to : r.from)} ${r.kind === 'has' ? '*--' : r.kind === 'is' ? '<|--' : '..>'} ${mid(r.kind === 'is' ? r.from : r.to)}${r.label ? ` : ${r.label}` : ''}`)].join('\n'),
    };
  }

  // ---------------------------------------------------------------- state machine
  // A state machine is about which state leads to which: a line that goes round the drawing hides that. Every transition is
  // one curve from state to state. Each tries several bends, and keeps the one that runs through no other state, crosses the
  // fewest other transitions and stays in the drawing; two passes, so that a curve can give way to one chosen after it.
  // Two transitions between one pair of states bend to opposite sides. A transition to itself keeps its loop.
  function curvedRoutes(edges, P, W, H, loops, labels = []) {
    const inside = (b, p, m) => p[0] > b.x - m && p[0] < b.x + b.w + m && p[1] > b.y - m && p[1] < b.y + b.h + m;
    // bumps move the curve only near one place: each is {t, x, y}, and the curve goes that far aside at that part of its length
    const ends = edges.map(() => [0, 0]);
    for (const id in P) { const near = []; edges.forEach(([a, b], k) => { if (a === b) return; if (a === id) near.push([k, 0, b]); if (b === id) near.push([k, 1, a]); });
      for (const below of [false, true]) { const side = near.filter(n => (P[n[2]].cy > P[id].cy) === below).sort((p, q) => P[p[2]].cx - P[q[2]].cx || p[0] - q[0]), gap = Math.min(16, (P[id].w - 16) / Math.max(1, side.length));
        side.forEach((n, i) => { ends[n[0]][n[1]] = (i - (side.length - 1) / 2) * gap; }); } }
    const curve = (pair, off, bumps = []) => { const [a, b] = pair, e = ends[edges.indexOf(pair)], A = P[a], B = P[b], ax = A.cx + e[0], bx = B.cx + e[1], dx = bx - ax, dy = B.cy - A.cy, L = Math.hypot(dx, dy) || 1, cx = (ax + bx) / 2 - dy / L * off, cy = (A.cy + B.cy) / 2 + dx / L * off, pts = [];
      const at = t => { const u = 1 - t, p = [u * u * ax + 2 * u * t * cx + t * t * bx, u * u * A.cy + 2 * u * t * cy + t * t * B.cy]; for (const q of bumps) { const g = Math.exp(-((t - q.t) ** 2) / 0.05); p[0] += q.x * g; p[1] += q.y * g; } return p; }, free = p => !inside(A, p, 1) && !inside(B, p, 3);
      let first = -1, last = -1; for (let k = 0; k <= 40; k++) { const p = at(k / 40); if (free(p)) { pts.push(p); if (first < 0) first = k; last = k; } }
      const edge = (t0, t1) => { for (let i = 0; i < 7; i++) { const m = (t0 + t1) / 2; if (free(at(m))) t0 = m; else t1 = m; } return at(t0); };
      if (first > 0) pts.unshift(edge(first / 40, (first - 1) / 40));
      if (last >= 0 && last < 40) pts.push(edge(last / 40, (last + 1) / 40));
      return pts.length > 1 ? pts : [[A.cx, A.cy + A.h / 2], [B.cx, B.y - 2]]; };
    const turn = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
    const crosses = (u, v) => { for (let i = 0; i + 1 < u.length; i++) for (let j = 0; j + 1 < v.length; j++) if (turn(u[i], u[i + 1], v[j]) * turn(u[i], u[i + 1], v[j + 1]) < 0 && turn(v[j], v[j + 1], u[i]) * turn(v[j], v[j + 1], u[i + 1]) < 0) return true; return false; };
    const pairs = new Set(edges.map(([a, b]) => a + '|' + b)), BENDS = [0, 24, -24, 48, -48, 80, -80, 120, -120, 170, -170, 230, -230, 300, -300, 380, -380], offs = edges.map(() => 0);
    const routes = edges.map(e => e[0] === e[1] ? null : curve(e, pairs.has(e[1] + '|' + e[0]) ? 40 : 0));
    const cost = (k, pts, off) => { const [a, b] = edges[k]; let c = Math.abs(off) * 0.03 + pts.length * 0.01;
      for (const id in P) if (id !== a && id !== b && pts.some(p => inside(P[id], p, 5))) c += 1000;
      if (pts.some(p => p[0] < 4 || p[0] > W - 4 || p[1] < 4 || p[1] > H - 4)) c += 500;
      labels.forEach((q, j) => { if (q && j !== k && pts.some(p => Math.abs(p[0] - q.x) < q.w / 2 + 2 && Math.abs(p[1] - q.y) < q.h / 2 + 2)) c += 30; });
      routes.forEach((o, j) => { if (j === k || !o) return; if (crosses(pts, o)) c += 20; if (pts.filter(p => o.some(q => Math.hypot(p[0] - q[0], p[1] - q[1]) < 7)).length > 6) c += 10; });
      return c; };
    for (let pass = 0; pass < 2; pass++) edges.forEach((e, k) => { if (e[0] === e[1]) return; const two = pairs.has(e[1] + '|' + e[0]); let best = Infinity;
      for (const off of BENDS) { if (two && Math.abs(off) < 40) continue; const pts = curve(e, off), c = cost(k, pts, off); if (c < best) { best = c; routes[k] = pts; offs[k] = off; } } });
    // a line behind a state reads as a line to that state. When no bend clears the states, the line goes round each one it meets
    const blocker = (k, pts) => Object.keys(P).find(id => id !== edges[k][0] && id !== edges[k][1] && pts.some(p => inside(P[id], p, 5)));
    edges.forEach((e, k) => { if (e[0] === e[1]) return; const bumps = [];
      for (let round = 0; round < 3; round++) { const id = blocker(k, routes[k]); if (!id) break; const N = P[id], at = routes[k].reduce((m, p, i) => inside(N, p, 5) ? i : m, 0), t = (at + 1) / (routes[k].length + 1), here = routes[k][at];
        let best = Infinity, pick = null;
        for (const room of [18, 34]) for (const side of [N.x - room, N.x + N.w + room]) { const q = {t, x: side - here[0], y: 0}, pts = curve(e, offs[k], [...bumps, q]), c = cost(k, pts, offs[k]); if (c < best) { best = c; pick = {q, pts}; } }
        bumps.push(pick.q); routes[k] = pick.pts; }
      // no curve found: the route the layout gave, when it clears the states
      if (blocker(k, routes[k]) && loops[k]) { const dense = loops[k].flatMap((p, i) => i ? Array.from({length: 12}, (_, j) => [loops[k][i - 1][0] + (p[0] - loops[k][i - 1][0]) * j / 12, loops[k][i - 1][1] + (p[1] - loops[k][i - 1][1]) * j / 12]) : []); if (!blocker(k, dense)) routes[k] = loops[k]; } });
    // the bend may reach past the picture when nothing else clears the boxes: the line stays in it, along the edge
    return routes.map((r, k) => r ? r.map(([x, y]) => [Math.max(3, Math.min(W - 3, x)), Math.max(3, Math.min(H - 3, y))]) : loops[k]);
  }
  function stateView(el, spec, opts) {
    const T = spec.transitions, S = spec.states.filter(s => !(s.kind === 'initial' || s.kind === 'final') || T.some(t => t.from === s.id || t.to === s.id)), size = opts.font || 12.5, kind = Object.fromEntries(S.map(s => [s.id, s.kind || 'normal'])), name = Object.fromEntries(S.map(s => [s.id, s.name || s.kind]));
    const rows = rowsOf(S.map(s => s.id), T.map(t => [t.from, t.to]), (S.find(s => s.kind === 'initial') || S[0]).id);
    const sizeOf = id => kind[id] === 'initial' ? {w: 16, h: 16} : kind[id] === 'final' ? {w: 22, h: 22} : (w => ({w, h: tallFor(name[id], size, w - 10, 32)}))(Math.min(150, Math.max(78, textW(name[id], size) + 24)));
    const lay = layered(rows, sizeOf, {...opts, width: opts.width || 300, gapY: Math.max(66, 34 + T.length * 5), edges: 'straight'}, T.map(t => [t.from, t.to])), {P, W, H} = lay, pairs = T.map(t => [t.from, t.to]), items = rs => T.map((t, k) => ({id: t.id, pts: rs[k], label: t.label})), spots = []; edgeLabels(items(curvedRoutes(pairs, P, W, H, lay.routes)), Object.values(P), W, H, false, spots); const routes = curvedRoutes(pairs, P, W, H, lay.routes, spots);
    const st = s => { const p = P[s.id], k = kind[s.id];
      return `<g class="cu-node cu-state cu-k-${clsPart(k)}" data-id="${esc(s.id)}" tabindex="0" role="button" aria-label="${esc(name[s.id])}">`
        + (k === 'initial' ? `<circle class="cu-dot" cx="${p.cx}" cy="${p.cy}" r="7"/>` : k === 'final' ? `<circle class="cu-ring" cx="${p.cx}" cy="${p.cy}" r="10"/><circle class="cu-dot" cx="${p.cx}" cy="${p.cy}" r="6"/>` : `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="14"/>${lines(s.name, p.cx, p.cy, size, p.w - 10, 4)}`)
        + `<title>${esc(name[s.id])}</title></g>`; };
    el.innerHTML = svgWrap('cu-state-d', W, H, spec.title || '状态机图', opts.uid, `<g>${T.map((t, k) => edgeSvg('cu-tr', t.id, t.from, t.to, routes[k], opts.uid)).join('')}</g><g class="cu-elabels">${edgeLabels(T.map((t, k) => ({id: t.id, pts: routes[k], label: t.label})), Object.values(P), W, H)}</g>${S.map(st).join('')}`);
    const svg = el.firstChild, fly = flier(svg);
    let prevVia = null;
    return {
      svg, width: W, height: H, ids: () => [...S.map(s => s.id), ...T.map(t => t.id)], box: boxOf(P), routes: () => T.map((t, k) => ({a: t.from, b: t.to, pts: routes[k]})),
      paint(state = {}) {
        const lit = setOf(state.lit), now = setOf([].concat(state.now || []));
        svg.querySelectorAll('.cu-state').forEach(g => { toggle(g, 'cu-now', now.has(g.dataset.id)); toggle(g, 'cu-lit', lit.has(g.dataset.id)); });
        // a transition is current when it is the one taken, when the text names it, or names both its states
        svg.querySelectorAll('.cu-tr').forEach(g => { toggle(g, 'cu-now', g.dataset.id === state.via || now.has(g.dataset.id) || (now.has(g.dataset.a) && now.has(g.dataset.b) && g.dataset.a !== g.dataset.b)); toggle(g, 'cu-lit', lit.has(g.dataset.id)); });
        if (state.via && state.via !== prevVia) { const k = T.findIndex(t => t.id === state.via); if (k >= 0) fly([{pts: routes[k], el: svg.querySelector(`.cu-tr[data-id="${CSS.escape(state.via)}"]`)}], 520); }
        prevVia = state.via || null;
      },
      toMermaid: () => ['stateDiagram-v2', ...S.filter(s => kind[s.id] === 'normal').map(s => `  ${mid(s.id)}: ${s.name}`), ...T.map(t => `  ${kind[t.from] === 'initial' ? '[*]' : mid(t.from)} --> ${kind[t.to] === 'final' ? '[*]' : mid(t.to)}${t.label ? ': ' + t.label : ''}`)].join('\n'),
    };
  }

  // ---------------------------------------------------------------- activity diagram (and interaction overview)
  function activity(el, spec, opts) {
    const Nn = spec.nodes, Fl = spec.flows, size = opts.font || 12.5, byId = Object.fromEntries(Nn.map(n => [n.id, n])), kind = id => byId[id].kind || 'action', Lanes = spec.lanes || [];
    const rows = rowsOf(Nn.map(n => n.id), Fl.map(f => [f.from, f.to]), (Nn.find(n => n.kind === 'start') || Nn[0]).id);
    const DNAME = 170, ENAME = 130;
    // an end says which result it is: its name stands under the ring
    const endLines = n => n.name ? evenWrap(n.name, 10.5, ENAME) : [];
    const sizeOf = id => { const k = kind(id); return k === 'start' ? {w: 16, h: 16} : k === 'end' ? (ls => ls.length ? {w: Math.max(22, ...ls.map(s => textW(s, 10.5))), h: 26 + ls.length * 12.5} : {w: 22, h: 22})(endLines(byId[id])) : k === 'decision' || k === 'merge' ? {w: 26, h: 26} : k === 'fork' || k === 'join' ? {w: 90, h: 6} : (w => ({w, h: k === 'ref' ? 38 : tallFor(byId[id].name || '', size, w - 10, 30)}))(Math.min(170, Math.max(84, textW(byId[id].name || '', size) + 24))); };
    let lay;
    if (Lanes.length) { // swimlanes: one column per lane, one row per layer; the same router, with rows packed per lane
      const W = opts.width || 340, cw = W / Lanes.length, P = {}, rowOf = {}, li = id => Math.max(0, Lanes.findIndex(l => l.id === byId[id].lane));
      let y = 30; const rowTop = [], rowBot = [];
      rows.forEach((r, ri) => { const hMax = Math.max(...r.map(id => sizeOf(id).h)); r.forEach(id => { const s = sizeOf(id), same = r.filter(x => li(x) === li(id)), cx = cw * li(id) + cw * (same.indexOf(id) + 1) / (same.length + 1); P[id] = {x: cx - s.w / 2, y: y + (hMax - s.h) / 2, w: s.w, h: s.h, cx, cy: y + hMax / 2}; rowOf[id] = ri; }); rowTop[ri] = y; rowBot[ri] = y + hMax; y += hMax + 30; });
      const route = (a, b) => { const A = P[a], B = P[b];
        if (rowOf[b] > rowOf[a]) { const y1 = A.y + A.h, y2 = B.y - 1; if (Math.abs(A.cx - B.cx) < 0.5 || opts.edges === 'straight') return [[A.cx, y1], [B.cx, y2]]; const ym = rowOf[b] === rowOf[a] + 1 ? (rowBot[rowOf[a]] + rowTop[rowOf[b]]) / 2 : B.y - 12; return [[A.cx, y1], [A.cx, ym], [B.cx, ym], [B.cx, y2]]; }
        if (opts.edges === 'straight') return [[A.cx + 8, A.y], [B.cx + 8, B.y + B.h + 1]];
        const cx = Math.min(W - 2, Math.max(A.x + A.w, B.x + B.w) + 10); return [[A.x + A.w, A.cy], [cx, A.cy], [cx, B.cy], [B.x + B.w + 1, B.cy]]; };
      lay = {P, W, H: y - 16, routes: Fl.map(f => route(f.from, f.to))};
    } else lay = layered(rows, sizeOf, {...opts, width: opts.width || 300, gapY: 30, trackGap: 16, decision: id => kind(id) === 'decision', bundle: true, ink: id => kind(id) === 'decision' && byId[id].name ? Math.min(DNAME, textW(byId[id].name, 10.5)) + 8 : 0}, Fl.map(f => [f.from, f.to]));
    const {P, W, H, routes} = lay;
    const onLeft = new Set(), roomL = id => P[id].x - 8 - Math.max(0, ...rows.find(r => r.includes(id)).filter(o => o !== id && P[o].x < P[id].x).map(o => P[o].x + P[o].w)), nameW = n => Math.min(DNAME, textW(n.name, 10.5));
    // a branch that leaves at the right corner would run through the question beside it: the question moves to the left,
    // or, when a branch leaves there too (or there is no room), above the right half of the diamond
    const above = new Set();
    for (const [id, c] of Object.entries(lay.corners || {})) { const n = byId[id]; if (!n.name || !c.R) continue; if (!c.L && nameW(n) + 8 <= roomL(id)) onLeft.add(id); else above.add(id); }
    const dnameLines = (n, p) => evenWrap(n.name, 10.5, above.has(n.id) ? Math.max(70, Math.min(DNAME, W - p.cx - 12)) : onLeft.has(n.id) ? Math.max(70, Math.min(DNAME, roomL(n.id))) : Math.max(70, Math.min(DNAME, W - p.x - p.w - 8)));
    const dnameAt = (n, p, a) => above.has(n.id) ? {x: p.cx + 9, y: i => p.y - 4 - (a.length - 1 - i) * 12.5} : {x: onLeft.has(n.id) ? p.x - 4 : p.x + p.w + 4, y: i => p.cy + (i - (a.length - 1) / 2) * 12.5};
    // a line going back out of the top of a decision reads as taken before the question: it leaves at the corner on its side
    // (the question beside the decision moves to the left when the line leaves at the right)
    if (!Lanes.length) { const rowAt = id => rows.findIndex(r => r.includes(id));
      Fl.forEach((f, k) => { if (kind(f.from) !== 'decision') return; const ra = rowAt(f.from), rb = rowAt(f.to), A = P[f.from], r = routes[k]; if (rb >= ra || !r) return;
        const i = r.findIndex((p, j) => j && (p[0] > A.x + A.w || p[0] < A.x)); if (i < 0) return; const right = r[i][0] > A.cx;
        if (rows[ra].some(id => id !== f.from && (right ? P[id].x > A.x : P[id].x < A.x))) return;
        if (right && byId[f.from].name) { if (nameW(byId[f.from]) + 8 > roomL(f.from)) return; onLeft.add(f.from); }
        routes[k] = [[right ? A.x + A.w : A.x, A.cy], [r[i][0], A.cy], ...r.slice(i)]; });
      // and into the bottom of a decision it lies on the lines that leave there: it enters at the right corner
      Fl.forEach((f, k) => { if (kind(f.to) !== 'decision' || rowAt(f.to) >= rowAt(f.from)) return; const B = P[f.to], r = routes[k]; if (!r) return; let j = -1; r.forEach((p, i) => { if (p[0] > B.x + B.w + 4) j = i; }); if (j < 0) return;
        if (rows[rowAt(f.to)].some(id => id !== f.to && P[id].x > B.x)) return;
        if (byId[f.to].name) { if (nameW(byId[f.to]) + 8 > roomL(f.to)) return; onLeft.add(f.to); }
        routes[k] = [...r.slice(0, j + 1), [r[j][0], B.cy], [B.x + B.w + 1, B.cy]]; }); }
    // a question moved to the left (a line goes back up from the right) stands where a branch leaves at the left corner:
    // it goes above the diamond instead
    for (const [id, c] of Object.entries(lay.corners || {})) if (c.L && onLeft.has(id)) { onLeft.delete(id); above.add(id); }
    // a named end is wider than its ring: a line that lands off centre would point at nothing
    Fl.forEach((f, k) => { const r = routes[k], B = P[f.to]; if (kind(f.to) !== 'end' || !r || r.length < 2) return; const [lx, ly] = r[r.length - 1], prev = r[r.length - 2]; if (Math.abs(lx - B.cx) < 0.5) return; const ym = (prev[1] + ly) / 2; routes[k] = [...r.slice(0, -1), [prev[0], ym], [B.cx, ym], [B.cx, ly]]; });
    // what a decision asks is text beside it: a label over it hides the question
    const dnames = Nn.filter(n => kind(n.id) === 'decision' && n.name).map(n => { const p = P[n.id], ls = dnameLines(n, p), h = ls.length * 12.5, w = Math.max(...ls.map(s => textW(s, 10.5))), at = dnameAt(n, p, ls); return {x: onLeft.has(n.id) ? at.x - w : at.x, y: at.y(0) - 6.25, w, h}; });
    const node = n => { const p = P[n.id], k = kind(n.id);
      const body = k === 'start' ? `<circle class="cu-dot" cx="${p.cx}" cy="${p.cy}" r="7"/>` : k === 'end' ? `<circle class="cu-ring" cx="${p.cx}" cy="${p.y + 11}" r="10"/><circle class="cu-dot" cx="${p.cx}" cy="${p.y + 11}" r="6"/>${endLines(n).map((s, i) => `<text class="cu-dname" style="text-anchor:middle" x="${p.cx}" y="${p.y + 31 + i * 12.5}">${esc(s)}</text>`).join('')}`
        : k === 'decision' || k === 'merge' ? `<path class="cu-diamond" d="M${p.cx},${p.y} L${p.x + p.w},${p.cy} L${p.cx},${p.y + p.h} L${p.x},${p.cy} z"/>${n.name ? dnameLines(n, p).map((s, i, a) => `<text class="cu-dname"${onLeft.has(n.id) ? ' style="text-anchor:end"' : ''} x="${dnameAt(n, p, a).x}" y="${dnameAt(n, p, a).y(i)}">${esc(s)}</text>`).join('') : ''}`
        : k === 'fork' || k === 'join' ? `<rect class="cu-bar" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="2"/>`
        : k === 'ref' ? `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3"/><path class="cu-fragtag" d="M${p.x},${p.y} h26 v7 l-5,5 H${p.x} z"/><text class="cu-ftag" x="${p.x + 4}" y="${p.y + 6}">ref</text>${lines(n.name, p.cx, p.cy + 4, size, p.w - 10, 1)}`
        : `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="12"/>${lines(n.name, p.cx, p.cy, size, p.w - 10, 4)}`;
      return `<g class="cu-node cu-act cu-k-${clsPart(k)}" data-id="${esc(n.id)}"${n.ref ? ` data-ref="${esc(n.ref)}"` : ''} tabindex="0" role="button" aria-label="${esc(n.name || k)}">${body}<title>${esc(n.name || k)}</title></g>`; };
    const laneSvg = Lanes.map((l, i) => { const cw = W / Lanes.length; return `<g class="cu-lane"><rect x="${i * cw}" y="0" width="${cw}" height="${H}"/><text x="${i * cw + cw / 2}" y="12">${esc(l.name)}</text></g>`; }).join('');
    el.innerHTML = svgWrap('cu-act-d', W, H, spec.title || '活动图', opts.uid, `${laneSvg}<g>${Fl.map((f, k) => edgeSvg('cu-flow', f.id, f.from, f.to, routes[k], opts.uid)).join('')}</g><g class="cu-elabels">${edgeLabels(Fl.map((f, k) => ({id: f.id, pts: routes[k], label: f.guard ? `[${f.guard}]` : ''})), [...Object.values(P), ...dnames], W, H, true)}</g>${Nn.map(node).join('')}`);
    const svg = el.firstChild, fly = flier(svg);
    let prevPath = [];
    return {
      svg, width: W, height: H, ids: () => [...Nn.map(n => n.id), ...Fl.map(f => f.id)], box: boxOf(P), routes: () => Fl.map((f, k) => ({a: f.from, b: f.to, pts: routes[k]})),
      paint(state = {}) {
        const path = state.path || [], onPath = new Set(path), now = setOf(state.now), lit = setOf(state.lit), used = new Set();
        for (let i = 1; i < path.length; i++) { const f = Fl.find(f => f.from === path[i - 1] && f.to === path[i]); if (f) used.add(f.id); }
        svg.querySelectorAll('.cu-act').forEach(g => { const id = g.dataset.id; toggle(g, 'cu-lit', onPath.has(id) || lit.has(id)); toggle(g, 'cu-now', now.has(id) || (path.length && id === path.at(-1) && !state.blocked)); toggle(g, 'cu-off', path.length && !onPath.has(id)); toggle(g, 'cu-blocked', state.blocked === id); });
        // a flow is current when the text names it, or names both its ends (the text is about the move between them,
        // and the flow's guard says when it happens); a decision without a name of its own that the text names lights
        // the flows out of it, since their guards are what it decides
        const nowF = new Set(Fl.filter(f => now.has(f.id) || (now.has(f.from) && now.has(f.to))).map(f => f.id));
        const ask = new Set(Nn.filter(n => now.has(n.id) && (n.kind === 'decision') && !n.name && !Fl.some(f => f.from === n.id && nowF.has(f.id))).map(n => n.id));
        svg.querySelectorAll('.cu-flow').forEach(g => { const id = g.dataset.id; toggle(g, 'cu-now', nowF.has(id)); toggle(g, 'cu-lit', used.has(id) || (!nowF.has(id) && ask.has(g.dataset.a))); toggle(g, 'cu-off', path.length && !used.has(id) && !nowF.has(id)); });
        // the token runs along the part of the path that is new
        let same = 0; while (same < path.length && same < prevPath.length && path[same] === prevPath[same]) same++;
        const legs = []; for (let i = Math.max(1, same); i < path.length; i++) { const k = Fl.findIndex(f => f.from === path[i - 1] && f.to === path[i]); if (k >= 0) legs.push({pts: routes[k], el: svg.querySelector(`.cu-flow[data-id="${CSS.escape(Fl[k].id)}"]`)}); }
        prevPath = path.slice(); fly(legs.slice(-8), 300);
      },
      toMermaid: () => ['flowchart TB', ...Nn.map(n => { const k = kind(n.id), t = n.name || k; return `  ${mid(n.id)}${k === 'start' || k === 'end' ? `(("${t}"))` : k === 'decision' || k === 'merge' ? `{"${t}"}` : k === 'ref' ? `[["${t}"]]` : `["${t}"]`}`; }), ...Fl.map(f => `  ${mid(f.from)} -->${f.guard ? `|${f.guard}|` : ''} ${mid(f.to)}`)].join('\n'),
    };
  }

  // ---------------------------------------------------------------- use case diagram
  // Cases stand in one column or, when there are many and room for two, in two staggered columns: a line to a case of the
  // far column then runs straight between two cases of the near one. Cases are ordered, and actors placed, by the mean
  // height of what they link to (a few rounds), so lines seldom cross. An association is a curve from the actor to the near
  // end of its case, level at both ends; a long name wraps onto a second line.
  function usecase(el, spec, opts) {
    const A = spec.actors || [], Cs = spec.cases || [], cids = new Set(Cs.map(c => c.id));
    const LK = (spec.links || []).filter(([a, c]) => A.some(x => x.id === a) && cids.has(c));
    const W = opts.width || 360, FS = 12, AF = 11, f1 = v => +v.toFixed(1), clip2 = ls => ls.length > 2 ? [ls[0], ls[1].replace(/.$/, '…')] : ls;
    const left = A.filter(a => a.side !== 'right'), right = A.filter(a => a.side === 'right'), onRight = new Set(right.map(a => a.id));
    // actor columns as wide as the longest name on one line (within limits); a longer name wraps
    const colW = list => list.length ? Math.min(84, Math.max(48, ...list.map(a => textW(a.name, AF) + 6))) : 0;
    const lw = colW(left), rw = colW(right), bx = left.length ? lw + 26 : 6, bw = W - bx - (right.length ? rw + 26 : 6);
    const AL = Object.fromEntries(A.map(a => [a.id, clip2(wrap(a.name, AF, (onRight.has(a.id) ? rw : lw) - 2))])), aH = a => 54 + (AL[a.id].length - 1) * 13;
    // case columns: two when there are many cases and room for two
    const two = Cs.length >= 6 && bw >= 290, gut = 22, cw = two ? (bw - 20 - gut) / 2 : bw - 20;
    // a case name on one line when it fits, else on two; at the height of its text an ellipse is narrower than at its middle:
    // F1 of its width for one line (ry 14), F2 for each of two (ry 23)
    const F1 = 0.9, F2 = 0.8, CL = Object.fromEntries(Cs.map(c => [c.id, textW(c.name, FS) <= cw * F1 - 20 ? [c.name] : clip2(wrap(c.name, FS, cw * F2 - 20))]));
    const need = c => (Math.max(...CL[c.id].map(t => textW(t, FS))) / 2 + 10) / (CL[c.id].length > 1 ? F2 : F1), RY = c => CL[c.id].length > 1 ? 23 : 14;
    const linked = new Map(Cs.map(c => [c.id, LK.filter(l => l[1] === c.id).map(l => l[0])]));
    const pref = c => linked.get(c.id).reduce((s, a) => s + (onRight.has(a) ? 1 : -1), 0);
    // each group is split between the columns: the cases that link more to the right go right, half of them
    const gs = spec.groups || [], known = new Set(gs.map(g => g.id));
    const groups = [...gs, {id: null, name: ''}].map(g => {
      const list = Cs.filter(c => g.id === null ? !known.has(c.group || '') : (c.group || '') === g.id);
      let L = list, R = [];
      if (two && list.length > 1) {
        const nR = list.reduce((s, c) => s + pref(c), 0) > 0 ? Math.ceil(list.length / 2) : Math.floor(list.length / 2);
        const rs = new Set([...list].sort((a, b) => pref(b) - pref(a)).slice(0, nR).map(c => c.id));
        L = list.filter(c => !rs.has(c.id)); R = list.filter(c => rs.has(c.id));
      }
      return {name: g.id === null ? '' : g.name, list, L, R};
    }).filter(g => g.list.length);
    const rxOf = list => Math.min(cw / 2, Math.max(28, ...list.map(need)));
    const allL = groups.flatMap(g => g.L), allR = groups.flatMap(g => g.R), rxL = allL.length ? rxOf(allL) : 0, rxR = allR.length ? rxOf(allR) : 0;
    const xm = bx + bw / 2, xL = two ? xm - gut / 2 - rxL : xm, xR = xm + gut / 2 + rxR;
    const P = {}, heads = [];
    let ay = new Map(); for (const list of [left, right]) list.forEach((a, i) => ay.set(a.id, (i + 1) / (list.length + 1)));
    const key = c => { const ys = linked.get(c.id).map(a => ay.get(a)); return ys.length ? ys.reduce((s, v) => s + v, 0) / ys.length : Infinity; };
    const byKey = list => list.map((c, i) => [c, key(c), i]).sort((p, q) => (p[1] - q[1]) || (p[2] - q[2])).map(p => p[0]);
    const placeCases = () => {
      let y = 28; heads.length = 0;
      for (const g of groups) {
        if (g.name) { heads.push([g.name, y]); y += 16; }
        const L = byKey(g.L), R = byKey(g.R), [a, b] = L.length >= R.length ? [L, R] : [R, L], seq = [];
        for (let i = 0; i < a.length; i++) { seq.push(a[i]); if (b[i]) seq.push(b[i]); }
        const ry = Math.max(...g.list.map(RY)), pitch = two ? ry + 11 : 2 * ry + 14, inR = new Set(g.R);
        seq.forEach((c, k) => { const col = inR.has(c) ? 'R' : 'L', cx = col === 'R' ? xR : xL, rx = col === 'R' ? rxR : rxL, cy = y + ry + k * pitch, r = RY(c);
          P[c.id] = {cx, cy, rx, ry: r, col, x: cx - rx, y: cy - r, w: 2 * rx, h: 2 * r}; });
        y += 2 * ry + (seq.length - 1) * pitch + 14;
      }
      return y;
    };
    // actors half at the mean height of their cases, half spread evenly over the cases in that order (actors that link to
    // much the same cases would otherwise bunch up), kept clear of each other and of the edges (y is the level of the arms)
    const placeActors = (list, x, H) => {
      const ys = Cs.filter(c => P[c.id]).map(c => P[c.id].cy), lo = ys.length ? Math.min(...ys) : 26, hi = ys.length ? Math.max(...ys) : H - 30;
      const want = list.map((a, i) => { const at = LK.filter(l => l[0] === a.id).map(l => P[l[1]].cy); return {a, i, b: at.length ? at.reduce((s, v) => s + v, 0) / at.length : null}; })
        .sort((p, q) => ((p.b ?? Infinity) - (q.b ?? Infinity)) || (p.i - q.i));
      want.forEach((w, r) => { const even = lo + (hi - lo) * (r + 0.5) / want.length; w.y = w.b === null ? even : (w.b + even) / 2; });
      want.forEach((w, i) => { w.y = Math.max(w.y, i ? want[i - 1].y + aH(want[i - 1].a) + 10 : 26); });
      for (let i = want.length - 1; i >= 0; i--) { const lim = i === want.length - 1 ? H + 12 - aH(want[i].a) : want[i + 1].y - aH(want[i].a) - 10; if (want[i].y > lim) want[i].y = lim; }
      for (const w of want) P[w.a.id] = {cx: x, cy: w.y, x: x - 18, y: w.y - 18, w: 36, h: aH(w.a)};
    };
    const tall = list => list.reduce((s, a) => s + aH(a) + 10, 0) + 14;
    let H = 0;
    for (let round = 0; round < 4; round++) {
      const bottom = placeCases(), off = (Math.max(bottom, tall(left), tall(right)) - bottom) / 2;
      H = bottom + 2 * off;
      if (off > 0) { for (const c of Cs) if (P[c.id]) { P[c.id].cy += off; P[c.id].y += off; } heads.forEach(h => { h[1] += off; }); }
      placeActors(left, lw / 2 + 6, H); placeActors(right, W - rw / 2 - 6, H);
      ay = new Map(A.map(a => [a.id, P[a.id].cy]));
    }
    const S = (x1, y1, x2, y2) => { const k = (x2 - x1) / 2; return `M${f1(x1)},${f1(y1)} C${f1(x1 + k)},${f1(y1)} ${f1(x2 - k)},${f1(y2)} ${f1(x2)},${f1(y2)}`; };
    const link = ([a, c]) => {
      const pa = P[a], pc = P[c], r = onRight.has(a), sx = pa.cx + (r ? -11 : 11), end = pc.cx + (r ? pc.rx : -pc.rx);
      const far = two && pc.col === (r ? 'L' : 'R'), edge = r ? xR + rxR + 4 : xL - rxL - 4;
      return `<path class="cu-assoc" data-a="${esc(a)}" data-b="${esc(c)}" d="${far ? `${S(sx, pa.cy, edge, pc.cy)} L${f1(end)},${f1(pc.cy)}` : S(sx, pa.cy, end, pc.cy)}"/>`;
    };
    // an include/extend: across the gutter from inner end to inner end, else a bow on the free side of its column
    let incK = 0;
    const inc = ([a, b, k]) => {
      const p = P[a], q = P[b]; if (!p || !q) return '';
      const t = `«${k || 'include'}»`, tw = textW(t, 10);
      let d, lx, ly;
      if (two && p.col !== q.col) { const s = p.cx + (p.col === 'L' ? p.rx : -p.rx), e = q.cx + (q.col === 'L' ? q.rx + 1 : -q.rx - 1); d = S(s, p.cy, e, q.cy); lx = (s + e) / 2 - tw / 2; ly = (p.cy + q.cy) / 2 - 8; }
      else {
        const side = two && p.col === 'R' ? -1 : 1, s = p.cx + side * p.rx, e = q.cx + side * (q.rx + 1), bow = 24 + incK++ * 10, xb = side > 0 ? Math.max(s, e) + bow : Math.min(s, e) - bow;
        d = `M${f1(s)},${f1(p.cy)} C${f1(xb)},${f1(p.cy)} ${f1(xb)},${f1(q.cy)} ${f1(e)},${f1(q.cy)}`; lx = side > 0 ? xb - bow / 4 + 3 : xb + bow / 4 - 3 - tw; ly = (p.cy + q.cy) / 2;
      }
      return `<g class="cu-inc" data-a="${esc(a)}" data-b="${esc(b)}"><path d="${d}" marker-end="url(#cu-oh-${opts.uid})"/><text class="cu-stereo" x="${f1(lx)}" y="${f1(ly)}">${esc(t)}</text></g>`;
    };
    const actor = a => { const p = P[a.id], x = f1(p.cx), y = p.cy;
      return `<g class="cu-node cu-actor" data-id="${esc(a.id)}" tabindex="0" role="button" aria-label="${esc(a.name)}"><circle cx="${x}" cy="${f1(y - 12)}" r="6"/><path d="M${x},${f1(y - 6)} v14 M${f1(p.cx - 9)},${f1(y)} h18 M${x},${f1(y + 8)} l-8,11 M${x},${f1(y + 8)} l8,11"/>${AL[a.id].map((t, i) => `<text x="${x}" y="${f1(y + 29 + i * 13)}">${esc(t)}</text>`).join('')}<title>${esc(a.name)}</title></g>`; };
    const uc = c => { const p = P[c.id], ls = CL[c.id];
      return `<g class="cu-node cu-case" data-id="${esc(c.id)}" tabindex="0" role="button" aria-label="${esc(c.name)}"><ellipse cx="${f1(p.cx)}" cy="${f1(p.cy)}" rx="${f1(p.rx)}" ry="${p.ry}"/>${ls.map((t, i) => `<text x="${f1(p.cx)}" y="${f1(p.cy + (i - (ls.length - 1) / 2) * (FS + 3))}">${esc(t)}</text>`).join('')}<title>${esc(c.name)}</title></g>`; };
    el.innerHTML = svgWrap('cu-uc', W, f1(H), spec.title || '用例图', opts.uid, `<g class="cu-system"><rect x="${f1(bx)}" y="4" width="${f1(bw)}" height="${f1(H - 8)}" rx="6"/><text class="cu-sysname" x="${f1(bx + 8)}" y="16">${esc(spec.system || '')}</text></g>${heads.map(([n, hy]) => `<text class="cu-ghead" x="${f1(xm)}" y="${f1(hy + 4)}">${esc(n)}</text>`).join('')}<g>${LK.map(link).join('')}${(spec.includes || []).map(inc).join('')}</g>${A.map(actor).join('')}${Cs.filter(c => P[c.id]).map(uc).join('')}`);
    const svg = el.firstChild;
    return {
      svg, width: W, height: H, ids: () => [...A.map(a => a.id), ...Cs.map(c => c.id)], box: boxOf(P),
      paint(state = {}) { const now = setOf(state.now), lit = setOf(state.lit); svg.querySelectorAll('.cu-node').forEach(g => { toggle(g, 'cu-now', now.has(g.dataset.id)); toggle(g, 'cu-lit', lit.has(g.dataset.id)); }); svg.querySelectorAll('.cu-assoc,.cu-inc').forEach(l => toggle(l, 'cu-on', now.has(l.dataset.a) || now.has(l.dataset.b))); },
      toMermaid: () => ['flowchart LR', ...A.map(a => `  ${mid(a.id)}(["${a.name}"])`), `  subgraph sys["${spec.system || ''}"]`, ...Cs.map(c => `    ${mid(c.id)}(("${c.name}"))`), '  end', ...(spec.links || []).map(([a, c]) => `  ${mid(a)} --- ${mid(c)}`), ...(spec.includes || []).map(([a, b, k]) => `  ${mid(a)} -.->|${k || 'include'}| ${mid(b)}`)].join('\n'),
    };
  }

  // ---------------------------------------------------------------- deployment diagram
  // a deployment diagram (UML): nodes in nodes — a device or a cloud holds execution environments, an environment holds
  // artifacts and databases; communication paths between any two of them, labelled with how they talk. A node is
  // {id, name, kind: device|env|cloud|external|artifact|db, stereo, cols, children}; the top nodes sit in rows (spec.rows:
  // [[ids]], else spec.cols to a row)
  function deploymentNested(el, spec, opts) {
    const W = Math.max(420, opts.width || 560), d3 = 7, pad = 8, gap = 28, AR = 28, gx = 40, gy = 44, size = 11, leaf = n => !n.children?.length && ['artifact', 'db'].includes(n.kind || 'artifact');
    const P = {}, parent = {}, out = [];
    const head = n => n.stereo ? 34 : 22;
    // a node's own box for at most max wide, with the places of its children relative to its corner: a node with nothing
    // inside fits its name; a node that holds others fits its title and them — its artifacts one per line (all as wide as
    // the widest), then the nodes inside it left to right, a new row when the next one does not fit
    const BH = 28, AH = 20;
    const fit = (n, max) => {
      const kids = n.children || [];
      if (!kids.length) { const art = leaf(n), w = Math.min(max, Math.max(72, textW(n.name, size) + (art ? 34 : 24))); return {w, h: art ? AH : BH + (fitLines(n.name, size, w - 12, 2).ls.length - 1) * 13, at: []}; }
      const inner = max - 2 * pad, arts = kids.filter(leaf), envs = kids.filter(k => !leaf(k)), at = [];
      const fa = arts.map(k => fit(k, inner)), aw = Math.max(0, ...fa.map(f => f.w));
      let y = head(n);
      arts.forEach((k, i) => { at.push({k, x: pad, y, f: {...fa[i], w: aw}}); y += AR; });
      if (arts.length && !envs.length) y -= AR - AH;
      const rows = []; let row = [], rw = 0;
      for (const k of envs) { const f = fit(k, inner); if (row.length && rw + gap + f.w > inner) { rows.push(row); row = []; rw = 0; } rw += (row.length ? gap : 0) + f.w; row.push({k, f}); }
      if (row.length) rows.push(row);
      rows.forEach((r, ri) => { let x = pad; for (const o of r) { at.push({k: o.k, x, y, f: o.f}); x += o.f.w + gap; } y += Math.max(...r.map(o => o.f.h)) + (ri < rows.length - 1 ? gap : 0); });
      return {w: Math.min(max, Math.max(textW(n.name, size) + 20, ...at.map(o => o.x + o.f.w + pad))), h: y + pad, at};
    };
    const place = (n, x, y, f, up) => { P[n.id] = {x, y, w: f.w, h: f.h}; if (up) parent[n.id] = up; for (const o of f.at) place(o.k, x + o.x, y + o.y, o.f, n.id); };
    const byId = new Map(spec.nodes.map(n => [n.id, n]));
    const rows = spec.rows || spec.nodes.reduce((rs, n, i) => { const c = spec.cols || 2; (rs[Math.floor(i / c)] ||= []).push(n.id); return rs; }, []);
    // a row of top nodes takes their own widths; when they do not fit side by side, a node that holds others gets twice
    // the room of an empty one (or its span)
    const layout = G => { let y = d3 + 4;
      const wOf = n => n.span || (n.children?.length ? 2 : 1);
      for (const r of rows) { const ns = r.map(id => byId.get(id)).filter(Boolean), room = W - d3 - (ns.length - 1) * G;
        let fs = ns.map(n => fit(n, room)); if (fs.reduce((a, f) => a + f.w, 0) > room) { const wt = ns.reduce((a, n) => a + wOf(n), 0); fs = ns.map(n => fit(n, room * wOf(n) / wt)); }
        let x = 1, hMax = 0; ns.forEach((n, i) => { place(n, x, y, fs[i]); hMax = Math.max(hMax, fs[i].h); x += fs[i].w + G; }); y += hMax + gy; }
      return y - gy + 6; };
    // a path between two top nodes runs in the gutter beside both: out of the side of one end, along its own lane in the
    // gutter, into the side of the other end (the ends spread along each side, ordered by where the other end is); a
    // path inside one top node is a curve. The gutter widens to hold its lanes.
    const LS = 7, f1 = v => +(+v).toFixed(1), top = id => { let x = id; while (parent[x]) x = parent[x]; return x; };
    const routes = G => {
      const LK = []; // two links between the same two nodes are one path that carries both words
      for (const [a, b, label] of spec.links || []) { const o = LK.find(l => (l[0] === a && l[1] === b) || (l[0] === b && l[1] === a)); if (!o) LK.push([a, b, label]); else if (label && o[2] !== label) o[2] = o[2] ? `${o[2]} · ${label}` : label; }
      const R = LK.filter(([a, b]) => P[a] && P[b] && a !== b).map(([a, b, label]) => {
        const ta = top(a), tb = top(b), p = P[a], q = P[b], r = {a, b, label};
        if (ta === tb) return r;
        const A = P[ta], B = P[tb], near = x => Math.min(Math.abs(B.x + B.w + G / 2 - x), Math.abs(B.x - G / 2 - x));
        const gs = [A.x + A.w + G / 2, A.x - G / 2].filter(x => x > 0 && x < W && near(x) < 2).sort((x, y) => Math.abs(x - q.x - q.w / 2) - Math.abs(y - q.x - q.w / 2));
        if (!gs.length) return r;
        const g = gs[0]; return {...r, g, sa: g > p.x + p.w / 2 ? 1 : 0, sb: g > q.x + q.w / 2 ? 1 : 0};
      });
      const ports = new Map(), key = (id, s) => id + '|' + s;
      for (const r of R.filter(r => r.g !== undefined)) for (const [id, s, o] of [[r.a, r.sa, r.b], [r.b, r.sb, r.a]]) (ports.get(key(id, s)) || ports.set(key(id, s), []).get(key(id, s))).push({r, o, end: id === r.a ? 'ya' : 'yb'});
      for (const [k, list] of ports) { const p = P[k.split('|')[0]], lo = p.y + Math.min(p.h / 2, list.length > 1 ? 6 : p.h / 2), span = p.h - 2 * (lo - p.y);
        list.sort((u, v) => (P[u.o].y + P[u.o].h / 2) - (P[v.o].y + P[v.o].h / 2)).forEach((u, i) => { u.r[u.end] = list.length > 1 ? lo + span * i / (list.length - 1) : p.y + p.h / 2; }); }
      const lanes = new Map();
      for (const r of R.filter(r => r.g !== undefined).sort((u, v) => Math.min(u.ya, u.yb) - Math.min(v.ya, v.yb))) {
        const k = Math.round(r.g), ends = lanes.get(k) || lanes.set(k, []).get(k), lo = Math.min(r.ya, r.yb), hi = Math.max(r.ya, r.yb);
        let i = ends.findIndex(e => e + 8 < lo); if (i < 0) { i = ends.length; ends.push(hi); } else ends[i] = hi; r.lane = i; }
      for (const r of R.filter(r => r.g !== undefined)) { const n = lanes.get(Math.round(r.g)).length; r.lx = r.g + (r.lane - (n - 1) / 2) * LS; }
      return {R, most: Math.max(0, ...[...lanes.values()].map(e => e.length))};
    };
    let G = gx, H = layout(G), RT = routes(G);
    if ((RT.most + 1) * LS + 16 > G) { G = Math.min(W / 4, (RT.most + 1) * LS + 16); H = layout(G); RT = routes(G); }
    const draw = (n, depth) => { const p = P[n.id];
      if (leaf(n)) { const db = n.kind === 'db';
        out.push(`<g class="cu-node cu-art${db ? ' cu-db' : ''}" data-id="${esc(n.id)}" tabindex="0" role="button">${db ? `<path d="M${p.x},${p.y + 4} a${p.w / 2},4 0 0 0 ${p.w},0 v${p.h - 8} a${p.w / 2},4 0 0 1 -${p.w},0 z M${p.x},${p.y + 4} a${p.w / 2},4 0 0 1 ${p.w},0"/>` : `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="2"/><path class="cu-doc" d="M${p.x + p.w - 13},${p.y + 4} h6 l3,3 v8 h-9 z"/>`}<text x="${p.x + (db ? p.w / 2 : (p.w - 14) / 2)}" y="${p.y + (db ? 14 : p.h / 2 + 1)}">${esc(clip(n.name, size - 0.5, p.w - (db ? 8 : 20)))}</text><title>${esc(n.name)}</title></g>`); return; }
      const k = n.kind || 'device', solid = k === 'device' || k === 'cloud' || k === 'external';
      out.push(`<g class="cu-node cu-dnode cu-k-${clsPart(k)}" data-id="${esc(n.id)}" tabindex="0" role="button">${solid ? `<path class="cu-face" d="M${p.x},${p.y} l${d3},-${d3} h${p.w} l-${d3},${d3} z M${p.x + p.w},${p.y} l${d3},-${d3} v${p.h} l-${d3},${d3} z"/>` : ''}<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="${k === 'env' ? 6 : k === 'cloud' ? 12 : 0}"/>`
        + (n.children?.length ? (n.stereo ? `<text class="cu-stereo" x="${p.x + 8}" y="${p.y + 13}">«${esc(n.stereo)}»</text>` : '') + `<text class="cu-pname" x="${p.x + 8}" y="${p.y + (n.stereo ? 28 : 15)}">${esc(clip(n.name, size, p.w - 14))}</text>` : `${lines(n.name, p.x + p.w / 2, p.y + p.h / 2, size, p.w - 12, 2).replace(/<text /g, '<text class="cu-lname" ')}`) + `<title>${esc(n.name)}</title></g>`);
      for (const c of n.children || []) draw(c, depth + 1);
    };
    for (const n of spec.nodes) draw(n, 0);
    // a path leaves the side facing the other end: below or above when they do not share rows, else beside
    // (a corner of a path in the gutter is rounded)
    const orth = pts => { let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
      for (let i = 1; i < pts.length - 1; i++) { const [x0, y0] = pts[i - 1], [x, y] = pts[i], [x2, y2] = pts[i + 1], r = Math.min(5, Math.abs(x - x0) / 2, Math.abs(y2 - y) / 2, Math.abs(x2 - x) / 2, Math.abs(y - y0) / 2);
        const ax = x - Math.sign(x - x0) * r, ay = y - Math.sign(y - y0) * r, bx = x + Math.sign(x2 - x) * r, by = y + Math.sign(y2 - y) * r; d += ` L${f1(ax)},${f1(ay)} Q${f1(x)},${f1(y)} ${f1(bx)},${f1(by)}`; }
      return d + ` L${f1(pts.at(-1)[0])},${f1(pts.at(-1)[1])}`; };
    // a path inside one top node runs between the boxes, on a grid of CS px: around every box that is neither one of its
    // ends nor a box holding an end, and around every name; it leaves and enters the sides of its ends, a turn costs, and
    // so does running on a cell an earlier path took (paths keep apart). No way through: the curve below.
    const CS = 4, GW = Math.ceil(W / CS) + 1, GH = Math.ceil(H / CS) + 1, used = new Uint8Array(GW * GH), DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
    const nodeOf = new Map(), walkN = x => { nodeOf.set(x.id, x); (x.children || []).forEach(walkN); }; spec.nodes.forEach(walkN);
    const holders = id => { const r = new Set(); for (let x = parent[id]; x; x = parent[x]) r.add(x); return r; };
    const solidK = id => { const k = nodeOf.get(id)?.kind || 'device'; return !leaf(nodeOf.get(id) || {}) && (k === 'device' || k === 'cloud' || k === 'external'); };
    const strips = [...nodeOf.values()].filter(x => !leaf(x) && P[x.id]).map(x => ({x: P[x.id].x, y: P[x.id].y, w: Math.min(P[x.id].w, textW(x.name, size) + 18), h: head(x)}));
    const inner = (a, b) => {
      const ha = holders(a), hb = holders(b); if (ha.has(b) || hb.has(a)) return null;
      const keep = new Set([...ha, ...hb]), m = new Uint8Array(GW * GH);
      const block = (x, y, w, h) => { const c0 = Math.max(0, Math.floor((x - 2) / CS)), c1 = Math.min(GW - 1, Math.floor((x + w + 2) / CS)), r0 = Math.max(0, Math.floor((y - 2) / CS)), r1 = Math.min(GH - 1, Math.floor((y + h + 2) / CS)); for (let r = r0; r <= r1; r++) m.fill(1, r * GW + c0, r * GW + c1 + 1); };
      for (const [id, p] of Object.entries(P)) if (!keep.has(id)) { const d = solidK(id) ? d3 : 0; block(p.x, p.y - d, p.w + d, p.h + d); }
      strips.forEach(t => block(t.x, t.y, t.w, t.h));
      // the cells two steps outside each side of a box, with the way out of (or into) that side
      const ring = p => { const o = [], c0 = Math.floor(p.x / CS), c1 = Math.floor((p.x + p.w) / CS), r0 = Math.floor(p.y / CS), r1 = Math.floor((p.y + p.h) / CS);
        for (let c = c0 + 1; c < c1; c++) o.push([c, r0 - 2, 0], [c, r1 + 2, 2]);
        for (let r = r0 + 1; r < r1; r++) o.push([c0 - 2, r, 3], [c1 + 2, r, 1]);
        return o.filter(([c, r]) => c >= 0 && r >= 0 && c < GW && r < GH && !m[r * GW + c]); };
      const p = P[a], q = P[b], S = ring(p), T = new Map(ring(q).map(([c, r, d]) => [r * GW + c, d])); if (!S.length || !T.size) return null;
      const tx = (q.x + q.w / 2) / CS, ty = (q.y + q.h / 2) / CS, hz = i => Math.max(0, Math.abs(i % GW - tx) - q.w / CS / 2) + Math.max(0, Math.abs(Math.floor(i / GW) - ty) - q.h / CS / 2);
      const N = GW * GH * 4, cost = new Float64Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), H0 = [];
      const push = (st, f) => { H0.push([f, st]); let i = H0.length - 1; while (i) { const j = (i - 1) >> 1; if (H0[j][0] <= H0[i][0]) break; [H0[i], H0[j]] = [H0[j], H0[i]]; i = j; } };
      const pop = () => { const top = H0[0], last = H0.pop(); if (H0.length) { H0[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let k = i; if (l < H0.length && H0[l][0] < H0[k][0]) k = l; if (r < H0.length && H0[r][0] < H0[k][0]) k = r; if (k === i) break; [H0[i], H0[k]] = [H0[k], H0[i]]; i = k; } } return top; };
      for (const [c, r, d] of S) { const st = (r * GW + c) * 4 + d; cost[st] = 0; push(st, hz(r * GW + c)); }
      let end = -1;
      while (H0.length) { const [f, st] = pop(), i = st >> 2, d = st & 3; if (f - hz(i) > cost[st] + 1e-9) continue;
        if (T.has(i)) { end = st; break; }
        for (let nd = 0; nd < 4; nd++) { if (nd === (d + 2) % 4) continue; const c = i % GW + DX[nd], r = Math.floor(i / GW) + DY[nd]; if (c < 0 || r < 0 || c >= GW || r >= GH) continue;
          const j = r * GW + c; if (m[j]) continue; const ns = j * 4 + nd, g = cost[st] + 1 + (nd !== d ? 6 : 0) + used[j] * 3;
          if (g < cost[ns]) { cost[ns] = g; from[ns] = st; push(ns, g + hz(j)); } } }
      if (end < 0) return null;
      const cells = []; for (let st = end; st >= 0; st = from[st]) cells.unshift(st);
      cells.forEach(st => { const i = st >> 2; used[i] = Math.min(3, used[i] + 1); });
      const at = st => [(st >> 2) % GW * CS + CS / 2, Math.floor((st >> 2) / GW) * CS + CS / 2];
      // onto the sides of the two boxes, straight out from the first and last cells
      const [sx, sy] = at(cells[0]), sd = cells[0] & 3, [ex, ey] = at(cells.at(-1)), ed = T.get(end >> 2);
      const onA = sd === 0 ? [sx, p.y] : sd === 2 ? [sx, p.y + p.h] : sd === 3 ? [p.x, sy] : [p.x + p.w, sy];
      const onB = ed === 0 ? [ex, q.y] : ed === 2 ? [ex, q.y + q.h] : ed === 3 ? [q.x, ey] : [q.x + q.w, ey];
      const pts = [onA, ...cells.map(at), onB].filter((pt, k, all) => { if (!k || k === all.length - 1) return true; const [a0, b0] = all[k - 1], [a2, b2] = all[k + 1]; return !((a0 === pt[0] && pt[0] === a2) || (b0 === pt[1] && pt[1] === b2)); });
      return pts;
    };
    const midPts = pts => { const seg = pts.slice(1).map((pt, k) => Math.hypot(pt[0] - pts[k][0], pt[1] - pts[k][1])), half = seg.reduce((x, y) => x + y, 0) / 2; let acc = 0;
      for (let k = 0; k < seg.length; k++) { if (acc + seg[k] >= half) { const t = seg[k] ? (half - acc) / seg[k] : 0; return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * t, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * t]; } acc += seg[k]; } return pts[0]; };
    const links = RT.R.map(({a, b, label, g, sa, sb, ya, yb, lx}) => { const p = P[a], q = P[b];
      let d, mx, my, ip;
      if (g !== undefined) { const x1 = sa ? p.x + p.w : p.x, x2 = sb ? q.x + q.w : q.x; d = orth([[x1, ya], [lx, ya], [lx, yb], [x2, yb]]); mx = lx; my = (ya + yb) / 2; }
      else if (top(a) === top(b) && (ip = inner(a, b))) { d = orth(ip); [mx, my] = midPts(ip); }
      else { let x1, y1, x2, y2;
        if (p.y + p.h <= q.y || q.y + q.h <= p.y) { const down = q.y > p.y; x1 = p.x + p.w / 2; x2 = q.x + q.w / 2; y1 = down ? p.y + p.h : p.y; y2 = down ? q.y : q.y + q.h; d = `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`; }
        else { const right = q.x > p.x; y1 = p.y + p.h / 2; y2 = q.y + q.h / 2; x1 = right ? p.x + p.w : p.x; x2 = right ? q.x : q.x + q.w; d = `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`; }
        mx = (x1 + x2) / 2; my = (y1 + y2) / 2; }
      const lines = label ? wrap(label, 10, Math.min(220, W / 2.4)) : [], w = Math.max(0, ...lines.map(t => textW(t, 10))) + 10, h = lines.length * 13 + 4, lx0 = Math.max(2, Math.min(W - w - 2, mx - w / 2));
      return `<g class="cu-dlink" data-a="${esc(a)}" data-b="${esc(b)}"><path class="cu-hit" d="${d}"/><path d="${d}"/>${label ? `<g class="cu-elabel" data-y="${f1(my - h / 2)}" data-x="${f1(lx0)}" data-w="${f1(w)}" data-h="${h}" transform="translate(${f1(lx0)},${f1(my - h / 2)})"><rect width="${f1(w)}" height="${h}" rx="3"/>${lines.map((t, i) => `<text x="${f1(w / 2)}" y="${11 + i * 13}">${esc(t)}</text>`).join('')}</g>` : ''}<title>${esc(label || '')}</title></g>`; });
    el.innerHTML = svgWrap('cu-dep-d cu-dep-n', W, H, spec.title || '部署图', opts.uid, out.join('') + `<g>${links.join('')}</g>`);
    const svg = el.firstChild, up = id => { const r = []; for (let x = parent[id]; x; x = parent[x]) r.push(x); return r; };
    // the labels shown at one time keep clear of the node names, the artifacts and each other: each takes the first place
    // along its path (from the middle outwards, then a step above or below) that covers none of them, else the place
    // that covers fewest (the boxes are measured when shown; a hidden pane keeps the middle)
    const spread = () => {
      const cover = (x, y, w, h, b) => x < b.x + b.width && b.x < x + w && y < b.y + b.height && b.y < y + h;
      let blocks = []; try { blocks = [...svg.querySelectorAll('.cu-pname, .cu-lname, .cu-art')].map(e => e.getBBox()).filter(b => b.width); } catch {}
      const put = [];
      for (const l of svg.querySelectorAll('.cu-dlink.cu-say')) {
        const g = l.querySelector('.cu-elabel'), path = l.querySelector('path:not(.cu-hit)'); if (!g || !path) continue;
        const w = +g.dataset.w, h = +g.dataset.h; let best = {x: +g.dataset.x, y: +g.dataset.y, bad: Infinity}, len = 0;
        try { len = path.getTotalLength(); } catch {}
        if (len && blocks.length) for (const dy of [0, -(h / 2 + 4), h / 2 + 4]) { for (const t of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8, 0.12, 0.88]) {
          const pt = path.getPointAtLength(len * t), x = Math.max(2, Math.min(W - w - 2, pt.x - w / 2)), y = Math.max(1, Math.min(H - h - 1, pt.y - h / 2 + dy));
          const bad = blocks.filter(b => cover(x, y, w, h, b)).length * 2 + put.filter(b => cover(x, y, w, h, b)).length * 3;
          if (bad < best.bad) best = {x, y, bad}; if (!bad) break; } if (!best.bad) break; }
        // no free place: the words are not drawn over names; they show while the pointer is on the link
        const room = !(len && blocks.length) || best.bad === 0; g.classList.toggle('cu-noroom', !room);
        if (room) put.push({x: best.x, y: best.y, width: w, height: h}); g.setAttribute('transform', `translate(${f1(best.x)},${f1(best.y)})`);
      } };
    return {svg, width: W, height: H, ids: () => Object.keys(P), box: id => P[id] ? {...P[id]} : null,
      paint(state = {}) { const now = setOf(state.now), lit = setOf(state.lit), around = new Set([...now].flatMap(up));
        svg.querySelectorAll('.cu-dnode,.cu-art').forEach(g => { const id = g.dataset.id; toggle(g, 'cu-now', now.has(id)); toggle(g, 'cu-lit', lit.has(id) || (around.has(id) && !now.has(id))); });
        // a link is on when an end, or a node holding an end, is the one being read; its words show when an end itself is
        const on = id => now.has(id) || up(id).some(x => now.has(x));
        svg.querySelectorAll('.cu-dlink').forEach(l => { toggle(l, 'cu-on', on(l.dataset.a) || on(l.dataset.b)); toggle(l, 'cu-say', now.has(l.dataset.a) || now.has(l.dataset.b)); }); spread(); },
      toMermaid: () => ''};
  }
  function deployment(el, spec, opts) {
    if (spec.nodes.some(n => (n.children || []).some(k => k.children || (k.kind && !['artifact', 'db'].includes(k.kind))))) return deploymentNested(el, spec, opts);
    // a grid: a node may name its row and col, otherwise nodes fill the rows in order; gap is the space between columns
    const Nd = spec.nodes, W = opts.width || 360, cols = Math.min(Nd.length, spec.cols || opts.cols || 3), gap = opts.gap || 50, cw = (W + gap) / cols, P = {}, d3 = 8, rowH = [];
    // a node may span several columns; its children then sit in as many columns as fit (kidCols at most)
    const spanOf = n => Math.max(1, Math.min(cols, n.span || 1)), kc = n => Math.max(1, Math.min(spanOf(n) * 2, opts.kidCols || 1, (n.children || []).length || 1));
    const hOf = n => 26 + Math.ceil((n.children || []).length / kc(n)) * 20 + 4;
    const gi = (v, d) => { const x = Math.round(Number(v)); return Number.isFinite(x) ? Math.max(0, Math.min(40, x)) : d; };
    const cell = Nd.map((n, i) => [gi(n.row, Math.floor(i / cols)), gi(n.col, i % cols)]);
    Nd.forEach((n, i) => { const r = cell[i][0]; rowH[r] = Math.max(rowH[r] || 0, hOf(n)); });
    let y = d3 + 6; const rowY = []; for (let r = 0; r < rowH.length; r++) { rowY[r] = y; y += (rowH[r] || 0) + 40; }
    Nd.forEach((n, i) => { const [r, c] = cell[i], x = c * cw + 2, w = spanOf(n) * cw - gap - d3, k = kc(n), kw = (w - 12 - (k - 1) * 6) / k; P[n.id] = {x, y: rowY[r], w, h: hOf(n), cx: x + w / 2, cy: rowY[r] + hOf(n) / 2};
      (n.children || []).forEach((ch, j) => { const kx = x + 6 + (j % k) * (kw + 6), ky = rowY[r] + 24 + Math.floor(j / k) * 20; P[ch.id] = {x: kx, y: ky, w: kw, h: 16, cx: kx + kw / 2, cy: ky + 8}; }); });
    const H = y - 40 + 8;
    const box = n => { const p = P[n.id];
      return `<g class="cu-node cu-dnode cu-k-${clsPart(n.kind || 'device')}" data-id="${esc(n.id)}" tabindex="0" role="button" aria-label="${esc(n.name)}"><path class="cu-face" d="M${p.x},${p.y} l${d3},-${d3} h${p.w} l-${d3},${d3} z M${p.x + p.w},${p.y} l${d3},-${d3} v${p.h} l-${d3},${d3} z"/><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"/>`
        + `<text class="cu-pname" x="${p.x + 6}" y="${p.y + 13}">${esc(n.name)}</text>${(n.children || []).map(k => { const q = P[k.id]; return `<g class="cu-art" data-id="${esc(k.id)}"><rect x="${q.x}" y="${q.y}" width="${q.w}" height="${q.h}" rx="2"/><text x="${q.x + q.w / 2}" y="${q.y + 8}">${esc(wrap(k.name, 10.5, q.w - 6)[0])}</text><title>${esc(k.name)}</title></g>`; }).join('')}<title>${esc(n.name)}</title></g>`; };
    // a link runs straight down when the two boxes share some width, else out of a side, across the gap and into the
    // other side (horizontal and vertical segments only); its label sits on the vertical segment
    const lanes = {}, laneOf = (k, i) => { (lanes[k] ||= []).includes(i) || lanes[k].push(i); return lanes[k].indexOf(i); };
    (spec.links || []).forEach(([a, b], i) => { const p = P[a], q = P[b]; if (Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x) < 16) laneOf(Math.round(Math.min(p.x + p.w, q.x + q.w)), i); });
    const route = (p, q, i) => {
      const lo = Math.max(p.x, q.x), hi = Math.min(p.x + p.w, q.x + q.w);
      if (hi - lo >= 16) { const x = (lo + hi) / 2, down = q.y > p.y; return [[x, down ? p.y + p.h : p.y], [x, down ? q.y : q.y + q.h]]; }
      const right = q.x > p.x, x1 = right ? p.x + p.w : p.x, x2 = right ? q.x : q.x + q.w, k = Math.round(Math.min(p.x + p.w, q.x + q.w)), n = lanes[k].length, off = (lanes[k].indexOf(i) - (n - 1) / 2) * 12, mx = (right ? x1 + (x2 - x1) / 2 + d3 / 2 : x2 + (x1 - x2) / 2 - d3 / 2) + off;
      return p.cy === q.cy ? [[x1, p.cy], [x2, q.cy]] : [[x1, p.cy], [mx, p.cy], [mx, q.cy], [x2, q.cy]];
    };
    const links = (spec.links || []).map(([a, b, label], i) => { const pts = route(P[a], P[b], i), m = pts.length === 4 ? [pts[1][0], (pts[1][1] + pts[2][1]) / 2] : [(pts[0][0] + pts.at(-1)[0]) / 2, (pts[0][1] + pts.at(-1)[1]) / 2], w = label ? textW(label, 10.5) + 8 : 0;
      return `<g class="cu-dlink" data-a="${esc(a)}" data-b="${esc(b)}"><path d="M${pts.map(q => q.join(',')).join(' L')}"/>${label ? `<g class="cu-elabel"><rect x="${m[0] - w / 2}" y="${m[1] - 7.5}" width="${w}" height="15" rx="3"/><text x="${m[0]}" y="${m[1]}">${esc(label)}</text></g>` : ''}</g>`; });
    el.innerHTML = svgWrap('cu-dep-d', W, H, spec.title || '部署图', opts.uid, `${Nd.map(box).join('')}<g>${links.join('')}</g>`);
    const svg = el.firstChild;
    return {
      svg, width: W, height: H, ids: () => [...Nd.map(n => n.id), ...Nd.flatMap(n => (n.children || []).map(k => k.id))], box: boxOf(P),
      paint(state = {}) { const now = setOf(state.now), lit = setOf(state.lit); svg.querySelectorAll('.cu-dnode,.cu-art').forEach(g => { toggle(g, 'cu-now', now.has(g.dataset.id)); toggle(g, 'cu-lit', lit.has(g.dataset.id)); }); svg.querySelectorAll('.cu-dlink').forEach(l => toggle(l, 'cu-on', now.has(l.dataset.a) || now.has(l.dataset.b))); },
      toMermaid: () => ['flowchart LR', ...Nd.map(n => `  subgraph ${mid(n.id)}["${n.name}"]\n${(n.children || []).map(k => `    ${mid(k.id)}["${k.name}"]`).join('\n') || `    ${mid(n.id)}_x[" "]`}\n  end`), ...(spec.links || []).map(([a, b, l]) => `  ${mid(a)} ---${l ? `|${l}|` : ''} ${mid(b)}`)].join('\n'),
    };
  }

  // ---------------------------------------------------------------- timing diagram
  function timing(el, spec, opts) {
    const L = spec.lifelines, T = spec.until, W = opts.width || 360, lx = 118, rx = W - 12, X = t => lx + (rx - lx) * t / T;
    let y = 22; const rowsY = L.map(l => { const top = y; y += l.states.length * 14 + 16; return top; }), H = y + 18;
    const lvl = (l, s, top) => top + 8 + (l.states.length - 1 - l.states.indexOf(s)) * 14;
    const wave = (l, i) => { const ch = spec.changes.filter(c => c.life === l.id).sort((a, b) => a.t - b.t), top = rowsY[i], pts = [];
      ch.forEach((c, k) => { const yy = lvl(l, c.state, top); if (k) pts.push([X(c.t), pts.at(-1)[1]]); pts.push([X(c.t), yy]); }); if (pts.length) pts.push([X(T), pts.at(-1)[1]]);
      return `<g class="cu-node cu-tl" data-id="${esc(l.id)}" tabindex="0" role="button" aria-label="${esc(l.name)}"><rect class="cu-trow" x="0" y="${top - 3}" width="${W}" height="${l.states.length * 14 + 10}"/><text class="cu-tname" x="4" y="${top + l.states.length * 7 + 1}">${esc(l.name)}</text>`
        + l.states.map(s => `<text class="cu-tstate" data-state="${esc(s)}" x="${lx - 4}" y="${lvl(l, s, top)}">${esc(s)}</text>`).join('') + (pts.length ? `<path class="cu-wave" d="${dPath(pts)}"/>` : '') + `<title>${esc(l.name)}</title></g>`; };
    const marks = (spec.marks || []).map(m => `<g class="cu-mark"><line x1="${X(m.t)}" x2="${X(m.t)}" y1="14" y2="${H - 16}"/><text x="${X(m.t)}" y="8">${esc(m.label)}</text></g>`).join('');
    const axis = `<g class="cu-axis"><line x1="${lx}" x2="${rx}" y1="${H - 14}" y2="${H - 14}"/>${[0, 0.25, 0.5, 0.75, 1].map(k => `<text x="${X(T * k)}" y="${H - 5}">${+(T * k).toFixed(1)}${k === 1 && spec.unit ? ' ' + esc(spec.unit) : ''}</text>`).join('')}</g>`;
    el.innerHTML = svgWrap('cu-timing', W, H, spec.title || '时间图', opts.uid, `${L.map(wave).join('')}${marks}${axis}<line class="cu-cursor" x1="${lx}" x2="${lx}" y1="14" y2="${H - 14}"/>`);
    const svg = el.firstChild, cursor = svg.querySelector('.cu-cursor');
    const at = (l, t) => { const ch = spec.changes.filter(c => c.life === l.id && c.t <= t).sort((a, b) => a.t - b.t); return ch.length ? ch.at(-1).state : null; };
    return {
      svg, width: W, height: H, ids: () => L.map(l => l.id), box: id => { const i = L.findIndex(l => l.id === id); return i < 0 ? null : {x: 0, y: rowsY[i] - 3, w: rx, h: L[i].states.length * 14 + 10}; },
      stateAt: t => Object.fromEntries(L.map(l => [l.id, at(l, t)])),
      paint(state = {}) {
        const t = state.t === undefined || state.t === null ? null : Math.max(0, Math.min(T, state.t)), now = setOf(state.now);
        toggle(cursor, 'on', t !== null); if (t !== null) { cursor.setAttribute('x1', X(t)); cursor.setAttribute('x2', X(t)); }
        svg.querySelectorAll('.cu-tl').forEach(g => { const l = L.find(x => x.id === g.dataset.id), s = t === null ? null : at(l, t); g.querySelectorAll('.cu-tstate').forEach(e => toggle(e, 'cu-now', e.dataset.state === s)); toggle(g, 'cu-now', now.has(l.id)); });
      },
      toMermaid: () => null,
    };
  }

  // ---------------------------------------------------------------- decision table (HTML, not SVG)
  function table(el, spec) {
    const C = spec.conditions, Rs = spec.results, Ru = spec.rules;
    // the filter's words follow the language of the table itself
    const zh = /[㐀-鿿]/.test(JSON.stringify([C, Rs])), ANY = zh ? '任意' : 'Any', IF = zh ? '如果' : 'If', THEN = zh ? '那么' : 'Then';
    // read as "if these conditions, then these results": the two groups are labelled and split by an arrow column;
    // a condition's value is a tag; a result the same in every rule is greyed (it does not tell the rules apart)
    const same = new Set(Rs.filter(x => Ru.length > 1 && Ru.every(r => (r.then[x.id] ?? '') === (Ru[0].then[x.id] ?? ''))).map(x => x.id));
    // choosing a value lights the rules it leads to: tags above the table, only when there are enough rules to sort
    const filters = Ru.length >= 3 ? C.filter(c => (c.values || []).length > 1) : [];
    el.innerHTML = `<div class="cu cu-table" role="group" aria-label="${esc(spec.title || (zh ? '决策表' : 'Decision table'))}">`
      + (filters.length ? `<div class="cu-tfilters">${filters.map(c => `<div class="cu-tfilter" data-cond="${esc(c.id)}"><span>${esc(c.name)}</span>${['', ...c.values].map(v => `<button type="button" data-v="${esc(v)}">${esc(v || ANY)}</button>`).join('')}</div>`).join('')}</div>` : '')
      + `<table><thead><tr class="cu-tgroup"><th class="cu-cond" colspan="${C.length}">${IF}</th><th class="cu-arrow"></th><th class="cu-res" colspan="${Rs.length}">${THEN}</th></tr>`
      + `<tr>${C.map(c => `<th class="cu-cond">${esc(c.name)}</th>`).join('')}<th class="cu-arrow"></th>${Rs.map(r => `<th class="cu-res">${esc(r.name)}</th>`).join('')}</tr></thead>`
      + `<tbody>${Ru.map(r => `<tr data-id="${esc(r.id)}" tabindex="0">${C.map(c => r.when[c.id] == null || r.when[c.id] === '—' ? `<td class="cu-if cu-any">${ANY}</td>` : `<td class="cu-if"><span class="cu-val${textW(r.when[c.id], 12.5) <= 150 ? ' cu-short' : ''}">${esc(r.when[c.id])}</span></td>`).join('')}<td class="cu-arrow">→</td>${Rs.map(x => `<td class="cu-then${same.has(x.id) ? ' cu-same' : ''}">${esc(r.then[x.id] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    const root = el.firstChild;
    // a rule matches when every chosen condition equals its value, or the rule does not care ('—')
    const match = when => Ru.filter(r => Object.entries(when || {}).every(([k, v]) => !v || r.when[k] === undefined || r.when[k] === v));
    let chosen = {};
    const self = {
      svg: root, width: 0, height: 0, ids: () => Ru.map(r => r.id), box: () => null, match,
      paint(state = {}) {
        const when = chosen = state.when || {}, hits = new Set(match(when).map(r => r.id)), any = Object.values(when).some(v => v);
        // a paragraph about every rule at once marks none: marking them all would say nothing
        const now = setOf(state.now), all = Ru.length > 1 && Ru.every(r => now.has(r.id));
        root.querySelectorAll('.cu-tfilter').forEach(f => f.querySelectorAll('button').forEach(b => toggle(b, 'on', (when[f.dataset.cond] || '') === b.dataset.v)));
        root.querySelectorAll('tbody tr').forEach(tr => { toggle(tr, 'cu-now', (!all && now.has(tr.dataset.id)) || (any && hits.has(tr.dataset.id) && hits.size === 1)); toggle(tr, 'cu-off', any && !hits.has(tr.dataset.id)); });
      },
      toMermaid: () => null,
      toMarkdown: () => [`| ${[...C.map(c => c.name), ...Rs.map(r => r.name)].join(' | ')} |`, `|${[...C, ...Rs].map(() => '---').join('|')}|`, ...Ru.map(r => `| ${[...C.map(c => r.when[c.id] ?? '—'), ...Rs.map(x => r.then[x.id] ?? '')].join(' | ')} |`)].join('\n'),
    };
    root.addEventListener('click', e => { const b = e.target.closest('.cu-tfilter button'); if (!b) return; const when = {...chosen, [b.closest('.cu-tfilter').dataset.cond]: b.dataset.v}; self.paint({when}); root.dispatchEvent(new CustomEvent('cu-filter', {detail: {when, rules: match(when).map(r => r.id)}})); });
    return self;
  }

  // ---------------------------------------------------------------- constraint notes, on any SVG diagram
  // A note sits in a column right of the diagram, at the height of what it constrains, tied to each element by an
  // orthogonal dashed line. It lights up whenever one of its elements is in the state.
  function addNotes(d, notes, opts) {
    if (!notes || !notes.length || !d.box) return;
    const svg = d.svg, [, , W, H] = svg.getAttribute('viewBox').split(' ').map(Number), nw = opts.noteW || 150, x = W + 18, size = 10.5;
    const items = notes.map(n => { const bs = n.on.map(id => d.box(id)).filter(Boolean); return {n, bs, cy: bs.length ? bs.reduce((s, b) => s + b.y + b.h / 2, 0) / bs.length : 0}; }).sort((a, b) => a.cy - b.cy);
    // notes that would overlap form a block centred on the mean height of their elements, so a crowd of notes stays
    // around what it explains instead of drifting down; blocks that then overlap merge in turn
    const gap = 6, blocks = [];
    items.forEach(it => { it.ls = wrap(it.n.text, size, nw - 14).slice(0, 5); it.h = it.ls.length * (size + 3) + 10; });
    for (const it of items) {
      blocks.push({its: [it], h: it.h, c: it.cy});
      while (blocks.length > 1) {
        const [p, q] = blocks.slice(-2), place = b => Math.max(4, b.c - b.h / 2);
        if (place(p) + p.h + gap <= place(q)) break;
        const its = [...p.its, ...q.its], h = its.reduce((s, x) => s + x.h, 0) + gap * (its.length - 1);
        blocks.splice(-2, 2, {its, h, c: its.reduce((s, x) => s + x.cy, 0) / its.length});
      }
    }
    blocks.forEach(b => { let t = Math.max(4, b.c - b.h / 2); b.its.forEach(it => { it.top = t; t += it.h + gap; }); });
    let y = 4; const out = [];
    for (const {n, bs, ls, h, top} of items) {
      y = top + h + gap;
      out.push(`<g class="cu-note" data-id="${esc(n.id)}" data-on="${esc(n.on.join(' '))}" tabindex="0" role="button" aria-label="${esc(n.text)}">`
        + bs.map(b => { const ex = b.x + b.w + 1, ey = b.y + b.h / 2, vx = W + 8; return `<path class="cu-anchor" d="M${ex},${ey} H${vx} V${top + h / 2} H${x}"/>`; }).join('')
        + `<path class="cu-paper" d="M${x},${top} h${nw - 9} l9,9 v${h - 9} h-${nw} z"/><path class="cu-fold" d="M${x + nw - 9},${top} v9 h9"/>${ls.map((t, k) => `<text x="${x + 7}" y="${top + 11 + k * (size + 3)}">${esc(t)}</text>`).join('')}<title>${esc(n.text)}</title></g>`);
    }
    const W2 = x + nw + 4, H2 = Math.max(H, y);
    svg.setAttribute('viewBox', `0 0 ${W2} ${H2}`); svg.setAttribute('width', W2);
    svg.querySelector('.cu-token').insertAdjacentHTML('beforebegin', `<g class="cu-notes">${out.join('')}</g>`);
    const paint = d.paint;
    d.paint = (state = {}) => { paint(state); const hot = setOf([].concat(state.now || [], state.via ? [state.via] : [], state.blocked ? [state.blocked] : []));
      svg.querySelectorAll('.cu-note').forEach(g => toggle(g, 'cu-now', hot.has(g.dataset.id) || g.dataset.on.split(' ').some(i => hot.has(i)))); };
  }

  // ---------------------------------------------------------------- grids: a story map, a service blueprint, a matrix
  // (painted alike: an element is current or lit when it, or what holds it, is named in now or lit; when anything is,
  // the rest fades)
  const gridPaint = (svg, parentOf) => (state = {}) => {
    const now = setOf(state.now), lit = setOf(state.lit), up = setOf(state.upto ? [state.upto, String(state.upto).replace(/-\d+$/, '')] : []), any = now.size || lit.size || up.size;
    const hit = (S, id) => [id, ...(parentOf(id) || [])].some(x => S.has(x));
    svg.querySelectorAll('[data-id],[data-for],[data-col]').forEach(g => { const id = g.dataset.id || g.dataset.for || g.dataset.col, n = hit(now, id) || hit(up, id), l = hit(lit, id) || (g.dataset.row && (now.has(g.dataset.row) || lit.has(g.dataset.row)));
      toggle(g, 'cu-now', n); toggle(g, 'cu-lit', l || n); toggle(g, 'cu-off', any && !n && !l); });
  };

  // the story map (Patton), turned for a narrow panel: a band per kind, a row per scenario, its phases from left to right
  function storymap(el, spec, opts) {
    const size = 11, W0 = opts.width || 420, maxP = Math.max(1, ...spec.kinds.flatMap(k => k.scs.map(c => c.phases.length)));
    const Lw = Math.min(150, Math.round(W0 * 0.3)), gap = 12, pw = Math.max(76, Math.floor((W0 - Lw - 18 - gap * (maxP - 1)) / maxP)), W = Math.max(W0, Lw + 18 + maxP * pw + (maxP - 1) * gap), h = 38;
    const parent = new Map(); let y = 6; const out = [];
    for (const k of spec.kinds) {
      out.push(`<g class="cu-node cu-smk" data-id="${esc(k.id)}"><rect x="4" y="${y}" width="${W - 8}" height="20" rx="5"/><text x="12" y="${y + 14}">${esc(k.name)}</text></g>`); y += 26;
      for (const c of k.scs) {
        parent.set(c.id, [k.id]);
        out.push(`<g class="cu-node cu-smc" data-id="${esc(c.id)}" tabindex="0" role="button"><rect x="6" y="${y}" width="${Lw}" height="${h}" rx="6"/>${lines(c.name, 6 + Lw / 2, y + h / 2 + 4, size, Lw - 10)}<title>${esc(c.name)}${c.actor ? ' · ' + esc(c.actor) : ''}</title></g>`);
        c.phases.forEach((ph, j) => { const x = Lw + 18 + j * (pw + gap); parent.set(ph.id, [c.id, k.id]);
          if (j) out.push(`<path class="cu-smar" d="M${x - gap + 2},${y + h / 2} L${x - 2},${y + h / 2}" marker-end="url(#cu-ah-${opts.uid})"/>`);
          out.push(`<g class="cu-node cu-smp${ph.bad ? ' cu-bad' : ''}" data-id="${esc(ph.id)}"><rect x="${x}" y="${y}" width="${pw}" height="${h}" rx="5"/>${lines(ph.name, x + pw / 2, y + h / 2 + 4, size - 0.5, pw - 8)}<title>${esc(ph.name)}</title></g>`); });
        y += h + 6;
      }
      y += 6;
    }
    el.innerHTML = svgWrap('cu-grid cu-smap', W, y, spec.title || '故事地图', opts.uid, out.join(''));
    const svg = el.firstChild;
    return {svg, width: W, height: y, ids: () => [...parent.keys()], box: id => { const g = svg.querySelector(`[data-id="${CSS.escape(id)}"] rect`); return g ? {x: +g.getAttribute('x'), y: +g.getAttribute('y'), w: +g.getAttribute('width'), h: +g.getAttribute('height')} : null; },
      paint: gridPaint(svg, id => parent.get(id)), toMermaid: () => ''};
  }

  // the service blueprint (Shostack): the phases across; in lanes the actor, what they see, what runs out of their sight,
  // the outside systems; the line of visibility between
  function blueprint(el, spec, opts) {
    const size = 11, W0 = opts.width || 420, n = Math.max(1, spec.cols.length), Lw = 62, cw = Math.max(92, Math.floor((W0 - Lw - 8) / n)), W = Math.max(W0, Lw + 8 + n * cw), hh = 40;
    const out = [], x0 = j => Lw + 4 + j * cw;
    let y = hh + 6;
    const rows = spec.lanes.map(l => { if (l.line) { const r = {line: l.line, y}; y += 12; return r; }
      const ht = Math.max(30, 8 + Math.max(...l.cells.map(c => c.reduce((a, t) => a + (t.id ? 24 : 16 * Math.min(4, wrap(t.name, size - 1, cw - 12).length) + 4), 0)))); const r = {l, y, ht}; y += ht; return r; });
    out.push(...spec.cols.map((c, j) => `<rect class="cu-bpcol" data-col="${esc(c.id)}" x="${x0(j)}" y="2" width="${cw - 4}" height="${y}" rx="6"/>`));
    out.push(...spec.cols.map((c, j) => `<g class="cu-node cu-bph" data-id="${esc(c.id)}" tabindex="0" role="button"><rect x="${x0(j) + 2}" y="4" width="${cw - 8}" height="${hh - 4}" rx="5"/>${lines(`${j + 1} ${c.name}`, x0(j) + cw / 2 - 2, 4 + hh / 2, size, cw - 14)}<title>${esc(c.name)}</title></g>`));
    for (const r of rows) {
      if (r.line) { out.push(`<line class="cu-bpvis" x1="4" y1="${r.y + 6}" x2="${W - 4}" y2="${r.y + 6}"/><text class="cu-bpvl" x="${W - 6}" y="${r.y + 3}">${esc(r.line)}</text>`); continue; }
      out.push(`<line class="cu-bpsep" x1="4" y1="${r.y + r.ht}" x2="${W - 4}" y2="${r.y + r.ht}"/>${lines(r.l.name, Lw / 2, r.y + r.ht / 2 + 4, size - 0.5, Lw - 6, 3).replace(/<text /g, '<text class="cu-bpln" ')}`);
      r.l.cells.forEach((c, j) => { let yy = r.y + 5;
        for (const t of c) {
          if (t.id) { out.push(`<g class="cu-node cu-bpm" data-id="${esc(t.id)}" data-row="${esc(spec.cols[j].id)}"><rect x="${x0(j) + 4}" y="${yy}" width="${cw - 12}" height="20" rx="10"/>${lines(t.name, x0(j) + cw / 2 - 2, yy + 14, size - 1, cw - 18, 1)}<title>${esc(t.name)}</title></g>`); yy += 24; }
          else { const ls = wrap(t.name, size - 1, cw - 12).slice(0, 4); out.push(`<g class="cu-bpt${t.bad ? ' cu-bad' : ''}" data-for="${esc(spec.cols[j].id)}">${ls.map((s2, k) => `<text x="${x0(j) + 6}" y="${yy + 11 + k * 15}">${esc(s2)}</text>`).join('')}<title>${esc(t.name)}</title></g>`); yy += ls.length * 15 + 4; }
        } });
    }
    el.innerHTML = svgWrap('cu-grid cu-bp', W, y + 4, spec.title || '服务蓝图', opts.uid, out.join(''));
    const svg = el.firstChild;
    return {svg, width: W, height: y + 4, ids: () => spec.cols.map(c => c.id), box: () => null, paint: gridPaint(svg, () => null), toMermaid: () => ''};
  }

  // a matrix: rows (features) against columns (scenarios); a cell names where the row takes part in the column
  function matrixView(el, spec, opts) {
    const size = 10.5, W0 = opts.width || 420, nc = Math.max(1, spec.cols.length), Lw = Math.min(170, Math.round(W0 * 0.4)), room = Math.floor((W0 - Lw - 8) / nc), long = Math.max(...spec.cols.map(c => textW(c.name, size)));
    const flat = nc <= 8 && room >= long + 12, cs = flat ? Math.min(room, long + 24, 120) : Math.max(16, Math.min(26, room)), W = Math.max(W0, Lw + 8 + nc * cs);
    const hh = flat ? 26 : Math.min(120, Math.max(40, long + 14)), rh = 18, H = hh + spec.rows.length * rh + 8;
    const cut = (t, w) => { let s2 = ''; for (const ch of String(t)) { if (textW(s2 + ch + '…', size) > w) return s2 + '…'; s2 += ch; } return s2; };
    const out = [];
    spec.cols.forEach((c, j) => { const x = Lw + 4 + j * cs;
      out.push(`<rect class="cu-mxcol" data-col="${esc(c.id)}" x="${x}" y="${hh}" width="${cs}" height="${spec.rows.length * rh}"/>`);
      out.push(`<g class="cu-node cu-mxh${flat ? ' cu-flat' : ''}" data-id="${esc(c.id)}" tabindex="0" role="button"><rect x="${x}" y="2" width="${cs}" height="${hh - 4}" rx="3"/>${flat ? `<text x="${x + cs / 2}" y="${hh / 2}">${esc(c.name)}</text>` : `<text transform="translate(${x + cs / 2 + 4},${hh - 6}) rotate(-90)">${esc(cut(c.name, hh - 12))}</text>`}<title>${esc(c.name)}</title></g>`); });
    spec.rows.forEach((r, i) => { const y = hh + i * rh;
      out.push(`<g class="cu-node cu-mxr" data-id="${esc(r.id)}" tabindex="0" role="button"${r.color ? ` style="--cu-c:${esc(cc(r.color))}"` : ''}><rect x="2" y="${y}" width="${W - 4}" height="${rh}" rx="3"/>${r.color ? `<circle cx="10" cy="${y + rh / 2}" r="3.5" style="fill:${esc(cc(r.color))}"/>` : ''}<text x="18" y="${y + rh / 2 + 4}">${esc(cut(r.name, Lw - 22))}</text><title>${esc(r.name)}</title></g>`);
      spec.cols.forEach((c, j) => { const t = spec.cell[r.id]?.[c.id]; if (!t) return; const x = Lw + 4 + j * cs;
        out.push(`<g class="cu-mxc" data-for="${esc(c.id)}" data-row="${esc(r.id)}"><rect x="${x + 2}" y="${y + 2}" width="${cs - 4}" height="${rh - 4}" rx="3"/><text x="${x + cs / 2}" y="${y + rh / 2 + 3.5}">${esc(t)}</text><title>${esc(r.name)} · ${esc(c.name)}：${/^\d+$/.test(t) ? `第 ${esc(t)} 阶段` : esc(t)}</title></g>`); }); });
    el.innerHTML = svgWrap('cu-grid cu-mx', W, H, spec.title || '矩阵', opts.uid, out.join(''));
    const svg = el.firstChild;
    return {svg, width: W, height: H, ids: () => [...spec.rows, ...spec.cols].map(x => x.id), box: () => null, paint: gridPaint(svg, () => null), toMermaid: () => ''};
  }

  // a trace: what uses the middle column (left: the steps, under their use case and its kind) and what carries it out
  // (right); links between columns, a link's weight its width. Painting an element lights it, its links and the
  // elements at their other ends; the rest fades
  function trace(el, spec, opts) {
    const size = 11, W = Math.max(560, opts.width || 620), top = 26, gx = 34;
    const wL = Math.round((W - 2 * gx) * 0.42), wM = Math.round((W - 2 * gx) * 0.32), wR = W - 2 * gx - wL - wM - 4, xL = 2, xM = xL + wL + gx, xR = xM + wM + gx;
    const cut = (t, w, sz = size) => { let s2 = ''; for (const ch of String(t)) { if (textW(s2 + ch + '…', sz) > w) return s2 + '…'; s2 += ch; } return s2; };
    const L = spec.left || [], M = spec.mid || [], R = spec.right || [];
    const hL = L.length * 19, hM = M.length * 30, hR = R.length * 38, H = top + Math.max(hL, hM, hR, 60) + 6;
    const at = (h, i, step) => top + (H - top - 6 - h) / 2 + i * step + step / 2, y = new Map(), out = [];
    L.forEach((r, i) => { const yy = at(hL, i, 19); if (r.id) y.set(r.id, yy);
      if (r.kind) out.push(`<text class="cu-trk" x="${xL}" y="${yy + 4}">${esc(cut(r.kind, wL))}</text>`);
      else if (r.case) out.push(`<g class="cu-node cu-trc" data-id="${esc(r.case)}" tabindex="0" role="button"><text x="${xL + 8}" y="${yy + 4}">${esc(cut(r.name, wL - 8))}</text><title>${esc(r.name)}</title></g>`);
      else out.push(`<g class="cu-node cu-trs" data-id="${esc(r.id)}" data-up="${esc(r.up || '')}" tabindex="0" role="button"><rect x="${xL + 16}" y="${yy - 8}" width="${wL - 16}" height="16" rx="3"/><text x="${xL + 22}" y="${yy + 4}">${esc(cut((r.n ? r.n + '　' : '') + r.name, wL - 26, size - 0.5))}</text><title>${esc(r.title || r.name)}</title></g>`); });
    M.forEach((m, i) => { const yy = at(hM, i, 30); y.set(m.id, yy);
      out.push(`<g class="cu-node cu-trm${m.alone ? ' cu-alone' : ''}" data-id="${esc(m.id)}" tabindex="0" role="button"${m.color ? ` style="--cu-c:${esc(cc(m.color))}"` : ''}><rect x="${xM}" y="${yy - 11}" width="${wM}" height="22" rx="11"/><text x="${xM + 10}" y="${yy + 4}">${esc(cut(m.name, wM - 16))}</text><title>${esc(m.say || m.name)}</title></g>`); });
    R.forEach((m, i) => { const yy = at(hR, i, 38); y.set(m.id, yy);
      out.push(`<g class="cu-node cu-trr" data-id="${esc(m.id)}" tabindex="0" role="button"${m.color ? ` style="--cu-c:${esc(cc(m.color))}"` : ''}><rect x="${xR}" y="${yy - 14}" width="${wR}" height="28" rx="5"/><text x="${xR + 8}" y="${yy + 4}">${esc(cut(m.name, wR - 12))}</text><title>${esc(m.name)}</title></g>`); });
    const xOf = id => L.some(r => r.id === id) ? [xL + wL, 'l'] : M.some(r => r.id === id) ? [xM, 'm'] : [xR, 'r'];
    const curve = (xa, ya, xb, yb) => `M${xa},${ya} C${(xa + xb) / 2},${ya} ${(xa + xb) / 2},${yb} ${xb},${yb}`;
    const ls = (spec.links || []).filter(([a, b]) => y.has(a) && y.has(b)).map(([a, b, w = 1]) => { const [x1, ca] = xOf(a), [x2] = xOf(b), xa = ca === 'm' ? xM + wM : x1;
      return `<path class="cu-trl" data-a="${esc(a)}" data-b="${esc(b)}" style="stroke-width:${(0.8 + 2.2 * Math.min(1, w)).toFixed(2)}" d="${curve(xa, y.get(a), x2, y.get(b))}"/>`; });
    const heads = (spec.heads || []).map((h, i) => `<text class="cu-trh" x="${[xL, xM, xR][i]}" y="14">${esc(h)}</text>`);
    el.innerHTML = svgWrap('cu-grid cu-trace', W, H, spec.title || '追踪图', opts.uid, heads.join('') + '<g>' + ls.join('') + '</g>' + out.join(''));
    const svg = el.firstChild, links = [...svg.querySelectorAll('.cu-trl')];
    const paint = (state = {}) => {
      const N = setOf([].concat(state.now || [], state.lit || [])), on = new Set(N);
      links.forEach(l => { const k = N.has(l.dataset.a) || N.has(l.dataset.b); toggle(l, 'cu-on', k); toggle(l, 'cu-off', N.size && !k); if (k) { on.add(l.dataset.a); on.add(l.dataset.b); } });
      svg.querySelectorAll('.cu-trs').forEach(g => { if (on.has(g.dataset.id)) on.add(g.dataset.up); });
      svg.querySelectorAll('.cu-node').forEach(g => { const id = g.dataset.id; toggle(g, 'cu-now', N.has(id)); toggle(g, 'cu-lit', on.has(id) && !N.has(id)); toggle(g, 'cu-off', N.size && !on.has(id)); });
    };
    return {svg, width: W, height: H, ids: () => [...y.keys()], box: id => { const g = svg.querySelector(`[data-id="${CSS.escape(id)}"] rect`); return g ? {x: +g.getAttribute('x'), y: +g.getAttribute('y'), w: +g.getAttribute('width'), h: +g.getAttribute('height')} : null; },
      paint, toMermaid: () => ''};
  }

  // what one thing is related to (a one-hop neighbourhood): in the middle the thing and the things of its own kind it
  // relates to, each relation an arrow with its verb; on the left what uses it (under group headings), on the right what
  // holds it. Painting lights the named items, the arrows and links at them and the far ends; nothing fades
  //   {center, heads?, left: [{group}|{id, name}], mid: {nodes: [{id, name, color?, say?}], edges: [[from, to, label]]}, right: [{id, name, color?}], links: [[a, b]]}
  function related(el, spec, opts) {
    const size = 11, W = Math.max(560, opts.width || 620), top = 26, gx = 30;
    const wL = Math.round((W - 2 * gx) * 0.27), wR = Math.round((W - 2 * gx) * 0.2), wM = W - 2 * gx - wL - wR - 4, xL = 2, xM = xL + wL + gx, xR = xM + wM + gx;
    const cut = (t, w, sz = size) => { let s2 = ''; for (const ch of String(t)) { if (textW(s2 + ch + '…', sz) > w) return s2 + '…'; s2 += ch; } return s2; };
    const L = spec.left || [], N = spec.mid?.nodes || [], R = spec.right || [], C = N.find(n => n.id === spec.center) || N[0], O = N.filter(n => n !== C);
    // the middle: the thing at the centre, the others on an ellipse around it (the first at the top, then clockwise)
    const ry = Math.max(80, Math.min(160, 28 * O.length)), rx = wM / 2 - 56, hM = 2 * ry + 60, hL = L.length * 19, hR = R.length * 34;
    const H = top + Math.max(hL, hM, hR, 80) + 6, cx = xM + wM / 2, cy = top + (H - top - 6) / 2, P = new Map();
    const box = (n, x, y) => { const w = Math.min(wM / 2.4, textW(n.name, size + 0.5) + 22); P.set(n.id, {x, y, w, h: n === C ? 30 : 24}); };
    if (C) box(C, cx, cy); O.forEach((n, i) => { const a = -Math.PI / 2 + 2 * Math.PI * i / O.length; box(n, cx + rx * Math.cos(a), cy + ry * Math.sin(a)); });
    const at = (h, i, step) => top + (H - top - 6 - h) / 2 + i * step + step / 2, out = [];
    L.forEach((r, i) => { const yy = at(hL, i, 19);
      if (r.group) out.push(`<text class="cu-trk" x="${xL}" y="${yy + 4}">${esc(cut(r.group, wL))}</text>`);
      else { P.set(r.id, {x: xL + 8 + (wL - 8) / 2, y: yy, w: wL - 8, h: 16, side: 'l'});
        out.push(`<g class="cu-node cu-trs" data-id="${esc(r.id)}" tabindex="0" role="button"><rect x="${xL + 8}" y="${yy - 8}" width="${wL - 8}" height="16" rx="3"/><text x="${xL + 14}" y="${yy + 4}">${esc(cut(r.name, wL - 18, size - 0.5))}</text><title>${esc(r.title || r.name)}</title></g>`); } });
    R.forEach((m, i) => { const yy = at(hR, i, 34); P.set(m.id, {x: xR + wR / 2, y: yy, w: wR, h: 26, side: 'r'});
      out.push(`<g class="cu-node cu-trr" data-id="${esc(m.id)}" tabindex="0" role="button"${m.color ? ` style="--cu-c:${esc(cc(m.color))}"` : ''}><rect x="${xR}" y="${yy - 13}" width="${wR}" height="26" rx="5"/><text x="${xR + 8}" y="${yy + 4}">${esc(cut(m.name, wR - 12))}</text><title>${esc(m.name)}</title></g>`); });
    for (const n of N) { const b = P.get(n.id);
      out.push(`<g class="cu-node cu-rlm${n === C ? ' cu-rlc' : ''}" data-id="${esc(n.id)}" tabindex="0" role="button"${n.color ? ` style="--cu-c:${esc(cc(n.color))}"` : ''}><rect x="${(b.x - b.w / 2).toFixed(1)}" y="${(b.y - b.h / 2).toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h}" rx="${b.h / 2}"/><text x="${b.x.toFixed(1)}" y="${(b.y + 4).toFixed(1)}">${esc(cut(n.name, b.w - 12, size + 0.5))}</text><title>${esc(n.say || n.name)}</title></g>`); }
    // an arrow from the edge of one box to the edge of the other, its verb at the middle
    const rim = (b, dx, dy) => { const k = Math.min(b.w / 2 / Math.abs(dx || 1e-9), b.h / 2 / Math.abs(dy || 1e-9)); return [b.x + dx * k, b.y + dy * k]; };
    const arrows = (spec.mid?.edges || []).filter(([a, b]) => P.has(a) && P.has(b)).map(([a, b, label], i) => { const A = P.get(a), B = P.get(b), dx = B.x - A.x, dy = B.y - A.y;
      const [x1, y1] = rim(A, dx, dy), [x2, y2] = rim(B, -dx, -dy), k = a === spec.center ? 0.62 : b === spec.center ? 0.38 : 0.5, mx = x1 + (x2 - x1) * k, my = y1 + (y2 - y1) * k, lw = textW(label || '', 10) + 8;
      return `<g class="cu-rle" data-a="${esc(a)}" data-b="${esc(b)}"><line class="cu-trl" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" marker-end="url(#cu-ah-${opts.uid})"/>${label ? `<rect class="cu-rlb" x="${(mx - lw / 2).toFixed(1)}" y="${(my - 7).toFixed(1)}" width="${lw.toFixed(1)}" height="14" rx="3"/><text class="cu-rlt" x="${mx.toFixed(1)}" y="${(my + 3.5).toFixed(1)}">${esc(label)}</text>` : ''}</g>`; });
    const curve = (xa, ya, xb, yb) => `M${xa},${ya} C${(xa + xb) / 2},${ya} ${(xa + xb) / 2},${yb} ${xb},${yb}`;
    const ls = (spec.links || []).filter(([a, b]) => P.has(a) && P.has(b)).map(([a, b]) => { let A = P.get(a), B = P.get(b); if (A.side === 'r' || B.side === 'l') [A, B] = [B, A];
      return `<path class="cu-trl cu-rll" data-a="${esc(a)}" data-b="${esc(b)}" d="${curve(A.x + A.w / 2, A.y, B.x - B.w / 2, B.y)}"/>`; });
    const heads = (spec.heads || []).map((h, i) => `<text class="cu-trh" x="${[xL, xM, xR][i]}" y="14">${esc(h)}</text>`);
    el.innerHTML = svgWrap('cu-grid cu-trace cu-related', W, H, spec.title || '关系图', opts.uid, heads.join('') + '<g>' + ls.join('') + '</g>' + arrows.join('') + out.join(''));
    const svg = el.firstChild;
    const paint = (state = {}) => {
      const S = setOf([].concat(state.now || [], state.lit || [])), on = new Set(S);
      svg.querySelectorAll('[data-a]').forEach(l => { const k = S.has(l.dataset.a) || S.has(l.dataset.b); toggle(l, 'cu-on', k); if (k) { on.add(l.dataset.a); on.add(l.dataset.b); } });
      svg.querySelectorAll('.cu-node').forEach(g => { const id = g.dataset.id; toggle(g, 'cu-now', S.has(id)); toggle(g, 'cu-lit', on.has(id) && !S.has(id)); });
    };
    return {svg, width: W, height: H, ids: () => [...P.keys()], box: id => { const b = P.get(id); return b ? {x: b.x - b.w / 2, y: b.y - b.h / 2, w: b.w, h: b.h} : null; }, paint, toMermaid: () => ''};
  }

  const KINDS = {sequence, communication, component, package: packageView, class: classView, state: stateView, activity, overview: activity, usecase, deployment, timing, table, storymap, blueprint, matrix: matrixView, trace, related};
  let uid = 0;
  function render(el, spec, opts = {}) {
    if (!KINDS[spec.type]) throw new Error('cw-uml: unknown diagram type ' + spec.type);
    try { FONT = getComputedStyle(el).fontFamily || FONT; } catch {}
    const ev = emitter(), d = KINDS[spec.type](el, spec, {...opts, uid: ++uid});
    // zoom: the drawing is laid out for width / zoom and shown zoom times larger, so text, lines and gaps grow together
    // (the host's body text is larger than cw-uml's 10.5–12 px); the sticky copy of the heads grows with it
    if (opts.zoom && opts.zoom !== 1) el.querySelectorAll('svg[viewBox]').forEach(s => { const w = s.viewBox.baseVal?.width; if (w) s.setAttribute('width', String(Math.round(w * opts.zoom))); });
    addNotes(d, spec.notes, opts);
    const labels = [...d.svg.querySelectorAll('.cu-elabel[data-for]')].map(l => [l, d.svg.querySelector(`[data-id="${CSS.escape(l.dataset.for)}"]`)]);
    if (labels.length) { const paint = d.paint; d.paint = (state = {}) => { paint(state); labels.forEach(([l, e]) => ['cu-now', 'cu-lit', 'cu-off'].forEach(c => toggle(l, c, e && e.classList.contains(c)))); }; }
    { // an element that becomes current flashes once, so the eye finds what the text just moved to
      const paint = d.paint, timers = new Map();
      d.paint = (state = {}) => {
        const was = new Set([...d.svg.querySelectorAll('.cu-now[data-id]')].map(g => g.dataset.id));
        paint(state);
        if (reduced()) return;
        d.svg.querySelectorAll('.cu-now[data-id]').forEach(g => { if (was.has(g.dataset.id)) return; g.classList.remove('cu-flash'); void g.getBoundingClientRect(); g.classList.add('cu-flash'); clearTimeout(timers.get(g)); timers.set(g, setTimeout(() => g.classList.remove('cu-flash'), 1000)); });
      };
    }
    let picked = null, hovered = null;
    // a picked node shows its neighbourhood: the edges at it and the nodes at their other ends stand out, the rest fades;
    // a picked edge shows its two ends. Kept through every repaint (the host paints as the reader moves on)
    const near = () => {
      const edges = [...d.svg.querySelectorAll('.cu-edge[data-a]')], e = picked && edges.find(g => g.dataset.id === picked);
      const at = picked ? edges.filter(g => e ? g === e : g.dataset.a === picked || g.dataset.b === picked) : [];
      const ends = new Set(at.flatMap(g => [g.dataset.a, g.dataset.b])), on = at.length > 0;
      edges.forEach(g => { toggle(g, 'cu-nbe', at.includes(g)); toggle(g, 'cu-dim', on && !at.includes(g)); });
      d.svg.querySelectorAll('.cu-node[data-id]').forEach(g => { const id = g.dataset.id; toggle(g, 'cu-nb', on && ends.has(id) && id !== picked); toggle(g, 'cu-dim', on && !ends.has(id) && id !== picked); });
      labels.forEach(([l, g]) => ['cu-nbe', 'cu-dim'].forEach(c => toggle(l, c, !!g && g.classList.contains(c))));
    };
    { const paint = d.paint; d.paint = (state = {}) => { paint(state); near(); }; }
    const mark = id => { d.svg.querySelectorAll('[data-id]').forEach(g => toggle(g, 'cu-picked', g.dataset.id === id)); near(); };
    const what = g => g.classList.contains('cu-msg') ? 'message' : g.classList.contains('cu-frag') ? 'fragment' : g.classList.contains('cu-note') ? 'note' : g.classList.contains('cu-edge') ? 'edge' : g.dataset.ref ? 'ref' : g.tagName === 'TR' ? 'rule' : 'element';
    const choose = g => { const id = g.dataset.id; picked = picked === id ? null : id; mark(picked); d.pickFocus?.(picked); ev.emit('select', picked, spec.type, what(g), picked ? g.dataset.ref || null : null); };
    const target = t => t.closest('[data-id]') || (t.closest('[data-for]') && d.svg.querySelector(`[data-id="${CSS.escape(t.closest('[data-for]').dataset.for)}"]`));
    d.svg.addEventListener('click', e => { if (e.target.closest('select')) return; const g = target(e.target); if (g) choose(g); });
    d.svg.addEventListener('keydown', e => { if (e.target.closest('select')) return; const g = e.target.closest('[data-id]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); choose(g); } });
    if (spec.type === 'table') d.svg.addEventListener('cu-filter', e => ev.emit('filter', e.detail));
    // hover: pointing at an element (or focusing it) is reported, so the host can mark where the text talks about it;
    // hover(ids) marks elements the host points at, for example a name in the text under the pointer
    const point = g => { const id = g ? g.dataset.id : null; if (id !== hovered) { hovered = id; ev.emit('hover', id, spec.type); } };
    d.svg.addEventListener('pointerover', e => point(target(e.target) || null));
    d.svg.addEventListener('pointerleave', () => point(null));
    d.svg.addEventListener('focusin', e => point(e.target.closest('[data-id]')));
    d.svg.addEventListener('focusout', () => point(null));
    const hover = ids => { const on = setOf(ids); d.svg.querySelectorAll('[data-id],[data-for]').forEach(g => toggle(g, 'cu-hover', on.has(g.dataset.id || g.dataset.for))); };
    return Object.assign(d, {on: ev.on, type: spec.type, hover, has: id => !!d.svg.querySelector(`[data-id="${CSS.escape(id)}"]`), select(id) { picked = id; mark(id); d.pickFocus?.(id); }});
  }

  // ---------------------------------------------------------------- a board: tabs over several diagrams
  function board(el, views, opts = {}) {
    const ev = emitter();
    el.classList.add('cu-board');
    el.innerHTML = `<div class="cu-tabs" role="tablist">${views.map(v => `<button type="button" role="tab" data-view="${esc(v.id)}">${esc(v.label)}</button>`).join('')}</div>${views.map(v => `<div class="cu-pane" data-pane="${esc(v.id)}" hidden></div>`).join('')}`;
    const D = {};
    let cur = null;
    const open = (id, byUser) => {
      if (!D[id]) return;
      if (cur !== id) { el.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.view === id))); el.querySelectorAll('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== id; }); const was = cur; cur = id; if (was) el.querySelector(`[data-pane="${CSS.escape(id)}"]`).animate?.([{opacity: 0}, {opacity: 1}], {duration: reduced() ? 0 : 220}); }
      ev.emit('tab', id, !!byUser);
    };
    for (const v of views) {
      const pane = el.querySelector(`[data-pane="${CSS.escape(v.id)}"]`);
      D[v.id] = render(pane, v.spec, {...opts, ...(v.opts || {})});
      // a selection is shared with the other views; choosing a 'ref' node of an overview opens the view it names
      D[v.id].on('select', (id, type, what, ref) => { for (const k in D) if (k !== v.id) D[k].select(id); ev.emit('select', id, v.id, what); if (ref && D[ref]) open(ref, true); });
      D[v.id].on('hover', id => ev.emit('hover', id, v.id));
      D[v.id].on('filter', x => ev.emit('filter', x, v.id));
    }
    el.querySelector('.cu-tabs').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) open(b.dataset.view, true); });
    // a pane taller than its box scrolls so that the current elements (or the given one) are in view
    function reveal(id) {
      const pane = el.querySelector(`[data-pane="${CSS.escape(cur)}"]`), list = id ? [...pane.querySelectorAll(`[data-id="${CSS.escape(id)}"]`)] : [...pane.querySelectorAll('.cu-now[data-id]')];
      if (!list.length || pane.scrollHeight <= pane.clientHeight + 2) return;
      // a lifeline or a frame spans the whole diagram: aim at the elements that fit in the box (messages, steps);
      // when there are only such tall ones, leave the box where it is if one of them is already in view
      const P = pane.getBoundingClientRect(), pin = pane.querySelector('.cu-pin svg')?.getBoundingClientRect().height || 0, top0 = P.top + pin, room = P.height - pin;
      let rs = list.map(g => g.getBoundingClientRect()); const fit = rs.filter(r => r.height <= room / 2);
      if (fit.length) rs = fit; else if (rs.some(r => r.bottom > top0 + 8 && r.top < P.bottom - 8)) return;
      const top = Math.min(...rs.map(r => r.top)), bot = Math.max(...rs.map(r => r.bottom));
      if (top >= top0 + 8 && bot <= P.bottom - 8) return;
      const want = bot - top < room - 24 ? (top + bot) / 2 - (top0 + room / 2) : top - top0 - 12;
      pane.scrollBy({top: want, behavior: reduced() ? 'auto' : 'smooth'});
    }
    open(views[0].id);
    return {
      diagrams: D, on: ev.on, get view() { return cur; },
      // paints the open view with the state; another view is repainted only when state.also names a state for it
      show(state = {}) { if (state.view) open(state.view); D[cur].paint(state); for (const [k, v] of Object.entries(state.also || {})) if (D[k] && k !== cur) D[k].paint(v); reveal(); },
      open, select(id) { for (const k in D) D[k].select(id); }, hover(ids) { for (const k in D) D[k].hover(ids); },
      reveal,
    };
  }

  // layout: the layered placement and orthogonal edge routes on their own, for a host that draws its own boxes
  root.CWUML = {render, board, layout: layered, types: Object.keys(KINDS), version: '0.2.0'};
})(typeof window !== 'undefined' ? window : globalThis);
