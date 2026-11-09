// What a diagram says, in plain lines: the model checks these against the code before its answer is accepted.
// A model reads its own picture from memory of what it meant; here it reads what was really drawn.
const MAX_PATHS = 12, MAX_LINES = 40
const parse = s => { if (typeof s !== 'string') return s || {}; try { return JSON.parse(s) } catch { return {} } }

function activityLines(s) {
  const nodes = s.nodes || [], flows = s.flows || [], byId = Object.fromEntries(nodes.map(n => [n.id, n]))
  const name = id => byId[id]?.name || (byId[id]?.kind === 'end' ? '结束' : id), start = (nodes.find(n => n.kind === 'start') || nodes[0])?.id
  const out = [], walk = (id, seen, steps) => {
    if (out.length >= MAX_PATHS) return
    const next = flows.filter(f => f.from === id)
    if (!next.length) { out.push(steps.join(' → ')); return }
    for (const f of next) {
      const guard = f.guard ? `[${f.guard}] ` : ''
      if (seen.includes(f.to)) out.push([...steps, `${guard}回到 ${name(f.to)}`].join(' → '))
      else walk(f.to, [...seen, f.to], byId[f.to]?.kind === 'start' ? steps : [...steps, guard + name(f.to)])
    }
  }
  if (start) walk(start, [start], [])
  return out.map((p, i) => `路径 ${i + 1}：${p}`)
}

function sequenceLines(s) {
  const lives = Object.fromEntries((s.lifelines || []).map(l => [l.id, l.name || l.id])), ms = s.messages || []
  const at = id => ms.findIndex(m => m.id === id), spans = []
  for (const f of s.frags || []) for (const o of f.operands || [{ from: f.from, to: f.to, guard: f.label }]) spans.push({ a: at(o.from), b: at(o.to), kind: f.kind, guard: o.guard || f.label || '' })
  return ms.map((m, i) => { const inside = spans.filter(x => x.a >= 0 && x.a <= i && i <= x.b)
    return `${inside.length ? inside.map(x => `只在 ${x.kind} [${x.guard}] 时`).join('，') : '所有路径都发生'}：${lives[m.from] || m.from} → ${lives[m.to] || m.to}：${m.text || ''}` })
}

function stateLines(s) {
  const byId = Object.fromEntries((s.states || []).map(x => [x.id, x])), name = id => byId[id]?.name || (byId[id]?.kind === 'initial' ? '开始' : byId[id]?.kind === 'final' ? '结束' : id)
  return (s.transitions || []).map(t => `${name(t.from)} → ${name(t.to)}${t.label ? `：${t.label}` : '（没有写条件，读者认为总是发生）'}`)
}

function depLines(s) {
  const list = [...(s.nodes || []), ...(s.packages || [])], name = id => list.find(x => x.id === id)?.name || id
  return (s.deps || []).map(([a, b]) => `${name(a)} 依赖 ${name(b)}，并且总是依赖（没有写条件）`)
}

function classLines(s) {
  return (s.classes || []).flatMap(c => [...(c.fields || []), ...(c.methods || [])].map(m => `${c.name || c.id} 总是有：${m}（没有写条件）`))
}

// Words that make a sentence a condition. The strong ones are listed first, because the list is capped.
const STRONG = /\b(only (when|if|while|after|once)|unless|by default|defaults? to|otherwise|except)\b|只有|只在|除非|默认|否则|取决于/i
const WEAK = /\b(if|when|while|requires?|depends on)\b|如果|才会|才能|需要/i

const sentences = paras => (paras || []).flatMap(p => String(p.text || '').replace(/\[\[([^|\]]+)\|[^\]]*\]\]/g, '$1').split(/(?<=[。；;!?！？]|\.\s)\s*/)).map(s => s.trim()).filter(Boolean)

/** The sentences of an answer that state a condition: the picture must not drop them. */
export function conditionsIn(paras, cap = 12) {
  const all = sentences(paras)
  return [...all.filter(s => STRONG.test(s)), ...all.filter(s => !STRONG.test(s) && WEAK.test(s))].slice(0, cap)
}

/** The diagrams of an answer as plain lines, for the model to check against the code. */
export function readBack(views) {
  return (views || []).map(v => { const s = parse(v.spec)
    const ls = v.type === 'activity' ? activityLines(s) : v.type === 'sequence' ? sequenceLines(s) : v.type === 'state' ? stateLines(s) : v.type === 'component' || v.type === 'package' ? depLines(s) : v.type === 'class' ? classLines(s) : []
    return ls.length ? `图「${v.title || v.id}」读者读到的是：\n${ls.slice(0, MAX_LINES).map(l => `- ${l}`).join('\n')}` : '' }).filter(Boolean).join('\n\n')
}
