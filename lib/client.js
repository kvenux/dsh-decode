window.__ModuleLoader__.load({ id: "dsh-decode", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
var CW_UML_CSS = "/* Copyright (c) 2026 Keven Sun. MIT License. */\n/* cw-uml: colours come from the host page's tokens when it has them */\n.cu{--cu-ink:var(--ink,#1b1f24);--cu-muted:var(--muted,#6b7280);--cu-line:var(--line,#d0d5dc);--cu-surface:var(--surface,#fff);--cu-bg:var(--bg,#f6f7f9);--cu-accent:var(--accent,#1f5fa8);--cu-accent-soft:var(--accent-soft,#e3edf8);--cu-danger:var(--danger,#b42318);\n  --cu-weak:var(--uml-weak,color-mix(in srgb,var(--cu-ink) 42%,var(--cu-bg)));--cu-ghost:var(--uml-ghost,color-mix(in srgb,var(--cu-ink) 20%,var(--cu-bg)));--cu-guide:var(--uml-guide,color-mix(in srgb,var(--cu-ink) 18%,var(--cu-bg)));\n  display:block;font-family:inherit;overflow:visible}\n.cu text{font-size:12px;fill:var(--cu-muted);text-anchor:middle;dominant-baseline:middle;pointer-events:none}\n.cu marker path{fill:context-stroke}\n.cu marker path.cu-open{fill:none;stroke:context-stroke;stroke-width:1.4}\n.cu marker path.cu-tri{fill:var(--cu-surface);stroke:context-stroke;stroke-width:1.3}\n.cu-cls .cu-cname{font-weight:700;fill:var(--cu-ink)}.cu-cls .cu-csep{stroke:var(--cu-line)}\n.cu-node.cu-cls .cu-field rect{fill:transparent;stroke:none}.cu-node.cu-cls .cu-field text{font-size:10.5px;text-anchor:start;fill:var(--cu-ink);font-weight:400}\n.cu-node.cu-cls .cu-field.cu-now rect{fill:var(--cu-accent-soft)}.cu-node.cu-cls .cu-field.cu-now text{font-weight:700}\n.cu-r-ref .cu-line{stroke-dasharray:5 3}\n.cu [data-id]{cursor:pointer;outline:none}\n.cu [data-id]:focus-visible rect,.cu [data-id]:focus-visible ellipse{stroke:var(--cu-accent);stroke-width:2.5}\n.cu-token{fill:var(--cu-accent);opacity:0;pointer-events:none}\n.cu-token.on{opacity:1}\n@keyframes cu-draw{to{stroke-dashoffset:0}}\n@keyframes cu-march{to{stroke-dashoffset:-20}}\n@keyframes cu-pulse{50%{opacity:.45}}\n@keyframes cu-glow{0%{filter:drop-shadow(0 0 0 var(--cu-accent))}35%{filter:drop-shadow(0 0 7px var(--cu-accent))}100%{filter:drop-shadow(0 0 0 transparent)}}\n/* an element that just became current glows once; one the host points at (a name under the pointer in the text) is ringed */\n.cu-flash{animation:cu-glow 1s ease-out 1}\n.cu-hover rect,.cu-hover ellipse,.cu-hover .cu-diamond,.cu-hover .cu-paper{stroke:var(--cu-accent)!important;stroke-width:3!important;stroke-dasharray:none!important}\n.cu-hover .cu-arrow,.cu-hover .cu-line{stroke:var(--cu-accent)!important;stroke-width:3!important}\n.cu-hover text{fill:var(--cu-ink)!important;font-weight:700}\ntr.cu-hover{outline:2px solid var(--cu-accent);outline-offset:-2px}\n\n/* boxes shared by most views */\n.cu-node rect,.cu-node ellipse,.cu-node .cu-diamond{fill:var(--cu-surface);stroke:color-mix(in srgb,var(--cu-c,var(--cu-muted)) 45%,var(--cu-line));stroke-width:1.2;transition:fill .3s,stroke .3s,stroke-width .3s,opacity .3s}\n.cu-node.cu-k-external rect{stroke-dasharray:4 3}\n.cu-node.cu-lit rect,.cu-node.cu-lit ellipse,.cu-node.cu-lit .cu-diamond{fill:color-mix(in srgb,var(--cu-c,var(--cu-accent)) 12%,var(--cu-surface));stroke:var(--cu-c,var(--cu-accent))}\n.cu-node.cu-lit text{fill:var(--cu-ink)}\n.cu-node.cu-now rect,.cu-node.cu-now ellipse,.cu-node.cu-now .cu-diamond{fill:color-mix(in srgb,var(--cu-c,var(--cu-accent)) 30%,var(--cu-surface));stroke:var(--cu-c,var(--cu-accent));stroke-width:2.4}\n.cu-node.cu-now text{font-weight:700;fill:var(--cu-ink)}\n.cu-node:hover rect,.cu-node:hover ellipse{stroke-width:2}\n.cu-picked rect,.cu-picked ellipse,.cu-picked .cu-diamond{stroke:var(--cu-accent)!important;stroke-width:3!important}\n.cu-badge{font-size:10.5px!important;fill:var(--cu-danger)!important;text-anchor:end!important;font-weight:700}\n.cu-dot{fill:var(--cu-ink)}\n.cu-ring{fill:none;stroke:var(--cu-ink);stroke-width:1.4}\n/* a start or end point the text names */\n.cu-node.cu-now .cu-dot{fill:var(--cu-accent)}.cu-node.cu-now .cu-ring{stroke:var(--cu-accent);stroke-width:2.4}\n\n/* edges: polylines of horizontal and vertical segments (or one straight segment) */\n.cu-edge .cu-line{fill:none;stroke:var(--cu-muted);stroke-width:1.3;stroke-linejoin:miter;transition:stroke .3s,opacity .3s}\n.cu-edge .cu-hitp{fill:none;stroke:transparent;stroke-width:12}\n.cu-edge:not([data-id]) .cu-hitp{display:none}\n.cu-elabel rect{fill:var(--cu-bg);stroke:none}\n.cu-elabel text{font-size:10.5px;fill:var(--cu-ink)}\n.cu-edge.cu-lit .cu-line{stroke:var(--cu-accent);stroke-width:2}\n.cu-edge.cu-now .cu-line{stroke:var(--cu-accent);stroke-width:2.6}\n.cu-elabel{cursor:pointer;transition:opacity .3s}\n.cu-elabel.cu-now rect{fill:var(--cu-accent-soft);stroke:var(--cu-accent)}\n.cu-elabel.cu-now text,.cu-elabel.cu-lit text{font-weight:700}\n.cu-elabel.cu-off{opacity:.35}\n.cu-edge.cu-off{opacity:.3}\n.cu-edge.cu-picked .cu-line{stroke:var(--cu-ink);stroke-width:2.4}\n/* a picked node's neighbourhood: its edges and the nodes at their other ends; the rest fades */\n.cu-edge.cu-nbe .cu-line{stroke:var(--cu-accent);stroke-width:2.4}\n.cu-elabel.cu-nbe text{font-weight:700}\n.cu-node.cu-nb rect,.cu-node.cu-nb ellipse,.cu-node.cu-nb .cu-diamond,.cu-node.cu-nb circle{stroke:var(--cu-accent);stroke-width:2}\n.cu-dim{opacity:.28;transition:opacity .15s}\n.cu-edge[data-id]:hover .cu-line{stroke-width:2.2}\n.cu-edge.cu-enter .cu-line{stroke-dasharray:600;stroke-dashoffset:600;animation:cu-draw .5s ease forwards}\n\n/* sequence */\n.cu-life rect{fill:var(--cu-surface);stroke:color-mix(in srgb,var(--cu-c,var(--cu-muted)) 45%,var(--cu-line));stroke-width:1.2;transition:fill .3s,stroke .3s}\n.cu-life.cu-k-external rect{stroke-dasharray:4 3}\n.cu-lifeline{stroke:var(--cu-guide);stroke-width:1.2;stroke-dasharray:3 4}\n.cu-life.cu-active rect{stroke:var(--cu-c,var(--cu-muted))}\n.cu-life.cu-active text{fill:var(--cu-ink)}\n.cu-life.cu-now rect{fill:color-mix(in srgb,var(--cu-c,var(--cu-accent)) 22%,var(--cu-surface));stroke:var(--cu-c,var(--cu-accent));stroke-width:2.2}\n.cu-life.cu-now text{font-weight:700}\n.cu-life.cu-now .cu-lifeline{stroke:var(--cu-c,var(--cu-accent));stroke-dasharray:none;opacity:.5}\n.cu-msg .cu-hit{stroke:transparent;stroke-width:14}\n.cu-msg .cu-arrow{stroke:var(--cu-weak);stroke-width:1.4;transition:stroke .3s,opacity .3s}\n.cu-msg path.cu-arrow{fill:none}\n.cu-msg.cu-m-return .cu-arrow{stroke-dasharray:5 4}\n.cu-msg.cu-m-async .cu-arrow{stroke-dasharray:1 3}\n.cu-msg{transition:opacity .3s}\n.cu-msg.cu-future .cu-arrow,.cu-msg.cu-skip .cu-arrow{stroke:var(--cu-ghost)}\n.cu-msg.cu-future .cu-num{opacity:.55}\n.cu-msg.cu-skip{opacity:.45}\n.cu-msg.cu-skip .cu-label,.cu-msg.cu-skip .cu-slabel{display:none}\n/* messages not reached yet keep their text, faint: a diagram of bare arrows reads as broken (RepoCompass review 2026-11-06) */\n.cu-msg.cu-future .cu-label,.cu-msg.cu-future .cu-slabel{opacity:.55}\n.cu-msg .cu-label rect,.cu-msg .cu-slabel rect{fill:var(--cu-bg);stroke:none}\n.cu-msg .cu-slabel text{font-size:11px;fill:var(--cu-ink)}\n/* every message shows its text (RepoCompass review 2026-11-06: text cut to the span hid the flow the reader had passed;\n   one message per row, so a label wider than its arrow covers no other label). A message to itself has its text right\n   of its loop; its number only where no text fits there. */\n.cu-msg .cu-label text{font-size:11px;fill:var(--cu-ink)}\n.cu-msg .cu-num circle{fill:var(--cu-surface);stroke:var(--cu-line)}\n.cu-msg .cu-num text{font-size:9.5px;font-weight:700}\n.cu-msg:not(.cu-self) .cu-num,.cu-msg.cu-short .cu-num{display:none}\n.cu-msg.cu-self .cu-label,.cu-msg .cu-slabel{display:none}.cu-msg.cu-short:not(.cu-skip) .cu-slabel{display:inline}\n.cu-msg.cu-now .cu-slabel rect{fill:var(--cu-accent-soft);stroke:var(--cu-accent)}.cu-msg.cu-now .cu-slabel text{font-weight:700}\n.cu-msg.cu-now .cu-arrow{stroke:var(--cu-accent);stroke-width:2.4}\n.cu-msg.cu-now .cu-label rect{fill:var(--cu-accent-soft);stroke:var(--cu-accent)}\n.cu-msg.cu-now .cu-label text{font-weight:700}\n.cu-msg.cu-enter .cu-arrow{stroke-dasharray:400;stroke-dashoffset:400;animation:cu-draw .42s ease forwards}\n.cu-msg.cu-picked .cu-arrow{stroke:var(--cu-ink);stroke-width:2.4}\n.cu-msg:hover .cu-arrow{stroke-width:2.4}\n.cu-frag .cu-fbox{fill:none;stroke:var(--cu-muted);stroke-width:1.2}\n.cu-frag .cu-fragtag{fill:var(--cu-surface);stroke:var(--cu-muted)}\n.cu-frag .cu-sep{stroke:var(--cu-muted);stroke-width:1.2;stroke-dasharray:6 4}\n.cu-frag text{text-anchor:start;font-size:11px;fill:var(--cu-ink)}\n.cu-frag .cu-ftag{font-weight:700}\n.cu-frag.cu-now .cu-fbox{stroke:var(--cu-accent);stroke-width:2;stroke-dasharray:6 4;animation:cu-march 1s linear infinite}\n.cu-frag.cu-now .cu-ftag{fill:var(--cu-accent)}\n.cu-guard.cu-chosen{fill:var(--cu-accent);font-weight:700}\n.cu-guard.cu-out{opacity:.45;text-decoration:line-through}\n\n/* communication */\n.cu-link line{stroke:var(--cu-line);stroke-width:1.3;transition:stroke .3s}\n.cu-link.cu-lit line{stroke:var(--cu-muted)}\n.cu-link.cu-now line{stroke:var(--cu-accent);stroke-width:2.4}\n.cu-cm rect{fill:var(--cu-bg);stroke:none}\n.cu-cm text{font-size:10.5px;fill:var(--cu-ink)}\n.cu-cm.cu-now rect{fill:var(--cu-accent-soft);stroke:var(--cu-accent)}\n.cu-cm.cu-now text{font-weight:700}\n.cu-cm.cu-picked rect{stroke:var(--cu-ink)}\n\n/* component */\n.cu-dep .cu-line{stroke:var(--cu-muted)}\n.cu-dep.cu-hide{opacity:0}\n.cu-dep.cu-on .cu-line{stroke:var(--cu-accent);stroke-width:1.8;stroke-dasharray:6 4;animation:cu-march 1.2s linear infinite}\n\n/* package */\n.cu-pkg .cu-tab{fill:var(--cu-surface);stroke:color-mix(in srgb,var(--cu-c,var(--cu-muted)) 45%,var(--cu-line));stroke-width:1.2}\n.cu-pkg .cu-pname,.cu-dnode .cu-pname{text-anchor:start;font-weight:700;fill:var(--cu-ink)}\n.cu-kid rect,.cu-art rect{fill:var(--cu-bg);stroke:var(--cu-line);stroke-width:1}\n.cu-kid text,.cu-art text{font-size:10.5px}\n.cu-kid.cu-now rect,.cu-art.cu-now rect{fill:var(--cu-accent-soft);stroke:var(--cu-accent)}\n.cu-kid.cu-lit rect,.cu-art.cu-lit rect{stroke:var(--cu-accent)}\n.cu-use .cu-line{stroke-dasharray:5 3}\n.cu-rev .cu-line{stroke:var(--cu-danger);stroke-width:1.6}\n\n/* state machine and activity */\n.cu-act.cu-off{opacity:.38}\n.cu-act.cu-blocked rect,.cu-act.cu-blocked .cu-diamond{fill:color-mix(in srgb,var(--cu-danger) 16%,var(--cu-surface))!important;stroke:var(--cu-danger)!important;stroke-width:2.6!important}\n.cu-act.cu-blocked text{fill:var(--cu-danger);font-weight:700}\n.cu-act.cu-k-ref rect{stroke-width:1.6}\n.cu-act.cu-k-ref .cu-fragtag{fill:var(--cu-surface);stroke:var(--cu-line)}\n.cu-act .cu-ftag{text-anchor:start;font-size:9.5px;font-weight:700}\n.cu-act .cu-dname{text-anchor:start;font-size:10.5px}\n.cu-bar{fill:var(--cu-ink)!important;stroke:none!important}\n.cu-lane rect{fill:none;stroke:var(--cu-line);stroke-width:1}\n.cu-lane text{font-size:11px;font-weight:700}\n.cu-state.cu-now rect{animation:cu-pulse 1.6s ease-in-out 1}\n\n/* use case */\n.cu-system rect{fill:none;stroke:var(--cu-line);stroke-width:1.2}\n.cu-sysname,.cu-ghead{text-anchor:start!important;font-weight:700}\n.cu-ghead{font-size:10.5px!important;text-anchor:middle!important}\n.cu-stereo{text-anchor:start!important}\n.cu-ghead,.cu-stereo{paint-order:stroke;stroke:var(--cu-bg);stroke-width:4px;stroke-linejoin:round}\n.cu-actor circle,.cu-actor path{fill:none;stroke:var(--cu-ink);stroke-width:1.4}\n.cu-actor text{fill:var(--cu-ink);font-size:11px}\n.cu-actor.cu-now circle,.cu-actor.cu-now path{stroke:var(--cu-accent);stroke-width:2.2}\n.cu-case text{font-size:12px}\n.cu-assoc{fill:none;stroke:color-mix(in srgb,var(--cu-muted) 75%,transparent);stroke-width:1.2;stroke-linecap:round;transition:stroke .2s,stroke-width .2s}\n.cu-assoc.cu-on{stroke:var(--cu-accent);stroke-width:2.2}\n.cu-inc path{fill:none;stroke:var(--cu-muted);stroke-width:1.2;stroke-dasharray:5 3}\n.cu-inc text{font-size:10px}\n.cu-inc.cu-on path{stroke:var(--cu-accent)}\n\n/* deployment */\n.cu-dnode .cu-face{fill:color-mix(in srgb,var(--cu-line) 50%,var(--cu-surface));stroke:var(--cu-line);stroke-width:1}\n.cu-dnode.cu-k-cloud rect{rx:10}\n.cu-dlink line,.cu-dlink path{stroke:var(--cu-muted);stroke-width:1.3;fill:none}\n.cu-dlink.cu-on line,.cu-dlink.cu-on path{stroke:var(--cu-accent);stroke-width:2.2}\n\n/* timing */\n.cu-trow{fill:none!important;stroke:none!important}\n.cu-tl:nth-child(even) .cu-trow{fill:color-mix(in srgb,var(--cu-bg) 60%,transparent)!important}\n.cu-tname{text-anchor:start!important;font-weight:700;fill:var(--cu-ink)!important}\n.cu-tstate{text-anchor:end!important;font-size:10px!important}\n.cu-tstate.cu-now{fill:var(--cu-accent)!important;font-weight:700}\n.cu-wave{fill:none;stroke:var(--cu-c,var(--cu-accent));stroke-width:1.8;stroke-linejoin:miter}\n.cu-tl.cu-now .cu-wave{stroke-width:2.8}\n.cu-mark line{stroke:var(--cu-line);stroke-dasharray:3 3}\n.cu-mark text{font-size:10px}\n.cu-axis line{stroke:var(--cu-line)}\n.cu-axis text{font-size:10px}\n.cu-cursor{stroke:var(--cu-accent);stroke-width:1.6;opacity:0;transition:opacity .2s}\n.cu-cursor.on{opacity:1}\n\n/* constraint notes */\n.cu-note .cu-paper{fill:color-mix(in srgb,#f5c542 16%,var(--cu-surface));stroke:color-mix(in srgb,#c89411 50%,var(--cu-line));stroke-width:1}\n.cu-note .cu-fold{fill:none;stroke:color-mix(in srgb,#c89411 50%,var(--cu-line))}\n.cu-note text{text-anchor:start;font-size:10.5px;fill:var(--cu-ink)}\n.cu-note .cu-anchor{fill:none;stroke:color-mix(in srgb,#c89411 50%,var(--cu-line));stroke-width:1;stroke-dasharray:3 3;opacity:.6}\n.cu-note.cu-now .cu-paper{stroke:#c89411;stroke-width:2}\n.cu-note.cu-now .cu-anchor{opacity:1;stroke-width:1.6}\n.cu-note.cu-picked .cu-paper{stroke:var(--cu-accent);stroke-width:2.4}\n\n/* decision table */\n/* decision table: \"if these conditions, then these results\"; a card with the two groups labelled and an arrow between */\n.cu-table{overflow-x:auto}\n.cu-table table{border-collapse:separate;border-spacing:0;font-size:12.5px;line-height:1.45;width:100%;color:var(--cu-ink);background:var(--cu-surface);border:1px solid var(--cu-line);border-radius:10px;overflow:hidden}\n.cu-table th,.cu-table td{padding:7px 10px;text-align:left;vertical-align:top;border-bottom:1px solid color-mix(in srgb,var(--cu-line) 70%,transparent)}\n.cu-table tbody tr:last-child td{border-bottom:none}\n.cu-table thead th{font-size:11.5px;font-weight:600;color:var(--cu-muted);background:color-mix(in srgb,var(--cu-ink) 3%,var(--cu-surface));border-bottom:1px solid var(--cu-line)}\n.cu-table thead .cu-tgroup th{font-size:10.5px;font-weight:700;letter-spacing:.06em;padding:6px 10px 0;border-bottom:none}\n.cu-table thead .cu-tgroup th.cu-res{color:var(--cu-accent)}\n.cu-table thead th.cu-res{background:color-mix(in srgb,var(--cu-accent) 7%,var(--cu-surface))}\n.cu-table th.cu-arrow,.cu-table td.cu-arrow{width:16px;padding-left:0;padding-right:0;text-align:center;color:var(--cu-muted)}\n.cu-table td.cu-arrow{font-weight:700}\n.cu-table .cu-val{display:inline-block;padding:1px 9px;border-radius:11px;font-weight:600;background:color-mix(in srgb,var(--cu-ink) 6%,var(--cu-surface));border:1px solid var(--cu-line);transition:background .25s,border-color .25s,color .25s}\n.cu-table .cu-val.cu-short{white-space:nowrap}\n.cu-table td.cu-any{color:var(--cu-muted);font-style:italic}\n.cu-table td.cu-then{background:color-mix(in srgb,var(--cu-accent) 3%,var(--cu-surface))}\n.cu-table td.cu-same{color:var(--cu-muted)}\n.cu-table tbody tr{cursor:pointer;transition:opacity .25s}\n.cu-table tbody tr td{transition:background .25s,box-shadow .25s}\n.cu-table tbody tr:hover td{background:color-mix(in srgb,var(--cu-accent) 6%,var(--cu-surface))}\n.cu-table tbody tr.cu-off{opacity:.3}\n.cu-table tbody tr.cu-now td{background:var(--cu-accent-soft)}\n.cu-table tbody tr.cu-now td:first-child{box-shadow:inset 3px 0 0 var(--cu-accent)}\n.cu-table tbody tr.cu-now td.cu-then{color:var(--cu-ink);font-weight:600}\n.cu-table tbody tr.cu-now .cu-val{background:var(--cu-accent);border-color:var(--cu-accent);color:var(--cu-surface)}\n.cu-table tbody tr.cu-picked td{box-shadow:inset 0 2px 0 var(--cu-accent),inset 0 -2px 0 var(--cu-accent)}\n.cu-tfilters{display:flex;flex-direction:column;gap:6px;margin:0 0 8px}\n.cu-tfilter{display:flex;flex-wrap:wrap;gap:4px;align-items:center;font-size:11.5px;color:var(--cu-muted)}\n.cu-tfilter span{margin-right:4px;font-weight:600}\n.cu-tfilter button{font:inherit;font-size:11.5px;color:var(--cu-ink);background:var(--cu-surface);border:1px solid var(--cu-line);border-radius:12px;padding:1px 10px;cursor:pointer;transition:background .15s,border-color .15s}\n.cu-tfilter button:hover{border-color:var(--cu-accent)}\n.cu-tfilter button.on{background:var(--cu-accent);border-color:var(--cu-accent);color:var(--cu-surface)}\n\n/* board */\n.cu-board{display:flex;flex-direction:column;gap:8px;min-height:0}\n.cu-tabs{display:flex;flex-wrap:wrap;gap:4px}\n.cu-tabs button{border:1px solid var(--line,#d0d5dc);background:none;border-radius:999px;padding:2px 12px;font:inherit;font-size:13px;color:var(--muted,#6b7280);cursor:pointer}\n.cu-tabs button[aria-selected=\"true\"]{background:var(--accent-soft,#e3edf8);border-color:var(--accent,#1f5fa8);color:var(--accent,#1f5fa8);font-weight:700}\n.cu-pane{min-height:0;overflow:auto}\n.cu-pin{position:sticky;top:0;z-index:2;height:0;overflow:visible}.cu-pin svg{display:block}.cu-pinbg{fill:var(--cu-bg)}\n@media (prefers-reduced-motion:reduce){.cu *{animation:none!important;transition:none!important}}\n.cu-band rect{fill:color-mix(in srgb,var(--cu-muted) 6%,transparent);stroke:color-mix(in srgb,var(--cu-muted) 22%,transparent);stroke-dasharray:4 3}\n.cu-band text{font-size:11px;fill:var(--cu-muted);letter-spacing:.06em;dominant-baseline:middle;text-anchor:start}\n.cu-band .cu-bandlab{fill:var(--cu-bg);stroke:color-mix(in srgb,var(--cu-muted) 22%,transparent);stroke-dasharray:none}\n.cu-node.cu-k-ctx{opacity:.5;transition:opacity .15s}\n.cu-node.cu-k-ctx.cu-now,.cu-node.cu-k-ctx.cu-lit,.cu-node.cu-k-ctx.cu-picked,.cu-node.cu-k-ctx.cu-nb,.cu-node.cu-k-ctx:hover{opacity:1}\n\n/* a route over the component map (spec.trail) */\n.cu-tr .cu-trl{fill:none;stroke:var(--cu-accent);stroke-width:1.6;opacity:.55}\n.cu-tr .cu-trn{fill:var(--cu-bg,#fff);stroke:var(--cu-accent);stroke-width:1.2}\n.cu-tr text{font-size:9.5px;text-anchor:middle;fill:var(--cu-accent);font-weight:600;pointer-events:none}\n.cu-tr-next{opacity:.28}.cu-tr-next .cu-trl{stroke-dasharray:4 4}\n.cu-tr-done .cu-trl{opacity:.75}\n.cu-tr-now .cu-trl{opacity:1;stroke-width:2.6;stroke-dasharray:7 5;animation:cu-march .7s linear infinite}\n.cu-tr-now .cu-trn{fill:var(--cu-accent)}.cu-tr-now text{fill:#fff}\n.cu-comp .cu-node.cu-off{opacity:.3;transition:opacity .2s}\n\n/* grids: story map, service blueprint, matrix */\n.cu-grid text{font-size:11px;fill:var(--cu-ink);text-anchor:middle;dominant-baseline:auto}\n.cu-grid .cu-off{opacity:.28;transition:opacity .2s}\n.cu-grid .cu-node{cursor:pointer}\n.cu-smk rect{fill:var(--cu-bg);stroke:none}.cu-smk text{text-anchor:start;font-weight:700;fill:var(--cu-muted);letter-spacing:.04em}\n.cu-smk.cu-now rect,.cu-smk.cu-lit rect{fill:var(--cu-accent-soft)}\n.cu-smc rect{fill:var(--cu-accent-soft);stroke:color-mix(in srgb,var(--cu-accent) 40%,var(--cu-line))}.cu-smc text{font-weight:600}\n.cu-smp.cu-bad rect{stroke:var(--cu-danger);stroke-dasharray:4 3}\n.cu-smar{stroke:var(--cu-muted);stroke-width:1.2;fill:none}\n.cu-bpcol{fill:transparent;transition:fill .2s}.cu-bpcol.cu-now{fill:color-mix(in srgb,var(--cu-accent-soft) 70%,transparent)}\n.cu-bph rect{fill:var(--cu-bg)}.cu-bph text{font-weight:600}\n.cu-bpln{fill:var(--cu-muted) !important;font-size:10.5px}\n.cu-bpsep{stroke:var(--cu-line);stroke-width:.8}\n.cu-bpvis{stroke:var(--cu-accent);stroke-width:1.4;stroke-dasharray:6 4}.cu-bpvl{text-anchor:end !important;fill:var(--cu-accent) !important;font-size:10px}\n.cu-bpm rect{fill:var(--cu-surface)}\n.cu-bpt text{text-anchor:start;font-size:10.5px;fill:var(--cu-ink2,var(--cu-ink))}.cu-bpt.cu-bad text{fill:var(--cu-danger)}\n.cu-mx text{font-size:10.5px}\n.cu-mxh rect{fill:transparent;stroke:none}.cu-mxh text{text-anchor:start}.cu-mxh.cu-now rect,.cu-mxh.cu-lit rect{fill:var(--cu-accent-soft)}\n.cu-mxr rect{fill:transparent;stroke:none}.cu-mxr text{text-anchor:start}.cu-mxr.cu-now rect,.cu-mxr.cu-lit rect{fill:var(--cu-accent-soft)}\n.cu-mxr:hover rect{fill:var(--cu-bg)}\n.cu-mxh.cu-flat text{text-anchor:middle;fill:var(--cu-ink)}.cu-mx .cu-mxr text{fill:var(--cu-ink)}\n.cu-mxcol{fill:transparent;stroke:var(--cu-line);stroke-width:.4}.cu-mxcol.cu-now{fill:color-mix(in srgb,var(--cu-accent-soft) 60%,transparent)}\n.cu-mxc rect{fill:color-mix(in srgb,var(--cu-accent) 22%,var(--cu-surface))}.cu-mxc text{fill:var(--cu-accent);font-weight:700}\n.cu-mxc.cu-now rect,.cu-mxc.cu-lit rect{fill:var(--cu-accent)}.cu-mxc.cu-now text,.cu-mxc.cu-lit text{fill:#fff}\n.cu-mxc{cursor:pointer}\n\n/* trace */\n.cu-trace text{text-anchor:start;font-size:11px}\n.cu-trh{font-weight:700;fill:var(--cu-muted,#6b7280)}.cu-trk{font-weight:700;font-size:11.5px}\n.cu-trc text{fill:var(--cu-muted,#6b7280);font-size:10.5px}.cu-trc.cu-lit text,.cu-trc.cu-now text{fill:var(--cu-ink);font-weight:700}\n.cu-trs rect{fill:var(--cu-surface,#fff);stroke:var(--cu-line)}\n.cu-trm rect{fill:var(--cu-surface,#fff);stroke:var(--cu-c,var(--cu-line));stroke-width:1.3}.cu-trm.cu-alone rect{stroke-dasharray:3 2}\n.cu-trr rect{fill:var(--cu-surface,#fff);stroke:var(--cu-c,var(--cu-line));stroke-width:1.6}.cu-trr text{font-weight:600}\n.cu-trl{fill:none;stroke:var(--cu-line);transition:opacity .15s,stroke .15s}.cu-trl.cu-on{stroke:var(--cu-accent)}.cu-trl.cu-off{opacity:.12}\n.cu-trace .cu-now rect,.cu-trace .cu-lit rect{stroke:var(--cu-accent);stroke-width:2}.cu-trace .cu-now rect{fill:var(--cu-accent-soft)}.cu-trace .cu-now text,.cu-trace .cu-lit text{font-weight:700}\n\n/* deployment, nested */\n.cu-dep-n .cu-dnode rect{fill:var(--cu-surface);stroke:var(--cu-line);stroke-width:1.2}\n.cu-dep-n .cu-dnode.cu-k-env rect{fill:color-mix(in srgb,var(--cu-bg) 70%,var(--cu-surface));stroke-dasharray:none}\n.cu-dep-n .cu-dnode.cu-k-external rect{stroke-dasharray:4 3}\n.cu-dep-n .cu-stereo{font-size:9.5px;fill:var(--cu-muted)}\n.cu-dep-n .cu-pname{font-size:11.5px}\n.cu-dep-n .cu-lname{font-size:11.5px;font-weight:700;fill:var(--cu-ink);text-anchor:middle}.cu-dep-n .cu-dnode.cu-now>.cu-lname{fill:var(--cu-accent)}\n.cu-dep-n .cu-art rect,.cu-dep-n .cu-art path{fill:var(--cu-surface);stroke:var(--cu-line)}\n.cu-dep-n .cu-art .cu-doc{fill:none}\n.cu-dep-n .cu-art text{font-size:10.5px;text-anchor:middle}\n.cu-dep-n .cu-dnode.cu-now>rect,.cu-dep-n .cu-art.cu-now rect,.cu-dep-n .cu-art.cu-now path{stroke:var(--cu-accent);stroke-width:2.4;fill:var(--cu-accent-soft)}\n.cu-dep-n .cu-dnode.cu-now>.cu-pname,.cu-dep-n .cu-art.cu-now text{fill:var(--cu-accent);font-weight:700}\n.cu-dep-n .cu-dnode.cu-lit>rect{stroke:var(--cu-accent);stroke-width:1.6}\n.cu-dep-n rect,.cu-dep-n path{transition:stroke .15s,fill .15s}\n.cu-dep-n .cu-elabel{opacity:0;pointer-events:none;transition:opacity .15s}\n.cu-dep-n .cu-dlink.cu-say .cu-elabel,.cu-dep-n .cu-dlink:hover .cu-elabel{opacity:1}\n.cu-dep-n .cu-dlink.cu-say .cu-elabel.cu-noroom{opacity:0}.cu-dep-n .cu-dlink:hover .cu-elabel.cu-noroom{opacity:1}\n.cu-dep-n .cu-dlink path.cu-hit{stroke:transparent;stroke-width:9;pointer-events:stroke}\n.cu-dep-n .cu-dlink path:not(.cu-hit){stroke:color-mix(in srgb,var(--cu-muted) 60%,transparent);stroke-width:1.1}\n.cu-dep-n .cu-dlink.cu-on path:not(.cu-hit){stroke:var(--cu-accent);stroke-width:2.2}\n.cu-dep-n .cu-dlink:hover path:not(.cu-hit){stroke:var(--cu-accent)}\n.cu-dep-n .cu-elabel rect{fill:var(--cu-surface);stroke:var(--cu-accent);stroke-width:.8}.cu-dep-n .cu-elabel text{font-size:10px;text-anchor:middle;fill:var(--cu-ink)}\n.cu-dep-n .cu-dlink.cu-on .cu-elabel text{fill:var(--cu-accent);font-weight:700}\n\n/* related: one thing and what it is related to */\n.cu-related .cu-rlm rect{fill:var(--cu-surface,#fff);stroke:var(--cu-c,var(--cu-line));stroke-width:1.3}\n.cu-related .cu-rlm text{text-anchor:middle;font-size:11.5px}\n.cu-related .cu-rlc rect{stroke-width:2.2}.cu-related .cu-rlc text{font-weight:700;font-size:12.5px}\n.cu-related .cu-rle .cu-trl{stroke:var(--cu-line);stroke-width:1.2}\n.cu-related .cu-rlb{fill:var(--cu-bg,#fff);stroke:none}.cu-related .cu-rlt{text-anchor:middle;font-size:10px;fill:var(--cu-muted,#6b7280)}\n.cu-related .cu-rle.cu-on .cu-trl{stroke:var(--cu-accent);stroke-width:2}.cu-related .cu-rle.cu-on .cu-rlt{fill:var(--cu-accent);font-weight:700}\n.cu-related .cu-rll{stroke-width:1.1}\n.cu-related .cu-now rect{fill:var(--cu-accent-soft)}\n";
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

;(function () {
// Made by scripts/icons.mjs from vscode-icons (MIT, github.com/vscode-icons/vscode-icons): the icons icons.js names.
// Make it again after naming a new id in icons.js rather than editing this file.
const ICON_SVGS = {"default-file":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#c5c5c5\" d=\"M20.414 2H5v28h22V8.586ZM7 28V4h12v6h6v18Z\"/></svg>",
"file-type-npm":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#c12127\" d=\"M2 2h28v28H2\"/><path fill=\"#fff\" d=\"M7.25 7.25h17.5v17.5h-3.5v-14H16v14H7.25\"/></svg>",
"file-type-pnpm":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#f9ad00\" d=\"M30 10.75h-8.749V2H30Zm-9.626 0h-8.75V2h8.75Zm-9.625 0H2V2h8.749ZM30 20.375h-8.749v-8.75H30Z\"/><path fill=\"#fff\" d=\"M20.374 20.375h-8.75v-8.75h8.75Zm0 9.625h-8.75v-8.75h8.75ZM30 30h-8.749v-8.75H30Zm-19.251 0H2v-8.75h8.749Z\"/></svg>",
"file-type-yarn":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#2188b6\" d=\"M28.208 24.409a10.5 10.5 0 0 0-3.959 1.822a23.7 23.7 0 0 1-5.835 2.642a1.63 1.63 0 0 1-.983.55a62 62 0 0 1-6.447.577c-1.163.009-1.876-.3-2.074-.776a1.573 1.573 0 0 1 .866-2.074a4 4 0 0 1-.514-.379c-.171-.171-.352-.514-.406-.388c-.225.55-.343 1.894-.947 2.5c-.83.839-2.4.559-3.328.072c-1.019-.541.072-1.813.072-1.813a.73.73 0 0 1-.992-.343a4.85 4.85 0 0 1-.667-2.949a5.37 5.37 0 0 1 1.749-2.895a9.3 9.3 0 0 1 .658-4.4a10.45 10.45 0 0 1 3.165-3.661S6.628 10.747 7.35 8.817c.469-1.262.658-1.253.812-1.308a3.6 3.6 0 0 0 1.452-.857a5.27 5.27 0 0 1 4.41-1.7S15.2 1.4 16.277 2.09a18.4 18.4 0 0 1 1.533 2.886s1.281-.748 1.425-.469a11.33 11.33 0 0 1 .523 6.132a14 14 0 0 1-2.6 5.411c-.135.225 1.551.938 2.615 3.887c.983 2.7.108 4.96.262 5.212c.027.045.036.063.036.063s1.127.09 3.391-1.308a8.5 8.5 0 0 1 4.277-1.604a1.081 1.081 0 0 1 .469 2.11Z\"/></svg>",
"file-type-bun":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#fbf0df\" d=\"M29 17c0 5.65-5.82 10.23-13 10.23S3 22.61 3 17c0-3.5 2.24-6.6 5.66-8.44S14.21 4.81 16 4.81s3.32 1.54 7.34 3.71C26.76 10.36 29 13.46 29 17\"/><path fill=\"none\" stroke=\"#000\" d=\"M16 27.65c7.32 0 13.46-4.65 13.46-10.65c0-3.72-2.37-7-5.89-8.85c-1.39-.75-2.46-1.41-3.37-2l-1.13-.69A6.14 6.14 0 0 0 16 4.35a6.9 6.9 0 0 0-3.3 1.23c-.42.24-.86.51-1.32.8c-.87.54-1.83 1.13-3 1.73C4.91 10 2.54 13.24 2.54 17c0 6 6.14 10.65 13.46 10.65Z\"/><ellipse cx=\"21.65\" cy=\"18.62\" fill=\"#febbd0\" rx=\"2.17\" ry=\"1.28\"/><ellipse cx=\"10.41\" cy=\"18.62\" fill=\"#febbd0\" rx=\"2.17\" ry=\"1.28\"/><path fill-rule=\"evenodd\" d=\"M11.43 18.11a2 2 0 1 0-2-2.05a2.05 2.05 0 0 0 2 2.05m9.2 0a2 2 0 1 0-2-2.05a2 2 0 0 0 2 2.05\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M10.79 16.19a.77.77 0 1 0-.76-.77a.76.76 0 0 0 .76.77m9.2 0a.77.77 0 1 0 0-1.53a.77.77 0 0 0 0 1.53\"/><path fill=\"#b71422\" stroke=\"#000\" stroke-width=\".75\" d=\"M18.62 19.67a3.3 3.3 0 0 1-1.09 1.75a2.48 2.48 0 0 1-1.5.69a2.53 2.53 0 0 1-1.5-.69a3.28 3.28 0 0 1-1.08-1.75a.26.26 0 0 1 .29-.3h4.58a.27.27 0 0 1 .3.3Z\"/><path fill=\"#ccbea7\" fill-rule=\"evenodd\" d=\"M14.93 5.75a6.1 6.1 0 0 1-2.09 4.62c-.1.09 0 .27.11.22c1.25-.49 2.94-1.94 2.23-4.88c-.03-.15-.25-.11-.25.04m.85 0a6 6 0 0 1 .57 5c0 .13.12.24.21.13c.83-1 1.54-3.11-.59-5.31c-.1-.11-.27.04-.19.17Zm1-.06a6.1 6.1 0 0 1 2.53 4.38c0 .14.21.17.24 0c.34-1.3.15-3.51-2.66-4.66c-.12-.02-.21.18-.09.27ZM9.94 9.55a6.27 6.27 0 0 0 3.89-3.33c.07-.13.28-.08.25.07c-.64 3-2.79 3.59-4.13 3.51c-.14-.01-.14-.21-.01-.25\"/></svg>",
"file-type-docker":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#3a4e55\" d=\"M18.191 13.071H20.7v2.566h1.27a5.5 5.5 0 0 0 1.744-.292a4.5 4.5 0 0 0 .848-.383a3.15 3.15 0 0 1-.589-1.623a3.43 3.43 0 0 1 .616-2.416l.264-.305l.314.253a4 4 0 0 1 1.575 2.538a3.84 3.84 0 0 1 2.913.271l.345.2l-.181.354a3.63 3.63 0 0 1-3.648 1.74c-2.173 5.413-6.9 7.976-12.642 7.976A7.96 7.96 0 0 1 6.3 20.211l-.025-.043l-.226-.459a7.3 7.3 0 0 1-.579-3.693l.035-.38h2.143v-2.565h2.51v-2.51h5.02v-2.51h3.012v5.02Z\"/><path fill=\"#00aada\" d=\"M26.324 14.021a3.31 3.31 0 0 0-1.418-2.821a3.07 3.07 0 0 0 .289 3.821a5.28 5.28 0 0 1-3.225 1.037H5.883a6.8 6.8 0 0 0 .667 3.737l.183.335a6 6 0 0 0 .379.569q.992.064 1.829.045a9 9 0 0 0 2.669-.389a.193.193 0 1 1 .126.365q-.135.047-.281.088a8.4 8.4 0 0 1-1.845.3c.044 0-.046.007-.046.007l-.082.007a22 22 0 0 1-2.008-.006l-.01.007a7.88 7.88 0 0 0 6.063 2.41c5.56 0 10.276-2.465 12.365-8c1.482.152 2.906-.226 3.553-1.49a3.5 3.5 0 0 0-3.122-.022\"/><path fill=\"#27b9ec\" d=\"M26.324 14.021a3.31 3.31 0 0 0-1.418-2.821a3.07 3.07 0 0 0 .289 3.821a5.28 5.28 0 0 1-3.225 1.037H6.836a5.22 5.22 0 0 0 2.106 4.686a9 9 0 0 0 2.669-.389a.193.193 0 1 1 .126.365q-.135.047-.281.088a9 9 0 0 1-1.894.314l-.019-.022c1.892.971 4.636.967 7.782-.241a21.87 21.87 0 0 0 9.1-6.889l-.1.048\"/><path fill=\"#088cb9\" d=\"M5.913 17.732a6.4 6.4 0 0 0 .637 2.061l.183.335a6 6 0 0 0 .379.569q.992.064 1.829.045a9 9 0 0 0 2.669-.389a.193.193 0 1 1 .126.365q-.135.047-.281.088a8.8 8.8 0 0 1-1.891.307h-.1q-.438.025-.922.026c-.351 0-.709-.007-1.1-.026a7.9 7.9 0 0 0 6.076 2.413c4.76 0 8.9-1.807 11.3-5.8Z\"/><path fill=\"#039cc7\" d=\"M6.98 17.732a4.83 4.83 0 0 0 1.961 3.01a9 9 0 0 0 2.669-.389a.193.193 0 1 1 .126.365q-.135.047-.281.088a9 9 0 0 1-1.9.307c1.892.971 4.628.957 7.773-.252a20.6 20.6 0 0 0 5.377-3.13Z\"/><path fill=\"#00acd3\" d=\"M9.889 13.671h.172v1.813h-.172zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813H9.23v-1.813Zm-.33 0h.179v1.813H8.9v-1.813Zm-.33 0h.179v1.813H8.57zm-.323 0h.172v1.813h-.17v-1.813Zm-.181-.181h2.175v2.176H8.066V13.49Zm4.335-2.329h.172v1.813H12.4zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.178v1.813h-.178zm-.323 0h.172v1.813h-.172zm-.181-.181h2.176v2.176h-2.175z\"/><path fill=\"#26c2ee\" d=\"M12.4 13.671h.172v1.813H12.4zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.178v1.813h-.178zm-.323 0h.172v1.813h-.172zm-.181-.181h2.176v2.176h-2.175z\"/><path fill=\"#00acd3\" d=\"M14.909 13.671h.172v1.813h-.172zm-.33 0h.179v1.813h-.178zm-.33 0h.179v1.813h-.178zm-.33 0h.181v1.813h-.179v-1.813Zm-.33 0h.179v1.813h-.179zm-.323 0h.172v1.813h-.172zm-.181-.181h2.176v2.176h-2.174V13.49Z\"/><path fill=\"#26c2ee\" d=\"M14.909 11.161h.172v1.813h-.172zm-.33 0h.179v1.813h-.178zm-.33 0h.179v1.813h-.178zm-.33 0h.181v1.813h-.179v-1.813Zm-.33 0h.179v1.813h-.179zm-.323 0h.172v1.813h-.172zm-.181-.181h2.176v2.176h-2.174v-2.177Zm4.335 2.691h.172v1.813h-.172zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813H16.1zm-.323 0h.172v1.813h-.172zm-.177-.181h2.176v2.176H15.6z\"/><path fill=\"#00acd3\" d=\"M17.42 11.161h.172v1.813h-.172zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813H16.1zm-.323 0h.172v1.813h-.172zm-.181-.181h2.176v2.176H15.6v-2.177Z\"/><path fill=\"#26c2ee\" d=\"M17.42 8.65h.172v1.813h-.172zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813H16.1zm-.323 0h.172v1.813h-.172zm-.177-.181h2.176v2.176H15.6z\"/><path fill=\"#00acd3\" d=\"M19.93 13.671h.17v1.813h-.17zm-.33 0h.178v1.813H19.6zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.33 0h.179v1.813h-.179zm-.323 0h.172v1.813h-.172zm-.181-.181h2.176v2.176h-2.175z\"/><path fill=\"#d5eef2\" d=\"M12.616 19.193a.6.6 0 1 1-.6.6a.6.6 0 0 1 .6-.6\"/><path fill=\"#3a4e55\" d=\"M12.616 19.363a.4.4 0 0 1 .156.029a.175.175 0 1 0 .241.236a.43.43 0 1 1-.4-.265M2 17.949h27.92c-.608-.154-1.923-.362-1.707-1.159c-1.105 1.279-3.771.9-4.444.267c-.749 1.087-5.111.674-5.415-.173c-.939 1.1-3.85 1.1-4.789 0c-.3.847-4.666 1.26-5.415.173c-.673.631-3.338 1.012-4.444-.267c.217.8-1.1 1.005-1.707 1.159\"/><path fill=\"#c0dbe1\" d=\"M14.211 23.518a5.3 5.3 0 0 1-2.756-2.711a9.2 9.2 0 0 1-1.987.3q-.436.024-.917.025q-.554 0-1.168-.033a7.94 7.94 0 0 0 6.145 2.43q.344 0 .683-.013\"/><path fill=\"#d5eef2\" d=\"M12.007 21.773a5.2 5.2 0 0 1-.552-.966a9.2 9.2 0 0 1-1.987.3a6.3 6.3 0 0 0 2.539.664\"/></svg>",
"file-type-git":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#dd4c35\" d=\"M29.472 14.753L17.247 2.528a1.8 1.8 0 0 0-2.55 0l-2.539 2.539l3.22 3.22a2.141 2.141 0 0 1 2.712 2.73l3.1 3.1a2.143 2.143 0 1 1-1.285 1.21l-2.895-2.895v7.617a2.141 2.141 0 1 1-1.764-.062V12.3a2.146 2.146 0 0 1-1.165-2.814l-3.17-3.172L2.528 14.7a1.8 1.8 0 0 0 0 2.551l12.225 12.221a1.8 1.8 0 0 0 2.55 0L29.472 17.3a1.8 1.8 0 0 0 0-2.551\"/><path fill=\"#fff\" d=\"m12.158 5.067l3.22 3.22a2.141 2.141 0 0 1 2.712 2.73l3.1 3.1a2.143 2.143 0 1 1-1.285 1.21l-2.895-2.895v7.617a2.141 2.141 0 1 1-1.764-.062V12.3a2.146 2.146 0 0 1-1.165-2.814l-3.17-3.172\"/></svg>",
"file-type-dotenv":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g fill-rule=\"evenodd\"><path d=\"M3.17 3.17h25.66v25.66H3.17z\"/><path fill=\"#ecd53f\" fill-rule=\"nonzero\" d=\"M30 2v28H2V2zM14.76 20.54H9.98v6.44h4.9v-1.09h-3.6v-1.75h3.23v-1.08h-3.23v-1.43h3.48zm2.5 0h-1.27v6.44h1.21v-4.2l2.6 4.2h1.3v-6.44h-1.2v4.3zm5.97 0h-1.41l2.3 6.44h1.39l2.3-6.44h-1.37l-1.58 4.76zM8.3 24.96H6.34v1.96H8.3z\"/></g></svg>",
"file-type-prettier":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g stroke-linecap=\"round\" stroke-width=\"1.33\"><path stroke=\"#56b3b4\" d=\"M2.45 2.45h16.3M2.45 7.87h9.48m10.8 0h1.35m-16.3 2.71h1.35M13.19 16h10.8m-21.7 2.71h5.42m-5.42 8.13H5\"/><path stroke=\"#ea5e5e\" d=\"M2.45 5.16h4.06m12.2 5.42h6.77M2.48 16h1.35m6.77 2.71h5.42m-13.5 10.8h6.77\"/><path stroke=\"#f7b93e\" d=\"M9.23 5.16h13.5m-20.3 5.42h2.71m13.5 2.71h6.77M6.41 16h4.06m-4.06 5.42h12.2m-10.8 5.42h1.35\"/><path stroke=\"#bf85bf\" d=\"M14.6 7.87h5.42m-17.6 5.42h6.77m9.48 5.42h4.06m-20.3 2.71h1.35m-1.35 2.71H9.2\"/><path stroke=\"#4d616e\" d=\"M21.4 2.45h8.13m-4.06 2.71h4.06m-2.71 2.71h2.71m-17.6 2.71h4.06m12.2 0h1.35m-17.6 2.71H16m12.2 0h1.35M26.84 16h2.71m-4.06 2.71h4.06m-8.13 2.71h2.71m2.71 0h2.71m-17.6 2.71h2.71m2.71 0h12.2m-17.6 2.71h5.42m2.71 0h1.35m2.71 0h5.42m-17.6 2.71h8.13m2.71 0h6.77\" opacity=\".5\"/></g></svg>",
"file-type-readme":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g fill=\"none\" stroke=\"#755838\" stroke-width=\"1.449\"><path stroke-width=\"2.083\" d=\"M2.152 22.497s6.713.03 9.02 1.016l2.202 1.06l2.181 1.394\"/><path stroke-width=\"2.019\" d=\"M2.22 6.166s6.964-.106 9.377.824l2.307 1.008l2.292 1.338\"/><path stroke-width=\"2.001\" d=\"M3.206 5.483L3.15 23.227M15.971 8.62l-.055 17.744\"/><path stroke-width=\"2.083\" d=\"M29.848 22.498s-6.713.03-9.02 1.016l-2.202 1.06l-2.181 1.394\"/><path stroke-width=\"2.019\" d=\"M29.78 6.167s-6.964-.106-9.377.824L18.096 8l-2.292 1.338\"/><path stroke-width=\"2.001\" d=\"m28.794 5.484l.056 17.744M16.029 8.622l.055 17.744\"/><path stroke-width=\"2.027\" d=\"m16.012 8.74l.055 18.226\"/></g></svg>",
"file-type-claude":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#d97757\" d=\"m7.5 20.61l5.5-3.08l.1-.27l-.1-.15h-.27l-.92-.06a234 234 0 0 1-8.51-.34l-.67-.14l-.62-.82l.06-.41l.56-.38l.8.07c3.08.2 6.15.4 9.21.72h.46l.06-.19l-.16-.1l-.12-.12l-2.74-1.86c-2.04-1.3-3.55-2.43-5.38-3.68l-.43-.54l-.18-1.18l.76-.84l1.03.07l.26.07c2.03 1.6 4.1 3.14 6.17 4.66l.43.36l.17-.12l.02-.09l-.2-.32c-1.43-2.6-2.55-4.62-4-6.96l-.2-.72c-.08-.3-.13-.55-.13-.85l.87-1.18l.49-.16l1.16.16l.49.42c1.4 3.31 2.76 5.93 4.23 8.83l.29.97l.1.3h.19v-.17c.65-3.42 0-6.57 1.22-9.53l.87-.57l.68.33l.56.8l-.08.51c-.37 2.62-.92 5.22-1.4 7.82h.24l.29-.29a69 69 0 0 1 4.91-5.94l.64-.5h1.2l.89 1.32l-.4 1.36a53.5 53.5 0 0 0-4.66 6.47l.09.13l.22-.02c2.4-.57 4.84-.99 7.27-1.4l.97.45l.1.46l-.37.94c-3 .72-6 1.34-9 2.05l-.05.04l.06.07c2.7.26 5.62.3 7.99.47l.92.61l.55.75l-.1.56l-1.4.73c-2.93-.7-5.19-1.22-7.91-1.9h-.22v.13c2.18 2.12 4.6 4.27 6.54 6.07l.15.68l-.38.53l-.4-.06c-2.04-1.43-3.9-3.09-5.8-4.7h-.15v.2l.52.76c1.14 1.79 2.64 3.25 2.87 5.37l-.2.41l-.7.25l-.78-.14a73 73 0 0 1-4.58-7.04l-.17.09l-.78 8.46l-.37.43l-.85.33l-.71-.54l-.38-.87a114 114 0 0 0 1.53-7.97l.2-.73l-.01-.05l-.16.02a77 77 0 0 1-6.23 7.88l-.48.2l-.84-.44l.08-.77l.47-.69c2.07-2.57 3.54-4.66 5.54-7v-.19h-.07l-7.4 4.8l-1.31.17l-.57-.53l.07-.87l.27-.28l2.23-1.53z\"/></svg>",
"file-type-agents":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#d2d2d2\" d=\"M27.2 16c0-6.19-5.01-11.2-11.2-11.2S4.8 9.81 4.8 16S9.81 27.2 16 27.2S27.2 22.19 27.2 16m-5.6 2.1a1.4 1.4 0 0 1 0 2.8h-4.2a1.4 1.4 0 0 1 0-2.8zm-11.2-6.8a1.397 1.397 0 0 1 1.84.361l.08.119l2.1 3.5l.087.171a1.4 1.4 0 0 1 0 1.1l-.088.171l-2.1 3.5a1.4 1.4 0 0 1-2.4-1.44l1.67-2.78l-1.67-2.78l-.067-.127a1.394 1.394 0 0 1 .547-1.79zM30 16c0 7.73-6.27 14-14 14S2 23.73 2 16S8.27 2 16 2s14 6.27 14 14\"/></svg>",
"file-type-node":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#83cd29\" d=\"M16 30a2.15 2.15 0 0 1-1.076-.288L11.5 27.685c-.511-.286-.262-.387-.093-.446a6.8 6.8 0 0 0 1.549-.7a.26.26 0 0 1 .255.019l2.631 1.563a.34.34 0 0 0 .318 0l10.26-5.922a.32.32 0 0 0 .157-.278V10.075a.33.33 0 0 0-.159-.283l-10.26-5.917a.32.32 0 0 0-.317 0L5.587 9.794a.33.33 0 0 0-.162.281v11.841a.32.32 0 0 0 .161.274L8.4 23.814c1.525.762 2.459-.136 2.459-1.038V11.085a.3.3 0 0 1 .3-.3h1.3a.3.3 0 0 1 .3.3v11.692c0 2.035-1.108 3.2-3.038 3.2a4.4 4.4 0 0 1-2.363-.642l-2.697-1.547a2.17 2.17 0 0 1-1.076-1.872V10.075A2.16 2.16 0 0 1 4.661 8.2l10.261-5.924a2.25 2.25 0 0 1 2.156 0L27.338 8.2a2.17 2.17 0 0 1 1.077 1.87v11.846a2.17 2.17 0 0 1-1.077 1.872l-10.26 5.924A2.15 2.15 0 0 1 16 30\"/><path fill=\"#83cd29\" d=\"M14.054 17.953a.3.3 0 0 1 .3-.3h1.327a.3.3 0 0 1 .295.251c.2 1.351.8 2.032 3.513 2.032c2.161 0 3.082-.489 3.082-1.636c0-.661-.261-1.152-3.62-1.481c-2.808-.278-4.544-.9-4.544-3.144c0-2.07 1.745-3.305 4.67-3.305c3.287 0 4.914 1.141 5.12 3.589a.3.3 0 0 1-.295.323h-1.336a.3.3 0 0 1-.288-.232c-.319-1.421-1.1-1.875-3.2-1.875c-2.36 0-2.634.822-2.634 1.438c0 .746.324.964 3.51 1.385c3.153.417 4.651 1.007 4.651 3.223c0 2.236-1.864 3.516-5.115 3.516c-4.495.006-5.436-2.055-5.436-3.784\"/></svg>",
"file-type-rust":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><radialGradient id=\"SVGZmFlvcVj\" cx=\"-492.035\" cy=\"-883.37\" r=\"13.998\" gradientTransform=\"matrix(.866 -.5 -.3 -.52 177.106 -689.033)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#7d7d7d\"/><stop offset=\".267\" stop-color=\"#7e7c7a\"/><stop offset=\".45\" stop-color=\"#817871\"/><stop offset=\".608\" stop-color=\"#867162\"/><stop offset=\".753\" stop-color=\"#8d684c\"/><stop offset=\".886\" stop-color=\"#965c30\"/><stop offset=\"1\" stop-color=\"#a04f12\"/></radialGradient></defs><path fill=\"url(#SVGZmFlvcVj)\" d=\"M15.124 5.3a.832.832 0 1 1 .832.832a.83.83 0 0 1-.832-.832M5.2 12.834a.832.832 0 1 1 .832.832a.83.83 0 0 1-.832-.832m19.856.039a.832.832 0 1 1 .832.832a.83.83 0 0 1-.832-.832m-17.451 1.14a.76.76 0 0 0 .386-1l-.369-.835h1.452v6.545h-2.93a10.3 10.3 0 0 1-.332-3.911Zm6.074.161v-1.929h3.458c.179 0 1.261.206 1.261 1.016c0 .672-.83.913-1.513.913ZM8.958 24.561a.832.832 0 1 1 .832.832a.83.83 0 0 1-.832-.832m12.331.039a.832.832 0 1 1 .832.832a.83.83 0 0 1-.832-.832m.257-1.887a.76.76 0 0 0-.9.584l-.418 1.949a10.25 10.25 0 0 1-8.545-.041l-.417-1.949a.76.76 0 0 0-.9-.583l-1.721.37a10 10 0 0 1-.89-1.049h8.374c.095 0 .158-.017.158-.1v-2.966c0-.086-.063-.1-.158-.1h-2.45v-1.881h2.649a1.665 1.665 0 0 1 1.629 1.412c.105.413.336 1.757.494 2.187c.157.483.8 1.447 1.482 1.447h4.323a10 10 0 0 1-.949 1.1Zm4.65-7.821a10.3 10.3 0 0 1 .022 1.779h-1.051c-.105 0-.148.069-.148.172v.483c0 1.136-.641 1.384-1.2 1.447c-.535.06-1.128-.224-1.2-.551a3.62 3.62 0 0 0-1.671-2.808c1.03-.654 2.1-1.619 2.1-2.911A3.29 3.29 0 0 0 21.44 9.8a4.56 4.56 0 0 0-2.2-.724H8.367A10.25 10.25 0 0 1 14.1 5.84l1.282 1.344a.76.76 0 0 0 1.072.026l1.434-1.372a10.25 10.25 0 0 1 7.015 5l-.982 2.217a.76.76 0 0 0 .386 1Zm2.448.036l-.033-.343l1.011-.943a.42.42 0 0 0-.013-.595a.4.4 0 0 0-.121-.081l-1.288-.483l-.1-.334l.806-1.12a.42.42 0 0 0-.13-.581a.4.4 0 0 0-.133-.055l-1.363-.222l-.164-.306l.573-1.257a.42.42 0 0 0-.236-.544a.4.4 0 0 0-.146-.029l-1.383.048l-.224-.264l.318-1.347a.42.42 0 0 0-.343-.487a.4.4 0 0 0-.144 0l-1.348.315l-.266-.219l.049-1.381a.42.42 0 0 0-.431-.411a.4.4 0 0 0-.141.028l-1.257.573l-.306-.164l-.222-1.363a.42.42 0 0 0-.5-.318a.4.4 0 0 0-.133.055l-1.121.806l-.333-.1l-.483-1.293a.42.42 0 0 0-.555-.215a.4.4 0 0 0-.12.08l-.946 1.012l-.343-.033l-.728-1.177a.42.42 0 0 0-.688 0l-.728 1.177l-.343.033l-.943-1.012a.42.42 0 0 0-.595.015a.4.4 0 0 0-.08.12L12.483 3.8l-.333.1l-1.12-.8a.42.42 0 0 0-.581.13a.4.4 0 0 0-.055.133l-.222 1.363l-.306.164l-1.258-.573a.42.42 0 0 0-.544.239a.4.4 0 0 0-.028.144l.048 1.383l-.266.217l-1.347-.316a.42.42 0 0 0-.487.343a.4.4 0 0 0 0 .144L6.3 7.819l-.218.265L4.7 8.036a.422.422 0 0 0-.383.573l.573 1.257l-.164.306l-1.363.222a.42.42 0 0 0-.318.5a.4.4 0 0 0 .055.133l.806 1.12l-.1.334l-1.293.483a.42.42 0 0 0-.215.555a.4.4 0 0 0 .081.121l1.011.943l-.033.343l-1.177.728a.42.42 0 0 0 0 .688l1.177.728l.033.343l-1.011.943a.42.42 0 0 0 .015.595a.4.4 0 0 0 .119.08l1.293.483l.1.334l-.806 1.124a.42.42 0 0 0 .131.581a.4.4 0 0 0 .133.055l1.363.222l.164.307l-.573 1.257a.42.42 0 0 0 .24.545a.4.4 0 0 0 .143.028l1.383-.048l.219.266l-.317 1.348a.42.42 0 0 0 .341.486a.4.4 0 0 0 .146 0l1.345-.319l.266.218l-.049 1.382a.42.42 0 0 0 .429.41a.4.4 0 0 0 .143-.028l1.257-.573l.306.164l.222 1.362a.42.42 0 0 0 .5.319a.4.4 0 0 0 .133-.055l1.12-.807l.334.1l.483 1.292a.42.42 0 0 0 .556.214a.4.4 0 0 0 .119-.08l.943-1.011l.343.034l.728 1.177a.42.42 0 0 0 .588.1a.4.4 0 0 0 .1-.1l.728-1.177l.343-.034l.943 1.011a.42.42 0 0 0 .595-.015a.4.4 0 0 0 .08-.119l.483-1.292l.334-.1l1.12.807a.42.42 0 0 0 .581-.131a.4.4 0 0 0 .055-.133l.222-1.362l.306-.164l1.257.573a.42.42 0 0 0 .544-.239a.4.4 0 0 0 .028-.143l-.048-1.384l.265-.218l1.347.317a.42.42 0 0 0 .487-.34a.5.5 0 0 0 0-.146l-.309-1.346l.218-.266l1.383.048a.42.42 0 0 0 .41-.431a.4.4 0 0 0-.028-.142l-.573-1.257l.164-.307l1.363-.222a.42.42 0 0 0 .319-.5a.4.4 0 0 0-.056-.135l-.806-1.12l.1-.334l1.293-.483a.42.42 0 0 0 .215-.554a.4.4 0 0 0-.081-.121l-1.011-.943l.033-.343l1.177-.728a.42.42 0 0 0 0-.688Z\"/></svg>",
"file-type-go":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#00acd7\" d=\"M0 12.32h1.64q.12.02.06.12l-.34.5a.3.3 0 0 1-.2.12H0zm0 1.8h.62a.1.1 0 0 1 .1.12l-.16.46a.2.2 0 0 1-.17.12H0zm0 1.8h.19q.12 0 .12.13l-.04.47a.15.15 0 0 1-.14.14H0zm16.15-3.22c-1.23.3-2.07.54-3.28.85c-.3.08-.32.1-.57-.2c-.3-.32-.5-.54-.92-.73a3.4 3.4 0 0 0-3.53.29a4.2 4.2 0 0 0-2 3.7a3.1 3.1 0 0 0 2.64 3.07a3.6 3.6 0 0 0 3.32-1.28q.25-.32.53-.73H8.57c-.41 0-.5-.25-.37-.58c.25-.6.72-1.62 1-2.13a.5.5 0 0 1 .48-.31h7.11c-.04.52-.04 1.05-.11 1.58a8.3 8.3 0 0 1-1.6 3.83a8.2 8.2 0 0 1-5.57 3.32a7 7 0 0 1-5.26-1.3a6 6 0 0 1-2.48-4.33a7.7 7.7 0 0 1 1.66-5.72q2.1-2.75 5.47-3.38a6.7 6.7 0 0 1 5.18.96a6 6 0 0 1 2.26 2.75q.17.25-.2.33m6.47 10.81a7.3 7.3 0 0 1-4.76-1.73a6 6 0 0 1-2.11-3.76a7.5 7.5 0 0 1 1.58-5.9a8 8 0 0 1 5.47-3.26a7.2 7.2 0 0 1 5.56 1a6 6 0 0 1 2.76 4.35a7.6 7.6 0 0 1-2.25 6.62a9 9 0 0 1-4.69 2.5c-.52.1-1.05.11-1.56.17m4.65-7.9l-.06-.64a3.2 3.2 0 0 0-3.98-2.6c-1.82.41-3 1.56-3.42 3.4a3.2 3.2 0 0 0 1.8 3.69q1.61.69 3.18-.12q2.32-1.2 2.48-3.73\"/></svg>",
"file-type-vite":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g fill=\"none\"><mask id=\"SVGgudELdDz\"><path fill=\"#fff\" d=\"M40.05 45.7c-.67.85-2.02.38-2.02-.69v-10.3a2.26 2.26 0 0 0-2.27-2.26H24.4a1.13 1.13 0 0 1-.92-1.8l7.48-10.46c1.07-1.5 0-3.58-1.84-3.58H15.34a1.13 1.13 0 0 1-.92-1.79l9.7-13.57c.2-.3.55-.48.92-.48h28.89c.92 0 1.46 1.04.92 1.79l-7.48 10.47a2.26 2.26 0 0 0 1.84 3.58H60.6c.94 0 1.47 1.09.89 1.83z\"/></mask><g mask=\"url(#SVGgudELdDz)\" transform=\"translate(1 6.8)scale(.393)\"><path fill=\"#9135ff\" d=\"M0 0h62v47H0z\"/><g filter=\"url(#SVGNp06lekD)\"><ellipse cx=\"24.46\" cy=\"37.75\" fill=\"#eee6ff\" rx=\"5.51\" ry=\"14.7\" transform=\"rotate(89.8 24.46 37.75)\"/></g><g filter=\"url(#SVGNp06lekD)\"><ellipse cx=\"4.76\" cy=\"18.96\" fill=\"#eee6ff\" rx=\"10.4\" ry=\"29.85\" transform=\"rotate(89.8 4.76 18.96)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"4.24\" cy=\"17.5\" fill=\"#8900ff\" rx=\"5.51\" ry=\"30.49\" transform=\"rotate(89.8 4.24 17.5)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"8.95\" cy=\"35.5\" fill=\"#8900ff\" rx=\"5.51\" ry=\"30.6\" transform=\"rotate(89.8 8.95 35.5)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"10.48\" cy=\"36.65\" fill=\"#8900ff\" rx=\"5.51\" ry=\"30.6\" transform=\"rotate(89.8 10.48 36.65)\"/></g><g filter=\"url(#SVGNp06lekD)\"><ellipse cx=\"67.34\" cy=\"12.3\" fill=\"#eee6ff\" rx=\"14.07\" ry=\"22.08\" transform=\"rotate(-86.7 67.34 12.3)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"68.44\" cy=\"15.74\" fill=\"#8900ff\" rx=\"3.47\" ry=\"21.5\" transform=\"rotate(-91 68.44 15.74)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"68.44\" cy=\"15.74\" fill=\"#8900ff\" rx=\"3.47\" ry=\"21.5\" transform=\"rotate(-91 68.44 15.74)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"14.59\" cy=\"9.74\" fill=\"#8900ff\" rx=\"4.41\" ry=\"29.11\" transform=\"rotate(39.5 14.6 9.74)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"61.73\" cy=\"-5.32\" fill=\"#8900ff\" rx=\"4.41\" ry=\"29.11\" transform=\"rotate(37.9 61.73 -5.32)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"55.62\" cy=\"7.1\" fill=\"#00c2ff\" rx=\"5.97\" ry=\"9.67\" transform=\"rotate(37.9 55.62 7.1)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"12.33\" cy=\"39.1\" fill=\"#8900ff\" rx=\"4.41\" ry=\"29.11\" transform=\"rotate(37.9 12.33 39.1)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"12.33\" cy=\"39.1\" fill=\"#8900ff\" rx=\"4.41\" ry=\"29.11\" transform=\"rotate(37.9 12.33 39.1)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"49.86\" cy=\"30.68\" fill=\"#8900ff\" rx=\"4.41\" ry=\"29.11\" transform=\"rotate(37.9 49.86 30.68)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"52.62\" cy=\"33.17\" fill=\"#00c2ff\" rx=\"5.97\" ry=\"15.3\" transform=\"rotate(37.9 52.62 33.17)\"/></g></g><path fill=\"#fff\" d=\"M3.72 6.8C.1 11.98.08 20 3.72 25.2h2.45c-3.64-5.2-3.62-13.22 0-18.4zm24.56 0h-2.45c3.62 5.18 3.64 13.2 0 18.4h2.45c3.64-5.2 3.62-13.22 0-18.4\"/><defs><filter id=\"SVGNp06lekD\" width=\"4\" height=\"4\" x=\"-2\" y=\"-2\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"7.66\"/></filter><filter id=\"SVGQv8P6csY\" width=\"4\" height=\"4\" x=\"-2\" y=\"-2\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"4.6\"/></filter></defs></g></svg>",
"file-type-vitest":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g fill=\"none\"><mask id=\"SVGTUBgmdJX\"><path fill=\"#fff\" d=\"M36.76 42.97c-.33.6-1.1.76-1.65.36L15.96 29.41a1.2 1.2 0 0 1-.46-.92V11.71c0-.93 1.05-1.46 1.8-.92L29 19.31c1.1.8 2.65.46 3.3-.72l9.71-17.25c.2-.35.58-.57.99-.57h15.57c.87 0 1.41.93.99 1.68z\"/></mask><g mask=\"url(#SVGTUBgmdJX)\" transform=\"translate(1 6.8)scale(.393)\"><path fill=\"#00ff74\" d=\"M0 0h60v44H0z\"/><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"41.46\" cy=\"10.01\" fill=\"#00d0c7\" rx=\"14.03\" ry=\"3.39\" transform=\"rotate(130.6 41.46 10.01)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"18.43\" cy=\"30.51\" fill=\"#00d0c7\" rx=\"14.03\" ry=\"6.09\" transform=\"rotate(234 18.43 30.5)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"21.94\" cy=\"12.96\" fill=\"#03ff00\" rx=\"6.37\" ry=\"5.55\" transform=\"rotate(23.1 21.94 12.96)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"56.27\" cy=\"16.72\" fill=\"#03ff00\" rx=\"5.61\" ry=\"24.53\" transform=\"rotate(23.1 56.27 16.72)\"/></g><g filter=\"url(#SVGQv8P6csY)\"><ellipse cx=\"51.35\" cy=\"1.06\" fill=\"#6effe1\" rx=\"4.99\" ry=\"10.07\" transform=\"rotate(-45 51.35 1.06)\"/></g></g><path fill=\"#fff\" d=\"M3.72 6.8C.1 11.98.08 20 3.72 25.2h2.45c-3.64-5.2-3.62-13.22 0-18.4zm24.56 0h-2.45c3.62 5.18 3.64 13.2 0 18.4h2.45c3.64-5.2 3.62-13.22 0-18.4\"/><defs><filter id=\"SVGQv8P6csY\" width=\"4\" height=\"4\" x=\"-2\" y=\"-2\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"4.6\"/></filter></defs></g></svg>",
"file-type-jest":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#c63d14\" d=\"M27.089 15.786a2.606 2.606 0 0 0-2.606-2.606a3 3 0 0 0-.274.014l3.58-10.558H12.576l3.575 10.549c-.052 0-.105-.005-.158-.005a2.606 2.606 0 0 0-.791 5.09a11.4 11.4 0 0 1-2.049 2.579A10.4 10.4 0 0 1 9.5 23.116a3.323 3.323 0 0 1-1.665-4.23q.117-.27.229-.544a2.607 2.607 0 1 0-2.09-.4a20 20 0 0 0-1.889 4.787c-.354 2.135 0 4.4 1.845 5.681c4.3 2.981 8.969-1.848 13.891-3.061c1.784-.44 3.742-.369 5.313-1.279a4.45 4.45 0 0 0 2.179-3.088a4.64 4.64 0 0 0-.831-3.522a2.6 2.6 0 0 0 .606-1.671ZM18.6 15.8v-.009a2.6 2.6 0 0 0-1.256-2.23L20.188 7.8l2.85 5.814a2.6 2.6 0 0 0-1.161 2.169v.057z\"/><path fill=\"#fff\" d=\"M27.726 15.786a3.25 3.25 0 0 0-2.643-3.186L28.677 2H11.689l3.6 10.621a3.241 3.241 0 0 0-1 5.918a11 11 0 0 1-1.568 1.846a9.8 9.8 0 0 1-3.16 2.03a2.656 2.656 0 0 1-1.134-3.28l.04-.093l.074-.175a3.245 3.245 0 1 0-3.34-.754q-.163.346-.339.706a14 14 0 0 0-1.4 3.8c-.465 2.8.285 5.043 2.111 6.308A5.75 5.75 0 0 0 8.934 30c2.132 0 4.289-1.071 6.4-2.119a23.7 23.7 0 0 1 4.642-1.918c.577-.142 1.171-.228 1.8-.319a10 10 0 0 0 3.68-1.028a5.09 5.09 0 0 0 2.487-3.53a5.26 5.26 0 0 0-.691-3.613a3.2 3.2 0 0 0 .475-1.688Zm-1.273 0a1.97 1.97 0 1 1-1.97-1.97a1.97 1.97 0 0 1 1.97 1.97M26.9 3.273l-3.174 9.36a3 3 0 0 0-.4.125l-3.135-6.4l-3.145 6.362a3 3 0 0 0-.419-.114l-3.163-9.333ZM15.993 13.816a1.97 1.97 0 1 1-1.97 1.97a1.97 1.97 0 0 1 1.97-1.97m-8.522.019A1.97 1.97 0 1 1 5.5 15.8a1.97 1.97 0 0 1 1.97-1.97Zm19.217 7.034a3.82 3.82 0 0 1-1.871 2.646a8.9 8.9 0 0 1-3.223.869c-.632.091-1.285.185-1.924.343a24.6 24.6 0 0 0-4.9 2.013c-3.164 1.571-5.9 2.928-8.472 1.143c-1.887-1.308-1.8-3.728-1.58-5.054A12.8 12.8 0 0 1 6 19.376l.27-.559a3.2 3.2 0 0 0 .838.21a3.965 3.965 0 0 0 2.1 4.655l.245.126l.259-.092a11 11 0 0 0 3.875-2.4a12 12 0 0 0 1.918-2.319a3.241 3.241 0 0 0 2.64-5.627l2.038-4.121l2.059 4.2a3.24 3.24 0 0 0 4.088 5a3.96 3.96 0 0 1 .355 2.422Z\"/></svg>",
"file-type-eslint":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#4b32c3\" d=\"m29.832 16.7l-6.354 10.717A1.26 1.26 0 0 1 22.36 28H9.647a1.26 1.26 0 0 1-1.118-.59l-6.356-10.7a1.26 1.26 0 0 1 0-1.272L8.527 4.676A1.34 1.34 0 0 1 9.647 4h12.709a1.34 1.34 0 0 1 1.118.678l6.354 10.786a1.2 1.2 0 0 1 0 1.238Zm-5.262 4.2v-9.614L16 6.466l-8.56 4.82V20.9L16 25.719Z\"/><path fill=\"#8080f2\" d=\"m21.802 19.188l-5.747 3.235l-5.742-3.235v-6.47l5.742-3.236l5.747 3.236z\"/></svg>",
"file-type-tailwind":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#44a8b3\" d=\"M9 13.7q1.4-5.6 7-5.6c5.6 0 6.3 4.2 9.1 4.9q2.8.7 4.9-2.1q-1.4 5.6-7 5.6c-5.6 0-6.3-4.2-9.1-4.9q-2.8-.7-4.9 2.1m-7 8.4q1.4-5.6 7-5.6c5.6 0 6.3 4.2 9.1 4.9q2.8.7 4.9-2.1q-1.4 5.6-7 5.6c-5.6 0-6.3-4.2-9.1-4.9q-2.8-.7-4.9 2.1\"/></svg>",
"file-type-playwright":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#2d4552\" d=\"M15.735 12.971a2.67 2.67 0 0 1 1.732 1.538l1.068.3a3.02 3.02 0 0 0-2.027-2.609a2.78 2.78 0 0 0-2.975 1.169a2.5 2.5 0 0 1 2.2-.4Zm8.5 1.548a2.78 2.78 0 0 0-2.974 1.167a2.5 2.5 0 0 1 2.2-.395a2.67 2.67 0 0 1 1.739 1.538l1.07.3a3.03 3.03 0 0 0-2.028-2.615ZM23.176 20l-8.885-2.484a4 4 0 0 0 .465 1.119l7.481 2.091a4 4 0 0 0 .939-.726m-6.16 5.346c-7.035-1.886-6.185-10.85-5.046-15.1a25.5 25.5 0 0 1 1.35-3.924c-.238-.049-.436.077-.631.473a24 24 0 0 0-1.489 4.23c-1.138 4.247-1.989 13.211 5.046 15.1c3.316.888 5.9-.462 7.825-2.582a7.23 7.23 0 0 1-7.052 1.81Z\"/><path fill=\"#e2574c\" d=\"M13.129 20.608V18.8L8.1 20.224a4 4 0 0 1 2.992-2.9a4.35 4.35 0 0 1 2.033-.116v-7.42h2.516a15 15 0 0 0-.762-1.951c-.368-.75-.746-.253-1.6.464a11.9 11.9 0 0 1-4.425 2.2a11.9 11.9 0 0 1-4.926.321c-1.1-.189-1.672-.43-1.618.4a18.3 18.3 0 0 0 .624 3.387c.869 3.266 3.743 9.559 9.173 8.1a5.46 5.46 0 0 0 3.114-2.1h-2.092Zm-8.11-5.952l3.859-1.016a2.17 2.17 0 0 1-1.559 1.866a2.215 2.215 0 0 1-2.3-.85\"/><path fill=\"#2ead33\" d=\"M27.653 9.874a15.4 15.4 0 0 1-6.384-.4a15.4 15.4 0 0 1-5.731-2.845c-1.109-.929-1.6-1.574-2.076-.6a24 24 0 0 0-1.492 4.224c-1.138 4.247-1.988 13.211 5.046 15.1s10.778-6.3 11.916-10.552a24 24 0 0 0 .819-4.4c.072-1.085-.673-.77-2.1-.52Zm-14.134 3.514a2.8 2.8 0 0 1 2.989-1.19a3.02 3.02 0 0 1 2.027 2.614Zm4.59 7.737a5.16 5.16 0 0 1-3.817-3.606L23.176 20a4.89 4.89 0 0 1-5.067 1.122Zm3.141-5.42a2.8 2.8 0 0 1 2.987-1.187a3.03 3.03 0 0 1 2.028 2.615z\"/><path fill=\"#d65348\" d=\"m11.373 19.3l-3.273.924a3.97 3.97 0 0 1 2.767-2.824l-1.852-6.949l-.16.049a11.9 11.9 0 0 1-4.926.321c-1.1-.189-1.672-.43-1.618.4a18.3 18.3 0 0 0 .624 3.387c.869 3.266 3.743 9.559 9.173 8.1l.16-.05Zm-6.354-4.644l3.859-1.016a2.17 2.17 0 0 1-1.559 1.866a2.215 2.215 0 0 1-2.3-.85\"/><path fill=\"#1d8d22\" d=\"m18.258 21.162l-.15-.036a5.16 5.16 0 0 1-3.817-3.606l4.581 1.28L21.3 9.479l-.029-.008a15.4 15.4 0 0 1-5.731-2.845c-1.109-.929-1.6-1.574-2.076-.6a24 24 0 0 0-1.492 4.224c-1.138 4.247-1.988 13.211 5.046 15.1l.144.032Zm-4.739-7.773a2.8 2.8 0 0 1 2.989-1.19a3.02 3.02 0 0 1 2.027 2.614ZM.094-.542\"/></svg>",
"file-type-webpack":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><radialGradient id=\"SVGhEfk9dUr\" cx=\"-236.884\" cy=\"-171.086\" r=\".006\" gradientTransform=\"matrix(2157.515 0 0 -2491.283 511096.688 -426208.482)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#93b4e7\"/><stop offset=\".593\" stop-color=\"#b9d1f8\"/><stop offset=\"1\" stop-color=\"#9cb6e0\"/></radialGradient></defs><path fill=\"url(#SVGhEfk9dUr)\" d=\"M16 2.043L3.9 9.032v13.979L16 30l12.106-6.989V9.032Z\"/><path fill=\"#6f95db\" d=\"M16 9.133L10 12.6v6.932L16 23l6-3.466V12.6Z\"/><path fill=\"#fff\" fill-opacity=\".1\" d=\"M16 2L3.869 9.037L16 15.642L28.131 9.08Zm0 14.548L3.869 22.981L16 29.974l12.088-7.037z\"/></svg>",
"file-type-tsconfig":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#007acc\" d=\"M23.827 8.243a4.4 4.4 0 0 1 2.223 1.281a6 6 0 0 1 .852 1.143c.011.045-1.534 1.083-2.471 1.662c-.034.023-.169-.124-.322-.35a2.01 2.01 0 0 0-1.67-1c-1.077-.074-1.771.49-1.766 1.433a1.3 1.3 0 0 0 .153.666c.237.49.677.784 2.059 1.383c2.544 1.1 3.636 1.817 4.31 2.843a5.16 5.16 0 0 1 .416 4.333a4.76 4.76 0 0 1-3.932 2.815a11 11 0 0 1-2.708-.028a6.53 6.53 0 0 1-3.616-1.884a6.3 6.3 0 0 1-.926-1.371a3 3 0 0 1 .327-.208c.158-.09.756-.434 1.32-.761l1.024-.6l.214.312a4.8 4.8 0 0 0 1.35 1.292a3.3 3.3 0 0 0 3.458-.175a1.545 1.545 0 0 0 .2-1.974c-.276-.4-.84-.727-2.443-1.422a8.8 8.8 0 0 1-3.349-2.055a4.7 4.7 0 0 1-.976-1.777a7.1 7.1 0 0 1-.062-2.268a4.33 4.33 0 0 1 3.644-3.374a9 9 0 0 1 2.691.084m-8.343 1.483l.011 1.454h-4.63v13.148H7.6V11.183H2.97V9.755a14 14 0 0 1 .04-1.466c.017-.023 2.832-.034 6.245-.028l6.211.017Z\"/><path fill=\"#99b8c4\" d=\"m27.075 25.107l.363-.361c1.68.055 1.706 0 1.78-.177l.462-1.124l.034-.107l-.038-.093c-.02-.049-.081-.2-1.13-1.2v-.526c1.211-1.166 1.185-1.226 1.116-1.4l-.46-1.136c-.069-.17-.1-.237-1.763-.191l-.364-.367a8 8 0 0 0-.057-1.657l-.047-.106l-1.2-.525c-.177-.081-.239-.11-1.372 1.124l-.509-.008c-1.167-1.245-1.222-1.223-1.4-1.152l-1.115.452c-.175.071-.236.1-.169 1.79l-.36.359c-1.68-.055-1.7 0-1.778.177L18.606 20l-.036.108l.038.094c.02.048.078.194 1.13 1.2v.525c-1.211 1.166-1.184 1.226-1.115 1.4l.459 1.137c.07.174.1.236 1.763.192l.363.377a8 8 0 0 0 .055 1.654l.047.107l1.208.528c.176.073.236.1 1.366-1.13l.509.006c1.168 1.247 1.228 1.223 1.4 1.154l1.113-.45c.176-.075.237-.102.169-1.795m-4.788-2.632a2 2 0 1 1 2.618 1.14a2.023 2.023 0 0 1-2.618-1.14\"/></svg>",
"file-type-jsconfig":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#f5de19\" d=\"M18.774 19.7a3.73 3.73 0 0 0 3.376 2.078c1.418 0 2.324-.709 2.324-1.688c0-1.173-.931-1.589-2.491-2.272l-.856-.367c-2.469-1.052-4.11-2.37-4.11-5.156c0-2.567 1.956-4.52 5.012-4.52A5.06 5.06 0 0 1 26.9 10.52l-2.665 1.711a2.33 2.33 0 0 0-2.2-1.467A1.49 1.49 0 0 0 20.4 12.1q-.007.067-.007.135c0 1.027.636 1.442 2.1 2.078l.856.366c2.908 1.247 4.549 2.518 4.549 5.376c0 3.081-2.42 4.769-5.671 4.769A6.58 6.58 0 0 1 16 21.32ZM6.686 20c.538.954 1.027 1.76 2.2 1.76c1.124 0 1.834-.44 1.834-2.15V7.975h3.422v11.683c0 3.543-2.078 5.156-5.11 5.156A5.31 5.31 0 0 1 3.9 21.688Z\"/><path fill=\"#99b8c4\" d=\"m27.2 25.482l.363-.361c1.68.055 1.706 0 1.78-.177l.462-1.124l.034-.107l-.039-.093c-.02-.049-.081-.2-1.13-1.2v-.526c1.211-1.166 1.185-1.226 1.116-1.4l-.46-1.136c-.069-.17-.1-.237-1.763-.191L27.2 18.8a8 8 0 0 0-.057-1.657l-.047-.106l-1.2-.525c-.177-.081-.239-.11-1.372 1.124l-.509-.008c-1.167-1.245-1.222-1.223-1.4-1.152l-1.115.452c-.175.071-.236.1-.169 1.79l-.36.359c-1.68-.055-1.7 0-1.778.177l-.462 1.124l-.036.108l.038.094c.02.048.078.194 1.13 1.2v.52c-1.211 1.166-1.184 1.226-1.115 1.4l.459 1.137c.07.174.1.236 1.763.192l.363.377a8 8 0 0 0 .055 1.654l.047.107l1.208.528c.176.073.236.1 1.366-1.13l.509.006c1.168 1.247 1.228 1.223 1.4 1.154l1.113-.45c.176-.075.237-.097.169-1.793m-4.788-2.632a2 2 0 1 1 2.618 1.14a2.023 2.023 0 0 1-2.618-1.14\"/></svg>",
"file-type-biome":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#60a5fa\" d=\"M16 3.903L9.777 14.68a14.04 14.04 0 0 1 7.364-.255l2.103.496l-1.979 8.39l-2.106-.496c-2.588-.61-5.076.749-6.127 2.918l-1.947-.942c1.486-3.068 4.987-4.926 8.572-4.08l.986-4.182A11.887 11.887 0 0 0 2.032 28.097H29.97z\"/></svg>",
"file-type-typescriptdef":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#00a23c\" d=\"M23.814 8.2a4.44 4.44 0 0 1 2.229 1.284a6 6 0 0 1 .857 1.146c.011.045-1.538 1.086-2.478 1.666c-.034.023-.17-.124-.323-.351a2.02 2.02 0 0 0-1.675-1.007c-1.08-.074-1.776.492-1.771 1.436a1.3 1.3 0 0 0 .153.668c.237.492.679.786 2.064 1.386c2.551 1.1 3.645 1.822 4.321 2.851a5.17 5.17 0 0 1 .417 4.344a4.78 4.78 0 0 1-3.942 2.823a11 11 0 0 1-2.715-.028a6.55 6.55 0 0 1-3.626-1.889a6.3 6.3 0 0 1-.928-1.375a3 3 0 0 1 .328-.208c.158-.091.758-.435 1.324-.763l1.024-.594l.215.312a4.8 4.8 0 0 0 1.354 1.3a3.31 3.31 0 0 0 3.467-.175a1.55 1.55 0 0 0 .2-1.979c-.277-.4-.843-.729-2.45-1.426a8.8 8.8 0 0 1-3.358-2.06a4.7 4.7 0 0 1-.979-1.782a7.1 7.1 0 0 1-.062-2.274a4.34 4.34 0 0 1 3.654-3.383a9 9 0 0 1 2.7.078m-8.366 1.488l.011 1.458h-4.642v13.181H7.54V11.148H2.9V9.717a14 14 0 0 1 .04-1.471c.017-.023 2.839-.034 6.262-.028l6.227.017Z\"/></svg>",
"file-type-testts":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#007acc\" d=\"M26.4 24.383c-2.306-.538-3.109-3.31-1.771-6.111a11.9 11.9 0 0 1 2.956-3.706l.415-.345l.012.475a9 9 0 0 0 1 3.233a19 19 0 0 1 .833 2.175a4.26 4.26 0 0 1-.1 2.611a3.56 3.56 0 0 1-1.488 1.45a3.7 3.7 0 0 1-1.857.218m.468-4.753c.166-.191.207-.443.218-1.335l.014-1.1l-.269.211a2.24 2.24 0 0 0-.846 1.867c.093.285.382.6.548.594a.7.7 0 0 0 .336-.236ZM6.165 29.08A5.136 5.136 0 0 1 2.124 23c.339-1.427.269-1.344 7.635-9.049l6.941-7.26l.984.938l.984.938l-4 4.176l-4 4.176l3.345-.072l3.345-.072l2.364-2.466l2.364-2.466l.98.943l.98.943l-6.951 7.24c-6.377 6.642-7.009 7.269-7.657 7.59a5.2 5.2 0 0 1-3.27.524Zm19.55-16.646c-.183-.11-2.061-1.862-4.173-3.895L17.7 4.844l-.012-.561a1.15 1.15 0 0 1 .259-.9a1.32 1.32 0 0 1 1.385-.494a92 92 0 0 1 8.37 8.031a1.339 1.339 0 0 1-1.99 1.511Z\"/><path fill=\"#007acc\" d=\"M4.1 23.621c-.353 2.277.959 3.823 3.439 3.486c.255-.268 3.21-3.353 9.849-10.316c-3.34.072-3.3-.074-6.641 0c-6.681 6.926-6.814 6.876-6.647 6.83\"/><path fill=\"#007acc\" stroke=\"#000\" stroke-miterlimit=\"10\" stroke-width=\".5\" d=\"M27.731 17.931a3.55 3.55 0 0 1 1.783 1.027a4.7 4.7 0 0 1 .683.914c.009.036-1.231.869-1.982 1.335c-.027.018-.136-.1-.258-.281a1.62 1.62 0 0 0-1.34-.806c-.864-.059-1.421.394-1.417 1.15a1.05 1.05 0 0 0 .122.534c.19.394.543.629 1.652 1.109c2.041.878 2.915 1.457 3.458 2.281a4.14 4.14 0 0 1 .33 3.476a3.82 3.82 0 0 1-3.154 2.258a8.7 8.7 0 0 1-2.172-.023a5.24 5.24 0 0 1-2.9-1.512a5 5 0 0 1-.742-1.1a2 2 0 0 1 .262-.167c.127-.072.606-.348 1.059-.611l.819-.475l.172.253a3.8 3.8 0 0 0 1.082 1.036a2.65 2.65 0 0 0 2.774-.14a1.24 1.24 0 0 0 .158-1.579c-.222-.317-.674-.584-1.96-1.14a7.06 7.06 0 0 1-2.684-1.652a3.8 3.8 0 0 1-.783-1.426a5.7 5.7 0 0 1-.05-1.819a3.475 3.475 0 0 1 2.924-2.706a7.2 7.2 0 0 1 2.164.064Zm-6.693 1.19l.009 1.168h-3.711v10.545h-2.625V20.289H11v-1.145a11 11 0 0 1 .032-1.177c.014-.018 2.272-.027 5.01-.023l4.983.014Z\"/></svg>",
"file-type-testjs":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#f5de19\" d=\"M26.4 24.383c-2.306-.538-3.109-3.31-1.771-6.111a11.9 11.9 0 0 1 2.956-3.706l.415-.345l.012.475a9 9 0 0 0 1 3.233a19 19 0 0 1 .833 2.175a4.26 4.26 0 0 1-.1 2.611a3.56 3.56 0 0 1-1.488 1.45a3.7 3.7 0 0 1-1.857.218m.468-4.753c.166-.191.207-.443.218-1.335l.014-1.1l-.269.211a2.24 2.24 0 0 0-.846 1.867c.093.285.382.6.548.594a.7.7 0 0 0 .336-.236ZM6.165 29.08A5.136 5.136 0 0 1 2.124 23c.339-1.427.269-1.344 7.635-9.049l6.941-7.26l.984.938l.984.938l-4 4.176l-4 4.176l3.345-.072l3.345-.072l2.364-2.466l2.364-2.466l.98.943l.98.943l-6.951 7.24c-6.377 6.642-7.009 7.269-7.657 7.59a5.2 5.2 0 0 1-3.27.524Zm19.55-16.646c-.183-.11-2.061-1.862-4.173-3.895L17.7 4.844l-.012-.561a1.15 1.15 0 0 1 .259-.9a1.32 1.32 0 0 1 1.385-.494a92 92 0 0 1 8.37 8.031a1.339 1.339 0 0 1-1.99 1.511Z\"/><path fill=\"#f5de19\" d=\"M4.1 23.621c-.353 2.277.959 3.823 3.439 3.486c.255-.268 3.21-3.353 9.849-10.316c-3.34.072-3.3-.074-6.641 0c-6.681 6.926-6.814 6.876-6.647 6.83\"/><path fill=\"#f5de19\" stroke=\"#000\" stroke-miterlimit=\"10\" stroke-width=\".5\" d=\"M23.4 26.737a3.11 3.11 0 0 0 2.813 1.732c1.182 0 1.936-.591 1.936-1.407c0-.978-.776-1.324-2.076-1.893l-.713-.306c-2.058-.877-3.425-1.975-3.425-4.3c0-2.139 1.63-3.767 4.176-3.767a4.22 4.22 0 0 1 4.056 2.283l-2.221 1.426a1.94 1.94 0 0 0-1.835-1.222a1.24 1.24 0 0 0-1.365 1.222c0 .856.53 1.2 1.753 1.732l.713.305c2.423 1.039 3.791 2.1 3.791 4.48C31 29.594 28.983 31 26.274 31a5.48 5.48 0 0 1-5.2-2.916Zm-10.074.247c.448.795.856 1.467 1.835 1.467c.937 0 1.528-.367 1.528-1.792v-9.7h2.852V26.7c0 2.953-1.731 4.3-4.258 4.3A4.43 4.43 0 0 1 11 28.39Z\"/></svg>",
"file-type-typescript":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#007acc\" d=\"M23.827 8.243a4.4 4.4 0 0 1 2.223 1.281a6 6 0 0 1 .852 1.143c.011.045-1.534 1.083-2.471 1.662c-.034.023-.169-.124-.322-.35a2.01 2.01 0 0 0-1.67-1c-1.077-.074-1.771.49-1.766 1.433a1.3 1.3 0 0 0 .153.666c.237.49.677.784 2.059 1.383c2.544 1.095 3.636 1.817 4.31 2.843a5.16 5.16 0 0 1 .416 4.333a4.76 4.76 0 0 1-3.932 2.815a11 11 0 0 1-2.708-.028a6.53 6.53 0 0 1-3.616-1.884a6.3 6.3 0 0 1-.926-1.371a3 3 0 0 1 .327-.208c.158-.09.756-.434 1.32-.761l1.024-.6l.214.312a4.8 4.8 0 0 0 1.35 1.292a3.3 3.3 0 0 0 3.458-.175a1.545 1.545 0 0 0 .2-1.974c-.276-.395-.84-.727-2.443-1.422a8.8 8.8 0 0 1-3.349-2.055a4.7 4.7 0 0 1-.976-1.777a7.1 7.1 0 0 1-.062-2.268a4.33 4.33 0 0 1 3.644-3.374a9 9 0 0 1 2.691.084m-8.343 1.483l.011 1.454h-4.63v13.148H7.6V11.183H2.97V9.755a14 14 0 0 1 .04-1.466c.017-.023 2.832-.034 6.245-.028l6.211.017Z\"/></svg>",
"file-type-reactts":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"15.974\" r=\"2.5\" fill=\"#007acc\"/><path fill=\"#007acc\" d=\"M16 21.706a28.4 28.4 0 0 1-8.88-1.2a11.3 11.3 0 0 1-3.657-1.958A3.54 3.54 0 0 1 2 15.974c0-1.653 1.816-3.273 4.858-4.333A28.8 28.8 0 0 1 16 10.293a28.7 28.7 0 0 1 9.022 1.324a11.4 11.4 0 0 1 3.538 1.866A3.4 3.4 0 0 1 30 15.974c0 1.718-2.03 3.459-5.3 4.541a28.8 28.8 0 0 1-8.7 1.191m0-10.217a28 28 0 0 0-8.749 1.282c-2.8.977-4.055 2.313-4.055 3.2c0 .928 1.349 2.387 4.311 3.4A27.2 27.2 0 0 0 16 20.51a27.6 27.6 0 0 0 8.325-1.13C27.4 18.361 28.8 16.9 28.8 15.974a2.33 2.33 0 0 0-1.01-1.573a10.2 10.2 0 0 0-3.161-1.654A27.5 27.5 0 0 0 16 11.489\"/><path fill=\"#007acc\" d=\"M10.32 28.443a2.64 2.64 0 0 1-1.336-.328c-1.432-.826-1.928-3.208-1.327-6.373a28.8 28.8 0 0 1 3.4-8.593a28.7 28.7 0 0 1 5.653-7.154a11.4 11.4 0 0 1 3.384-2.133a3.4 3.4 0 0 1 2.878 0c1.489.858 1.982 3.486 1.287 6.859a28.8 28.8 0 0 1-3.316 8.133a28.4 28.4 0 0 1-5.476 7.093a11.3 11.3 0 0 1-3.523 2.189a4.9 4.9 0 0 1-1.624.307m1.773-14.7a28 28 0 0 0-3.26 8.219c-.553 2.915-.022 4.668.75 5.114c.8.463 2.742.024 5.1-2.036a27.2 27.2 0 0 0 5.227-6.79a27.6 27.6 0 0 0 3.181-7.776c.654-3.175.089-5.119-.713-5.581a2.33 2.33 0 0 0-1.868.089A10.2 10.2 0 0 0 17.5 6.9a27.5 27.5 0 0 0-5.4 6.849Z\"/><path fill=\"#007acc\" d=\"M21.677 28.456c-1.355 0-3.076-.82-4.868-2.361a28.8 28.8 0 0 1-5.747-7.237a28.7 28.7 0 0 1-3.374-8.471a11.4 11.4 0 0 1-.158-4A3.4 3.4 0 0 1 8.964 3.9c1.487-.861 4.01.024 6.585 2.31a28.8 28.8 0 0 1 5.39 6.934a28.4 28.4 0 0 1 3.41 8.287a11.3 11.3 0 0 1 .137 4.146a3.54 3.54 0 0 1-1.494 2.555a2.6 2.6 0 0 1-1.315.324m-9.58-10.2a28 28 0 0 0 5.492 6.929c2.249 1.935 4.033 2.351 4.8 1.9c.8-.465 1.39-2.363.782-5.434A27.2 27.2 0 0 0 19.9 13.74a27.6 27.6 0 0 0-5.145-6.64c-2.424-2.152-4.39-2.633-5.191-2.169a2.33 2.33 0 0 0-.855 1.662a10.2 10.2 0 0 0 .153 3.565a27.5 27.5 0 0 0 3.236 8.1Z\"/></svg>",
"file-type-js":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#f5de19\" d=\"M18.774 19.7a3.73 3.73 0 0 0 3.376 2.078c1.418 0 2.324-.709 2.324-1.688c0-1.173-.931-1.589-2.491-2.272l-.856-.367c-2.469-1.052-4.11-2.37-4.11-5.156c0-2.567 1.956-4.52 5.012-4.52A5.06 5.06 0 0 1 26.9 10.52l-2.665 1.711a2.33 2.33 0 0 0-2.2-1.467a1.49 1.49 0 0 0-1.638 1.467c0 1.027.636 1.442 2.1 2.078l.856.366c2.908 1.247 4.549 2.518 4.549 5.376c0 3.081-2.42 4.769-5.671 4.769a6.58 6.58 0 0 1-6.236-3.5ZM6.686 20c.538.954 1.027 1.76 2.2 1.76c1.124 0 1.834-.44 1.834-2.15V7.975h3.422v11.683c0 3.543-2.078 5.156-5.11 5.156A5.31 5.31 0 0 1 3.9 21.688Z\"/></svg>",
"file-type-reactjs":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><circle cx=\"16\" cy=\"15.974\" r=\"2.5\" fill=\"#00d8ff\"/><path fill=\"#00d8ff\" d=\"M16 21.706a28.4 28.4 0 0 1-8.88-1.2a11.3 11.3 0 0 1-3.657-1.958A3.54 3.54 0 0 1 2 15.974c0-1.653 1.816-3.273 4.858-4.333A28.8 28.8 0 0 1 16 10.293a28.7 28.7 0 0 1 9.022 1.324a11.4 11.4 0 0 1 3.538 1.866A3.4 3.4 0 0 1 30 15.974c0 1.718-2.03 3.459-5.3 4.541a28.8 28.8 0 0 1-8.7 1.191m0-10.217a28 28 0 0 0-8.749 1.282c-2.8.977-4.055 2.313-4.055 3.2c0 .928 1.349 2.387 4.311 3.4A27.2 27.2 0 0 0 16 20.51a27.6 27.6 0 0 0 8.325-1.13C27.4 18.361 28.8 16.9 28.8 15.974a2.33 2.33 0 0 0-1.01-1.573a10.2 10.2 0 0 0-3.161-1.654A27.5 27.5 0 0 0 16 11.489\"/><path fill=\"#00d8ff\" d=\"M10.32 28.443a2.64 2.64 0 0 1-1.336-.328c-1.432-.826-1.928-3.208-1.327-6.373a28.8 28.8 0 0 1 3.4-8.593a28.7 28.7 0 0 1 5.653-7.154a11.4 11.4 0 0 1 3.384-2.133a3.4 3.4 0 0 1 2.878 0c1.489.858 1.982 3.486 1.287 6.859a28.8 28.8 0 0 1-3.316 8.133a28.4 28.4 0 0 1-5.476 7.093a11.3 11.3 0 0 1-3.523 2.189a4.9 4.9 0 0 1-1.624.307m1.773-14.7a28 28 0 0 0-3.26 8.219c-.553 2.915-.022 4.668.75 5.114c.8.463 2.742.024 5.1-2.036a27.2 27.2 0 0 0 5.227-6.79a27.6 27.6 0 0 0 3.181-7.776c.654-3.175.089-5.119-.713-5.581a2.33 2.33 0 0 0-1.868.089A10.2 10.2 0 0 0 17.5 6.9a27.5 27.5 0 0 0-5.4 6.849Z\"/><path fill=\"#00d8ff\" d=\"M21.677 28.456c-1.355 0-3.076-.82-4.868-2.361a28.8 28.8 0 0 1-5.747-7.237a28.7 28.7 0 0 1-3.374-8.471a11.4 11.4 0 0 1-.158-4A3.4 3.4 0 0 1 8.964 3.9c1.487-.861 4.01.024 6.585 2.31a28.8 28.8 0 0 1 5.39 6.934a28.4 28.4 0 0 1 3.41 8.287a11.3 11.3 0 0 1 .137 4.146a3.54 3.54 0 0 1-1.494 2.555a2.6 2.6 0 0 1-1.315.324m-9.58-10.2a28 28 0 0 0 5.492 6.929c2.249 1.935 4.033 2.351 4.8 1.9c.8-.465 1.39-2.363.782-5.434A27.2 27.2 0 0 0 19.9 13.74a27.6 27.6 0 0 0-5.145-6.64c-2.424-2.152-4.39-2.633-5.191-2.169a2.33 2.33 0 0 0-.855 1.662a10.2 10.2 0 0 0 .153 3.565a27.5 27.5 0 0 0 3.236 8.1Z\"/></svg>",
"file-type-json":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#f5de19\" d=\"M4.014 14.976a2.5 2.5 0 0 0 1.567-.518a2.38 2.38 0 0 0 .805-1.358a15.3 15.3 0 0 0 .214-2.944q.012-2.085.075-2.747a5.2 5.2 0 0 1 .418-1.686a3 3 0 0 1 .755-1.018A3.05 3.05 0 0 1 9 4.125A6.8 6.8 0 0 1 10.544 4h.7v1.96h-.387a2.34 2.34 0 0 0-1.723.468a3.4 3.4 0 0 0-.425 2.092a36 36 0 0 1-.137 4.133a4.7 4.7 0 0 1-.768 2.06A4.6 4.6 0 0 1 6.1 16a3.8 3.8 0 0 1 1.992 1.754a8.9 8.9 0 0 1 .618 3.865q0 2.435.05 2.9a1.76 1.76 0 0 0 .504 1.181a2.64 2.64 0 0 0 1.592.337h.387V28h-.7a5.7 5.7 0 0 1-1.773-.2a2.97 2.97 0 0 1-1.324-.93a3.35 3.35 0 0 1-.681-1.63a24 24 0 0 1-.165-3.234a16.5 16.5 0 0 0-.214-3.106a2.4 2.4 0 0 0-.805-1.361a2.5 2.5 0 0 0-1.567-.524Zm23.972 2.035a2.5 2.5 0 0 0-1.567.524a2.4 2.4 0 0 0-.805 1.361a16.5 16.5 0 0 0-.212 3.109a24 24 0 0 1-.169 3.234a3.35 3.35 0 0 1-.681 1.63a2.97 2.97 0 0 1-1.324.93a5.7 5.7 0 0 1-1.773.2h-.7V26.04h.387a2.64 2.64 0 0 0 1.592-.337a1.76 1.76 0 0 0 .506-1.186q.05-.462.05-2.9a8.9 8.9 0 0 1 .618-3.865A3.8 3.8 0 0 1 25.9 16a4.6 4.6 0 0 1-1.7-1.286a4.7 4.7 0 0 1-.768-2.06a36 36 0 0 1-.137-4.133a3.4 3.4 0 0 0-.425-2.092a2.34 2.34 0 0 0-1.723-.468h-.387V4h.7a6.8 6.8 0 0 1 1.54.125a3.05 3.05 0 0 1 1.149.581a3 3 0 0 1 .755 1.018a5.2 5.2 0 0 1 .418 1.686q.062.662.075 2.747a15.3 15.3 0 0 0 .212 2.947a2.38 2.38 0 0 0 .805 1.355a2.5 2.5 0 0 0 1.567.518Z\"/></svg>",
"file-type-css":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#639\" d=\"M1.995 1.994h23.52a4.48 4.48 0 0 1 4.48 4.48v19.04a4.48 4.48 0 0 1-4.48 4.48H6.475a4.48 4.48 0 0 1-4.48-4.48Z\"/><path fill=\"#fff\" d=\"M9.079 24.87v-4.704c0-1.876 1.204-2.884 3.024-2.884c1.792-.028 2.912 1.148 2.856 3.136h-2.072c.056-.756-.28-1.316-.84-1.288c-.7 0-.896.476-.896 1.372v4.088c0 .868.28 1.288.896 1.316c.644 0 .896-.644.84-1.372h2.072c.112 2.044-1.176 3.248-2.996 3.22c-1.764 0-2.884-.98-2.884-2.884m6.636-.336h1.932c.028.896.308 1.456.924 1.456s.84-.364.84-1.204c0-.7-.308-1.092-1.064-1.456l-.728-.336c-1.288-.616-1.82-1.372-1.82-2.884c0-1.68 1.064-2.856 2.8-2.856s2.66 1.204 2.688 3.164h-1.876c0-.812-.168-1.372-.784-1.372c-.56 0-.84.28-.84.98s.252.98.924 1.26l.672.308c1.428.672 2.044 1.54 2.044 3.164c0 1.932-1.092 2.996-2.884 2.996s-2.8-1.232-2.828-3.22m6.328 0h1.96c0 .896.308 1.456.896 1.456s.84-.364.84-1.204c0-.7-.28-1.092-1.064-1.456l-.728-.336c-1.288-.616-1.792-1.372-1.792-2.884c0-1.68 1.036-2.856 2.8-2.856s2.632 1.204 2.688 3.164h-1.876c-.028-.812-.196-1.372-.812-1.372c-.56 0-.812.28-.812.98s.224.98.896 1.26l.7.308c1.4.672 2.016 1.54 2.016 3.164c0 1.932-1.092 2.996-2.884 2.996s-2.8-1.232-2.828-3.22\"/></svg>",
"file-type-scss":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#cd6799\" d=\"M16.171 18.7c-.481.221-1.008.509-2.063 1.088c-.4.225-.818.45-1.207.662c-.027-.027-.055-.061-.082-.089c-2.087-2.23-5.947-3.805-5.783-6.8c.061-1.091.436-3.955 7.413-7.433c5.742-2.83 10.311-2.046 11.1-.307c1.134 2.479-2.449 7.092-8.379 7.761a4.47 4.47 0 0 1-3.751-.948c-.314-.341-.361-.361-.477-.293c-.191.1-.068.409 0 .586a3.5 3.5 0 0 0 2.141 1.684a11.4 11.4 0 0 0 6.956-.689c3.594-1.391 6.4-5.258 5.578-8.5c-.825-3.287-6.281-4.371-11.443-2.537a26 26 0 0 0-8.79 5.047c-2.844 2.66-3.294 4.972-3.11 5.94c.662 3.437 5.4 5.674 7.3 7.331q-.148.08-.259.143c-.948.471-4.562 2.36-5.463 4.358c-1.023 2.264.164 3.887.948 4.105a5.83 5.83 0 0 0 6.281-2.544a6.3 6.3 0 0 0 .559-5.8a5 5 0 0 1 .716-.477c.484-.286.945-.568 1.354-.786a10.5 10.5 0 0 1 4.475-.989c3.246.382 3.887 2.407 3.764 3.26a2.16 2.16 0 0 1-1.03 1.459c-.225.143-.3.191-.28.293c.027.15.136.143.327.116a2.535 2.535 0 0 0 1.766-2.257c.1-2-1.807-4.194-5.183-4.174a7.8 7.8 0 0 0-2.946.587q-.225.093-.437.2Zm-4.825 7.839c-1.078 1.173-2.578 1.616-3.226 1.241c-.7-.4-.423-2.135.9-3.376a17 17 0 0 1 2.53-1.889c.157-.1.389-.232.668-.4l.075-.041l.164-.1a4.66 4.66 0 0 1-1.111 4.565\"/></svg>",
"file-type-html":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#e44f26\" d=\"M5.902 27.201L3.655 2h24.69l-2.25 25.197L15.985 30z\"/><path fill=\"#f1662a\" d=\"m16 27.858l8.17-2.265l1.922-21.532H16z\"/><path fill=\"#ebebeb\" d=\"M16 13.407h-4.09l-.282-3.165H16V7.151H8.25l.074.83l.759 8.517H16zm0 8.027l-.014.004l-3.442-.929l-.22-2.465H9.221l.433 4.852l6.332 1.758l.014-.004z\"/><path fill=\"#fff\" d=\"M15.989 13.407v3.091h3.806l-.358 4.009l-3.448.93v3.216l6.337-1.757l.046-.522l.726-8.137l.076-.83zm0-6.256v3.091h7.466l.062-.694l.141-1.567l.074-.83z\"/></svg>",
"file-type-markdown":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"none\" stroke=\"#755838\" d=\"M2.5 7.955h27v16.091h-27z\"/><path fill=\"#755838\" d=\"M5.909 20.636v-9.272h2.727l2.728 3.409l2.727-3.409h2.727v9.272h-2.727v-5.318l-2.727 3.409l-2.728-3.409v5.318zm17.046 0l-4.091-4.5h2.727v-4.772h2.727v4.772h2.727z\"/></svg>",
"file-type-mdx":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#d2d2d2\" d=\"m20.3 16.5l-3.9 3.9l-4-3.9l1.1-1.1l2.1 2.1v-5.7h1.5v5.8l2.1-2.1Zm-16.8-.8l2.7 2.7L9 15.7v4.4h1.5V12l-4.3 4.3L2 12v8.1h1.5Z\"/><path fill=\"#f9ac00\" d=\"m28.8 20l-3.1-3.1l-3.1 3.1l-1-1.1l3.1-3.1l-3.2-3.2l1.1-1l3.1 3.2l3.2-3.2l1.1 1l-3.2 3.2l3.1 3.1Z\"/></svg>",
"file-type-yaml":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ffe885\" d=\"M2 12.218c.755 0 1.51-.008 2.264 0l.053.038l2.761 2.758c.891-.906 1.8-1.794 2.7-2.7c.053-.052.11-.113.192-.1h1.823a1.4 1.4 0 0 1 .353.019c-.7.67-1.377 1.369-2.069 2.05L5.545 18.8c-.331.324-.648.663-.989.975c-.754.022-1.511.007-2.266.007c1.223-1.209 2.431-2.433 3.658-3.637c-1.321-1.304-2.63-2.62-3.948-3.927m10.7 0h1.839v7.566c-.611 0-1.222.012-1.832-.008v-4.994c-1.6 1.607-3.209 3.2-4.811 4.8c-.089.08-.166.217-.305.194c-.824-.006-1.649 0-2.474 0Q8.916 16 12.7 12.218m2.258.002c.47-.009.939 0 1.409 0c.836.853 1.69 1.689 2.536 2.532q1.268-1.267 2.539-2.532h1.4q-.008 3.784 0 7.567c-.471 0-.943.006-1.414 0q.008-2.387 0-4.773c-.844.843-1.676 1.7-2.526 2.536c-.856-.835-1.687-1.695-2.532-2.541c0 1.594-.006 3.188.006 4.781c-.472 0-.943.005-1.415 0q-.003-3.79-.003-7.57m8.301-.003c.472 0 .944-.007 1.416 0q-.007 3.083 0 6.166h3.782c.063.006.144-.012.191.045c.448.454.907.9 1.353 1.354q-3.371.007-6.741 0q.007-3.782-.001-7.565\"/></svg>",
"file-type-toml":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#7f7f7f\" d=\"M22.76 6.83v3.25h-5v15.09h-3.5V10.08h-5V6.83Z\"/><path fill=\"#bfbfbf\" d=\"M2 2h6.2v3.09H5.34v21.8H8.2V30H2Zm28 28h-6.2v-3.09h2.86V5.11H23.8V2H30Z\"/></svg>",
"file-type-xml":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#f1662a\" d=\"m20.42 21.157l2.211 2.211L30 16l-7.369-7.369l-2.211 2.212L25.58 16Zm-8.84-10.314L9.369 8.631L2 16l7.369 7.369l2.211-2.211L6.42 16Zm5.831-3.166l1.6.437l-4.42 16.209l-1.6-.437z\"/></svg>",
"file-type-light-ini":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#40535b\" d=\"m23.265 24.381l.9-.894c4.164.136 4.228-.01 4.411-.438l1.144-2.785l.085-.264l-.093-.231c-.049-.122-.2-.486-2.8-2.965V15.5c3-2.89 2.936-3.038 2.765-3.461l-1.139-2.814c-.171-.422-.236-.587-4.37-.474l-.9-.93a20 20 0 0 0-.141-4.106l-.116-.263l-2.974-1.3c-.438-.2-.592-.272-3.4 2.786l-1.262-.019c-2.891-3.086-3.028-3.03-3.461-2.855L9.149 3.182c-.433.175-.586.237-.418 4.437l-.893.89c-4.162-.136-4.226.012-4.407.438l-1.146 2.786l-.09.267l.094.232c.049.12.194.48 2.8 2.962v1.3c-3 2.89-2.935 3.038-2.763 3.462l1.138 2.817c.174.431.236.584 4.369.476l.9.935a20.2 20.2 0 0 0 .137 4.1l.116.265l2.993 1.308c.435.182.586.247 3.386-2.8l1.262.016c2.895 3.09 3.043 3.03 3.466 2.859l2.759-1.115c.436-.173.588-.234.413-4.436m-11.858-6.524a4.957 4.957 0 1 1 6.488 2.824a5.014 5.014 0 0 1-6.488-2.824\"/></svg>",
"file-type-svg":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ffb13b\" stroke=\"#000\" stroke-width=\"3.73\" d=\"M7.674 14.488a2.218 2.218 0 1 0 0 3.137h16.652a2.218 2.218 0 1 0 0-3.137Z\"/><path fill=\"#ffb13b\" stroke=\"#000\" stroke-width=\"3.73\" d=\"M11.222 9.06A2.218 2.218 0 1 0 9 11.278l11.778 11.774A2.218 2.218 0 1 0 23 20.834Z\"/><path fill=\"#ffb13b\" stroke=\"#000\" stroke-width=\"3.73\" d=\"M17.568 7.73a2.218 2.218 0 1 0-3.137 0v16.652a2.218 2.218 0 1 0 3.137 0Z\"/><path fill=\"#ffb13b\" stroke=\"#000\" stroke-width=\"3.73\" d=\"M23 11.278a2.218 2.218 0 1 0-2.222-2.218L9 20.834a2.218 2.218 0 1 0 2.218 2.218Z\"/><path fill=\"#ffb13b\" d=\"M7.674 14.488a2.218 2.218 0 1 0 0 3.137h16.652a2.218 2.218 0 1 0 0-3.137Z\"/><path fill=\"#ffb13b\" d=\"M11.222 9.06A2.218 2.218 0 1 0 9 11.278l11.778 11.774A2.218 2.218 0 1 0 23 20.834Z\"/><path fill=\"#ffb13b\" d=\"M17.568 7.73a2.218 2.218 0 1 0-3.137 0v16.652a2.218 2.218 0 1 0 3.137 0Z\"/><path fill=\"#ffb13b\" d=\"M23 11.278a2.218 2.218 0 1 0-2.222-2.218L9 20.834a2.218 2.218 0 1 0 2.218 2.218Z\"/><path d=\"M2 16.056h28v9.894a4.035 4.035 0 0 1-4.106 4.106H6.106A4.035 4.035 0 0 1 2 25.95Z\"/><path fill=\"#fff\" d=\"M6.2 23.045a3.628 3.628 0 1 1 6.2-2.565h-2.13a1.5 1.5 0 1 0-2.57 1.061a1.6 1.6 0 0 0 1.062.441a4.12 4.12 0 0 1 2.566 1.063a3.628 3.628 0 1 1-6.194 2.565h2.13a1.5 1.5 0 1 0 2.566-1.06a1.95 1.95 0 0 0-1.063-.44A4.47 4.47 0 0 1 6.2 23.045m13.451-6.193L17.085 29.24H14.96L12.4 16.852h2.12l1.5 7.255l1.5-7.255Zm3.629 5.131h3.628v3.628a3.628 3.628 0 1 1-7.257 0V20.48a3.628 3.628 0 0 1 7.257 0h-2.125a1.5 1.5 0 1 0-3.005 0v5.13a1.5 1.5 0 0 0 3.005 0v-1.5h-1.5v-2.127Z\"/></svg>",
"file-type-image":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#2dcc9f\" d=\"M30 5.851v20.298H2V5.851z\"/><path fill=\"#fff\" d=\"M24.232 8.541a2.2 2.2 0 1 0 1.127.623a2.2 2.2 0 0 0-1.127-.623M18.111 20.1q-2.724-3.788-5.45-7.575L4.579 23.766h10.9q1.316-1.832 2.634-3.663M22.057 16q-2.793 3.882-5.584 7.765h11.169Q24.851 19.882 22.057 16\"/></svg>",
"file-type-csv":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#91d290\" d=\"M22.038 2H6.375a1.755 1.755 0 0 0-1.75 1.75v24.5A1.755 1.755 0 0 0 6.375 30h19.25a1.755 1.755 0 0 0 1.75-1.75V6.856Zm.525 2.844l1.663 1.531h-1.663ZM6.375 28.25V3.75h14.438v4.375h4.813V28.25Z\"/><path fill=\"#73b568\" d=\"M8.125 15.097h13.076v1.75H8.125zm0 9.342h9.762v1.75H8.125zm0-4.676h15.75v1.75H8.125zm0-9.533h15.75v1.75H8.125z\"/></svg>",
"file-type-text":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#c2c2c2\" d=\"M22.038 2H6.375a1.755 1.755 0 0 0-1.75 1.75v24.5A1.755 1.755 0 0 0 6.375 30h19.25a1.755 1.755 0 0 0 1.75-1.75V6.856Zm.525 2.844l1.663 1.531h-1.663ZM6.375 28.25V3.75h14.438v4.375h4.813V28.25Z\"/><path fill=\"#829ec2\" d=\"M8.125 15.097h13.076v1.75H8.125zm0 9.342h9.762v1.75H8.125zm0-4.676h15.75v1.75H8.125zm0-9.533h15.75v1.75H8.125z\"/></svg>",
"file-type-log":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#00bd02\" d=\"M29.4 27.6H2.5V4.5h26.9Zm-25.9-1h24.9V5.5H3.5Z\"/><path fill=\"#00bd02\" d=\"M2.5 5.5h26.9v1.9H2.5zm8.833 4H19.5v1h-8.167zm0 2.583h12.5v1h-12.5zm0 2.667H21.95v1H11.333zm0 2.833H25.5v1H11.333zm0 2.917h9.834v1h-9.834zm.167 2.583h12.167v1H11.5zM5.5 9.5h4.333v1H5.5zm0 2.583h4.333v1H5.5z\"/><path fill=\"#00bd02\" d=\"M5.5 12.083h4.333v1H5.5zm0 2.584h4.333v1H5.5zm0 2.583h4.333v1H5.5zm0 3.25h4.333v1H5.5zm0 2.583h4.333v1H5.5z\"/></svg>",
"file-type-python":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><linearGradient id=\"SVGg4rxgcri\" x1=\"-133.268\" x2=\"-133.198\" y1=\"-202.91\" y2=\"-202.84\" gradientTransform=\"matrix(189.38 0 0 189.81 25243.061 38519.17)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#387eb8\"/><stop offset=\"1\" stop-color=\"#366994\"/></linearGradient><linearGradient id=\"SVG5ouQmWbV\" x1=\"-133.575\" x2=\"-133.495\" y1=\"-203.203\" y2=\"-203.133\" gradientTransform=\"matrix(189.38 0 0 189.81 25309.061 38583.42)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#ffe052\"/><stop offset=\"1\" stop-color=\"#ffc331\"/></linearGradient></defs><path fill=\"url(#SVGg4rxgcri)\" d=\"M15.885 2.1c-7.1 0-6.651 3.07-6.651 3.07v3.19h6.752v1H6.545S2 8.8 2 16.005s4.013 6.912 4.013 6.912H8.33v-3.361s-.13-4.013 3.9-4.013h6.762s3.772.06 3.772-3.652V5.8s.572-3.712-6.842-3.712Zm-3.732 2.137a1.214 1.214 0 1 1-1.183 1.244v-.02a1.214 1.214 0 0 1 1.214-1.214Z\"/><path fill=\"url(#SVG5ouQmWbV)\" d=\"M16.085 29.91c7.1 0 6.651-3.08 6.651-3.08v-3.18h-6.751v-1h9.47S30 23.158 30 15.995s-4.013-6.912-4.013-6.912H23.64V12.4s.13 4.013-3.9 4.013h-6.765S9.2 16.356 9.2 20.068V26.2s-.572 3.712 6.842 3.712h.04Zm3.732-2.147A1.214 1.214 0 1 1 21 26.519v.03a1.214 1.214 0 0 1-1.214 1.214z\"/></svg>",
"file-type-java":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#5382a1\" d=\"M12.7 23.56s-1.07.622.761.833a16 16 0 0 0 5.8-.246a10 10 0 0 0 1.539.753c-5.481 2.349-12.405-.136-8.1-1.339m-.674-3.067s-1.2.888.633 1.078a22.6 22.6 0 0 0 7.481-.359a3.3 3.3 0 0 0 1.152.7c-6.627 1.938-14.009.153-9.266-1.421\"/><path fill=\"#e76f00\" d=\"M17.673 15.294a2.05 2.05 0 0 1-.355 2.954s3.429-1.77 1.854-3.987c-1.471-2.067-2.6-3.095 3.508-6.636c0 0-9.586 2.394-5.007 7.669\"/><path fill=\"#5382a1\" d=\"M24.922 25.827s.792.652-.872 1.157c-3.164.958-13.168 1.248-15.948.038c-1-.435.874-1.038 1.464-1.164a3.8 3.8 0 0 1 .966-.108c-1.111-.783-7.181 1.537-3.083 2.2c11.176 1.812 20.372-.816 17.473-2.124m-11.711-8.508s-5.089 1.209-1.8 1.648a38 38 0 0 0 6.731-.072a53 53 0 0 0 4.221-.555a9 9 0 0 0-1.28.685c-5.17 1.358-15.153.726-12.283-.665a9.6 9.6 0 0 1 4.407-1.042m9.133 5.104c5.253-2.73 2.824-5.353 1.129-5a4 4 0 0 0-.6.161a.96.96 0 0 1 .449-.346c3.354-1.179 5.933 3.478-1.083 5.322a.5.5 0 0 0 .106-.138\"/><path fill=\"#e76f00\" d=\"M19.172 1.906s2.909 2.91-2.759 7.386c-4.546 3.59-1.037 5.637 0 7.975c-2.653-2.394-4.6-4.5-3.294-6.463c1.917-2.879 7.229-4.275 6.056-8.9\"/><path fill=\"#5382a1\" d=\"M13.727 29.818c5.042.323 12.786-.179 12.969-2.565c0 0-.353.9-4.167 1.623a41.5 41.5 0 0 1-12.76.2s.645.533 3.959.746\"/></svg>",
"file-type-kotlin":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><g fill=\"none\"><path fill=\"url(#SVG5NiZhbGj)\" d=\"M30 30H2V2h28L15.711 15.794z\"/><defs><radialGradient id=\"SVG5NiZhbGj\" cx=\"0\" cy=\"0\" r=\"1\" gradientTransform=\"matrix(-28 0 0 -28 30 2)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#e44857\"/><stop offset=\".504\" stop-color=\"#c711e1\"/><stop offset=\"1\" stop-color=\"#7f52ff\"/></radialGradient></defs></g></svg>",
"file-type-swift":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><linearGradient id=\"SVGkG5neddW\" x1=\"-134.494\" x2=\"-134.497\" y1=\"-171.82\" y2=\"-171.89\" gradientTransform=\"matrix(240 0 0 -205.6 32295 -35312.585)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#f88535\"/><stop offset=\"1\" stop-color=\"#fd2221\"/></linearGradient></defs><path fill=\"url(#SVGkG5neddW)\" d=\"M19.422 4.007s6.217 3.554 7.844 9.2c1.466 5.1.292 7.534.292 7.534a8.9 8.9 0 0 1 1.742 2.8a4.83 4.83 0 0 1 .29 4.453s-.1-2.08-3.2-2.511c-2.841-.4-3.874 2.366-9.3 2.232A18.43 18.43 0 0 1 2 19.354C4.651 20.8 8.124 23.045 12.449 22.7s5.228-1.674 5.228-1.674A67 67 0 0 1 4.891 7.643c3.4 2.845 11.822 8.507 11.626 8.363A76 76 0 0 1 8.092 6.24s12.636 10.389 13.653 10.323c.418-.861 2.579-5.318-2.324-12.557Z\"/></svg>",
"file-type-c":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#005f91\" d=\"M10.676 15.973a10.05 10.05 0 0 0 1.175 5.151a5.446 5.446 0 0 0 6.306 2.408a4.28 4.28 0 0 0 3.09-3.6l.109-.61c1.737.251 4.537.658 6.274.906l-.11.44a11.26 11.26 0 0 1-2.7 5.39a9.44 9.44 0 0 1-5.366 2.688a14.6 14.6 0 0 1-8.277-.819a10.15 10.15 0 0 1-5.777-6.24a16.23 16.23 0 0 1 .019-11.45a10.54 10.54 0 0 1 8.963-7.054a13.35 13.35 0 0 1 6.666.555a9.57 9.57 0 0 1 6.167 6.9c.094.352.114.417.114.417c-1.932.351-4.319.8-6.238 1.215c-.362-1.915-1.265-3.428-3.2-3.9a5.263 5.263 0 0 0-6.616 3.57a10.5 10.5 0 0 0-.385 1.439a12.3 12.3 0 0 0-.214 2.594\"/></svg>",
"file-type-cheader":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#005f91\" d=\"M6.97 29V3h5.2v8.52c1.45-1.73 3.61-2.6 6.21-2.6c2.17 0 4.05.72 5.2 2.17c1.01 1.3 1.45 3.18 1.45 6.07V29h-5.2V18.02q0-2.38-.87-3.46c-.58-.73-1.59-1.02-2.74-1.02c-1.3 0-2.46.44-3.18 1.3c-.58.73-.87 2.03-.87 3.76V29Z\"/></svg>",
"file-type-cpp":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#984c93\" d=\"M14.742 24.047a10.24 10.24 0 0 1-4.673.919a7.63 7.63 0 0 1-5.914-2.346A8.88 8.88 0 0 1 2 16.369a9.48 9.48 0 0 1 2.422-6.748a8.22 8.22 0 0 1 6.285-2.588a11.2 11.2 0 0 1 4.035.641v3.761A6.84 6.84 0 0 0 11 10.395a4.81 4.81 0 0 0-3.712 1.535a5.9 5.9 0 0 0-1.413 4.159A5.8 5.8 0 0 0 7.209 20.1a4.57 4.57 0 0 0 3.59 1.493a7.3 7.3 0 0 0 3.943-1.113Zm2.37-9.218v-2.344h2.344v2.344H21.8v2.343h-2.344v2.343h-2.344v-2.343H14.77v-2.344zm8.201 0v-2.344h2.344v2.344H30v2.343h-2.343v2.343h-2.344v-2.343h-2.342v-2.344z\"/></svg>",
"file-type-cppheader":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#984c93\" d=\"M2 25V7h3.6v5.9c1-1.2 2.5-1.8 4.3-1.8c1.5 0 2.8.5 3.6 1.5c.7.9 1 2.2 1 4.2V25h-3.6v-7.6q0-1.65-.6-2.4c-.4-.5-1.1-.7-1.9-.7c-.9 0-1.7.3-2.2.9c-.4.5-.6 1.4-.6 2.6V25Zm15.11-10.17v-2.34h2.35v2.34h2.34v2.34h-2.34v2.35h-2.35v-2.35h-2.34v-2.34zm8.2 0v-2.34h2.35v2.34H30v2.34h-2.34v2.35h-2.35v-2.35h-2.34v-2.34z\"/></svg>",
"file-type-csharp":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#368832\" d=\"M19.792 7.071h2.553v2.553H24.9V7.071h2.552v2.553H30v2.552h-2.55v2.551H30v2.553h-2.551v2.552H24.9v-2.55h-2.55v2.552h-2.557v-2.55H17.24v-2.559h2.553v-2.546H17.24V9.622h2.554Zm2.553 7.658H24.9v-2.553h-2.555Zm-7.656 9.284a10.2 10.2 0 0 1-4.653.915a7.6 7.6 0 0 1-5.89-2.336A8.84 8.84 0 0 1 2 16.367a9.44 9.44 0 0 1 2.412-6.719a8.18 8.18 0 0 1 6.259-2.577a11.1 11.1 0 0 1 4.018.638v3.745a6.8 6.8 0 0 0-3.723-1.036a4.8 4.8 0 0 0-3.7 1.529a5.88 5.88 0 0 0-1.407 4.142a5.77 5.77 0 0 0 1.328 3.992a4.55 4.55 0 0 0 3.575 1.487a7.3 7.3 0 0 0 3.927-1.108Z\"/></svg>",
"file-type-lua":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"none\" stroke=\"gray\" stroke-dasharray=\"1.209\" stroke-width=\".33\" d=\"M28.33 9.7a13.85 13.85 0 1 1-3.81-4.62\"/><path fill=\"navy\" d=\"M5.29 16a10.71 10.71 0 1 0 21.42 0a10.71 10.71 0 1 0-21.42 0M23.57 5.29a3.14 3.14 0 1 0 6.28 0a3.14 3.14 0 1 0-6.28 0\"/><path fill=\"#fff\" d=\"M17.29 11.56a3.14 3.14 0 1 0 6.28 0a3.14 3.14 0 1 0-6.28 0m-4.19 9.79v-.79H9.63v-6.23h-.9v7.02zm4.82 0V16.3h-.8v2.79c0 1.03-.54 1.7-1.38 1.7a.95.95 0 0 1-1.04-.99v-3.5h-.8v3.82c0 .83.63 1.37 1.6 1.37a1.9 1.9 0 0 0 1.7-.92v.78zm5.88-.02v-.6l-.18.01q-.43 0-.44-.4v-2.8q-.01-1.37-1.9-1.38c-1.22 0-1.97.47-2.02 1.64h.81c.07-.62.43-.9 1.19-.9q1.1.02 1.12.75v.21c0 .34-.2.48-.83.56a6 6 0 0 0-1.62.3a1.3 1.3 0 0 0-.9 1.32c0 .91.64 1.45 1.67 1.45a2.4 2.4 0 0 0 1.71-.74a.86.86 0 0 0 .83.67a2 2 0 0 0 .55-.1m-1.4-1.72a1.37 1.37 0 0 1-1.52 1.19c-.63 0-1-.22-1-.77c0-.53.36-.76 1.22-.89a4 4 0 0 0 1.3-.28z\"/></svg>",
"file-type-shell":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#d9b400\" d=\"M29.4 27.6H2.5V4.5h26.9Zm-25.9-1h24.9V5.5H3.5Z\"/><path fill=\"#d9b400\" d=\"m6.077 19.316l-.555-.832l4.844-3.229l-4.887-4.071l.641-.768l5.915 4.928zM12.7 18.2h7.8v1h-7.8zM2.5 5.5h26.9v1.9H2.5z\"/></svg>",
"file-type-powershell":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><linearGradient id=\"SVGaVba93Vn\" x1=\"23.325\" x2=\"7.26\" y1=\"-118.543\" y2=\"-104.193\" gradientTransform=\"matrix(1 0 0 -1 0 -96)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#5391fe\"/><stop offset=\"1\" stop-color=\"#3e6dbf\"/></linearGradient><linearGradient id=\"SVG7XRbSdmK\" x1=\"7.1\" x2=\"23.001\" y1=\"-104.002\" y2=\"-118.292\" href=\"#SVGaVba93Vn\"/></defs><path fill=\"url(#SVGaVba93Vn)\" fill-rule=\"evenodd\" d=\"M3.174 26.589a1.15 1.15 0 0 1-.928-.423a1.23 1.23 0 0 1-.21-1.052L6.233 6.78a1.8 1.8 0 0 1 1.681-1.37h20.912a1.16 1.16 0 0 1 .928.423a1.24 1.24 0 0 1 .21 1.052l-4.2 18.335a1.8 1.8 0 0 1-1.681 1.37H3.174Z\"/><path fill=\"url(#SVG7XRbSdmK)\" fill-rule=\"evenodd\" d=\"M7.914 5.646h20.912a.913.913 0 0 1 .908 1.187l-4.2 18.334a1.575 1.575 0 0 1-1.451 1.187H3.174a.913.913 0 0 1-.908-1.187l4.2-18.334a1.57 1.57 0 0 1 1.448-1.187\"/><path fill=\"#2c5591\" fill-rule=\"evenodd\" d=\"M16.04 21.544h5.086a1.118 1.118 0 0 1 0 2.234H16.04a1.118 1.118 0 0 1 0-2.234m3.299-4.966a1.76 1.76 0 0 1-.591.6l-9.439 6.775a1.224 1.224 0 0 1-1.438-1.977l8.512-6.164v-.126L11.035 10a1.224 1.224 0 0 1 1.782-1.672l6.418 6.827a1.166 1.166 0 0 1 .104 1.423\"/><path fill=\"#fff\" fill-rule=\"evenodd\" d=\"M19.1 16.342a1.75 1.75 0 0 1-.59.6l-9.436 6.776a1.225 1.225 0 0 1-1.439-1.977l8.513-6.164v-.127L10.8 9.761a1.224 1.224 0 0 1 1.783-1.672L19 14.916a1.16 1.16 0 0 1 .1 1.426m-3.2 5.07h5.086a1.059 1.059 0 1 1 0 2.118H15.9a1.059 1.059 0 1 1 0-2.118\"/></svg>",
"file-type-sql":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ffda44\" d=\"M8.562 15.256A21.2 21.2 0 0 0 16 16.449a21.2 21.2 0 0 0 7.438-1.194c1.864-.727 2.525-1.535 2.525-2V9.7a10.4 10.4 0 0 1-2.084 1.076A22.3 22.3 0 0 1 16 12.078a22.4 22.4 0 0 1-7.879-1.3A10.3 10.3 0 0 1 6.037 9.7v3.55c0 .474.663 1.278 2.525 2.006m0 6.705a15.6 15.6 0 0 0 2.6.741a25 25 0 0 0 4.838.453a25 25 0 0 0 4.838-.452a15.6 15.6 0 0 0 2.6-.741c1.864-.727 2.525-1.535 2.525-2v-3.39a10.7 10.7 0 0 1-1.692.825A23.5 23.5 0 0 1 16 18.74a23.5 23.5 0 0 1-8.271-1.348a11 11 0 0 1-1.692-.825v3.393c0 .466.663 1.271 2.525 2.001M16 30c5.5 0 9.963-1.744 9.963-3.894v-2.837a10.5 10.5 0 0 1-1.535.762l-.157.063A23.5 23.5 0 0 1 16 25.445a23.4 23.4 0 0 1-8.271-1.351l-.157-.063a10.5 10.5 0 0 1-1.535-.762v2.837C6.037 28.256 10.5 30 16 30\"/><ellipse cx=\"16\" cy=\"5.894\" fill=\"#ffda44\" rx=\"9.963\" ry=\"3.894\"/></svg>",
"file-type-sqlite":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><defs><linearGradient id=\"SVGwuIXyeeC\" x1=\"-118.318\" x2=\"-116.751\" y1=\"45.638\" y2=\"45.638\" gradientTransform=\"matrix(0 11.486 11.486 0 -510.889 1363.307)\" gradientUnits=\"userSpaceOnUse\"><stop offset=\"0\" stop-color=\"#97d9f6\"/><stop offset=\".92\" stop-color=\"#0f80cc\"/><stop offset=\"1\" stop-color=\"#0f80cc\"/></linearGradient></defs><path fill=\"#0f80cc\" d=\"M23.192 3.242H5.623a2.147 2.147 0 0 0-2.141 2.141v19.376A2.147 2.147 0 0 0 5.623 26.9h11.572c-.132-5.758 1.835-16.932 5.997-23.658\"/><path fill=\"url(#SVGwuIXyeeC)\" d=\"M22.554 3.867H5.623a1.52 1.52 0 0 0-1.516 1.516v17.962a42 42 0 0 1 13.569-2.684a123.6 123.6 0 0 1 4.878-16.794\"/><path fill=\"#003b57\" d=\"M27.29 2.608c-1.2-1.073-2.66-.642-4.1.634q-.32.286-.638.625A25.4 25.4 0 0 0 17.1 15a10 10 0 0 1 .634 1.822c.036.14.069.272.1.384c.062.265.1.437.1.437s-.022-.083-.113-.346l-.059-.17l-.038-.094c-.16-.373-.6-1.16-.8-1.5c-.167.493-.315.954-.438 1.371a12 12 0 0 1 .908 2.8s-.03-.115-.171-.515a19 19 0 0 0-.9-1.708a4 4 0 0 0-.264 1.724a6 6 0 0 1 .493 1.383c.334 1.283.566 2.846.566 2.846l.02.263a26 26 0 0 0 .065 3.205a11.4 11.4 0 0 0 .584 3.1l.18-.1a13.9 13.9 0 0 1-.478-4.628a35.3 35.3 0 0 1 1.938-9.688c2.01-5.308 4.8-9.568 7.35-11.6c-2.326 2.1-5.474 8.9-6.417 11.418a45.7 45.7 0 0 0-2.254 8A6.2 6.2 0 0 1 21.39 20s1.233-1.521 2.674-3.693a26 26 0 0 0-2.755.733c-.7.294-.889.394-.889.394a24 24 0 0 1 4.215-2.007c2.676-4.215 5.592-10.2 2.656-12.824\"/></svg>",
"file-type-graphql":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#e10098\" d=\"M4.781 22.746L16.232 2.914l1.028.593L5.81 23.34z\"/><path fill=\"#e10098\" d=\"M4.545 21.162h22.902v1.187H4.545z\"/><path fill=\"#e10098\" d=\"m4.999 21.828l.593-1.028l11.455 6.614l-.594 1.028zM14.95 4.59l.594-1.027l11.455 6.614l-.594 1.028z\"/><path fill=\"#e10098\" d=\"M5.002 10.174L16.456 3.56l.594 1.028l-11.455 6.614z\"/><path fill=\"#e10098\" d=\"m14.743 3.508l1.028-.594l11.45 19.833l-1.027.593z\"/><path fill=\"#e10098\" d=\"M5.454 9.386h1.187v13.228H5.454zm19.906 0h1.187v13.228H25.36z\"/><path fill=\"#e10098\" d=\"m15.734 27.042l9.962-5.752l.519.898l-9.963 5.752z\"/><path fill=\"#e10098\" d=\"M28.12 23a2.5 2.5 0 1 1-.915-3.411A2.5 2.5 0 0 1 28.12 23M8.2 11.5a2.5 2.5 0 1 1-.915-3.411A2.5 2.5 0 0 1 8.2 11.5M3.88 23a2.5 2.5 0 1 1 3.411.915A2.5 2.5 0 0 1 3.88 23M23.8 11.5a2.5 2.5 0 1 1 3.411.915A2.5 2.5 0 0 1 23.8 11.5M16 30a2.5 2.5 0 1 1 2.5-2.5A2.493 2.493 0 0 1 16 30m0-23.009a2.5 2.5 0 1 1 2.5-2.5a2.493 2.493 0 0 1-2.5 2.5\"/></svg>",
"file-type-vue":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#41b883\" d=\"M24.4 3.925H30l-14 24.15L2 3.925h10.71l3.29 5.6l3.22-5.6Z\"/><path fill=\"#41b883\" d=\"m2 3.925l14 24.15l14-24.15h-5.6L16 18.415L7.53 3.925Z\"/><path fill=\"#35495e\" d=\"M7.53 3.925L16 18.485l8.4-14.56h-5.18L16 9.525l-3.29-5.6Z\"/></svg>",
"file-type-svelte":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#ff3e00\" d=\"M26.47 5.7a8.973 8.973 0 0 0-11.793-2.454L7.96 7.4a7.46 7.46 0 0 0-3.481 5.009a7.7 7.7 0 0 0 .8 5.058a7.4 7.4 0 0 0-1.151 2.8a7.8 7.8 0 0 0 1.4 6.028a8.977 8.977 0 0 0 11.794 2.458L24.04 24.6a7.47 7.47 0 0 0 3.481-5.009a7.67 7.67 0 0 0-.8-5.062a7.35 7.35 0 0 0 1.152-2.8A7.8 7.8 0 0 0 26.47 5.7\"/><path fill=\"#fff\" d=\"M14.022 26.64A5.41 5.41 0 0 1 8.3 24.581a4.68 4.68 0 0 1-.848-3.625a4 4 0 0 1 .159-.61l.127-.375l.344.238a8.8 8.8 0 0 0 2.628 1.274l.245.073l-.025.237a1.44 1.44 0 0 0 .271.968a1.63 1.63 0 0 0 1.743.636a1.5 1.5 0 0 0 .411-.175l6.7-4.154a1.37 1.37 0 0 0 .633-.909a1.4 1.4 0 0 0-.244-1.091a1.63 1.63 0 0 0-1.726-.622a1.5 1.5 0 0 0-.413.176l-2.572 1.584a5 5 0 0 1-1.364.582a5.415 5.415 0 0 1-5.727-2.06a4.68 4.68 0 0 1-.831-3.628A4.5 4.5 0 0 1 9.9 10.09l6.708-4.154a5 5 0 0 1 1.364-.581A5.41 5.41 0 0 1 23.7 7.414a4.68 4.68 0 0 1 .848 3.625a4 4 0 0 1-.159.61l-.127.375l-.344-.237a8.7 8.7 0 0 0-2.628-1.274l-.245-.074l.025-.237a1.44 1.44 0 0 0-.272-.968a1.63 1.63 0 0 0-1.725-.622a1.5 1.5 0 0 0-.411.176l-6.722 4.14a1.35 1.35 0 0 0-.631.908a1.4 1.4 0 0 0 .244 1.092a1.63 1.63 0 0 0 1.726.621a1.5 1.5 0 0 0 .413-.175l2.562-1.585a4.9 4.9 0 0 1 1.364-.581a5.42 5.42 0 0 1 5.728 2.059a4.68 4.68 0 0 1 .843 3.625a4.5 4.5 0 0 1-2.089 3.013l-6.707 4.154a4.9 4.9 0 0 1-1.364.581\"/></svg>",
"file-type-wasm":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#654ff0\" d=\"M19.153 2.35v.15a3.2 3.2 0 1 1-6.4 0v-.15H2v27.919h27.919V2.35Z\"/><path fill=\"#fff\" d=\"M8.485 17.4h1.85l1.265 6.723h.023L13.14 17.4h1.731l1.371 6.81h.027l1.44-6.81h1.815l-2.358 9.885h-1.837l-1.36-6.728h-.036l-1.456 6.728h-1.87Zm13.124 0h2.917l2.9 9.885h-1.911l-.63-2.2h-3.323l-.486 2.2h-1.859Zm1.11 2.437l-.807 3.627h2.512l-.924-3.632Z\"/></svg>",
"file-type-diff":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#c00000\" d=\"M6.975 3h18.05v6.017H6.975z\"/><path fill=\"green\" d=\"M12.992 10.95v6.017H6.975v6.017h6.017V29h6.017v-6.017h6.017v-6.016h-6.018V10.95Z\"/></svg>",
"file-type-font":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#cfcfcf\" d=\"m12.677 17.781l-2.626-6.256l-2.694 6.256Zm6.723 6.511h-7.069v-1.365l.458-.023a1.85 1.85 0 0 0 .972-.2a.31.31 0 0 0 .145-.263a4.2 4.2 0 0 0-.419-1.4l-.812-1.931H7.322L6.4 21.259a3.3 3.3 0 0 0-.349 1.157c0 .036 0 .119.154.241a2.5 2.5 0 0 0 1.191.247l.448.033v1.354H2v-1.31l.4-.07a2.2 2.2 0 0 0 1-.318a6.3 6.3 0 0 0 1.18-2.066l5.575-13.036H11.2l5.512 13.174a5.3 5.3 0 0 0 1.049 1.835a1.96 1.96 0 0 0 1.19.4l.454.027Zm6.441-2.732v-3.985a23 23 0 0 0-2.226.97a3.85 3.85 0 0 0-1.29 1.05a2.03 2.03 0 0 0-.388 1.2a1.95 1.95 0 0 0 .491 1.362a1.49 1.49 0 0 0 1.13.544a4.14 4.14 0 0 0 2.283-1.141m-3.333 2.949a2.83 2.83 0 0 1-2.139-.893a3.2 3.2 0 0 1-.833-2.285a2.96 2.96 0 0 1 .415-1.577a5 5 0 0 1 1.791-1.625a24 24 0 0 1 3.617-1.588v-.074a2.9 2.9 0 0 0-.383-1.833a1.33 1.33 0 0 0-1.075-.412a1.16 1.16 0 0 0-.816.26a.69.69 0 0 0-.277.536l.023.646a1.62 1.62 0 0 1-.4 1.158a1.48 1.48 0 0 1-2.1-.019a1.63 1.63 0 0 1-.391-1.134a2.8 2.8 0 0 1 1.182-2.177a4.8 4.8 0 0 1 3.125-.932a5.4 5.4 0 0 1 2.508.524a2.63 2.63 0 0 1 1.213 1.346a6.4 6.4 0 0 1 .244 2.2v3.55a15 15 0 0 0 .051 1.749a.7.7 0 0 0 .054.2c.085-.078.284-.225.864-.806l.819-.828v1.967l-.1.128c-.958 1.283-1.883 1.907-2.83 1.907a1.6 1.6 0 0 1-1.257-.557a1.8 1.8 0 0 1-.358-.74a9.7 9.7 0 0 1-1.433.977a3.6 3.6 0 0 1-1.514.332\"/></svg>",
"file-type-audio":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#00007f\" d=\"M17.229 4a.9.9 0 0 0-.569.232l-7.6 6.32a1.16 1.16 0 0 1-.955.328H3.208A1.2 1.2 0 0 0 2 12.088v7.826a1.2 1.2 0 0 0 1.208 1.206H8.1a1.16 1.16 0 0 1 .955.328l7.6 6.32c.521.433 1.081.224 1.081-.289V4.522A.494.494 0 0 0 17.229 4M27 6.3l-1.791 1.793a14.71 14.71 0 0 1 0 15.844l1.785 1.776A17.19 17.19 0 0 0 27 6.3m-4.333 4.323L20.905 12.4a6.035 6.035 0 0 1 0 7.237l1.756 1.756a8.554 8.554 0 0 0 .01-10.769Z\"/></svg>",
"file-type-jupyter":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#767677\" d=\"M26.233 3.588A1.69 1.69 0 1 1 24.473 2a1.67 1.67 0 0 1 1.76 1.585Z\"/><path fill=\"#f37726\" d=\"M16.375 23.111c-4.487 0-8.43-1.61-10.469-3.988a11.162 11.162 0 0 0 20.938 0c-2.034 2.377-5.962 3.988-10.469 3.988m0-15.463c4.487 0 8.43 1.61 10.469 3.988a11.162 11.162 0 0 0-20.938 0c2.039-2.383 5.963-3.988 10.469-3.988\"/><path fill=\"#9e9e9e\" d=\"M10.2 27.739a2.109 2.109 0 1 1-.2-.8a2.1 2.1 0 0 1 .2.8\"/><path fill=\"#616262\" d=\"M6.416 7.106A1.226 1.226 0 1 1 7.608 5.83a1.24 1.24 0 0 1-1.192 1.276\"/></svg>",
"file-type-nix":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#7ebae4\" fill-rule=\"evenodd\" d=\"M13 11.115L6.183 23.76L4.59 20.87l1.839-3.387l-3.651-.01L2 16.029l.8-1.477l5.2.018l1.868-3.447Zm.527 10.108h13.64l-1.541 2.922l-3.658-.011l1.817 3.389l-.779 1.449h-1.593l-2.584-4.825l-3.722-.008Zm7.94-5.541l-6.82-12.645l3.134-.032L19.6 6.4l1.834-3.379h1.557l.795 1.479l-2.612 4.807l1.854 3.455Z\"/><path fill=\"#5277c3\" fill-rule=\"evenodd\" d=\"m10.542 16.324l6.821 12.645l-3.134.031l-1.821-3.4l-1.834 3.38H9.016l-.8-1.476l2.615-4.804l-1.855-3.457Zm7.922-5.573H4.823l1.542-2.922l3.658.011l-1.816-3.389L8.986 3h1.592l2.584 4.825l3.722.008ZM19 20.888l6.817-12.644l1.593 2.89l-1.839 3.386l3.651.01l.778 1.449l-.8 1.477l-5.2-.018l-1.868 3.447Z\"/></svg>",
"file-type-terraform":"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 32 32\"><path fill=\"#813cf3\" d=\"m12.042 6.858l8.029 4.59v9.014l-8.029-4.594zM20.5 20.415l7.959-4.575V6.887L20.5 11.429zM3.541 11.01l8.03 4.589V6.59L3.541 2zm8.501 14.4L20.071 30v-9.043l-8.029-4.589z\"/></svg>"}

// File and folder icons for the folder tree. File icons are vscode-icons (MIT, github.com/vscode-icons/vscode-icons),
// picked the way VS Code picks them: a whole file name first, then a name prefix, then the longest extension. The SVGs
// are in icon-svgs.js, made by scripts/icons.mjs from the ids named here. Folders draw in the current text colour, so
// a folder can wear the colour of its place in the diagram. Icons that are large and rarely met are left out (the
// file gets the default icon).

const ICON_BY_NAME = {
  'package.json': 'file-type-npm', 'package-lock.json': 'file-type-npm', '.npmrc': 'file-type-npm',
  'pnpm-lock.yaml': 'file-type-pnpm', 'pnpm-workspace.yaml': 'file-type-pnpm', 'yarn.lock': 'file-type-yarn', 'bun.lock': 'file-type-bun',
  dockerfile: 'file-type-docker', 'docker-compose.yml': 'file-type-docker', 'docker-compose.yaml': 'file-type-docker', '.dockerignore': 'file-type-docker',
  '.gitignore': 'file-type-git', '.gitattributes': 'file-type-git', '.gitmodules': 'file-type-git',
  '.env': 'file-type-dotenv', '.prettierrc': 'file-type-prettier', '.prettierignore': 'file-type-prettier',
  
  'readme.md': 'file-type-readme', readme: 'file-type-readme', 'claude.md': 'file-type-claude', 'agents.md': 'file-type-agents',
  '.nvmrc': 'file-type-node', 'cargo.toml': 'file-type-rust', 'cargo.lock': 'file-type-rust', 'go.mod': 'file-type-go', 'go.sum': 'file-type-go',
}
const ICON_BY_PREFIX = [
  ['vite.config.', 'file-type-vite'], ['vitest.', 'file-type-vitest'], ['jest.config.', 'file-type-jest'], ['eslint.config.', 'file-type-eslint'],
  ['.eslintrc', 'file-type-eslint'], ['prettier.config.', 'file-type-prettier'], ['tailwind.config.', 'file-type-tailwind'], 
  ['playwright.config.', 'file-type-playwright'], ['webpack.config.', 'file-type-webpack'], 
  ['tsconfig.', 'file-type-tsconfig'], ['jsconfig.', 'file-type-jsconfig'], ['biome.json', 'file-type-biome'], ['dockerfile.', 'file-type-docker'], ['.env.', 'file-type-dotenv'],
]
const ICON_BY_EXT = {
  'd.ts': 'file-type-typescriptdef', 'test.ts': 'file-type-testts', 'spec.ts': 'file-type-testts', 'test.tsx': 'file-type-testts', 'e2e.ts': 'file-type-testts',
  'test.js': 'file-type-testjs', 'spec.js': 'file-type-testjs', 'test.mjs': 'file-type-testjs',
  ts: 'file-type-typescript', mts: 'file-type-typescript', cts: 'file-type-typescript', tsx: 'file-type-reactts',
  js: 'file-type-js', mjs: 'file-type-js', cjs: 'file-type-js', jsx: 'file-type-reactjs',
  json: 'file-type-json', jsonc: 'file-type-json', json5: 'file-type-json', jsonl: 'file-type-json',
  css: 'file-type-css', scss: 'file-type-scss', sass: 'file-type-scss', less: 'file-type-css', html: 'file-type-html', htm: 'file-type-html',
  md: 'file-type-markdown', markdown: 'file-type-markdown', mdx: 'file-type-mdx',
  yml: 'file-type-yaml', yaml: 'file-type-yaml', toml: 'file-type-toml', xml: 'file-type-xml', ini: 'file-type-light-ini',
  svg: 'file-type-svg', png: 'file-type-image', jpg: 'file-type-image', jpeg: 'file-type-image', gif: 'file-type-image', webp: 'file-type-image', ico: 'file-type-image',
  csv: 'file-type-csv', tsv: 'file-type-csv', txt: 'file-type-text', log: 'file-type-log', lock: 'file-type-text',
  py: 'file-type-python', rs: 'file-type-rust', go: 'file-type-go', java: 'file-type-java', kt: 'file-type-kotlin', swift: 'file-type-swift',
  c: 'file-type-c', h: 'file-type-cheader', cpp: 'file-type-cpp', cc: 'file-type-cpp', hpp: 'file-type-cppheader', cs: 'file-type-csharp',
  lua: 'file-type-lua',
  sh: 'file-type-shell', bash: 'file-type-shell', zsh: 'file-type-shell', ps1: 'file-type-powershell', bat: 'file-type-powershell', cmd: 'file-type-powershell',
  sql: 'file-type-sql', sqlite: 'file-type-sqlite', db: 'file-type-sqlite', graphql: 'file-type-graphql', gql: 'file-type-graphql',
  vue: 'file-type-vue', svelte: 'file-type-svelte', wasm: 'file-type-wasm', patch: 'file-type-diff', diff: 'file-type-diff',
  woff: 'file-type-font', woff2: 'file-type-font', ttf: 'file-type-font',
  mp3: 'file-type-audio', wav: 'file-type-audio', ipynb: 'file-type-jupyter', nix: 'file-type-nix', tf: 'file-type-terraform',
}
const ICON_EXTS = Object.keys(ICON_BY_EXT).sort((p, q) => q.length - p.length)

/** The vscode-icons SVG of a file, by its name (no folder). */
function fileIconSvg(name) {
  const n = String(name).split('/').pop().toLowerCase()
  const id = ICON_BY_NAME[n] || ICON_BY_PREFIX.find(([p]) => n.startsWith(p))?.[1] || ICON_EXTS.filter(e => n.endsWith('.' + e)).map(e => ICON_BY_EXT[e])[0]
  return (typeof ICON_SVGS !== 'undefined' && (ICON_SVGS[id] || ICON_SVGS['default-file'])) || ''
}

// a folder, closed or open, in the current text colour
const FOLDER_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M1.5 3.5A1 1 0 0 1 2.5 2.5h3.6l1.5 1.5h5.9a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z"/></svg>'
const FOLDER_OPEN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" opacity=".55" d="M1.5 3.5A1 1 0 0 1 2.5 2.5h3.6l1.5 1.5h5.9a1 1 0 0 1 1 1v1.5H1.5z"/><path fill="currentColor" d="M1.6 6.5h12.9a.6.6 0 0 1 .58.75l-1.4 5.5a1 1 0 0 1-.97.75H2.5a1 1 0 0 1-1-1z"/></svg>'
const CHEVRON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M4.5 2.75L7.75 6L4.5 9.25" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/** The icon ids this file names (scripts/icons.mjs copies their SVGs). */
function iconIds() { return [...new Set(['default-file', ...Object.values(ICON_BY_NAME), ...ICON_BY_PREFIX.map(x => x[1]), ...Object.values(ICON_BY_EXT)])] }

// The panel's folder tree: the files an answer cites or read, put where they sit in the repository, with what each
// folder is for. The reader builds a map of the repository: the top folders, the groups and packages in them, which
// of them this answer touches. Plain functions, no React and no DOM: scripts/build.mjs puts this file in front of
// app.js in the same scope, and tests/files.test.js loads it with node:vm.

// a file that makes its folder a package (a unit a programmer names: packages/core/session, crates/foo)
const MANIFEST = /(^|\/)(package\.json|Cargo\.toml|go\.mod|pyproject\.toml|setup\.py|pom\.xml|build\.gradle(?:\.kts)?|[^/]+\.csproj)$/

/** Folders that hold a package manifest ('' = the repository root), from the repository's file list. */
function packageRoots(paths) {
  const out = new Set()
  for (const p of paths || []) { const m = MANIFEST.exec(p); if (m) out.add(p.slice(0, m.index)) }
  return out
}

/** Where a file is listed: the nearest folder above it with a manifest (not the root), else the folder it is in. */
function groupOf(file, roots) {
  const d = String(file).split('/').slice(0, -1)
  for (let n = d.length; n > 0; n--) { const k = d.slice(0, n).join('/'); if (roots && roots.has(k)) return k }
  return d.join('/')
}

/** Line ranges sorted, with overlapping and touching ranges joined (and ranges at most `gap` lines apart). */
function mergeRanges(list, gap = 0) {
  const out = []
  for (const [s, e] of [...(list || [])].filter(r => r && r[0] > 0).map(r => [r[0], Math.max(r[0], r[1] || r[0])]).sort((x, y) => x[0] - y[0])) {
    const last = out[out.length - 1]
    if (last && s <= last[1] + 1 + gap) last[1] = Math.max(last[1], e); else out.push([s, e])
  }
  return out
}


const DOC = /\.(md|mdx|markdown|rst|adoc|txt)$/i
const nameIn = (key, file) => (key && file.startsWith(key + '/') ? file.slice(key.length + 1) : file)
const parentOf = p => p.split('/').slice(0, -1).join('/')
const lastSeg = p => p.split('/').pop()

/** Per folder of a repository ('' = the root): its child folders, the names of its own files, and how many files it
 * holds at all levels. */
function dirIndex(paths) {
  const idx = new Map(), at = d => idx.get(d) || idx.set(d, { dirs: new Set(), files: 0, names: [], total: 0 }).get(d)
  at('')
  for (const p of paths || []) {
    const parts = String(p).split('/')
    let d = ''
    at('').total++
    for (let i = 0; i < parts.length - 1; i++) { const next = d ? d + '/' + parts[i] : parts[i]; at(d).dirs.add(next); at(next).total++; d = next }
    at(d).files++; at(d).names.push(parts[parts.length - 1])
  }
  return idx
}

const byName = (p, q) => (p < q ? -1 : p > q ? 1 : 0)
/** What a folder holds, as a file explorer lists it: folders (with their label and file count), then file names. */
function dirList(idx, dir, labels) {
  const ix = idx?.get(dir) || { dirs: new Set(), names: [] }
  return { dir, dirs: [...ix.dirs].sort(byName).map(d => ({ dir: d, name: lastSeg(d), label: (labels && labels.get(d)) || '', total: idx.get(d)?.total || 0 })),
    files: [...ix.names].sort(byName) }
}

/**
 * The files of an answer in reading order: the file the earliest paragraph cites first, files only read after them.
 * @param {object} a - the checked answer (paras with evidence)
 * @param {Array<{file: string, ranges?: number[][]}>} reads - files read while answering
 * @param {Set<string>} current - files the paragraph being read cites
 * @returns {Array<{file, cited, paras, read, cur, doc, order}>}
 */
function answerFiles(a, reads, current) {
  const byFile = new Map(), at = f => byFile.get(f) || byFile.set(f, { file: f, cited: [], paras: [], read: [], first: Infinity, readAt: Infinity }).get(f)
  ;(a?.paras || []).forEach((p, i) => (p.evidence || []).forEach(e => {
    if (!e || !e.file) return
    const x = at(e.file); x.cited.push([e.start, e.end]); if (!x.paras.includes(i)) x.paras.push(i); x.first = Math.min(x.first, i)
  }))
  let n = 0
  for (const r of reads || []) { if (!r || !r.file) continue; const x = at(r.file); x.read.push(...(r.ranges || [])); x.readAt = Math.min(x.readAt, n++) }
  return [...byFile.values()].map(x => ({ file: x.file, cited: mergeRanges(x.cited), paras: x.paras.sort((p, q) => p - q), read: mergeRanges(x.read),
    cur: !!current && current.has(x.file), doc: DOC.test(x.file), order: x.first < Infinity ? x.first : 1e6 + x.readAt }))
}

/** The files read so far while the agent works, in the order they were first read; `now` is the one being read. */
function liveFiles(reads, now) {
  const list = [...new Set([...(reads || []), ...(now ? [now] : [])])]
  return list.map((f, i) => ({ file: f, cited: [], paras: [], read: [], cur: f === now, doc: DOC.test(f), order: i }))
}

/**
 * The files placed in the repository's folder tree.
 * - From the root down, a folder that holds a listed file opens; it lists its files (a package lists all of its
 *   files, with paths inside the package) and its open sub-folders, in the order of their first file.
 * - What else the folder holds (folders and files with no listed file) is kept as `hidden`, for a "+" row that the
 *   reader opens like a folder in a file explorer. Not inside a package (it lists its files with paths inside it).
 * - A folder with one sub-folder and no files of its own joins it on one row ("apps/web").
 * @param {Array} files - answerFiles or liveFiles
 * @param {Map|null} idx - dirIndex of the repository (null: built from the files alone)
 * @param {Set<string>|null} roots - package folders
 * @param {Map<string, string>} labels - folder -> what it is for
 * @returns {object} the root node: {dir, name, pkg, label, total, cited, read, cur, files, kids, hidden}
 */
function fileTree(files, idx, roots, labels) {
  idx = idx || dirIndex(files.map(f => f.file))
  const home = new Map(files.map(f => [f.file, groupOf(f.file, roots)]))
  // per folder: the first order of the files listed in it or below it
  const first = new Map()
  for (const f of files) for (let d = home.get(f.file); ; d = parentOf(d)) { first.set(d, Math.min(first.get(d) ?? Infinity, f.order)); if (!d) break }
  // the open folders under each folder (from the files, so a cited file in a folder the repository lacks still shows)
  const under = new Map()
  for (const d of first.keys()) if (d) { const p = parentOf(d); under.set(p, [...(under.get(p) || []), d]) }
  const label = d => (labels && labels.get(d)) || ''
  const build = (dir, name) => {
    const none = { dirs: new Set(), files: 0, names: [], total: 0 }
    let ix = idx.get(dir) || none, lab = label(dir)
    // a chain of single folders reads as one path (with the label of the deepest folder that has one)
    while (dir && !(roots && roots.has(dir)) && ix.files === 0 && !files.some(f => home.get(f.file) === dir)) {
      const subs = new Set([...ix.dirs, ...(under.get(dir) || [])]); if (subs.size !== 1) break
      const only = [...subs][0]; if (!first.has(only)) break
      dir = only; name += '/' + lastSeg(only); ix = idx.get(dir) || none; lab = label(dir) || lab
    }
    const pkg = !!dir && !!roots && roots.has(dir)
    const own = files.filter(f => home.get(f.file) === dir).sort((p, q) => p.order - q.order).map(f => ({ ...f, name: nameIn(dir, f.file) }))
    const open = [...(under.get(dir) || [])].sort((p, q) => first.get(p) - first.get(q))
    const kids = open.map(d => build(d, lastSeg(d)))
    let hidden = null
    if (!pkg) {
      const l = dirList(idx, dir, labels), mine = new Set(own.map(f => f.name))
      hidden = { dir, dirs: l.dirs.filter(d => !first.has(d.dir)), files: l.files.filter(n => !mine.has(n)) }
      if (!hidden.dirs.length && !hidden.files.length) hidden = null
    }
    const all = [...own, ...kids.flatMap(k => k.all)]
    return { dir, name, pkg, label: lab, total: ix.total, files: own, kids, all, hidden,
      cited: all.filter(f => f.cited.length).length, read: all.filter(f => !f.cited.length).length, cur: all.some(f => f.cur) }
  }
  return build('', '')
}

// what common top folders hold, by name (a repository's own labels come from answers and replace these)
const FOLDER_WORDS = {
  zh: { apps: '应用入口', packages: '各个包', libs: '库', docs: '文档', doc: '文档', documentation: '文档', scripts: '脚本', tests: '测试', test: '测试', __tests__: '测试',
    examples: '示例', example: '示例', benchmarks: '性能测试', bench: '性能测试', vendor: '第三方代码', third_party: '第三方代码', website: '网站', site: '网站',
    assets: '资源文件', public: '静态文件', static: '静态文件', patches: '依赖补丁', snapshots: '测试快照', fixtures: '测试数据', '.github': 'GitHub 配置', '.agents': '给智能体的说明' },
  en: { apps: 'entry apps', packages: 'packages', libs: 'libraries', docs: 'documents', doc: 'documents', documentation: 'documents', scripts: 'scripts', tests: 'tests', test: 'tests', __tests__: 'tests',
    examples: 'examples', example: 'examples', benchmarks: 'benchmarks', bench: 'benchmarks', vendor: 'third-party code', third_party: 'third-party code', website: 'website', site: 'website',
    assets: 'assets', public: 'static files', static: 'static files', patches: 'dependency patches', snapshots: 'test snapshots', fixtures: 'test data', '.github': 'GitHub settings', '.agents': 'notes for agents' },
}
/** Labels by folder name for the top folders of a repository. */
function folderWords(idx, lang) {
  const words = FOLDER_WORDS[lang] || FOLDER_WORDS.zh, out = new Map()
  for (const d of idx?.get('')?.dirs || []) if (words[d]) out.set(d, words[d])
  return out
}

/**
 * Cells of the repository map when it has too many files to draw one by one: folders, split from the top until there
 * are about `target` of them. The biggest folder is split first, into its sub-folders and (one cell) its own files,
 * so a repository that keeps its code a few folders deep (src/app/core/...) still gets cells of a size that can be
 * seen, and a flat one is not cut up more than needed.
 * @param {string[]} paths - the repository's files
 * @param {Iterable<string>} split0 - folders that are split from the start (the map's regions that are sub-folders)
 * @returns {{cellOf: (path: string) => string, size: number}} cellOf gives "folder/" ("(根目录)/" for the root)
 */
function folderCells(paths, split0 = [], target = 500) {
  const idx = dirIndex(paths), split = new Set(['', ...split0])
  const cellsOf = d => [...(idx.get(d)?.dirs || [])].filter(x => !split.has(x))
  let cells = [], own = 0
  for (const d of split) { cells.push(...cellsOf(d)); if (idx.get(d)?.files) own++ }
  // the biggest folder that has sub-folders is split until there are enough cells
  while (cells.length + own < target) {
    let best = null
    for (const d of cells) if ((idx.get(d)?.dirs.size || 0) && (!best || idx.get(d).total > idx.get(best).total)) best = d
    if (!best) break
    split.add(best); cells = cells.filter(x => x !== best).concat(cellsOf(best)); if (idx.get(best).files) own++
  }
  const cellOf = p => {
    const d = String(p).split('/').slice(0, -1)
    for (let n = 1; n <= d.length; n++) { const k = d.slice(0, n).join('/'); if (!split.has(k)) return k + '/' }
    return d.length ? d.join('/') + '/' : '(根目录)/'
  }
  return { cellOf, size: cells.length + own }
}

/**
 * How well a path answers a search, or null when it does not (from claude-files-pane hooks/paths.ts): the letters of
 * the query in order; a run of letters, a letter at the start of a word, and a letter in the file name count more; the
 * query whole in the file name counts most; a shorter path wins a tie.
 */
function scoreOf(path, query) {
  const text = String(path).toLowerCase(), nameAt = text.lastIndexOf('/') + 1
  const from = start => {
    let score = 0, at = start - 1, run = 0
    for (const letter of query) {
      const found = text.indexOf(letter, at + 1)
      if (found < 0) return null
      run = found === at + 1 ? run + 1 : 0
      score += 1 + run * 2
      if (found === 0 || '/-_. '.includes(text[found - 1])) score += 3
      if (found >= nameAt) score += 2
      at = found
    }
    return score
  }
  let best = null
  for (let start = text.indexOf(query[0] ?? ''); start >= 0; start = text.indexOf(query[0], start + 1)) {
    const s = from(start)
    if (s === null) break
    if (best === null || s > best) best = s
  }
  if (best === null) return null
  if (text.slice(nameAt).includes(query)) best += query.length * 4
  return best - text.length / 100
}

/** The paths that answer a search best, best first (at most `limit`). Spaces in the query are ignored. */
function findFiles(paths, query, limit = 50) {
  const q = String(query || '').toLowerCase().replace(/\s+/g, '')
  if (!q) return []
  const out = []
  for (const p of paths || []) { const s = scoreOf(p, q); if (s !== null) out.push({ p, s }) }
  return out.sort((x, y) => y.s - x.s).slice(0, limit).map(x => x.p)
}

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

})();
return module.exports; } });