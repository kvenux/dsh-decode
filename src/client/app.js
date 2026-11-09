// Decode browser half. Plain JS (no JSX) so the bundle needs no compiler: scripts/build.mjs wraps this file,
// cw-uml and the styles into one dsh client module.
//  - the submit_answer tool row becomes the answer card (conclusion, paragraphs, evidence, follow-ups);
//  - a right-sidebar tab shows the cw-uml diagram and the repository map for the answer being read;
//  - pointing at a paragraph moves the diagram to that step and marks the files the paragraph cites.
const React = require('react')
const h = React.createElement
const { useEffect, useMemo, useRef, useState, useSyncExternalStore } = React

const TAB_ID = 'dsh-decode'
const TAB_KIND = 'decode'

// ------------------------------------------------------------------ shared state: the answer being read
const store = (() => {
  // view: 'live' while the agent is still reading (live = that turn's reads and search hits), 'answer' once a card is open
  let state = { callId: null, meta: null, para: 0, live: null, view: 'answer' }
  const fns = new Set()
  return {
    get: () => state,
    set(patch) { state = { ...state, ...patch }; fns.forEach(f => f()) },
    subscribe(f) { fns.add(f); return () => fns.delete(f) },
  }
})()
const useStore = () => useSyncExternalStore(store.subscribe, store.get)

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
// inline text: [[label|id]] references and `code`
const inline = t => esc(t)
  .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_, l, id) => `<span class="rc-ref" data-ref="${esc(id.trim())}">${l}</span>`)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
const join = (root, file) => (root ? root.replace(/[\\/]+$/, '') + '/' + file : file)
// a cited file that does not exist (status missing) is not a file of the repository: not listed, not opened
const citedFiles = p => [...new Set((p?.evidence || []).filter(e => e.status !== 'missing').map(e => e.file))]

// ------------------------------------------------------------------ language: card and panel follow the answer's language
const TX = {
  zh: {
    pending: '正在整理回答…', retry: '回答没通过校验，正在修改：', missing: '回答数据缺失', done: '回答已生成：',
    meta: (v, r, c, n) => `Decode · ${v} 张图 · 引用 ${r} 个文件 · ${n} 处引文${n > c ? `，${n - c} 处没有原文` : ''}`, openPanel: '在右侧打开图和文件',
    evNote: (k, n) => k ? `引文：${n} 处中 ${n - k} 处在文件里找到了原文（只说明代码存在，不代表结论已验证）；${k} 处没有原文（推断或没找到），在段落下标出。` : '引文：模型抄的代码在文件里找到了。这只说明代码存在，不代表结论已验证。',
    chipOk: '原文已找到', chipMissing: '找不到这个文件', chipInferred: '推断', chipUnchecked: '没找到原文', inferred: ' (推断)',
    followups: '可以接着问：', copy: '复制这个问题', fill: '填入输入框，改好再发送',
    noView: '这个回答没有画图', viewFail: '图画不出来：', idle: '在 Decode 模式里提一个问题，这里会显示交互图和涉及的文件。',
    diagram: '交互图', paraOf: (i, n) => `第 ${i}/${n} 段`, prev: '上一段', next: '下一段', pause: '暂停', play: '从这一段起逐段播放', para: i => `第 ${i} 段`,
    evidence: '本段的引文', places: n => `${n} 处`, map: '仓库地图', files: n => `${n} 个文件`, byFolder: '，按文件夹显示', drawn: n => `（只画了 ${n} 个）`,
    loadFail: '读取失败', loading: '读取中…', cur: '本段引用', cited: '回答引用', read: '读过', doc: '文档', regions: '颜色表示代码所在目录：',
    involved: '本次问答涉及的文件', openFile: '打开这个文件', curShort: '本段', citedShort: '引用',
    tagOk: '引文', tagMissing: '没有这个文件', tagInferred: '推断', tagRan: '运行结果', tagUnchecked: '没找到原文',
    tagTip: { verified: '模型抄的代码在这个文件里找到了（只说明代码在，不说明它支持这段话）', unverified: '模型抄的代码在这个文件里没找到：行号或内容可能不准',
      inferred: '模型没有抄代码，这是它的推断', ran: '模型运行命令得到的结果，程序没有核对', missing: '仓库里没有这个文件' }, open: '打开', openInEditor: '在编辑器里打开',
    showCode: '点开看代码', mapLabel: '仓库文件地图', root: '(根目录)', nFiles: n => ` · ${n} 个文件`,
    liveTitle: '正在查证', liveDone: '查证结束', liveStat: (r, n) => `读了 ${r} 个文件 · 搜到 ${n} 处`, liveNow: '正在看：', liveQuery: '正在搜：', liveRecent: '读过的文件',
    hit: '搜到', curLive: '正在看', lastAnswer: '看上一个回答', goLive: '正在查证新的问题，点此查看',
    hurried: '查证到 3 分钟上限：没查实的地方标为推断', hurriedTip: '为了不让你久等，查证到时间上限后就停止搜索，用已经找到的证据写了回答；没查实的地方标为推断或写在判断的风险里。',
    liveCompose: '正在整理回答', liveComposeNote: '一阵没有新的读取了，多半在组织段落和图，通常要 1–2 分钟。', typical: '复杂问题通常要 1–2 分钟',
    elapsed: s => `已用 ${s >= 60 ? `${Math.floor(s / 60)} 分 ${s % 60} 秒` : `${s} 秒`}`,
    evSum: (n, ok) => `${n} 处引文${ok < n ? ` · ${n - ok} 处没有原文` : ''}`, evSumTip: '点一下，右侧显示这一段引用的代码',
    show: '展开', hide: '收起',
    layoutStack: '上下：图在上，文件在下', layoutSide: '左右：图在左，文件在右', layoutTabs: '标签：图和文件分开看', tabDiagram: '图', tabFiles: '文件', dragTip: '拖动调整大小，双击恢复', seqView: '时序', commView: '通信', seqTip: '时序图：消息按时间从上到下排', commTip: '通信图：谁和谁通信，消息按编号排在连线上',
    filesTitle: '涉及的文件', viewList: '目录树', viewMap: '地图', viewListTip: '把这次用到的文件放进仓库的目录树：每个目录做什么、旁边还有什么', viewMapTip: '整个仓库的矩形图：看这些文件在仓库里的位置',
    more: '其他', moreTip: (d, f) => `还有 ${[d ? `${d} 个目录` : '', f ? `${f} 个文件` : ''].filter(Boolean).join('、')}，点开查看`,
    lines: (s, e) => (e > s ? `第 ${s}–${e} 行` : `第 ${s} 行`), jumpCur: '跳到本段引用的文件', pkg: '包', inDiagram: '图里在这个目录的：', readOnly: '只读过', shrunk: '图被缩小了，字不好读。', toTabs: '切到标签布局', sayTip: '点一下看全文', allN: n => `共 ${n}`, gitDirTip: '里面有没提交的修改', git: { M: '改过', A: '新加', D: '删了' }, gitTip: { M: '有没提交的修改', A: '新加入 git，还没提交', D: '已删除，还没提交' },
    citedBy: l => `第 ${l.join('、')} 段引用`, nCited: n => `下面有 ${n} 个文件被引用`, nRead: n => `下面读过 ${n} 个文件`,
    ask: '追问', askTip: '把这处代码填进输入框，接着问', askPara: '追问这段', askParaTip: '把这段引用到输入框，接着问',
    copyLoc: '复制', copyLocTip: '复制“路径:行号”', copied: '已复制',
    askAt: (f, s, e) => `${pathToken(f)} ${e > s ? `第 ${s}–${e} 行` : `第 ${s} 行`}：`,
    fsum: (r, c, k) => [`读了 ${r} 个`, `引用 ${c} 个`, k != null ? `本段 ${k} 处引文` : ''].filter(Boolean).join(' · '), repoDirty: x => `仓库 ${x} 个未提交`, uncommitted: '未提交：',
    fsumTip: '读了：查证时打开过的文件；引用：回答引用的文件；本段：这一段的引文处数；仓库未提交：整个仓库里改了还没提交的文件（和这个回答无关）', firstN: n => `显示前 ${n} 个，再多输几个字缩小范围`, moreParas: n => `+${n}`,
    scopePara: '本段', scopeAll: '整个回答', scopeTip: { para: '只列这一段引用的文件', all: '列出整个回答引用的文件' },
    citedHere: '引用的文件', foldMore: n => `还有 ${n} 个`, foldLess: '收起',
    allFiles: '全部文件', collapseAll: '全部收起', expandAll: '展开引用的目录',
    find: '查找文件', findTip: '按文件名或路径找（字母按顺序出现即可，如 cwuml）；Esc 清空', matches: n => `找到 ${n} 个`, findNone: '没有找到这个文件', findCut: n => `只搜了前 ${n} 个文件`,
    paraLink: i => `第 ${i} 段`, paraLinkTip: '看这一段', dirty: '未提交', dirtyTip: '这个文件有没提交的修改：引文是从工作区读的，可能和提交的版本不同',
  },
  en: {
    pending: 'Writing the answer…', retry: 'The answer failed a check and is being fixed: ', missing: 'Answer data is missing', done: 'Answer ready: ',
    meta: (v, r, c, n) => `Decode · ${v} diagram${v === 1 ? '' : 's'} · ${r} file${r === 1 ? '' : 's'} cited · ${n} quote${n === 1 ? '' : 's'}${n > c ? `, ${n - c} without source` : ''}`, openPanel: 'Open diagram and files on the right',
    evNote: (k, n) => k ? `Quotes: ${n - k} of ${n} were found in the files (that shows the code exists, not that the conclusion is verified); ${k} ${k === 1 ? 'has' : 'have'} no source (inferred or not found), marked under the paragraph.` : 'Quotes: the code the model quoted was found in the files. That shows the code exists, not that the conclusion is verified.',
    chipOk: 'Quote found', chipMissing: 'File not found', chipInferred: 'Inferred', chipUnchecked: 'Quote not found', inferred: ' (inferred)',
    followups: 'Ask next: ', copy: 'Copy this question', fill: 'Put it in the input box to edit and send',
    noView: 'This answer has no diagram', viewFail: 'Cannot draw the diagram: ', idle: 'Ask a question in Decode mode to see the diagram and the files here.',
    diagram: 'Diagram', paraOf: (i, n) => `Paragraph ${i}/${n}`, prev: 'Previous paragraph', next: 'Next paragraph', pause: 'Pause', play: 'Play paragraph by paragraph from here', para: i => `Paragraph ${i}`,
    evidence: 'Quotes for this paragraph', places: n => `${n}`, map: 'Repository map', files: n => `${n} files`, byFolder: ', shown by folder', drawn: n => ` (only ${n} drawn)`,
    loadFail: 'Could not load', loading: 'Loading…', cur: 'This paragraph', cited: 'Cited', read: 'Read', doc: 'Document', regions: 'Colour = folder of the code:',
    involved: 'Files in this answer', openFile: 'Open this file', curShort: 'this para', citedShort: 'cited',
    tagOk: 'Quote', tagMissing: 'No such file', tagInferred: 'Inferred', tagRan: 'Run result', tagUnchecked: 'Quote not found',
    tagTip: { verified: 'The code the model quoted is in this file (it shows the code is there, not that it backs the sentence)', unverified: 'The code the model quoted is not in this file: the lines or the text may be wrong',
      inferred: 'The model quoted no code: this is its inference', ran: 'What the model got by running a command; not checked by the program', missing: 'The repository has no such file' }, open: 'Open', openInEditor: 'Open in the editor',
    showCode: 'Click to show the code', mapLabel: 'Repository file map', root: '(root)', nFiles: n => ` · ${n} files`,
    liveTitle: 'Looking through the code', liveDone: 'Search finished', liveStat: (r, n) => `${r} files read · ${n} search hits`, liveNow: 'Now: ', liveQuery: 'Searching: ', liveRecent: 'Files read',
    hit: 'Search hit', curLive: 'Now', lastAnswer: 'Previous answer', goLive: 'A new question is being looked into: show it',
    hurried: 'Stopped at the 3-minute limit: unconfirmed points are marked inferred', hurriedTip: 'So you do not wait too long, the search stopped at the time limit and the answer uses the evidence found so far; anything not confirmed is marked inferred or named as a risk.',
    liveCompose: 'Writing the answer', liveComposeNote: 'No new reads for a while: most likely arranging the paragraphs and diagrams, usually 1–2 minutes.', typical: 'complex questions usually take 1–2 minutes',
    elapsed: s => `${s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`} so far`,
    evSum: (n, ok) => `${n} quote${n === 1 ? '' : 's'}${ok < n ? ` · ${n - ok} without source` : ''}`, evSumTip: 'Click to see the code this paragraph cites on the right',
    show: 'Show', hide: 'Hide',
    layoutStack: 'Stacked: diagram above, files below', layoutSide: 'Side by side: diagram left, files right', layoutTabs: 'Tabs: diagram and files one at a time', tabDiagram: 'Diagram', tabFiles: 'Files', dragTip: 'Drag to resize, double-click to reset', seqView: 'Sequence', commView: 'Communication', seqTip: 'Sequence diagram: messages in time order, top to bottom', commTip: 'Communication diagram: who talks to whom, messages numbered on the links',
    filesTitle: 'Files in this answer', viewList: 'Tree', viewMap: 'Map', viewListTip: 'The files of this answer in the folder tree: what each folder is for, what else is beside it', viewMapTip: 'Treemap of the whole repository: where these files are',
    more: 'more', moreTip: (d, f) => `${[d ? `${d} more folder${d === 1 ? '' : 's'}` : '', f ? `${f} more file${f === 1 ? '' : 's'}` : ''].filter(Boolean).join(', ')}: click to show`,
    lines: (s, e) => (e > s ? `lines ${s}–${e}` : `line ${s}`), jumpCur: 'Go to the files this paragraph cites', pkg: 'pkg', inDiagram: 'In the diagram, here: ', readOnly: 'only read', shrunk: 'The diagram is shrunk and hard to read.', toTabs: 'Switch to tabs', sayTip: 'Click to show it all', allN: n => `${n} in all`, gitDirTip: 'Holds changes not committed yet', git: { M: 'changed', A: 'added', D: 'deleted' }, gitTip: { M: 'Has changes not committed yet', A: 'Added to git, not committed yet', D: 'Deleted, not committed yet' },
    citedBy: l => `Cited in paragraph${l.length > 1 ? 's' : ''} ${l.join(', ')}`, nCited: n => `${n} file${n === 1 ? '' : 's'} below cited`, nRead: n => `${n} file${n === 1 ? '' : 's'} below read`,
    ask: 'Ask', askTip: 'Put this place in the input box to ask about it', askPara: 'Ask about this', askParaTip: 'Quote this paragraph in the input box to ask about it',
    copyLoc: 'Copy', copyLocTip: 'Copy "path:line"', copied: 'Copied',
    askAt: (f, s, e) => `${pathToken(f)} ${e > s ? `lines ${s}–${e}` : `line ${s}`}: `,
    fsum: (r, c, k) => [`${r} read`, `${c} cited`, k != null ? `${k} quote${k === 1 ? '' : 's'} here` : ''].filter(Boolean).join(' · '), repoDirty: x => `repository: ${x} not committed`, uncommitted: 'Not committed: ',
    fsumTip: 'read: files opened while looking; cited: files the answer quotes; here: quotes in this paragraph; repository not committed: files of the whole repository changed and not committed (not about this answer)', firstN: n => `first ${n} shown: type more to narrow`, moreParas: n => `+${n}`,
    scopePara: 'This para', scopeAll: 'Whole answer', scopeTip: { para: 'Only the files this paragraph cites', all: 'The files the whole answer cites' },
    citedHere: 'Cited files', foldMore: n => `${n} more`, foldLess: 'Show less',
    allFiles: 'All files', collapseAll: 'Collapse all', expandAll: 'Open cited folders',
    find: 'Find a file', findTip: 'By name or path (letters in order are enough, e.g. cwuml); Esc clears', matches: n => `${n} found`, findNone: 'No such file', findCut: n => `only the first ${n} files were searched`,
    paraLink: i => `¶${i}`, paraLinkTip: 'Go to this paragraph', dirty: 'not committed', dirtyTip: 'This file has changes not committed: the quotes were read from the working tree and can differ from the committed version',
  },
}
const uiLang = () => /^zh/i.test(document.documentElement.lang || navigator.language || '') ? 'zh' : 'en'
// the language of an answer: Chinese when its conclusion is written in Chinese; the page language before there is one
const tx = a => TX[a ? (/[㐀-鿿]/.test(a.take || '') ? 'zh' : 'en') : uiLang()]

// ------------------------------------------------------------------ treemap (ported from codewiki-next renderer/treemap.js)
function squarify(items, rect) {
  const out = [], total = items.reduce((s, i) => s + i.w, 0)
  if (!total || rect.w <= 0 || rect.h <= 0) return out
  const scale = rect.w * rect.h / total
  let list = items.map(i => ({ ...i, a: i.w * scale })).sort((a, b) => b.a - a.a), { x, y, w, h } = rect
  const worst = (row, side) => { const s = row.reduce((t, r) => t + r.a, 0), mx = Math.max(...row.map(r => r.a)), mn = Math.min(...row.map(r => r.a)); return Math.max(side * side * mx / (s * s), s * s / (side * side * mn)) }
  while (list.length) {
    const side = Math.min(w, h); let row = [list[0]], i = 1
    while (i < list.length && worst([...row, list[i]], side) <= worst(row, side)) row.push(list[i++])
    list = list.slice(i)
    const s = row.reduce((t, r) => t + r.a, 0)
    if (w >= h) { const cw = s / h; let cy = y; for (const r of row) { const rh = r.a / cw; out.push({ ...r, x, y: cy, w: cw, h: rh }); cy += rh } x += cw; w -= cw }
    else { const ch = s / w; let cx = x; for (const r of row) { const rw = r.a / ch; out.push({ ...r, x: cx, y, w: rw, h: ch }); cx += rw } y += ch; h -= ch }
  }
  return out
}
const clip = (s, w) => { const n = Math.max(1, Math.floor((w - 6) / 7)); return [...s].length > n ? [...s].slice(0, n).join('') + '…' : s }

// A large repository is drawn by folder (folderCells: about 500 folders, the big ones split): single files would be
// too small to see or point at. A cell is marked when a file in it is.
const FILE_CELLS_MAX = 2500
// documents (not code) get stripes over their mark: a paragraph that rests only on documents shows it
const isDoc = p => /\.(md|mdx|markdown|rst|adoc|txt)$/i.test(p)
const RANK = ['cur', 'cited', 'read', 'hit']
let tmUid = 0
// opts: labels {cur, cited, read, hit} for the tip; onHover(cell key or null); onOpen(file) when a cell is clicked
function drawTreemap(el, files, width, height, t, opts = {}) {
  const uid = ++tmUid, byFolder = files.length > FILE_CELLS_MAX
  // the regions that are sub-folders (src/app when src holds most files) start split
  const fc = byFolder ? folderCells(files.map(f => f.path), [...new Set(files.filter(f => f.part.includes('/')).map(f => f.part.split('/')[0]))]) : null
  const cellOf = f => (byFolder ? fc.cellOf(f.path) : f.path)
  const groups = new Map()
  for (const f of files) {
    const g = groups.get(f.part) || groups.set(f.part, new Map()).get(f.part), k = cellOf(f)
    const c = g.get(k) || g.set(k, { key: k, w: 0, n: 0 }).get(k)
    c.w += Math.sqrt(f.size + 400); c.n++
  }
  const G = [...groups].map(([id, cells]) => ({ id, cells: [...cells.values()], n: [...cells.values()].reduce((s, c) => s + c.n, 0), w: [...cells.values()].reduce((s, c) => s + c.w, 0) }))
  const name = k => k.replace(/^\(根目录\)/, t.root)
  const info = new Map()
  // layers over the cells: marks (stripes, rings around this paragraph's cells), then hover and spotlight outlines
  let svg = `<svg class="rc-tm" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${t.mapLabel}">`
    + `<defs><pattern id="rc-hatch${uid}" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)"><rect class="hatch" width="2.2" height="5"/></pattern></defs>`
  for (const b of squarify(G, { x: 0, y: 0, w: width, h: height })) {
    const pad = 1.5, top = b.h > 26 && b.w > 34 ? 12 : 1.5
    // a region that has a colour in the answer's diagrams is tinted with it
    const tint = opts.tint?.get(b.id)
    svg += `<g class="g${tint ? ' tint' : ''}" data-part="${esc(b.id)}"${tint ? ` style="--g:${esc(tint)}"` : ''}><rect class="gb" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}"/>`
    if (top > 2) svg += `<text x="${b.x + 3}" y="${b.y + 9}">${esc(clip(name(b.id), b.w))}</text>`
    for (const c of squarify(b.cells, { x: b.x + pad, y: b.y + top, w: b.w - 2 * pad, h: b.h - top - pad }))
      if (c.w > 0.15 && c.h > 0.15) { info.set(c.key, { n: c.n, x: c.x, y: c.y, w: c.w, h: c.h }); svg += `<rect class="f" data-cell="${esc(c.key)}" x="${c.x.toFixed(2)}" y="${c.y.toFixed(2)}" width="${c.w.toFixed(2)}" height="${c.h.toFixed(2)}"/>` }
    svg += '</g>'
  }
  el.innerHTML = svg + '<g class="ov"></g><g class="hl"></g></svg><div class="rc-tip" hidden></div>'
  const svgEl = el.querySelector('svg'), ov = el.querySelector('.ov'), hl = el.querySelector('.hl'), tip = el.querySelector('.rc-tip')
  const rects = new Map([...el.querySelectorAll('rect.f')].map(r => [r.dataset.cell, r]))
  const cells = set => new Set([...set].map(p => cellOf({ path: p })))
  // a ring at least 9 px across, so a folder too small to see still shows where it is; kept inside the map's edge
  const ring = (k, cls, grow = 3) => { const c = info.get(k); if (!c) return ''
    const w = Math.min(Math.max(c.w, 9) + grow * 2, width - 2), h = Math.min(Math.max(c.h, 9) + grow * 2, height - 2)
    const x = Math.max(1, Math.min(c.x + c.w / 2 - w / 2, width - 1 - w)), y = Math.max(1, Math.min(c.y + c.h / 2 - h / 2, height - 1 - h))
    return `<rect class="${cls}" x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="3"/>` }
  let byCell = new Map(), sig = '', hover = null, spotted = [], spotHtml = ''
  const drawHl = () => { hl.innerHTML = (hover ? ring(hover, 'hov', 1.5) : '') + spotHtml }
  const showTip = (k, ev) => {
    const L = opts.labels || {}, marked = byCell.get(k) || []
    const short = f => byFolder && f.startsWith(k) ? f.slice(k.length) : f
    tip.innerHTML = `<b>${esc(name(k))}</b>${byFolder ? `<span class="rc-faint">${esc(t.nFiles(info.get(k)?.n || 0).replace(/^\s*·\s*/, ''))}</span>` : ''}`
      + marked.slice(0, 6).map(m => `<div class="rc-tip-f"><i class="${m.state}${m.doc ? ' doc' : ''}"></i><span>${esc(short(m.file))}</span><em>${esc(L[m.state] || '')}</em></div>`).join('')
      + (marked.length > 6 ? `<div class="rc-faint">+${marked.length - 6}</div>` : '')
    tip.hidden = false
    const box = el.getBoundingClientRect(), x = ev.clientX - box.left, y = ev.clientY - box.top, tw = tip.offsetWidth, th = tip.offsetHeight
    tip.style.left = Math.max(0, Math.min(x + 14, box.width - tw)) + 'px'
    tip.style.top = (y + 16 + th > box.height + 40 ? Math.max(0, y - th - 10) : y + 16) + 'px'
  }
  const setHover = k => { if (k === hover) return; hover = k; drawHl(); opts.onHover?.(k) }
  svgEl.addEventListener('mousemove', ev => { const r = ev.target.closest?.('rect.f'); if (!r) { tip.hidden = true; setHover(null); return } setHover(r.dataset.cell); showTip(r.dataset.cell, ev) })
  svgEl.addEventListener('mouseleave', () => { tip.hidden = true; setHover(null) })
  svgEl.addEventListener('click', ev => {
    const r = ev.target.closest?.('rect.f'); if (!r) return
    const m = (byCell.get(r.dataset.cell) || [])[0]
    if (m) opts.onOpen?.(m.file); else if (!byFolder) opts.onOpen?.(r.dataset.cell)
  })
  return {
    byFolder,
    cellOf: p => cellOf({ path: p }),
    mark(read, cited, current, hit = new Set()) {
      const S = { cur: current, cited, read, hit }, K = Object.fromEntries(RANK.map(s => [s, cells(S[s])]))
      // per cell: its marked files, the strongest mark first
      const m = new Map(), seen = new Set()
      for (const s of RANK) for (const f of S[s]) { if (seen.has(f)) continue; seen.add(f); const k = cellOf({ path: f }); (m.get(k) || m.set(k, []).get(k)).push({ file: f, state: s, doc: isDoc(f) }) }
      const next = [...m].map(([k, l]) => k + ':' + l.map(x => x.state + ':' + x.file).join(',')).sort().join('|')
      byCell = m
      if (next === sig) return
      sig = next
      let rings = '', docs = ''
      for (const [k, r] of rects) {
        for (const s of RANK) r.classList.toggle(s, K[s].has(k))
        const l = m.get(k), top = l?.[0]?.state
        // stripes when every file behind the cell's colour is a document
        if (top && l.filter(x => x.state === top).every(x => x.doc)) { const c = info.get(k); docs += `<rect class="doc" x="${c.x.toFixed(2)}" y="${c.y.toFixed(2)}" width="${c.w.toFixed(2)}" height="${c.h.toFixed(2)}" fill="url(#rc-hatch${uid})"/>` }
        if (top === 'cur') rings += ring(k, 'ring') + ring(k, 'ping')
      }
      ov.innerHTML = docs + rings
      svgEl.classList.toggle('marked', m.size > 0)
      el.querySelectorAll('.g').forEach(g => g.classList.toggle('touched', [...g.querySelectorAll('rect.f')].some(r => m.has(r.dataset.cell) && m.get(r.dataset.cell).some(x => x.state !== 'hit'))))
    },
    // the cells of some files stand out and the rest fade (pointing at a file in the list)
    spot(paths) {
      spotted = [...cells(paths)].filter(k => rects.has(k))
      svgEl.classList.toggle('spotting', spotted.length > 0)
      for (const [k, r] of rects) r.classList.toggle('spot', spotted.includes(k))
      spotHtml = spotted.map(s => ring(s, 'spot', 3)).join(''); drawHl()
    },
    // one region stands out and the rest fade (pointing at a colour in the diagram or its legend)
    spotPart(part) {
      const g = part ? [...el.querySelectorAll('.g')].find(x => x.dataset.part === part) : null
      spotted = g ? [...g.querySelectorAll('rect.f')].map(r => r.dataset.cell) : []
      svgEl.classList.toggle('spotting', spotted.length > 0)
      const on = new Set(spotted); for (const [k, r] of rects) r.classList.toggle('spot', on.has(k))
      const b = g?.querySelector('rect.gb')
      spotHtml = b ? `<rect class="spot" x="${+b.getAttribute('x') + 1}" y="${+b.getAttribute('y') + 1}" width="${Math.max(0, b.getAttribute('width') - 2)}" height="${Math.max(0, b.getAttribute('height') - 2)}" rx="3"/>` : ''; drawHl()
    },
  }
}

// ------------------------------------------------------------------ region colours: one colour per repository region
// The places in an answer's diagrams (lifelines, nodes, packages, classes) are coloured by the region of the code they
// stand for, and the map tints the same regions with the same colours. The program finds the region, not the model:
//  - a place whose id or name shares words with a code file the answer read or cites votes for that file's region;
//  - a paragraph votes for the regions of its code evidence, shared by the places it points at (a message: both ends);
//  - one place drawn in several diagrams (same id) collects one set of votes, so it has one colour everywhere;
// the region with at least half of a place's votes wins; people, external systems and unclear places stay grey.
// A document votes only when it sits inside a module's folder (packages/boot/app-boot/README.md); one in docs/, notes
// or at the top of a folder describes many places and does not vote. Files at the repository root are no region.
// A deployment diagram is not coloured: it shows where programs run, not where code lives.
const PLACE_KEYS = ['lifelines', 'nodes', 'classes', 'packages']
const REGION_VIEWS = new Set(['sequence', 'communication', 'component', 'package', 'class'])
// no green (checked), red or orange (refuted, partly) or amber (this paragraph on the map)
const REGION_COLORS = ['#8b6be0', '#129c9c', '#d0549a', '#3c9ad6', '#a57c45']
const NO_REGION = /^(actor|external|person|user|human)$/
const STOP = new Set(['the', 'and', 'for', 'with', 'object', 'objects', 'view', 'views', 'service', 'services', 'src', 'lib', 'index', 'main', 'core', 'client', 'server', 'data', 'file', 'files', 'type', 'types', 'test', 'tests', 'json', 'from', 'into', 'model', 'module', 'system', 'layer', 'part', 'parts', 'api', 'app', 'apps', 'packages', 'package', 'readme', 'docs'])
const words = s => String(s || '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !STOP.has(w))
function placesOf(spec) {
  const out = [], walk = l => (l || []).forEach(e => { if (e && e.id != null && e.from == null) { out.push(e); walk(e.children) } })
  for (const k of PLACE_KEYS) walk(spec[k])
  return out
}
function regionsOf(a, partOf0, readFiles = []) {
  const views = a.views.filter(v => REGION_VIEWS.has(v.type))
  const code = f => f && (!isDoc(f) || (f.split('/').length >= 3 && !/^(\.?docs?|documentation|\.agents|notes|wiki)\//i.test(f)))
  const partOf = f => { const p = partOf0(f); return p && p !== '(根目录)' ? p : null }
  const files = [...new Set([...a.paras.flatMap(p => (p.evidence || []).map(e => e.file)), ...readFiles])].filter(code)
  const fw = files.map(f => ({ part: partOf(f), w: new Set(words(f)) })).filter(x => x.part)
  const vote = new Map(), named = new Set(), add = (id, part, n) => { const m = vote.get(id) || vote.set(id, new Map()).get(id); m.set(part, (m.get(part) || 0) + n) }
  for (const v of views) for (const e of placesOf(v.spec || {})) {
    if (NO_REGION.test(e.kind || '') || named.has(e.id)) continue
    named.add(e.id)
    const own = new Set([...words(e.id), ...words(e.name)])
    let best = 0, hits = []
    for (const x of fw) { const s = [...own].filter(w => x.w.has(w)).length; if (s > best) { best = s; hits = [x] } else if (s && s === best) hits.push(x) }
    for (const x of hits) add(e.id, x.part, 3 / hits.length)
  }
  for (const v of views) {
    const spec = v.spec || {}, ids = new Set(placesOf(spec).filter(e => !NO_REGION.test(e.kind || '')).map(e => e.id)), msgs = new Map((spec.messages || []).map(m => [m.id, m]))
    for (const p of a.paras) {
      if ((p.view || a.views[0]?.id) !== v.id) continue
      const E = new Set(); for (const id of p.now || []) { if (ids.has(id)) E.add(id); const m = msgs.get(id); if (m) { if (ids.has(m.from)) E.add(m.from); if (ids.has(m.to)) E.add(m.to) } }
      const ev = [...new Set((p.evidence || []).map(e => e.file))].filter(code).map(partOf).filter(Boolean)
      // a paragraph that points at most of the diagram (an overview) says nothing about one place
      if (!E.size || !ev.length || E.size > Math.max(3, ids.size * 0.6)) continue
      for (const id of E) for (const part of ev) add(id, part, 1 / (E.size * ev.length))
    }
  }
  const res = new Map()
  for (const [id, m] of vote) { const l = [...m].sort((x, y) => y[1] - x[1]), tot = l.reduce((s, x) => s + x[1], 0); if (l[0][1] >= tot * 0.5) res.set(id, l[0][0]) }
  return res
}
// -> {part(id): region of a place, color: Map(region -> colour)}; regions with more places first, each colour taken
// from the region's name (the same region keeps its colour across answers when it can), five at most
function regionColors(a, partOf, readFiles) {
  const byId = regionsOf(a, partOf, readFiles), n = new Map()
  for (const p of byId.values()) n.set(p, (n.get(p) || 0) + 1)
  const color = new Map(), used = new Set()
  for (const [p] of [...n].sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1))) {
    if (used.size >= REGION_COLORS.length) break
    let h = 0; for (const c of p) h = (h * 31 + c.charCodeAt(0)) >>> 0
    let i = h % REGION_COLORS.length; while (used.has(i)) i = (i + 1) % REGION_COLORS.length
    used.add(i); color.set(p, REGION_COLORS[i])
  }
  return { part: id => (color.has(byId.get(id)) ? byId.get(id) : null), color }
}
// a copy of a diagram's spec with each place's colour set (a colour the spec already gives is kept)
function withColors(v, R) {
  if (!REGION_VIEWS.has(v.type)) return v.spec
  const s = JSON.parse(JSON.stringify(v.spec))
  const walk = l => (l || []).forEach(e => { if (e && e.id != null && e.from == null) { const p = R.part(e.id); if (p && !e.color) e.color = R.color.get(p); walk(e.children) } })
  for (const k of PLACE_KEYS) walk(s[k])
  return s
}

// ------------------------------------------------------------------ answer card (tool.call.toolview, key submit_answer)
function AnswerView(props) {
  const s = useStore()
  const t0 = tx(null)
  if (props.phase !== 'result') return h('div', { className: 'rc-pending' }, h('span', { className: 'rc-spin' }), t0.pending)
  const block = props.block
  if (block.isError) {
    const text = (block.content || []).map(c => c.text || '').join('').slice(0, 400)
    return h('div', { className: 'rc-pending rc-retry' }, t0.retry, h('span', { className: 'rc-faint' }, text))
  }
  const meta = block.meta
  if (!meta?.answer) return h('div', { className: 'rc-pending' }, t0.missing)
  // the full card is a turn-level element (TurnAnswer below): the tool group folds when the turn ends
  return h('div', { className: 'rc-pending rc-done' }, tx(meta.answer).done, h('span', { className: 'rc-faint' }, meta.answer.take))
}

// ------------------------------------------------------------------ the answer as a turn-level element
// dsh folds a finished turn's tool group, so the card sits in conversation.chat.turnTail, which stays open.
// A turn data definition collects the accepted submit_answer results of each turn (replays from the session log).
const TURN_KEY = 'decode-answer'
const append = e => e.surfaceOp === 'append'
const turnDefinition = {
  kind: TURN_KEY,
  match: e => e.type === 'turn/start' ? { id: String(e.data.turn), role: 'start' }
    : e.type === 'tool/call' || (e.type === 'tool/result' && append(e)) ? { id: String(e.data.turn), role: 'update' } : null,
  start: (_c, m) => ({ turn: m.event.data.turn, calls: new Map(), answers: [] }),
  update: (c, m) => {
    const e = m.event
    if (e.type === 'tool/call') { const calls = new Map(c.state.calls); calls.set(String(e.data.callId), e.data.name); return { ...c.state, calls } }
    if (e.type !== 'tool/result') return c.state
    const callId = String(e.data.message.source.callId)
    if (c.state.calls.get(callId) !== 'submit_answer' || e.data.message.isError === true || !e.data.meta?.answer) return c.state
    return { ...c.state, answers: [...c.state.answers, { callId, seq: e.seq, meta: e.data.meta }] }
  },
  buildLocationData: (c, scope, prev) => {
    if (scope !== 'turn' || !c.state) return null
    if (prev?.kind === 'turn' && prev.turn === c.state.turn && prev.key === TURN_KEY && prev.value.answers === c.state.answers) return prev
    return { kind: 'turn', turn: c.state.turn, key: TURN_KEY, value: { answers: c.state.answers } }
  },
}

// ------------------------------------------------------------------ live: what the agent reads and searches while it works
// A view target of its own: Conversation materializes one node per turn as tool events arrive, and LiveWatch (mounted
// in every session header) hands the open turn of a Decode session to the panel. The turn tail, where the card
// lives, renders only after the turn ends, so it cannot carry this.
const LIVE_KIND = 'decode-live', LIVE_TARGET = 'decode'
const HITS_MAX = 400, HIT_LIST_MAX = 80, WRITING_AFTER_MS = 15000
const argsOf = e => { try { return JSON.parse(e.data.arguments || '{}') } catch { return {} } }
const slash = p => String(p || '').replace(/\\/g, '/')
// the paths a grep or glob result lists (grep: a path line, then its "Line n:" lines)
const listedPaths = text => String(text || '').split('\n').map(l => l.trim())
  .filter(l => l && !/^(Line \d+|Found \d+|No files|No matches|\(|<)/.test(l) && !/\s{2,}/.test(l) && /[\\/.]/.test(l) && l.length < 300)
  .map(slash)
const liveDefinition = {
  kind: LIVE_KIND,
  target: LIVE_TARGET,
  // the reader's question (its own context): the live panel speaks its language before any answer exists
  match: e => e.type === 'user/message' && e.data?.source?.kind === 'user' ? { id: 'ask' + (e.data.id || e.seq), role: 'start' }
    : e.type === 'turn/start' ? { id: String(e.data.turn), role: 'start' }
    : (e.type === 'tool/call' || (e.type === 'tool/result' && append(e)) || e.type === 'turn/end') && e.data?.turn != null ? { id: String(e.data.turn), role: 'update' } : null,
  start: (_c, m) => {
    const e = m.event
    if (e.type === 'user/message') {
      const text = (e.data.content || []).map(x => x.text || '').join('')
      return { ask: true, id: 'ask' + (e.data.id || e.seq), seq: e.seq, en: !!text.trim() && !/[㐀-鿿]/.test(text) }
    }
    return { turn: e.data.turn, open: true, calls: {}, reads: [], hits: [], current: null, query: '', t0: e.time, last: e.time }
  },
  update: (c, m) => {
    const e = m.event, st = c.state
    if (e.type === 'turn/end') return { ...st, open: false }
    if (e.type === 'tool/call') {
      const name = e.data.name
      if (name !== 'read' && name !== 'grep' && name !== 'glob') return st
      const a = argsOf(e), file = name === 'read' ? slash(a.file_path) : ''
      return { ...st, calls: { ...st.calls, [e.data.callId]: name }, last: e.time,
        current: file || st.current, query: file ? '' : String(a.pattern || ''),
        reads: file && !st.reads.includes(file) ? [...st.reads, file] : st.reads }
    }
    const name = st.calls[String(e.data.message?.source?.callId)]
    if (!name || e.data.message?.isError) return st
    if (name === 'read') {
      // the result carries the absolute path the call named relatively
      const abs = slash(e.data.meta?.path)
      return { ...st, last: e.time, ...(abs && !st.reads.includes(abs) ? { reads: [...st.reads, abs] } : {}) }
    }
    const text = (e.data.message.content || []).map(x => x.text || '').join('\n')
    // a result that lists most of the repository (glob *) says nothing about where the answer is: not marked
    const listed = listedPaths(text), add = listed.length > HIT_LIST_MAX ? [] : listed.filter(p => !st.hits.includes(p))
    return { ...st, last: e.time, ...(add.length && st.hits.length < HITS_MAX ? { hits: [...st.hits, ...add].slice(0, HITS_MAX) } : {}) }
  },
  buildViewNode: c => { if (!c.state) return null; const id = c.state.ask ? c.state.id : String(c.state.turn)
    return { key: `${LIVE_KIND.length}:${LIVE_KIND}${id}`, kind: LIVE_KIND, id, target: LIVE_TARGET, data: c.state } },  // the engine-owned key form (conversationContextKey)
}
// the target's snapshot: the newest turn and the language of the newest question
const liveView = {
  target: LIVE_TARGET,
  create: () => {
    const turns = new Map()
    const snap = () => {
      let latest = null, ask = null
      for (const d of turns.values()) { if (d.ask) { if (!ask || d.seq > ask.seq) ask = d } else if (!latest || d.turn > latest.turn) latest = d }
      return { latest, en: ask ? ask.en : null }
    }
    return {
      empty: { latest: null, en: null },
      replace: ({ nodes }) => { turns.clear(); for (const n of nodes) turns.set(n.key, n.data); return snap() },
      apply: ({ upserts }) => { for (const n of upserts) turns.set(n.key, n.data); return snap() },
    }
  },
}
let uiConversation = null
// session:turn of every answer card mounted on this page; a live turn that ends without one closes the panel
const answeredTurns = new Set(), NO_CARD_CLOSE_MS = 2500
const noSub = () => () => {}, noSnap = () => null
// mounted in each session header (renders nothing): opens the panel when a Decode turn starts reading
function LiveWatch({ sessionId, useSessions }) {
  const preset = useSessions(st => st.byId?.[sessionId]?.projectionValues?.agentPreset)
  const cwd = useSessions(st => st.byId?.[sessionId]?.cwd)
  const rc = preset === 'decode'
  const src = React.useMemo(() => { try { return rc ? uiConversation.binding(sessionId).target(LIVE_TARGET) : null } catch { return null } }, [sessionId, rc])
  const snap = useSyncExternalStore(src ? src.subscribe : noSub, src ? src.getSnapshot : noSnap)
  const latest = snap?.latest, en = snap?.en ?? null
  useEffect(() => {
    if (!rc || !latest || !cwd) return
    const prev = store.get().live, same = prev?.sessionId === sessionId && prev?.turn === latest.turn
    if (!latest.open) {
      if (!(same && prev.open)) return
      store.set({ live: { ...prev, ...latest, open: false } })
      // a turn that ended with a plain message (no answer card): the live panel has nothing left to show, so it closes
      // (the card mounts in the turn tail right after the turn ends; a card that mounts later opens the panel again)
      const key = sessionId + ':' + latest.turn
      setTimeout(() => {
        const s = store.get()
        if (answeredTurns.has(key) || answeredTurns.has('*:' + latest.turn) || s.view !== 'live' || s.live?.sessionId !== sessionId || s.live?.turn !== latest.turn) return
        store.set({ view: 'answer' }); closePanel()
      }, NO_CARD_CLOSE_MS)
      return
    }
    if (!latest.reads.length && !latest.hits.length) return
    // seenAt: when this page saw the latest read or search (the browser's clock; event times are the server's)
    store.set({ live: { ...latest, root: cwd, sessionId, en, seenAt: Date.now() }, ...(same ? {} : { view: 'live' }) })
    if (!same) openPanel()
  }, [latest, en, rc, cwd, sessionId])
  return null
}

// the session composer (dsh marks its editor data-composer-input): focus it with the caret after the text
function focusComposer() {
  requestAnimationFrame(() => { try {
    const el = document.querySelector('[data-composer-input]'); if (!el) return
    el.focus(); const sel = window.getSelection(); sel.selectAllChildren(el); sel.collapseToEnd()
  } catch {} })
}

// Asking about a place: the session's input box gets the place, the reader writes the question. The panel has no input
// actions of its own: the answer card hands over its session's (the page shows one session at a time).
let composer = null
const copyText = text => { try { navigator.clipboard.writeText(text) } catch {} }
// dsh's @path grammar: a path with spaces is quoted; the line numbers stay outside the path token
const pathToken = f => (/\s/.test(f) ? `@"${f}"` : '@' + f)
const plain = s => String(s || '').replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
// insert at the caret, keeping what the reader already wrote; copied when there is no input box
function toComposer(text, c = composer) {
  if (!c) { copyText(text); return }
  try { const span = c.captureInsertion(); if (!c.insertText((span.start > 0 ? ' ' : '') + text, span)) c.setDraft(text) } catch { try { c.setDraft(text) } catch {} }
  focusComposer()
}
// a paragraph goes in as a quote (dsh shows it as a quote block the reader can remove); as text when quotes are refused
function quoteToComposer(text, c = composer) {
  try { if (c?.insertQuote && c.insertQuote(text)) { focusComposer(); return } } catch {}
  toComposer(`“${text}”\n`, c)
}

function TurnAnswer(props) {
  const s = useStore()
  const data = props.turn?.data?.get(TURN_KEY)
  const end = props.turn?.end?.seq ?? props.seq
  const last = (data?.answers || []).filter(x => x.seq <= end).at(-1)
  if (!last) return null
  return h(AnswerCard, { meta: last.meta, callId: last.callId, turn: props.turn?.turn, sessionId: props.sessionId, openFile: props.openFile, input: props.inputActions, active: s.callId === last.callId ? s.para : -1 })
}


let opened = null
// a paragraph the pointer rests on this long becomes the current one (a pointer passing over it does not)
const HOVER_MS = 250
const scrolled = new Set()
function AnswerCard({ meta, callId, turn, sessionId, openFile, input, active }) {
  const a = meta.answer
  const cardEl = useRef(null)
  useEffect(() => {
    try { (window.__decodeAnswers ||= {})[callId] = meta.answer } catch {}  // read by bench/ scripts
    if (turn != null) answeredTurns.add((sessionId ?? '*') + ':' + turn)
    // a card replaces the live view, unless a later turn is still reading (an older card mounting on session open)
    const live = store.get().live, later = live?.open && turn != null && live.turn > turn
    if (store.get().callId !== callId) store.set({ callId, meta, para: 0, ...(later ? {} : { view: 'answer' }) })
    if (opened !== callId) { opened = callId; openPanel() }
    // the answer to the turn this page watched: show its conclusion, not its last paragraph (an old card on session open stays put)
    const fresh = live && live.turn === turn && (sessionId == null || live.sessionId === sessionId)
    if (fresh && !scrolled.has(callId)) {
      scrolled.add(callId)
      const top = () => cardEl.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      requestAnimationFrame(top); setTimeout(top, 400)
    }
  }, [callId])
  useEffect(() => { if (openFile) fileOpener = { root: meta.root, open: openFile } }, [openFile, meta.root])
  useEffect(() => { if (input) composer = input }, [input])
  // a step chosen in the panel (diagram click, ‹ ›, playback) brings its paragraph into view
  useEffect(() => {
    if (store.get().src !== 'panel' || active < 0) return
    cardEl.current?.querySelectorAll('.rc-para')[active]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [active])
  const hoverT = useRef(0)
  useEffect(() => () => clearTimeout(hoverT.current), [])
  const point = i => { const s = store.get(); if (s.callId !== callId || s.para !== i || s.view !== 'answer') store.set({ callId, meta, para: i, src: 'card', view: 'answer' }) }
  const views = a.views.length, t = tx(a)
  const ev = a.paras.flatMap(p => p.evidence), checked = ev.filter(e => e.status === 'verified').length
  return h('div', { className: 'rc-card', ref: cardEl, lang: t === TX.en ? 'en' : 'zh' },
    h('div', { className: 'rc-meta' }, t.meta(views, new Set(ev.map(e => e?.file).filter(Boolean)).size, checked, ev.length),
      meta.hurried ? h('span', { className: 'rc-hurried', title: t.hurriedTip }, t.hurried) : null,
      h('button', { className: 'rc-link', onClick: () => { store.set({ callId, meta, para: Math.max(0, active), view: 'answer' }); openPanel() } }, t.openPanel)),
    h('div', { className: 'rc-evnote' }, t.evNote(ev.length - checked, ev.length)),
    h('div', { className: 'rc-take', dangerouslySetInnerHTML: { __html: inline(a.take || '') } }),
    a.paras.map((p, i) => h('div', {
      key: i, className: 'rc-para' + (i === active ? ' on' : ''),
      onMouseEnter: () => { clearTimeout(hoverT.current); hoverT.current = setTimeout(() => point(i), HOVER_MS) },
      onMouseLeave: () => clearTimeout(hoverT.current), onClick: () => { clearTimeout(hoverT.current); point(i) }, onFocus: () => point(i), tabIndex: 0,
    },
    h('span', { className: 'rc-n' }, String(i + 1).padStart(2, '0')),
    h('span', { className: 'rc-text', dangerouslySetInnerHTML: { __html: inline(p.text) } }),
    h('div', { className: 'rc-ev' }, p.evidence.length ? (() => {
      const ok = p.evidence.filter(e => e.status === 'verified').length
      return h('button', { className: 'rc-evsum' + (ok < p.evidence.length ? ' doubt' : ''),
        title: t.evSumTip + '\n' + p.evidence.map(e => `${e.file}:${e.start}${e.end > e.start ? '-' + e.end : ''}`).join('\n'),
        onClick: ev => { ev.stopPropagation(); point(i); openPanel() } }, t.evSum(p.evidence.length, ok))
    })() : null,
    // shown on the paragraph being read (CSS): quotes the paragraph in this session's input box
    h('button', { className: 'rc-ask', title: t.askParaTip, onClick: ev => { ev.stopPropagation(); point(i); quoteToComposer(plain(p.text), input || composer) } }, t.askPara)))),
    a.followups.length ? h('div', { className: 'rc-fups' }, h('span', { className: 'rc-faint' }, t.followups),
      // a follow-up goes into this session's input box (the reader can edit it before sending); copy only without one
      a.followups.map((q, i) => h('button', { key: i, className: 'rc-fup', title: input ? t.fill : t.copy, onClick: () => {
        if (input?.setDraft) { input.setDraft(q); focusComposer() } else { try { navigator.clipboard.writeText(q) } catch {} }
      } }, q))) : null,
  )
}

// ------------------------------------------------------------------ right sidebar tab: diagram + map + files
// a sequence paragraph that names no message walks the messages since the previous paragraph's upto (answers saved
// before src/check.js made the same repair)
function walkedNow(a, i) {
  const p = a.paras[i], v = a.views.find(x => x.id === p.view), msgs = v?.spec?.messages
  if (!msgs || !p.upto) return p.now
  const order = msgs.map(m => m.id)
  if (p.now.some(x => order.includes(x))) return p.now
  const prev = a.paras.slice(0, i).reverse().find(q => q.view === p.view && q.upto)?.upto
  const to = order.indexOf(p.upto), from = order.indexOf(prev ?? '') + 1
  return [...p.now, ...order.slice(from <= to ? from : to, to + 1).slice(-6)]
}

let fileOpener = null  // the chat's file opener, handed over by the answer card (the tab has none of its own)
const sources = new Map()
// one cited place: a folded row (where, and whether it was checked); the code shows only when the reader opens it
function useSource(root, e, on) {
  const key = `${root}|${e.file}|${e.start}|${e.end}`
  const [src, setSrc] = useState(() => sources.get(key) || null)
  useEffect(() => {
    if (sources.has(key)) { setSrc(sources.get(key)); return }
    if (!on || e.status === 'missing') return
    let live = true
    fetch(`/dsh-decode/source?root=${encodeURIComponent(root)}&file=${encodeURIComponent(e.file)}&start=${e.start}&end=${e.end}`, { cache: 'no-store' })
      .then(r => r.json()).then(v => { sources.set(key, v); if (live) setSrc(v) }).catch(() => {})
    return () => { live = false }
  }, [key, on])
  return src
}
// the lines of a place, the cited ones marked (the quote when the file cannot be read)
const CodeLines = ({ src, e }) => src?.lines ? h('pre', { className: 'rc-code' }, src.lines.map((l, i) => {
  const n = src.from + i, hot = n >= src.start && n <= src.end
  return h('div', { key: i, className: hot ? 'hot' : '' }, h('span', { className: 'ln' }, n), l || ' ')
})) : e.quote ? h('pre', { className: 'rc-code' }, e.quote) : null
function EvidenceCode({ root, e, open, t }) {
  const [shown, setShown] = useState(false)
  const src = useSource(root, e, shown)
  const tag = tagOf(e, t), loc = `${e.file}:${e.start}${e.end > e.start ? '-' + e.end : ''}`
  const [copied, setCopied] = useState(false)
  useEffect(() => { if (!copied) return; const id = setTimeout(() => setCopied(false), 1200); return () => clearTimeout(id) }, [copied])
  return h('div', { className: 'rc-src ' + e.status + (shown ? ' shown' : '') },
    h('div', { className: 'rc-src-h', title: t.showCode, role: 'button', tabIndex: 0, 'aria-expanded': shown,
      onClick: () => setShown(!shown), onKeyDown: k => { if (k.target === k.currentTarget && (k.key === 'Enter' || k.key === ' ')) { k.preventDefault(); setShown(!shown) } } },
      h('span', { className: 'rc-caret' }, shown ? '▾' : '▸'), h('span', { className: 'rc-tag', title: tipOf(e, t) }, tag),
      h('span', { className: 'rc-path' }, loc),
      e.status !== 'missing' ? h('button', { className: 'rc-open', title: t.askTip, onClick: k => { k.stopPropagation(); toComposer(t.askAt(e.file, e.start, e.end)) } }, t.ask) : null,
      h('button', { className: 'rc-open', title: t.copyLocTip, onClick: k => { k.stopPropagation(); copyText(loc); setCopied(true) } }, copied ? t.copied : t.copyLoc),
      e.status !== 'missing' ? h('button', { className: 'rc-open', title: t.openInEditor, onClick: k => { k.stopPropagation(); open(e.file, e.start) } }, t.open) : null),
    shown ? h(CodeLines, { src, e }) : null)
}
const tagOf = (e, t) => (e.status === 'verified' ? t.tagOk : e.status === 'missing' ? t.tagMissing : e.kind === 'inferred' ? t.tagInferred : e.kind === 'ran' ? t.tagRan : t.tagUnchecked)
const tipOf = (e, t) => t.tagTip[e.status === 'verified' || e.status === 'missing' ? e.status : e.kind === 'inferred' || e.kind === 'ran' ? e.kind : 'unverified']

const inventories = new Map()
function useInventory(root) {
  const [inv, setInv] = useState(() => inventories.get(root) || null)
  useEffect(() => {
    if (!root) return
    if (inventories.has(root)) { setInv(inventories.get(root)); return }
    let live = true
    fetch('/dsh-decode/inventory?root=' + encodeURIComponent(root), { cache: 'no-store' })
      .then(r => r.json()).then(v => { if (v.files) inventories.set(root, v); if (live) setInv(v) }).catch(e => live && setInv({ error: String(e) }))
    return () => { live = false }
  }, [root])
  return inv
}
// the files changed and not committed yet (path -> M/A/D): read again for each turn and answer (key), as an edit may come between
function useChanges(root, key) {
  const [ch, setCh] = useState(null)
  useEffect(() => {
    if (!root) return
    let live = true
    fetch('/dsh-decode/changes?root=' + encodeURIComponent(root), { cache: 'no-store' })
      .then(r => r.json()).then(v => { if (live && v.files) { const m = new Map(Object.entries(v.files)); m.lines = v.lines || {}; setCh(m) } }).catch(() => {})
    return () => { live = false }
  }, [root, key])
  return ch
}
// the letter of a file changed and not committed, as in a file explorer
const GitTag = ({ file, ctx }) => { const c = ctx.changes?.get(file)
  return c ? h('span', { className: 'rc-git ' + c, title: ctx.t.gitTip[c] }, c) : null }
// the folders that hold a changed file (a folded folder shows a dot, so a change out of sight is not missed)
const gitDirs = new WeakMap()
const changedDir = (changes, dir) => { if (!changes?.size || !dir) return false
  let d = gitDirs.get(changes); if (!d) { d = new Set(); for (const f of changes.keys()) { const p = f.split('/'); for (let i = 1; i < p.length; i++) d.add(p.slice(0, i).join('/')) } gitDirs.set(changes, d) }
  return d.has(dir) }
const GitDot = ({ dir, ctx }) => changedDir(ctx.changes, dir) ? h('i', { className: 'rc-gitdot', title: ctx.t.gitDirTip }) : null

// package folders and the folder index of a repository, once per file list
const invCache = new WeakMap()
const invOf = inv => { if (!inv?.files) return { roots: null, idx: null }; let r = invCache.get(inv)
  if (!r) { const paths = inv.files.map(f => f.path); r = { roots: packageRoots(paths), idx: dirIndex(paths) }; invCache.set(inv, r) } return r }

// what the folders of a repository are for: learned from the answers about it (their `areas`), kept in this browser,
// so the tree names more folders the more questions are asked
const AREAS_KEY = 'decode.areas'
const rootKey = root => slash(root).replace(/\/+$/, '').toLowerCase()
function learnedAreas(root) { try { return JSON.parse(localStorage.getItem(AREAS_KEY) || '{}')[rootKey(root)] || {} } catch { return {} } }
function learnAreas(root, areas) {
  if (!root || !areas?.length) return
  try { const all = JSON.parse(localStorage.getItem(AREAS_KEY) || '{}'), k = rootKey(root)
    all[k] = { ...(all[k] || {}), ...Object.fromEntries(areas.map(x => [x.path, x.role])) }; localStorage.setItem(AREAS_KEY, JSON.stringify(all)) } catch {}
}
// folder -> label: the answer's own areas first, then what earlier answers said, then common folder names
function folderLabels(root, idx, lang, areas) {
  const m = folderWords(idx, lang)
  for (const [d, r] of Object.entries(learnedAreas(root))) m.set(d, r)
  for (const x of areas || []) m.set(x.path, x.role)
  return m
}

// files: the folder tree (default) or the treemap of the whole repository; the choice is kept in this browser
const FILES_VIEW_KEY = 'decode.files-view'
const pref = (k, d) => { try { return localStorage.getItem(k) ?? d } catch { return d } }
const setPref = (k, v) => { try { localStorage.setItem(k, v) } catch {} }
// a sequence diagram can be drawn as a communication diagram (the same spec): the reader's choice, kept
const SEQ_AS_KEY = 'decode.seqAs'
function useSeqAs() {
  const [v, setV] = useState(() => (pref(SEQ_AS_KEY, 'sequence') === 'communication' ? 'communication' : 'sequence'))
  return [v, x => { setV(x); setPref(SEQ_AS_KEY, x) }]
}
const SeqSwitch = ({ value, set, t }) => h('span', { className: 'rc-seg rc-seqas', role: 'group' },
  ['sequence', 'communication'].map(k => h('button', { key: k, className: value === k ? 'on' : '', 'aria-pressed': value === k,
    title: k === 'sequence' ? t.seqTip : t.commTip, onClick: () => set(k) }, k === 'sequence' ? t.seqView : t.commView)))
function useFilesView() {
  const [v, setV] = useState(() => (pref(FILES_VIEW_KEY, 'list') === 'map' ? 'map' : 'list'))
  return [v, x => { setV(x); setPref(FILES_VIEW_KEY, x) }]
}
// the panel's layout: diagram and files stacked (default), side by side, or as tabs; the split of each is kept too
const LAYOUT_KEY = 'decode.layout', SPLIT_KEY = 'decode.split'
const LAYOUTS = ['stack', 'side', 'tabs']
const LAYOUT_SVG = {
  stack: '<svg viewBox="0 0 16 16"><rect x="2" y="2.5" width="12" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 8h11" stroke="currentColor" stroke-width="1.3"/></svg>',
  side: '<svg viewBox="0 0 16 16"><rect x="2" y="2.5" width="12" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M8 3v10" stroke="currentColor" stroke-width="1.3"/></svg>',
  tabs: '<svg viewBox="0 0 16 16"><rect x="2" y="4.5" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 4.5V3.2c0-.4.3-.7.7-.7h3.6c.4 0 .7.3.7.7v1.3" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>',
}
// the split the reader dragged, kept per layout; stacked panes without one are sized to the diagram (null)
const splitOf = l => { const x = parseFloat(pref(SPLIT_KEY + '.' + l, '')); return x >= 0.2 && x <= 0.8 ? x : l === 'stack' ? null : 0.5 }
function useLayout() {
  const [v, setV] = useState(() => { const x = pref(LAYOUT_KEY, 'stack'); return LAYOUTS.includes(x) ? x : 'stack' })
  const [split, setSplit] = useState(() => splitOf(v))
  return [v, x => { setV(x); setPref(LAYOUT_KEY, x); setSplit(splitOf(x)) }, split,
    (x, keep) => { const y = x ?? (v === 'stack' ? null : 0.5); setSplit(y); if (keep) setPref(SPLIT_KEY + '.' + v, y == null ? 'auto' : String(y)) }]
}
const LayoutSwitch = ({ value, set, t }) => h('span', { className: 'rc-layout', role: 'group' },
  LAYOUTS.map(k => h('button', { key: k, className: value === k ? 'on' : '', 'aria-pressed': value === k, title: t[{ stack: 'layoutStack', side: 'layoutSide', tabs: 'layoutTabs' }[k]],
    onClick: () => set(k), dangerouslySetInnerHTML: { __html: LAYOUT_SVG[k] } })))
// the bar between the two panes: dragged, it moves the split (between 20% and 80%); a double click gives the split back
function Divider({ side, set, t }) {
  const down = e => {
    const box = e.currentTarget.parentElement.getBoundingClientRect(), bar = e.currentTarget
    bar.setPointerCapture?.(e.pointerId); bar.classList.add('on')
    const at = ev => Math.min(0.8, Math.max(0.2, side ? (ev.clientX - box.left) / box.width : (ev.clientY - box.top) / box.height))
    // a press without a move (a click, half a double click) keeps the split as it is
    const y0 = side ? e.clientX : e.clientY, moved = ev => Math.abs((side ? ev.clientX : ev.clientY) - y0) > 2
    const move = ev => { if (moved(ev)) set(at(ev), false) }
    const up = ev => { bar.removeEventListener('pointermove', move); bar.removeEventListener('pointerup', up); bar.classList.remove('on'); if (moved(ev)) set(at(ev), true) }
    bar.addEventListener('pointermove', move); bar.addEventListener('pointerup', up)
    e.preventDefault()
  }
  return h('div', { className: 'rc-divider', role: 'separator', 'aria-orientation': side ? 'vertical' : 'horizontal', title: t.dragTip, onPointerDown: down, onDoubleClick: () => set(null, true) }, h('i'))
}
function ViewSwitch({ value, set, t }) {
  return h('span', { className: 'rc-seg', role: 'group', onClick: k => k.stopPropagation(), onKeyDown: k => k.stopPropagation() },
    ['list', 'map'].map(k => h('button', { key: k, className: value === k ? 'on' : '', 'aria-pressed': value === k,
      title: k === 'list' ? t.viewListTip : t.viewMapTip, onClick: () => set(k) }, k === 'list' ? t.viewList : t.viewMap)))
}
// a path as folder (faint, shortened first when the row is narrow) + file name (always whole)
const FilePath = ({ name }) => { const i = name.lastIndexOf('/')
  return h('span', { className: 'rc-fpath' }, i >= 0 ? h('span', { className: 'rc-dir' }, name.slice(0, i + 1)) : null, h('span', { className: 'rc-base' }, name.slice(i + 1))) }
// the tree from fileTree, drawn like a file explorer: chevron, icon, name; a folder's number counts the files below it
// that the answer cites (or, with none cited, read). A file's colour says how the answer uses it: this paragraph,
// cited, only read. A cited file opens its code under its row; the places this paragraph cites are named on the row.
// What else a folder holds is behind a "+" row.
// ctx: t, live, onOpen(file, line), shut + flip (folded folders), regions (folder -> {color, names}: the places of the
// answer's diagrams whose code is in that folder, in their colour), evidence (file -> this paragraph's places), root,
// evKey (keys per paragraph), idx + roots + labels (to list folders the answer does not use)
const Svg = ({ svg, className }) => h('span', { className, 'aria-hidden': true, dangerouslySetInnerHTML: { __html: svg } })
const Chev = ({ open }) => h(Svg, { svg: CHEVRON_SVG, className: 'rc-chev' + (open ? ' open' : '') })
const NoChev = () => h('span', { className: 'rc-chev' })
const rangeText = (s, e) => (e > s ? `${s}–${e}` : String(s))
// a file's actions, shown on hover: ask about it (its first place), copy where it is, open it in the editor
function FileActs({ file, place, ctx }) {
  const { t } = ctx, [copied, setCopied] = useState(false)
  useEffect(() => { if (!copied) return; const id = setTimeout(() => setCopied(false), 1200); return () => clearTimeout(id) }, [copied])
  const loc = place ? `${file}:${place[0]}${place[1] > place[0] ? '-' + place[1] : ''}` : file
  const stop = f => k => { k.stopPropagation(); f() }
  return h('span', { className: 'rc-acts' },
    h('button', { title: t.askTip, onClick: stop(() => toComposer(place ? t.askAt(file, place[0], place[1]) : pathToken(file) + ' ')) }, t.ask),
    h('button', { title: t.copyLocTip, onClick: stop(() => { copyText(loc); setCopied(true) }) }, copied ? t.copied : t.copyLoc),
    h('button', { title: t.openInEditor, onClick: stop(() => ctx.onOpen(file, place ? place[0] : 1)) }, t.open))
}
// one place's code under a file row
function Peek({ e, ctx }) {
  const src = useSource(ctx.root, e, true)
  return h(CodeLines, { src, e })
}
function FileRow({ f, ctx }) {
  const { t, live } = ctx
  const ev = !live && f.cur ? ctx.evidence?.get(f.file) || [] : []
  // the places to show: this paragraph's, else every place the answer cites in the file
  const places = ev.length ? ev.map(x => x.e) : live ? [] : f.cited.map(([s, e]) => ({ file: f.file, start: s, end: e, status: 'verified' }))
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [ctx.evKey])
  const peek = ctx.flat && places.length > 0
  const flip = () => (peek ? setOpen(!open) : ctx.onOpen(f.file, places[0]?.start || 1))
  const used = live ? '' : f.paras.length ? '\n' + t.citedBy(f.paras.map(i => i + 1)) : '\n' + t.readOnly
  const state = f.cur ? 'cur' : live || !f.cited.length ? 'read' : 'cited'
  return h('div', { className: 'rc-fw' + (open ? ' open' : '') },
    h('div', { className: 'rc-row file ' + state, role: 'button', tabIndex: 0, 'aria-expanded': peek ? open : undefined,
      title: `${f.file}${used}\n${peek ? t.showCode : t.openFile}`,
      onClick: flip, onKeyDown: k => { if (k.target === k.currentTarget && (k.key === 'Enter' || k.key === ' ')) { k.preventDefault(); flip() } } },
      h(NoChev), h(Svg, { svg: fileIconSvg(f.file), className: 'rc-ic' }), h(FilePath, { name: f.name }), ctx.flat && ctx.changes?.lines?.[f.file] ? null : h(GitTag, { file: f.file, ctx }),
      h('span', { className: 'rc-end' },
        live && f.cur ? h('span', { className: 'rc-now-tag' }, t.curLive) : null,
        h(FileActs, { file: f.file, place: places[0] ? [places[0].start, places[0].end] : null, ctx }),
        ev.filter(x => x.e.status !== 'verified').map(x => h('span', { key: 'w' + x.k, className: 'rc-warn-tag ' + x.e.status, title: tipOf(x.e, t) }, tagOf(x.e, t))),
        ev.length ? h('span', { className: 'rc-ranges', title: t.tagTip.verified }, ev.map(x => rangeText(x.e.start, x.e.end)).join(' · ')) : null,
        ctx.flat && ctx.links && f.paras.length ? h('span', { className: 'rc-plinks' }, f.paras.slice(0, 4).map(i => h('button', { key: i, title: t.paraLinkTip, className: f.cur && ctx.para === i ? 'on' : '',
          onClick: k => { k.stopPropagation(); store.set({ para: i, src: 'panel' }) } }, t.paraLink(i + 1))),
          f.paras.length > 4 ? h('span', { key: 'm', className: 'rc-faint', title: t.citedBy(f.paras.map(i => i + 1)) }, t.moreParas(f.paras.length - 4)) : null) : null,
        ctx.flat ? h(DirtyTag, { file: f.file, cited: !live && f.cited.length > 0, ctx }) : null)),
    open && peek ? h('div', { className: 'rc-peek' }, places.map((e, k) => h(Peek, { key: ctx.evKey + ':' + k, e, ctx }))) : null)
}
// in a flat list: the lines a changed file adds and removes; a cited file that is changed is flagged (the quotes come from
// the working tree, not from the last commit)
const DirtyTag = ({ file, cited, ctx }) => { const c = ctx.changes?.get(file), n = ctx.changes?.lines?.[file]
  if (!c) return null
  return h('span', { className: 'rc-dirty' + (cited ? ' warn' : ''), title: cited ? ctx.t.dirtyTip : ctx.t.gitTip[c] },
    n ? [h('span', { key: 'a', className: 'add' }, '+' + n[0]), h('span', { key: 'd', className: 'del' }, '−' + n[1])] : null, cited ? h('span', { key: 'w' }, ctx.t.dirty) : null) }
// the files a paragraph or the whole answer cites (or, while looking, the files read last), flat above the tree: the
// name whole, the folder shortened first. Past FOLD_ROWS the list folds.
const FOLD_ROWS = 6
function FlatList({ title, files, ctx, scope, setScope, foldKey }) {
  const { t } = ctx, [all, setAll] = useState(false)
  useEffect(() => { setAll(false) }, [foldKey])
  const c = { ...ctx, flat: true, links: scope === 'all' }, shown = all ? files : files.slice(0, FOLD_ROWS)
  return h('div', { className: 'rc-box rc-flat' },
    h('div', { className: 'rc-bh' }, h('span', { className: 'rc-bt' }, title),
      setScope ? h('span', { className: 'rc-seg', role: 'group' }, ['para', 'all'].map(k => h('button', { key: k, className: scope === k ? 'on' : '', 'aria-pressed': scope === k,
        title: t.scopeTip[k], onClick: () => setScope(k) }, k === 'para' ? t.scopePara : t.scopeAll))) : null,
      h('span', { className: 'rc-pill' }, files.length)),
    shown.map(f => h(FileRow, { key: f.file, f: { ...f, name: f.file }, ctx: c })),
    files.length > FOLD_ROWS ? h('div', { className: 'rc-row more', role: 'button', tabIndex: 0, 'aria-expanded': all, onClick: () => setAll(!all),
      onKeyDown: k => { if (k.key === 'Enter' || k.key === ' ') { k.preventDefault(); setAll(!all) } } },
      h(NoChev), h('span', { className: 'rc-name' }, all ? t.foldLess : t.foldMore(files.length - FOLD_ROWS))) : null)
}
// find a file of the repository by name or path; the matches replace the tree while the box has text
function FindBox({ q, setQ, t }) {
  return h('input', { className: 'rc-find', type: 'search', placeholder: t.find, title: t.findTip, value: q, spellCheck: false, 'aria-label': t.find,
    onChange: k => setQ(k.target.value), onKeyDown: k => { if (k.key === 'Escape') { k.stopPropagation(); setQ('') } } })
}
function Matches({ q, inv, used, ctx }) {
  const { t } = ctx
  const paths = useMemo(() => (inv?.files || []).map(f => f.path), [inv])
  const list = useMemo(() => findFiles(paths, q, 50), [paths, q])
  const c = { ...ctx, flat: true }
  return h('div', { className: 'rc-box rc-matches' },
    h('div', { className: 'rc-bh' }, h('span', { className: 'rc-bt' }, t.matches(list.length)), list.length >= 50 ? h('span', { className: 'rc-faint' }, t.firstN(50)) : null, inv?.truncated ? h('span', { className: 'rc-faint' }, t.findCut(paths.length)) : null),
    list.length ? list.map(p => used?.get(p) ? h(FileRow, { key: p, f: { ...used.get(p), name: p }, ctx: c }) : h(IdleFile, { key: p, file: p, name: p, ctx }))
      : h('div', { className: 'rc-faint rc-none' }, t.findNone))
}
// a file the answer does not use: grey, opens in the editor
const IdleFile = ({ file, name, ctx }) => h('div', { className: 'rc-row file idle', title: `${file}\n${ctx.t.openFile}`, onClick: () => ctx.onOpen(file, 1) },
  h(NoChev), h(Svg, { svg: fileIconSvg(name), className: 'rc-ic' }), h(FilePath, { name }), h(GitTag, { file, ctx }), h('span', { className: 'rc-end' }, h(FileActs, { file, place: null, ctx })))
// what a folder holds besides the answer's files. In the top two levels its folders are listed (folded), so the reader
// sees how the repository is laid out; the rest is behind one "…" row, which gives way to it when clicked.
function More({ hidden, depth, ctx }) {
  const [open, setOpen] = useState(false), { t } = ctx
  const path = n => (hidden.dir ? hidden.dir + '/' + n : n)
  const dirsShown = open || depth <= 1, rest = [dirsShown ? 0 : hidden.dirs.length, hidden.files.length]
  return h('div', { className: 'rc-more-w' },
    dirsShown ? hidden.dirs.map(d => h(BrowseDir, { key: d.dir, d, ctx })) : null,
    open ? hidden.files.map(n => h(IdleFile, { key: n, file: path(n), name: n, ctx }))
      : rest[0] + rest[1] ? h('div', { className: 'rc-row more', role: 'button', tabIndex: 0, 'aria-expanded': false, title: t.moreTip(...rest),
        onClick: () => setOpen(true), onKeyDown: k => { if (k.key === 'Enter' || k.key === ' ') { k.preventDefault(); setOpen(true) } } },
        h(NoChev), h('span', { className: 'rc-ic rc-plus' }, '…'), h('span', { className: 'rc-faint' }, t.more)) : null)
}
// a folder row: chevron, folder icon (in the colour of its place in the diagram), name, what it is for, number
const DirRow = ({ open, name, label, title, color, end, cls, onClick, git }) => h('div', { className: 'rc-row dir' + (cls ? ' ' + cls : ''), role: 'button', tabIndex: 0,
  'aria-expanded': open, title, onClick, onKeyDown: k => { if (k.target === k.currentTarget && (k.key === 'Enter' || k.key === ' ')) { k.preventDefault(); onClick() } } },
  h(Chev, { open }), h(Svg, { svg: open ? FOLDER_OPEN_SVG : FOLDER_SVG, className: 'rc-ic rc-folder' + (color ? ' tinted' : '') }),
  h('span', { className: 'rc-name' }, name), git, label ? h('span', { className: 'rc-label' }, label) : null, h('span', { className: 'rc-end' }, end))
// a folder the answer does not use, folded; opened, it lists its folders and files like a file explorer
function BrowseDir({ d, ctx }) {
  const [open, setOpen] = useState(false), { t } = ctx
  const l = open ? dirList(ctx.idx, d.dir, ctx.labels) : null
  return h('div', { className: 'rc-tn idle' },
    h(DirRow, { open, name: d.name, label: d.label, title: d.dir + t.nFiles(d.total) + (ctx.roots?.has(d.dir) ? ' · ' + t.pkg : ''), cls: 'idle',
      git: h(GitDot, { dir: d.dir, ctx }), end: h('span', { className: 'rc-cnt all', title: t.nFiles(d.total).replace(/^ · /, '') }, t.allN(d.total)), onClick: () => setOpen(!open) }),
    open ? h('div', { className: 'rc-kids' },
      l.dirs.map(x => h(BrowseDir, { key: x.dir, d: x, ctx })), l.files.map(n => h(IdleFile, { key: n, file: d.dir + '/' + n, name: n, ctx }))) : null)
}
const Count = ({ n, live, t }) => { const c = live ? n.all.length : n.cited || n.all.length
  return h('span', { className: 'rc-cnt ' + (n.cur ? 'cur' : !live && n.cited ? 'cited' : 'read'), title: !live && n.cited ? t.nCited(c) : t.nRead(c) }, c) }
const NodeBody = ({ n, depth, ctx }) => [
  ...n.files.map(f => h(FileRow, { key: f.file, f, ctx })),
  ...n.kids.map(k => h(TreeNode, { key: k.dir, n: k, depth: depth + 1, ctx })),
  n.hidden ? h(More, { key: 'm', hidden: n.hidden, depth, ctx }) : null]
function TreeNode({ n, depth, ctx }) {
  const { t, live } = ctx, reg = ctx.regions?.get(n.dir), open = !ctx.shut.has(n.dir)
  const title = n.dir + t.nFiles(n.total) + (n.pkg ? ' · ' + t.pkg : '') + (reg ? '\n' + t.inDiagram + reg.names.join('、') : '')
  // folded, a folder holding a file of this paragraph shows a dot (the file is out of sight)
  const end = [!open && n.cur ? h('i', { key: 'd', className: 'rc-curdot' }) : null, h(Count, { key: 'n', n, live, t })]
  return h('div', { className: 'rc-tn' + (n.cur ? ' cur' : '') + (!live && n.cited ? ' used' : ''), style: reg ? { '--g': reg.color } : null },
    h(DirRow, { open, name: n.name, label: n.label, title, color: reg?.color, end, cls: n.cur ? 'cur' : !live && n.cited ? 'used' : '', git: h(GitDot, { dir: n.dir, ctx }), onClick: () => ctx.flip(n.dir) }),
    open ? h('div', { className: 'rc-kids' }, h(NodeBody, { n, depth, ctx })) : null)
}
const openDirs = n => [...(n.dir ? [n.dir] : []), ...n.kids.flatMap(openDirs)]
function FileTree({ tree, name, total, ctx, folded }) {
  const { t } = ctx
  const [shut, setShut] = useState(() => (folded ? new Set(openDirs(tree)) : new Set()))
  const first = useRef(true)
  useEffect(() => { if (first.current) { first.current = false; return } setShut(folded ? new Set(openDirs(tree)) : new Set()) }, [folded])
  const c = { ...ctx, shut, flip: d => setShut(x => { const y = new Set(x); if (y.has(d)) y.delete(d); else y.add(d); return y }) }
  return h('div', { className: 'rc-tree' },
    h('div', { className: 'rc-row root' }, h('span', { className: 'rc-name' }, name || t.root), total ? h('span', { className: 'rc-end' }, h('span', { className: 'rc-cnt all', title: t.files(total) }, t.allN(total))) : null),
    h('div', { className: 'rc-kids root' }, h(NodeBody, { n: tree, depth: 0, ctx: c })))
}
// what the colours of the files mean
// (the words take the colours of the file names; changed files get the letter at the row end)
const GitLegend = ({ t, changes }) => { const has = new Set(changes?.values() || [])
  const l = ['M', 'A', 'D'].filter(c => has.has(c))
  return l.length ? h('span', { className: 'git' }, t.uncommitted, l.map(c => h('span', { key: c, title: t.gitTip[c] }, h('b', { className: 'rc-git ' + c }, c), t.git[c]))) : null }
const TreeLegend = ({ t, live, ended, readToo, changes }) => h('div', { className: 'rc-tlegend' }, live
  ? [ended ? null : h('span', { key: 'c', className: 'cur' }, t.curLive), h('span', { key: 'r', className: 'read' }, t.read), h(GitLegend, { key: 'g', t, changes })]
  : [h('span', { key: 'c', className: 'cur' }, t.curShort), h('span', { key: 'd', className: 'cited' }, t.citedShort), readToo ? h('span', { key: 'r', className: 'read' }, t.readOnly) : null, h(GitLegend, { key: 'g', t, changes })])

function PanelBody() {
  const s = useStore()
  return s.view === 'live' && s.live ? h(LivePanel, { live: s.live }) : h(AnswerPanel)
}

// the repository map while the agent works: files read so far, search hits, and the file it is on now
function LivePanel({ live }) {
  const s = useStore()
  // the question's language once known (an English question gets an English panel), else the browser's
  const t = live.en == null ? tx(null) : TX[live.en ? 'en' : 'zh'], inv = useInventory(live.root), changes = useChanges(live.root, live.turn)
  const mapEl = useRef(null), tm = useRef(null)
  const root = slash(live.root).replace(/\/+$/, '') + '/'
  // repository-relative; a path outside the repository (a tool's spill file) is dropped
  const rel = p => { const x = slash(p).replace(/^\.\//, ''); return x.toLowerCase().startsWith(root.toLowerCase()) ? x.slice(root.length) : /^([a-z]:)?\//i.test(x) ? '' : x }
  // no read or search for a while: the agent is writing the answer (measured: 1–2.5 minutes with no tool calls)
  const [, tick] = useState(0)
  useEffect(() => { if (!live.open) return; const id = setInterval(() => tick(x => x + 1), 1000); return () => clearInterval(id) }, [live.open])
  const idle = live.seenAt ? Date.now() - live.seenAt : 0, writing = live.open && idle > WRITING_AFTER_MS
  const secs = live.t0 && live.last ? Math.max(0, Math.round((live.last - live.t0 + idle) / 1000)) : null
  const reads = [...new Set(live.reads.map(rel))].filter(Boolean), hits = new Set(live.hits.map(rel).filter(Boolean)), now = live.open && live.current && !writing ? rel(live.current) : ''
  const [hoverCell, setHoverCell] = useState(null)
  const [fview, setFview] = useFilesView()
  const openAt = f => { try { fileOpener?.open(join(live.root, f), { line: 1 }) } catch {} }
  useEffect(() => {
    const el = mapEl.current
    tm.current = null
    if (!el || !inv?.files) return
    tm.current = drawTreemap(el, inv.files, Math.max(260, el.clientWidth), 300, t, { labels: { cur: t.curLive, read: t.read, hit: t.hit },
      onHover: setHoverCell, onOpen: openAt })
  }, [inv, live.root, t, fview])
  useEffect(() => { tm.current?.mark(new Set(reads), new Set(), new Set(now ? [now] : []), hits) })
  const { roots, idx } = invOf(inv), lang = t === TX.en ? 'en' : 'zh'
  return h('div', { className: 'rc-panel rc-live' + (live.open ? ' open' : '') },
    h('div', { className: 'rc-ph' }, live.open ? h('span', { className: 'rc-spin' }) : null, h('b', null, !live.open ? t.liveDone : writing ? t.liveCompose : t.liveTitle),
      h('span', { className: 'rc-faint' }, [live.open && secs != null ? t.elapsed(secs) : '', t.liveStat(reads.length, hits.size), live.open && !writing && secs >= 20 ? t.typical : ''].filter(Boolean).join(' · ')),
      s.meta ? h('span', { className: 'rc-nav' }, h('button', { className: 'rc-back', title: t.lastAnswer, onClick: () => store.set({ view: 'answer' }) }, t.lastAnswer)) : null),
    writing ? h('div', { className: 'rc-now' }, h('span', { className: 'rc-faint' }, t.liveComposeNote))
      : !live.open ? null : live.query ? h('div', { className: 'rc-now' }, h('span', { className: 'rc-faint' }, t.liveQuery), h('code', { className: 'rc-path' }, live.query)) : now ? h('div', { className: 'rc-now' }, h('span', { className: 'rc-faint' }, t.liveNow), h('span', { className: 'rc-path' }, now)) : null,
    h('div', { className: 'rc-ph' }, h('b', null, t.liveRecent), h(ViewSwitch, { value: fview, set: setFview, t })),
    fview === 'list' ? h(TreeLegend, { t, live: true, ended: !live.open, changes }) : null,
    fview === 'list' ? (() => { const labels = folderLabels(live.root, idx, lang, null), lf = liveFiles(reads, now)
      const ctx = { t, live: true, onOpen: openAt, idx, roots, labels, changes }
      return h('div', null,
        h('div', { className: 'rc-box rc-all' }, h('div', { className: 'rc-bh' }, h('span', { className: 'rc-bt' }, t.allFiles)),
          h(FileTree, { tree: fileTree(lf, idx, roots, labels), name: lastSeg(root.replace(/\/+$/, '')), total: inv?.total, ctx }))) })() : h('div', null,
      h('div', { className: 'rc-faint rc-mapnote' }, inv?.files ? `${t.map} · ${t.files(inv.total)}${inv.files.length > FILE_CELLS_MAX ? t.byFolder : ''}` : inv?.error ? t.loadFail : t.loading),
      h('div', { className: 'rc-map', ref: mapEl }),
      h('div', { className: 'rc-legend' }, h('i', { className: 'cur' }), t.curLive, h('i', { className: 'read' }), t.read, h('i', { className: 'hit' }), t.hit),
      h('ul', { className: 'rc-files' }, reads.slice(-14).reverse().map(f => h('li', { key: f, className: (f === now ? 'cur' : 'read') + (hoverCell && tm.current?.cellOf(f) === hoverCell ? ' spot' : ''), title: t.openFile,
        onMouseEnter: () => tm.current?.spot([f]), onMouseLeave: () => tm.current?.spot([]), onClick: () => openAt(f) },
        h('span', { className: 'rc-dot' }), h('span', { className: 'rc-path' }, f))))),
  )
}

// cw-uml draws names at 12 px and fields and labels at 10.5 px, smaller than this panel's 13 px text: a drawing is laid
// out for the pane width / BOARD_ZOOM and shown up to BOARD_ZOOM times larger
// stacked panes the reader did not resize: the diagram pane takes the height its drawings need, SPLIT_MIN..SPLIT_MAX
const BOARD_ZOOM = 1.15, FIT_MIN = 0.78, SPLIT_MIN = 0.3, SPLIT_MAX = 0.62, SHRUNK = 0.8
/** Sizes each drawing of the board to its pane (or to a pane `room` px high): the whole drawing in view, as large as
 *  the pane allows (at most BOARD_ZOOM). A drawing that would need its text smaller than FIT_MIN of its size fills the
 *  width instead, and the pane scrolls (cw-uml keeps the current step in view). The scale is kept on the svg as
 *  data-fit. Returns the height the tallest drawing takes (at most the pane), 0 when there is no pane to fit. */
function fitBoard(el, room) {
  const box = el?.querySelector('.cu-pane:not([hidden])')
  const W = box?.clientWidth || 0, H = (room ?? box?.clientHeight ?? 0) - 2
  if (W < 50 || H < 50) return 0
  let need = 0
  el.querySelectorAll('.cu-pane').forEach(p => {
    const svg = p.querySelector(':scope > svg[viewBox]'), vb = svg?.viewBox.baseVal
    // a view that is not a drawing (a table) takes the height of its content, when it is the one shown
    if (!vb?.width || !vb.height) { if (p === box) need = Math.max(need, box.scrollHeight); return }
    const wide = Math.min(BOARD_ZOOM, W / vb.width), all = Math.min(wide, H / vb.height), s = all >= FIT_MIN ? all : wide
    svg.setAttribute('width', String(Math.floor(vb.width * s)))
    svg.dataset.fit = s.toFixed(2)
    const pin = p.querySelector('.cu-pin svg'), pv = pin?.viewBox.baseVal
    if (pv?.width) pin.setAttribute('width', String(Math.floor(pv.width * s)))
    need = Math.max(need, vb.height * s)
  })
  return need ? Math.ceil(Math.min(need, H)) + 2 : 0
}

function AnswerPanel() {
  const s = useStore()
  const meta = s.meta, a = meta?.answer
  const boardEl = useRef(null), mapEl = useRef(null), board = useRef(null), tm = useRef(null)
  const inv = useInventory(meta?.root), changes = useChanges(meta?.root, s.callId)
  const [layout, setLayout, split, setSplit] = useLayout()
  const [tab, setTab] = useState('diagram')
  const [seqAs, setSeqAs] = useSeqAs(), [openView, setOpenView] = useState(null)
  const showDiagram = layout !== 'tabs' || tab === 'diagram', showFiles = layout !== 'tabs' || tab === 'files'
  // the width the diagram was laid out for, in steps of 40 px: a wider or narrower pane lays it out again
  // (a taller or shorter pane only sizes the drawing again)
  const [bw, setBw] = useState(0), [autoSplit, setAutoSplit] = useState(0.5)
  const fitNow = useRef(null)
  // the drawing shown much smaller than its size (side by side, a narrow pane): the reader is offered the tabs
  const [shrunk, setShrunk] = useState(false)
  const noteFit = el => setShrunk(Number(el.querySelector('.cu-pane:not([hidden]) > svg')?.dataset.fit || 1) < SHRUNK)
  fitNow.current = () => {
    const el = boardEl.current
    if (!el) return
    if (layout !== 'stack' || split != null) { fitBoard(el); noteFit(el); return }
    // stacked and not resized: the drawings are sized for the largest diagram pane, and the pane then takes their height
    const sp = el.closest('.rc-split'), pane = el.closest('.rc-pane'), box = el.querySelector('.cu-pane:not([hidden])')
    if (!sp || !pane || !box) return
    const room = sp.clientHeight - 9, chrome = pane.clientHeight - box.clientHeight
    const need = fitBoard(el, room * SPLIT_MAX - chrome)
    if (need > 0) setAutoSplit(Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, Math.ceil((need + chrome) / room * 100) / 100)))
    noteFit(el)
  }
  useEffect(() => {
    const el = boardEl.current
    if (!el || typeof ResizeObserver === 'undefined') return
    let id = 0
    const ro = new ResizeObserver(() => { fitNow.current(); clearTimeout(id); id = setTimeout(() => setBw(Math.round(el.clientWidth / 40)), 150) })
    ro.observe(el)
    return () => { ro.disconnect(); clearTimeout(id) }
  }, [showDiagram, layout])
  const para = a?.paras[s.para], t = tx(a)
  // region colours, once the file list (each file's region) is known
  const R = useMemo(() => {
    if (!a || !inv?.files) return null
    const part = new Map(inv.files.map(f => [f.path, f.part]))
    return regionColors(a, f => part.get(f) || null, (meta.reads || []).map(r => r.file))
  }, [s.callId, inv])
  // folder -> the places of the diagrams whose code is there, in their region's colour (shown on the folder tree)
  const regions = useMemo(() => {
    if (!R) return null
    const m = new Map()
    for (const v of a.views.filter(v => REGION_VIEWS.has(v.type))) for (const e of placesOf(v.spec || {})) {
      const p = R.part(e.id); if (!p) continue
      const x = m.get(p) || m.set(p, { color: R.color.get(p), names: [] }).get(p), nm = String(e.name || e.id).replace(/\s+/g, ' ')
      if (!x.names.includes(nm)) x.names.push(nm)
    }
    return m
  }, [R])
  useEffect(() => { if (a?.areas?.length) learnAreas(meta.root, a.areas) }, [s.callId])
  const regionIds = p => [...new Set((a?.views || []).filter(v => REGION_VIEWS.has(v.type)).flatMap(v => placesOf(v.spec || {})).map(e => e.id))].filter(id => R?.part(id) === p)

  // diagram: built once per answer (again when the region colours arrive), painted per paragraph
  useEffect(() => {
    const el = boardEl.current
    board.current = null
    if (!el) return
    if (!a?.views.length) { el.innerHTML = `<div class="rc-empty">${t.noView}</div>`; return }
    // laid out for a narrower width and shown up to ZOOM times larger (fields and labels about 12 px, names about 14 px)
    const ZOOM = BOARD_ZOOM, w = Math.max(300, el.clientWidth - 16) / ZOOM
    try {
      const comm = v => v.type === 'sequence' && seqAs === 'communication'
      board.current = window.CWUML.board(el, a.views.map(v => { const spec = R ? withColors(v, R) : v.spec
        return { id: v.id, label: v.title || v.type, spec: comm(v) ? { ...spec, type: 'communication' } : spec,
          opts: v.type === 'sequence' && !comm(v) ? { col: Math.max(56, Math.min(150, Math.floor((w - 28) / Math.max(2, v.spec.lifelines.length)))), zoom: ZOOM } : { width: w, zoom: ZOOM } } }))
      setOpenView(board.current.view)
      board.current.on('tab', id => setOpenView(id))
      board.current.on('select', id => {
        const i = a.paras.findIndex((p, k) => k > 0 && walkedNow(a, k).includes(id))
        if (i >= 0) store.set({ para: i, src: 'panel' })
      })
      // pointing at a coloured place lights its region on the map
      board.current.on('hover', id => tm.current?.spotPart((id && R?.part(id)) || null))
      fitNow.current()
    } catch (e) { el.innerHTML = `<div class="rc-empty">${t.viewFail}${esc(e.message)}</div>` }
  }, [s.callId, R, showDiagram, bw, seqAs])
  useEffect(() => {
    if (!board.current || !para) return
    const view = para.view || a.views[0]?.id
    const now = walkedNow(a, s.para), v = a.views.find(x => x.id === view), msgs = new Set((v?.spec?.messages || []).map(m => m.id))
    try { board.current.show({ view, now, all: !now.some(id => msgs.has(id)), ...(para.upto ? { upto: para.upto } : {}) }) } catch {}
  }, [s.callId, s.para, R, showDiagram, bw, seqAs])

  // files: the tree or the map, the map built when shown and marked per paragraph
  const [fview, setFview] = useFilesView()
  const mapOpen = showFiles && fview === 'map', evInTree = showFiles && fview === 'list'
  const [hoverCell, setHoverCell] = useState(null)
  useEffect(() => {
    const el = mapEl.current
    tm.current = null
    if (!el || !inv?.files) return
    // a click on a marked cell opens its file at the first line the answer cites
    const line = f => (a?.paras || []).flatMap(p => p.evidence || []).find(e => e.file === f)?.start || 1
    tm.current = drawTreemap(el, inv.files, Math.max(260, el.clientWidth), 230, t, { labels: { cur: t.cur, cited: t.cited, read: t.read }, tint: R?.color,
      onHover: setHoverCell, onOpen: f => { try { fileOpener?.open(join(meta.root, f), { line: line(f) }) } catch {} } })
  }, [inv, s.callId, mapOpen, R, layout, (split ?? autoSplit) > 0.5])
  const read = new Set((meta?.reads || []).map(r => r.file))
  const cited = new Set((a?.paras || []).flatMap(citedFiles))
  const current = new Set(citedFiles(para))
  useEffect(() => { tm.current?.mark(read, cited, current) })

  // the cited files are listed at the top of the files pane: a new paragraph brings the list back into view, when the
  // reader scrolled down the tree (only up: the pane never moves sideways)
  const filesBody = useRef(null)
  const [scope, setScope] = useState('para'), [q, setQ] = useState(''), [folded, setFolded] = useState(false)
  useEffect(() => { setFolded(false) }, [s.callId])
  useEffect(() => {
    const el = filesBody.current, list = el?.querySelector('.rc-flat')
    if (el && list && el.scrollTop > list.offsetTop) el.scrollTo({ top: 0 })
  }, [s.callId, s.para])

  // playback: one paragraph every few seconds, stops at the last one
  const [playing, setPlaying] = useState(false)
  const [sayAll, setSayAll] = useState(false)
  useEffect(() => { setSayAll(false) }, [s.callId, s.para])
  useEffect(() => {
    if (!playing || !a) return
    if (s.para >= a.paras.length - 1) { setPlaying(false); return }
    const timer = setTimeout(() => store.set({ para: s.para + 1, src: 'panel' }), 3500)
    return () => clearTimeout(timer)
  }, [playing, s.para, s.callId])

  if (!a) return h('div', { className: 'rc-panel' }, h('div', { className: 'rc-empty' }, t.idle))
  const files = [...new Set([...current, ...cited, ...read])]
  const go = i => store.set({ para: Math.max(0, Math.min(a.paras.length - 1, i)), src: 'panel' })
  const open = (file, line) => { try { fileOpener?.open(join(meta.root, file), { line }) } catch {} }
  // the sequence / communication switch sits at the right of the diagram tabs while a sequence diagram is open
  const seqOpen = a.views.find(v => v.id === openView)?.type === 'sequence'
  const diagramPane = h('div', { key: 'd', className: 'rc-pane diagram' },
    // what the colours mean; pointing at one rings its places in the diagram and lights its region on the map
    R?.color.size ? h('div', { className: 'rc-regions' }, h('span', { className: 'rc-faint' }, t.regions),
      [...R.color].map(([p, c]) => h('span', { key: p, className: 'rc-region', style: { '--g': c },
        onMouseEnter: () => { board.current?.hover(regionIds(p)); tm.current?.spotPart(p) }, onMouseLeave: () => { board.current?.hover([]); tm.current?.spotPart(null) } },
        h('i'), p === '(根目录)' ? t.root : p))) : null,
    shrunk && layout === 'side' ? h('div', { className: 'rc-shrunk' }, h('span', { className: 'rc-faint' }, t.shrunk), h('button', { className: 'rc-link', onClick: () => setLayout('tabs') }, t.toTabs)) : null,
    h('div', { className: 'rc-boardw' + (seqOpen ? ' has-seqas' : '') }, h('div', { className: 'rc-board', ref: boardEl }),
      seqOpen ? h(SeqSwitch, { value: seqAs, set: setSeqAs, t }) : null))

  const nRead = new Set((meta.reads || []).map(r => r.file)).size
  const filesPane = h('div', { key: 'f', className: 'rc-pane files' },
    h('div', { className: 'rc-ph rc-files-h' }, h('b', null, t.filesTitle), h(ViewSwitch, { value: fview, set: setFview, t })),
    // one line of numbers (the card says how many files are cited; how many were read is said only here)
    h('div', { className: 'rc-fsum', title: t.fsumTip }, h('span', null, t.fsum(nRead, cited.size, para?.evidence ? para.evidence.length : null)),
      changes?.size ? (() => { const v = Object.values(changes.lines || {}), add = v.reduce((x, n) => x + n[0], 0), del = v.reduce((x, n) => x + n[1], 0)
        return h('span', { className: 'rc-repo' }, h('span', { className: 'rc-faint' }, t.repoDirty(changes.size)),
          v.length ? h('span', { className: 'rc-dirty' }, h('span', { className: 'add' }, '+' + add), h('span', { className: 'del' }, '−' + del)) : null) })() : null),
    evInTree ? h(TreeLegend, { t, readToo: [...read].some(f => !cited.has(f)), changes }) : null,
    h('div', { className: 'rc-pane-body', ref: filesBody },
    para?.evidence?.length && !evInTree ? h('div', null,
      h('div', { className: 'rc-ph' }, h('b', null, t.evidence), h('span', { className: 'rc-faint' }, t.places(para.evidence.length))),
      para.evidence.map((e, k) => h(EvidenceCode, { key: s.callId + ':' + s.para + ':' + k, root: meta.root, e, open, t }))) : null,
    evInTree ? (() => { const { roots, idx } = invOf(inv), labels = folderLabels(meta.root, idx, t === TX.en ? 'en' : 'zh', a.areas)
      // the tree holds every file of the answer, the cited ones and the ones only read (in their own colour), so each
      // number of the summary line can be found in it; the flat list above holds the cited ones
      const af = answerFiles(a, meta.reads, current), used = af.filter(f => f.cited.length)
      const evidence = new Map()
      ;(para?.evidence || []).forEach((e, k) => { if (e?.file) evidence.set(e.file, [...(evidence.get(e.file) || []), { e, k }]) })
      const ctx = { t, onOpen: open, regions, evidence, evKey: s.callId + ':' + s.para, root: meta.root, idx, roots, labels, changes }
      // the flat list: this paragraph's files in the order it cites them, or every cited file in answer order
      const here = [...evidence.keys()].map(f => af.find(x => x.file === f)).filter(Boolean)
      const flat = scope === 'para' ? here : used
      return h('div', null,
        inv?.files ? h(FindBox, { q, setQ, t }) : null,
        used.length ? h(FlatList, { title: t.citedHere, files: flat, ctx: { ...ctx, para: s.para }, scope, setScope, foldKey: ctx.evKey + scope }) : null,
        q.trim() ? h(Matches, { q, inv, used: new Map(af.map(f => [f.file, f])), ctx })
          : h('div', { className: 'rc-box rc-all' },
            h('div', { className: 'rc-bh' }, h('span', { className: 'rc-bt' }, t.allFiles),
              h('button', { className: 'rc-link rc-fold', onClick: () => setFolded(!folded) }, folded ? t.expandAll : t.collapseAll)),
            h(FileTree, { key: s.callId, tree: fileTree(af, idx, roots, labels), folded,
              name: lastSeg(slash(meta.root).replace(/\/+$/, '')), total: inv?.total, ctx }))) })() : null,
    mapOpen ? h('div', null,
      h('div', { className: 'rc-faint rc-mapnote' }, inv?.files ? `${t.map} · ${t.files(inv.total)}${inv.files.length > FILE_CELLS_MAX ? t.byFolder : ''}${inv.truncated ? t.drawn(inv.files.length) : ''}` : inv?.error ? t.loadFail : t.loading),
      h('div', { className: 'rc-map', ref: mapEl }),
      h('div', { className: 'rc-legend' }, h('i', { className: 'cur' }), t.cur, h('i', { className: 'cited' }), t.cited, h('i', { className: 'read' }), t.read,
        files.some(isDoc) ? [h('i', { key: 'i', className: 'doc' }), h('span', { key: 's' }, t.doc)] : null),
      h('ul', { className: 'rc-files' }, files.map(f => h('li', { key: f, className: (current.has(f) ? 'cur' : cited.has(f) ? 'cited' : 'read') + (hoverCell && tm.current?.cellOf(f) === hoverCell ? ' spot' : ''), title: t.openFile,
        onMouseEnter: () => tm.current?.spot([f]), onMouseLeave: () => tm.current?.spot([]), onClick: () => open(f, 1) },
        h('span', { className: 'rc-dot' + (isDoc(f) ? ' doc' : '') }), h('span', { className: 'rc-path' }, f),
        h('span', { className: 'rc-faint' }, current.has(f) ? t.curShort : cited.has(f) ? t.citedShort : t.read))))) : null))
  return h('div', { className: 'rc-panel rc-ans layout-' + layout, lang: t === TX.en ? 'en' : 'zh' },
    s.live?.open ? h('button', { className: 'rc-golive', onClick: () => store.set({ view: 'live' }) }, h('span', { className: 'rc-spin' }), t.goLive) : null,
    h('div', { className: 'rc-ph' }, h('b', null, (a.views.find(v => v.id === para?.view) || a.views[0])?.title || t.diagram), h('span', { className: 'rc-faint' }, t.paraOf(s.para + 1, a.paras.length)),
      h('span', { className: 'rc-nav' },
        h('button', { title: t.prev, onClick: () => go(s.para - 1) }, '‹'),
        h('button', { title: playing ? t.pause : t.play, className: 'rc-play', onClick: () => { if (!playing && s.para >= a.paras.length - 1) go(0); setPlaying(!playing) } }, playing ? '❚❚' : '▶'),
        h('button', { title: t.next, onClick: () => go(s.para + 1) }, '›')),
      h(LayoutSwitch, { value: layout, set: setLayout, t })),
    h('div', { className: 'rc-prog' }, a.paras.map((_, i) => h('i', { key: i, className: i === s.para ? 'on' : i < s.para ? 'past' : '', title: t.para(i + 1), onClick: () => go(i) }))),
    h('div', { className: 'rc-say' + (sayAll ? ' all' : ''), title: sayAll ? '' : t.sayTip, onClick: () => setSayAll(!sayAll), dangerouslySetInnerHTML: { __html: inline(para?.text || '') } }),
    layout === 'tabs' ? h('div', { className: 'rc-tabs', role: 'tablist' }, [['diagram', t.tabDiagram], ['files', t.tabFiles]].map(([k, l]) =>
      h('button', { key: k, role: 'tab', 'aria-selected': tab === k, className: tab === k ? 'on' : '', onClick: () => setTab(k) }, l))) : null,
    h('div', { className: 'rc-split', style: { '--split': split ?? autoSplit } },
      showDiagram ? diagramPane : null,
      layout !== 'tabs' ? h(Divider, { key: 'v', side: layout === 'side', set: setSplit, t }) : null,
      showFiles ? filesPane : null),
  )
}

// ------------------------------------------------------------------ styles
const STYLE = `
.rc-card,.rc-panel,.rc-pending{
--rc-bg:var(--dsw-alias-bg-layer-1,#fff);--rc-sub:var(--dsw-alias-markdown-code-block,#f6f8fb);
--rc-line:var(--dsw-alias-border-l2,#d9dee7);--rc-line2:var(--dsw-alias-border-l1,#e9ecf1);
--rc-text:var(--dsw-alias-label-primary,#1b1f24);--rc-text2:var(--dsw-alias-label-secondary,#475066);--rc-faint:var(--dsw-alias-label-tertiary,#8a94a6);
--rc-accent:var(--dsw-alias-link,#3b6cf6);--rc-accent-bg:color-mix(in srgb,var(--rc-accent) 12%,transparent);
--rc-ok:var(--dsw-alias-state-success-primary,#1b7a43);--rc-ok-bg:color-mix(in srgb,var(--rc-ok) 16%,transparent);
--rc-warn:var(--dsw-alias-state-warn-primary,#b26b00);--rc-warn-bg:color-mix(in srgb,var(--rc-warn) 16%,transparent);
--rc-bad:var(--dsw-alias-state-error-primary,#b4532a);--rc-bad-bg:color-mix(in srgb,var(--rc-bad) 16%,transparent);
--rc-cur:#f59e0b;--rc-cited:var(--rc-accent);--rc-read:color-mix(in srgb,var(--rc-accent) 50%,var(--rc-bg));--rc-read-fg:color-mix(in srgb,var(--rc-accent) 55%,var(--rc-text2));
--rc-git-m:#a87ee6;--rc-git-a:#3f9a5c;--rc-git-d:#d0573f;
--rc-hit:color-mix(in srgb,var(--rc-text) 30%,var(--rc-bg));--rc-cell:color-mix(in srgb,var(--rc-text) 9%,var(--rc-bg));
--ink:var(--rc-text);--muted:var(--rc-text2);--line:var(--rc-line);--surface:var(--rc-bg);--bg:var(--rc-sub);--accent:var(--rc-accent);--accent-soft:color-mix(in srgb,var(--rc-accent) 14%,var(--rc-sub));--danger:var(--rc-bad);
color:var(--rc-text)}
.rc-card{border:1px solid var(--rc-line);border-radius:12px;padding:12px 14px;margin:6px 0;background:var(--rc-bg);line-height:1.65}
.rc-meta .rc-hurried{order:3;flex-basis:100%;width:fit-content;max-width:100%}
.rc-evnote{font-size:12px;color:var(--rc-faint);margin:-2px 0 8px}
.rc-meta{display:flex;flex-wrap:wrap;row-gap:4px;gap:12px;align-items:center;font-size:12px;color:var(--rc-faint);margin-bottom:6px}
.rc-link{border:0;background:none;color:var(--rc-accent);cursor:pointer;font:inherit;padding:0}
.rc-hurried{color:var(--rc-warn);background:var(--rc-warn-bg);border-radius:8px;padding:0 6px;cursor:help;flex:none}
.rc-take{font-size:16px;font-weight:700;border-left:3px solid var(--rc-accent);padding:4px 10px;margin:4px 0 10px;background:var(--rc-accent-bg);border-radius:0 8px 8px 0}
.rc-card .rc-take code{font-size:14px;font-weight:600}
.rc-para{padding:6px 10px;border-left:3px solid transparent;border-radius:0 8px 8px 0;margin:2px 0;outline:none}
.rc-para.on{border-left-color:var(--rc-accent);background:var(--rc-accent-bg)}
.rc-n{font:11px ui-monospace,monospace;color:var(--rc-faint);margin-right:8px}
.rc-text code,.rc-say code,.rc-take code{font:12px ui-monospace,monospace;background:var(--dsw-alias-markdown-inline-code,#f1f3f6);padding:0 4px;border-radius:4px}
.rc-ref{color:var(--rc-accent);border-bottom:1px dashed var(--rc-accent)}
.rc-ev{margin:4px 0 0 26px;display:flex;flex-wrap:wrap;gap:4px 14px;align-items:center}
.rc-ask{border:0;background:none;padding:0;cursor:pointer;font-size:11.5px;color:var(--rc-accent);visibility:hidden}.rc-ask:hover{text-decoration:underline}
.rc-para:hover .rc-ask,.rc-para.on .rc-ask,.rc-para:focus-within .rc-ask{visibility:visible}
.rc-chip{font:11px ui-monospace,monospace;border:1px solid var(--rc-line);background:var(--rc-bg);border-radius:10px;padding:1px 8px;cursor:pointer;color:var(--rc-text2)}
.rc-chip.verified{border-color:color-mix(in srgb,var(--rc-ok) 60%,transparent);color:var(--rc-ok)}
.rc-chip.missing{text-decoration:line-through;color:var(--rc-faint)}
.rc-evsum{font-size:11.5px;border:none;background:none;padding:0;cursor:pointer;color:var(--rc-faint)}
.rc-evsum.doubt{color:color-mix(in srgb,var(--rc-warn) 55%,var(--rc-text))}.rc-evsum:hover{text-decoration:underline}
.rc-fups{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12px}
.rc-fup{border:1px dashed var(--rc-line);background:none;border-radius:14px;padding:2px 10px;cursor:pointer;font:inherit;color:var(--rc-text2)}
.rc-faint{color:var(--rc-faint);font-size:12px}
.rc-done .rc-faint{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rc-pending{color:var(--rc-faint);font-size:13px;padding:6px 0;display:flex;gap:8px;align-items:center}
.rc-pending.rc-done{color:var(--rc-ok)}.rc-pending.rc-retry{color:var(--rc-warn)}
.rc-spin{width:10px;height:10px;border-radius:50%;border:2px solid var(--rc-line);border-top-color:var(--rc-accent);animation:rc-spin 1s linear infinite}
@keyframes rc-spin{to{transform:rotate(360deg)}}
.rc-panel{padding:10px 12px;overflow:auto;height:100%;box-sizing:border-box;font-size:13px}
.rc-panel.rc-ans{display:flex;flex-direction:column;overflow:hidden;padding-bottom:4px}
.rc-ans>*{flex:none}.rc-ans>.rc-split{flex:1 1 0;min-height:0;display:flex;flex-direction:column}
.layout-side>.rc-split{flex-direction:row}
.rc-pane{min-height:0;min-width:0;display:flex;flex-direction:column;overflow:hidden}
.rc-pane.diagram{flex:0 0 calc(var(--split) * (100% - 9px))}.rc-pane.files{flex:1 1 0}
.layout-tabs .rc-pane.diagram,.layout-tabs .rc-pane.files{flex:1 1 0}
.rc-pane.diagram .rc-boardw{flex:1 1 0;min-height:80px;position:relative;display:flex;flex-direction:column}
.rc-boardw>.rc-board{flex:1 1 0;min-height:0;overflow:hidden}
.rc-seqas{position:absolute;top:9px;right:9px;z-index:3}.rc-boardw.has-seqas .cu-tabs{padding-right:112px}
.rc-board .cu-pane{flex:1 1 0;min-height:0;overflow:auto}.rc-board .cu-pane>svg{display:block;margin:0 auto}.rc-board .cu-pin svg{margin:0 auto}
.rc-pane-body{flex:1 1 0;min-height:0;overflow:hidden auto;padding-right:2px}
.rc-files-h{margin:6px 0 4px}
.rc-divider{flex:none;height:9px;cursor:row-resize;display:flex;align-items:center;justify-content:center;touch-action:none}
.rc-divider i{display:block;width:36px;height:3px;border-radius:2px;background:var(--rc-line)}
.rc-divider:hover i,.rc-divider.on i{background:var(--rc-accent)}
.layout-side .rc-divider{height:auto;width:9px;cursor:col-resize}.layout-side .rc-divider i{width:3px;height:36px}
.layout-side .rc-pane.files{padding-left:2px}
.rc-tabs{display:flex;gap:2px;border-bottom:1px solid var(--rc-line);margin:2px 0 8px}
.rc-tabs button{border:0;border-bottom:2px solid transparent;background:none;color:var(--rc-text2);font:13px system-ui,sans-serif;padding:4px 12px;margin-bottom:-1px;cursor:pointer}
.rc-tabs button.on{color:var(--rc-accent);border-bottom-color:var(--rc-accent);font-weight:600}
.rc-layout{display:inline-flex;gap:1px;margin-left:8px;border:1px solid var(--rc-line);border-radius:6px;overflow:hidden;flex:none}
.rc-layout button{border:0;background:var(--rc-bg);color:var(--rc-faint);width:24px;height:22px;padding:3px;cursor:pointer;display:inline-flex}
.rc-layout button svg{width:100%;height:100%}.rc-layout button:hover{color:var(--rc-text)}.rc-layout button.on{background:var(--rc-accent-bg);color:var(--rc-accent)}
.rc-ph{display:flex;gap:8px;align-items:center;margin:10px 0 6px}
.rc-nav{margin-left:auto;display:flex;gap:4px}.rc-nav button{border:1px solid var(--rc-line);background:var(--rc-bg);color:var(--rc-text);border-radius:6px;width:26px;cursor:pointer}
.rc-board{border:1px solid var(--rc-line);border-radius:10px;padding:8px;min-height:120px;overflow:auto;background:var(--rc-sub)}
.rc-say{font-size:13px;color:var(--rc-text);margin:2px 2px 8px;line-height:1.6;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;cursor:pointer}.rc-say.all{display:block}
.rc-fold{cursor:pointer;user-select:none;border-top:1px solid var(--rc-line);padding-top:8px}.rc-fold:hover b{text-decoration:underline}
.rc-fold:focus-visible{outline:2px solid var(--rc-accent);outline-offset:2px}.rc-right{margin-left:auto}.rc-mapnote{margin:0 0 6px}
.rc-map{position:relative}
.rc-tm{display:block;border-radius:8px;overflow:hidden}
.rc-tm .g rect.gb{fill:var(--rc-sub);stroke:var(--rc-bg);stroke-width:2}
.rc-tm .g.touched rect.gb{fill:color-mix(in srgb,var(--rc-accent) 10%,var(--rc-sub))}
.rc-tm .g text{font-size:9.5px;fill:var(--rc-faint);pointer-events:none;transition:opacity .25s}
.rc-tm .g.touched text{fill:var(--rc-text);font-weight:600}
.rc-tm rect.f{fill:var(--rc-cell);stroke:var(--rc-bg);stroke-width:.5;transition:fill .35s,opacity .25s}
.rc-tm rect.f.hit{fill:var(--rc-hit)}
.rc-tm rect.f.read{fill:var(--rc-read)}
.rc-tm rect.f.cited{fill:var(--rc-cited)}
.rc-tm rect.f.cur{fill:var(--rc-cur)}
.rc-tm rect.f.read,.rc-tm rect.f.cited,.rc-tm rect.f.cur{cursor:pointer}
/* with marks, the folders nothing touched step back; pointing at a file in the list fades all but its cell */
.rc-tm.marked .g:not(.touched) rect.f:not(.hit){opacity:.5}.rc-tm.marked .g:not(.touched) text{opacity:.6}
.rc-tm.spotting rect.f:not(.spot){opacity:.22}.rc-tm.spotting .ov{opacity:.3}
.rc-tm .ov,.rc-tm .hl{pointer-events:none}
.rc-tm .g.tint rect.gb{fill:color-mix(in srgb,var(--g) 24%,var(--rc-sub))}
.rc-tm .g.tint text{fill:color-mix(in srgb,var(--g) 80%,var(--rc-text))}
.rc-tm .g.tint rect.f:not(.read):not(.cited):not(.cur):not(.hit){fill:color-mix(in srgb,var(--g) 15%,var(--rc-cell))}
.rc-shrunk{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12px;margin:0 2px 6px}
.rc-regions{display:flex;flex-wrap:wrap;gap:4px 6px;align-items:center;margin:0 2px 6px}
.rc-region{display:inline-flex;gap:5px;align-items:center;padding:1px 7px;border-radius:10px;font:11.5px ui-monospace,monospace;color:var(--rc-text2);transition:background .15s;cursor:default}
.rc-region i{width:9px;height:9px;border-radius:3px;background:var(--g);flex:none}
.rc-region:hover{background:color-mix(in srgb,var(--g) 18%,transparent);color:var(--rc-text)}
/* places coloured by region: a light fill and a coloured edge at rest; cw-uml's lit and current states keep their look */
.rc-board .cu-node[style*="--cu-c"]:not(.cu-lit):not(.cu-now)>rect,.rc-board .cu-node[style*="--cu-c"]:not(.cu-lit):not(.cu-now)>ellipse,
.rc-board .cu-life[style*="--cu-c"]:not(.cu-now)>rect{fill:color-mix(in srgb,var(--cu-c) 10%,var(--cu-surface));stroke:color-mix(in srgb,var(--cu-c) 65%,var(--cu-line))}
.rc-board .cu-life[style*="--cu-c"]:not(.cu-now) .cu-lifeline{stroke:color-mix(in srgb,var(--cu-c) 45%,var(--cu-guide))}
.rc-tm .hatch{fill:var(--rc-bg);fill-opacity:.6}
.rc-tm .ring{fill:none;stroke:var(--rc-cur);stroke-width:2;filter:drop-shadow(0 0 3px var(--rc-cur))}
.rc-tm .ping{fill:none;stroke:var(--rc-cur);opacity:0;animation:rc-ping 1.1s ease-out 2}
@keyframes rc-ping{0%{opacity:.9;stroke-width:2}100%{opacity:0;stroke-width:18}}
.rc-tm .hov{fill:none;stroke:var(--rc-text);stroke-width:1.5}
.rc-tm .hl .spot{fill:none;stroke:var(--rc-text);stroke-width:2}
.rc-live.open .rc-tm .ring{animation:rc-pulse .9s ease-in-out infinite alternate}
@keyframes rc-pulse{from{opacity:1}to{opacity:.3}}
.rc-tip{position:absolute;z-index:5;pointer-events:none;max-width:300px;box-sizing:border-box;background:var(--rc-bg);color:var(--rc-text);border:1px solid var(--rc-line);border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.18);padding:6px 9px;font:11.5px/1.45 system-ui,sans-serif}
.rc-tip b{display:block;font:600 11.5px/1.4 ui-monospace,monospace;word-break:break-all}.rc-tip .rc-faint{font-size:11px}
.rc-tip-f{display:flex;gap:6px;align-items:center;margin-top:3px}
.rc-tip-f span{flex:1;min-width:0;font:11px ui-monospace,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rc-tip-f em{font-style:normal;color:var(--rc-faint);font-size:10.5px;flex:none}
.rc-tip i{width:8px;height:8px;border-radius:2px;flex:none}
.rc-tip i.cur,.rc-legend i.cur{background-color:var(--rc-cur)}.rc-tip i.cited,.rc-legend i.cited{background-color:var(--rc-cited)}
.rc-tip i.read,.rc-legend i.read{background-color:var(--rc-read)}.rc-tip i.hit,.rc-legend i.hit{background-color:var(--rc-hit)}
.rc-legend i.doc{background-color:var(--rc-cited)}
.rc-tip i.doc,.rc-legend i.doc,.rc-dot.doc{background-image:repeating-linear-gradient(45deg,color-mix(in srgb,var(--rc-bg) 60%,transparent) 0 1.6px,transparent 1.6px 3.5px)}
.rc-now{display:flex;gap:6px;align-items:center;font:12px ui-monospace,monospace;margin:2px 0 4px}.rc-now .rc-path{color:color-mix(in srgb,var(--rc-cur) 70%,var(--rc-text));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rc-nav .rc-back,.rc-golive{border:1px solid var(--rc-line);background:var(--rc-bg);color:var(--rc-text2);border-radius:6px;padding:1px 8px;cursor:pointer;font:12px system-ui,sans-serif;width:auto}
.rc-golive{display:flex;gap:8px;align-items:center;width:100%;margin:0 0 6px;padding:4px 8px;color:var(--rc-accent);border-color:color-mix(in srgb,var(--rc-accent) 50%,transparent)}
.rc-legend{display:flex;gap:6px;align-items:center;font-size:11px;color:var(--rc-faint);margin-top:4px}
.rc-legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-left:6px}
.rc-files{list-style:none;margin:0;padding:0;font:12px ui-monospace,monospace}
.rc-files li{display:flex;gap:6px;align-items:center;padding:2px 4px;margin:0 -4px;border-radius:4px;transition:background .15s}
.rc-files li:hover,.rc-files li.spot{background:color-mix(in srgb,var(--rc-accent) 12%,transparent)}
.rc-files .rc-path{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rc-dot{width:8px;height:8px;border-radius:2px;background-color:var(--rc-read);flex:none}
.rc-files li.cited .rc-dot{background-color:var(--rc-cited)}.rc-files li.cur .rc-dot{background-color:var(--rc-cur)}
.rc-files li.cur{font-weight:700}
.rc-empty{color:var(--rc-faint);padding:16px;text-align:center}
.rc-prog{display:flex;gap:3px;margin:0 0 6px}.rc-prog i{flex:1;height:4px;border-radius:2px;background:var(--rc-line);cursor:pointer}
.rc-prog i.past{background:color-mix(in srgb,var(--rc-accent) 40%,transparent)}.rc-prog i.on{background:var(--rc-accent)}
.rc-play{font-size:10px}
.rc-src{border:1px solid var(--rc-line);border-radius:8px;margin:0 0 6px;overflow:hidden}
.rc-src-h{display:flex;gap:6px;align-items:center;padding:3px 8px;background:var(--rc-sub);cursor:pointer;font:11.5px ui-monospace,monospace}
.rc-src-h .rc-path{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rc-src-h:hover .rc-path{text-decoration:underline}.rc-src-h:focus-visible{outline:2px solid var(--rc-accent);outline-offset:-2px}
.rc-caret{width:10px;color:var(--rc-faint);flex:none}
.rc-open{border:0;background:none;color:var(--rc-accent);cursor:pointer;font:11px system-ui,sans-serif;padding:0 2px;flex:none}
.rc-tag{font:11px system-ui,sans-serif;border-radius:8px;padding:0 6px;background:var(--rc-line2);color:var(--rc-text2)}
.rc-src:not(.verified) .rc-tag{background:var(--rc-warn-bg);color:var(--rc-warn)}.rc-src.missing .rc-tag{background:var(--rc-bad-bg);color:var(--rc-bad)}
.rc-code{margin:0;padding:4px 0;font:11.5px/1.5 ui-monospace,monospace;max-height:220px;overflow:auto;background:var(--rc-bg);color:var(--rc-text)}
.rc-code div{white-space:pre;padding:0 8px}.rc-code div.hot{background:color-mix(in srgb,var(--rc-cur) 18%,transparent)}
.rc-code .ln{display:inline-block;width:34px;color:var(--rc-faint);text-align:right;margin-right:10px;user-select:none}
.rc-files li{cursor:pointer}.rc-files li:hover .rc-path{text-decoration:underline}
.rc-seg{margin-left:auto;display:inline-flex;border:1px solid var(--rc-line);border-radius:7px;overflow:hidden;flex:none}
.rc-seg button{border:0;background:var(--rc-bg);color:var(--rc-text2);font:12px system-ui,sans-serif;padding:1px 10px;cursor:pointer}
.rc-seg button+button{border-left:1px solid var(--rc-line)}.rc-seg button:hover{color:var(--rc-text)}
.rc-seg button.on{background:var(--rc-accent-bg);color:var(--rc-accent);font-weight:600}
.rc-tree{font:13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;margin:4px 0 0 -6px;--rc-folder:#7fa7e3;--rc-guide:color-mix(in srgb,var(--rc-line) 70%,transparent)}
.rc-row{display:flex;gap:6px;align-items:center;min-height:22px;padding:0 6px;border-radius:5px;cursor:pointer;white-space:nowrap;min-width:0;position:relative}
.rc-row:hover{background:color-mix(in srgb,var(--rc-text) 6%,transparent)}.rc-row:focus-visible{outline:2px solid var(--rc-accent);outline-offset:-2px}
.rc-row.root{cursor:default;font-weight:600}.rc-row.root:hover{background:none}
.rc-kids{margin-left:12px;padding-left:4px;border-left:1px solid var(--rc-guide)}.rc-kids.root{margin-left:0;padding-left:0;border-left:0}
.rc-chev{width:12px;height:12px;flex:none;color:var(--rc-faint);display:inline-flex;transition:transform .12s}.rc-chev.open{transform:rotate(90deg)}
.rc-chev svg,.rc-ic svg{width:100%;height:100%;display:block}
.rc-ic{width:16px;height:16px;flex:none;display:inline-flex}
.rc-folder{color:var(--rc-folder)}.rc-folder.tinted{color:var(--g)}.rc-row.idle .rc-folder{color:color-mix(in srgb,var(--rc-faint) 70%,transparent)}
.rc-name{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;color:var(--rc-text)}
.rc-row.dir.idle .rc-name{color:var(--rc-text2)}.rc-row.dir.cur .rc-name{color:color-mix(in srgb,var(--rc-cur) 70%,var(--rc-text))}
.rc-label{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;color:var(--rc-faint);font-size:12px}
.rc-end{margin-left:auto;flex:none;display:inline-flex;gap:8px;align-items:center;padding-left:8px}
.rc-cnt{font:11px ui-monospace,monospace;font-variant-numeric:tabular-nums;color:var(--rc-faint);min-width:14px;text-align:right}
.rc-cnt.cited{color:var(--rc-cited)}.rc-cnt.cur{color:color-mix(in srgb,var(--rc-cur) 80%,var(--rc-text))}
.rc-curdot{width:6px;height:6px;border-radius:50%;background:var(--rc-cur)}
.rc-row.file .rc-fpath{flex:0 1 auto}
.rc-row.file .rc-base{color:var(--rc-text2)}.rc-row.file.cited .rc-base{color:color-mix(in srgb,var(--rc-cited) 75%,var(--rc-text))}.rc-row.file.read .rc-base{color:var(--rc-read-fg)}
.rc-git{font:600 11px ui-monospace,monospace;flex:none;padding:0 2px}.rc-gitdot{width:6px;height:6px;border-radius:50%;background:var(--rc-git-m);flex:none}.rc-git.M{color:var(--rc-git-m)}.rc-git.A{color:var(--rc-git-a)}.rc-git.D{color:var(--rc-git-d)}
.rc-row.file.cur .rc-base{color:color-mix(in srgb,var(--rc-cur) 50%,var(--rc-text));font-weight:600}
.rc-row.file.cur{background:color-mix(in srgb,var(--rc-cur) 13%,transparent)}.rc-row.file.cur:hover{background:color-mix(in srgb,var(--rc-cur) 20%,transparent)}
.rc-row.file.idle .rc-base{color:var(--rc-faint)}.rc-row.file.idle .rc-ic{opacity:.7}
.rc-row.file:hover .rc-base{text-decoration:underline}
.rc-ranges{font:11px ui-monospace,monospace;color:var(--rc-faint)}.rc-fw.open .rc-ranges{color:var(--rc-text2)}
.rc-warn-tag{font:11px system-ui,sans-serif;border-radius:8px;padding:0 6px;background:var(--rc-warn-bg);color:var(--rc-warn)}.rc-warn-tag.missing{background:var(--rc-bad-bg);color:var(--rc-bad)}
.rc-acts{display:none;gap:2px}.rc-row:hover .rc-acts,.rc-row:focus-within .rc-acts,.rc-fw.open>.rc-row .rc-acts{display:inline-flex}
.rc-acts button{border:0;background:none;color:var(--rc-accent);cursor:pointer;font:11.5px system-ui,sans-serif;padding:0 3px;border-radius:3px}
.rc-acts button:hover{background:color-mix(in srgb,var(--rc-accent) 12%,transparent)}
.rc-peek{min-width:0;margin:2px 0 6px 40px;border:1px solid var(--rc-line);border-radius:6px;overflow:hidden}
.rc-peek .rc-code+.rc-code{border-top:1px dashed var(--rc-line)}
/* under a file row the pane is narrow: long lines wrap (a wrapped part starts under the code, not under the number) */
.rc-peek .rc-code div{white-space:pre-wrap;overflow-wrap:anywhere;padding-left:52px;text-indent:-44px}
.rc-plus{align-items:center;justify-content:center;font:600 13px/1 system-ui,sans-serif;letter-spacing:1px;color:var(--rc-faint)}
.rc-row.more .rc-name{color:var(--rc-faint);font-size:12px}.rc-row.more:hover .rc-name,.rc-row.more:hover .rc-plus{color:var(--rc-accent)}
.rc-now-tag{flex:none;font:11px system-ui,sans-serif;color:color-mix(in srgb,var(--rc-cur) 70%,var(--rc-text))}
.rc-jump{border:0;background:none;padding:0;font:inherit;color:inherit;cursor:pointer;display:inline-flex;gap:3px;align-items:center}
.rc-jump:hover{color:var(--rc-accent);text-decoration:underline}
.rc-tlegend{display:flex;flex-wrap:wrap;gap:2px 8px;align-items:center;min-width:0;font:11px system-ui,sans-serif;color:var(--rc-faint);font-weight:400}
.rc-tlegend>*{white-space:nowrap}.rc-ph>b{white-space:nowrap}
.rc-tlegend span{display:inline-flex;gap:3px;align-items:center}
.rc-tlegend .cur{color:color-mix(in srgb,var(--rc-cur) 70%,var(--rc-text));font-weight:600}.rc-tlegend .cited{color:var(--rc-cited)}.rc-tlegend .read{color:var(--rc-read-fg)}
.rc-fpath{flex:1;min-width:0;display:flex;overflow:hidden;white-space:nowrap}
.rc-fsum{display:flex;flex-wrap:wrap;gap:0 8px;align-items:center;font-size:12px;color:var(--rc-text2);margin:0 0 2px;cursor:default}
.rc-files-h+.rc-fsum+.rc-tlegend,.rc-live .rc-ph+.rc-tlegend{margin:0 0 4px}
.rc-dirty{display:inline-flex;gap:4px;align-items:center;font:11px ui-monospace,monospace;flex:none}.rc-dirty .add{color:var(--rc-git-a)}.rc-dirty .del{color:var(--rc-git-d)}
.rc-dirty.warn>span:last-child{font:11px system-ui,sans-serif;border-radius:8px;padding:0 6px;background:var(--rc-warn-bg);color:color-mix(in srgb,var(--rc-warn) 50%,var(--rc-text))}
.rc-box{border:1px solid var(--rc-line);border-radius:8px;padding:2px 4px 4px;margin:6px 0}
.rc-box .rc-tree{margin:0}
.rc-bh{display:flex;align-items:center;gap:8px;min-height:24px;padding:0 6px}
.rc-bt{font:600 11px system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--rc-text2);white-space:nowrap}
.rc-bh .rc-seg{margin-left:auto}.rc-bh .rc-seg button{font-size:11px;padding:0 8px}
.rc-bh .rc-seg+.rc-pill{margin-left:0}
.rc-pill{margin-left:auto;font:11px ui-monospace,monospace;font-variant-numeric:tabular-nums;border-radius:9px;padding:0 7px;background:var(--rc-accent-bg);color:var(--rc-accent)}
.rc-fold{margin-left:auto;font-size:11.5px}
.rc-flat .rc-row.file .rc-fpath{flex:0 1 auto}
.rc-flat .rc-peek{margin-left:24px}
.rc-plinks{display:inline-flex;gap:2px}.rc-plinks button{border:0;background:none;padding:0 3px;border-radius:3px;cursor:pointer;font:11px system-ui,sans-serif;color:var(--rc-text2)}
.rc-plinks button.on{color:var(--rc-text);font-weight:600}.rc-plinks button:hover{color:var(--rc-accent);background:color-mix(in srgb,var(--rc-accent) 12%,transparent)}
.rc-row.file.cited{background:color-mix(in srgb,var(--rc-cited) 7%,transparent)}.rc-row.file.cited:hover{background:color-mix(in srgb,var(--rc-cited) 12%,transparent)}
.rc-repo{display:inline-flex;gap:6px;align-items:center}
.rc-tlegend .git{display:inline-flex;gap:6px;align-items:center}
.rc-find{display:block;width:100%;box-sizing:border-box;margin:6px 0 0;padding:4px 8px;border:1px solid var(--rc-line);border-radius:7px;background:var(--rc-bg);color:var(--rc-text);font:12.5px system-ui,sans-serif}
.rc-find::placeholder{color:var(--rc-faint)}.rc-find:focus{outline:2px solid color-mix(in srgb,var(--rc-accent) 60%,transparent);outline-offset:-1px;border-color:transparent}
.rc-none{padding:4px 6px}
.rc-fpath .rc-dir{color:var(--rc-faint);overflow:hidden;text-overflow:ellipsis;min-width:0;flex:0 1 auto}.rc-fpath .rc-base{flex:none}
.rc-files li:hover .rc-base{text-decoration:underline}.rc-files li.cur .rc-base{font-weight:700}.rc-tree .rc-files li.cur{font-weight:400}
`

// ------------------------------------------------------------------ registration
let openPanel = () => {}, closePanel = () => {}
// the tab's chip title. dockkit fades the last ~30 px of an active chip's title under its close button: the trailing
// space keeps the whole name readable
const TabTitle = () => h('span', { style: { paddingInlineEnd: 26 } }, 'Decode')

exports.inject = ['slots', 'sidebarRight', 'sidebarRightTabs', 'uiConversation']
exports.apply = function apply(ctx) {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-decode'
    style.textContent = STYLE + '\n' + CW_UML_CSS
    document.head.appendChild(style)
    return () => style.remove()
  }, 'decode: styles')
  openPanel = () => { try { ctx.sidebarRight.openTab(TAB_KIND) } catch (e) { console.warn('[decode] open panel', e) } }
  // only when our tab is the one on screen: a tab the reader moved to has their attention
  closePanel = () => { try { const a = ctx.sidebarRight.active(); if (a?.kind === TAB_KIND) ctx.sidebarRight.close(a.id) } catch (e) { console.warn('[decode] close panel', e) } }
  // bench/ scripts set the panel state directly (the live panel without a running question)
  try { window.__decode = { store } } catch {}
  ctx.effect(() => ctx.sidebarRightTabs.register({
    id: TAB_ID, kind: TAB_KIND, priority: 'extension', title: () => 'Decode',
  }), 'decode: tab type')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab', key: TAB_ID }, PanelBody,
  )), 'decode: tab body')
  ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab.title', () => ctx.slots.register(
    { name: 'sidebar.right.pane.tab.title', key: TAB_ID }, TabTitle,
  )), 'decode: tab title')
  ctx.effect(() => ctx.uiConversation.events.register(turnDefinition), 'decode: turn answers')
  // live map while the agent reads: a view target fed by tool events, watched from each session header
  uiConversation = ctx.uiConversation
  ctx.effect(() => ctx.uiConversation.views.register(liveView), 'decode: live view')
  ctx.effect(() => ctx.uiConversation.events.register(liveDefinition), 'decode: live turns')
  ctx.effect(() => ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register(
    { name: 'conversation.session.header.actions', id: 'decode-live', order: 900 }, LiveWatch,
  )), 'decode: live watch')
  ctx.effect(() => ctx.slots.inject('conversation.chat.turnTail', () => ctx.slots.register(
    { name: 'conversation.chat.turnTail', id: 'decode-answer', order: 5 }, TurnAnswer,
  )), 'decode: answer card')
  ctx.effect(() => ctx.slots.inject('tool.call.toolview', () => ctx.slots.register(
    { name: 'tool.call.toolview', key: 'submit_answer' }, AnswerView,
  )), 'decode: answer row')
}
