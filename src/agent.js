// Decode agent plugin: mounted inside the Decode preset. It adds the Q&A rules to the system prompt,
// registers submit_answer, and records which lines the agent read so the answer can mark evidence it really saw.
import { defineTool } from '@deepseek-ai/dsh-tools'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { readBack, conditionsIn } from './readback.js'
import { checkAnswer, fileTypes, KINDS, loadTracked, relPath, VIEW_TYPES } from './check.js'
import { instructions } from './prompt.js'

export const name = 'dsh-decode'
export const inject = ['tools', 'systemPrompt', 'workingDirectory']

// the file types the repository tracks, most first: told to the agent once, so a grep does not guess an include
// (seen: `include: "*.ts"` in a JavaScript repository; rg searches no file and the chat shows an error)
const TYPES = l => `（Decode）这个仓库跟踪的文件类型（按数量）：${l.join('、')}。grep 的 include 只用这里有的类型，不确定就不写 include。`

// the reader waits: past this time in a turn the agent is told once to submit what it has
// (RC_DEADLINE_MS shortens it for a live test of the notice)
const DEADLINE_MS = Number(process.env.RC_DEADLINE_MS) || 180000
// Once per turn, after the form checks pass: the model reads its own answer the way a reader does, text against picture
const list = a => a.map(c => '- ' + c).join('\n')
const REVIEW = (said, conds, en) => '格式已通过，但还没有接受。提交前核对一次（每个回答只核对一次）。下面是程序从你的图里读出来的内容，也就是读者会相信的内容：\n\n' + said + '\n\n逐行对照代码：哪一行不成立（步骤不该在这条路径上、条件写错或漏写、顺序不对、这条依赖没有读到 import 或调用、这条依赖不是总有）？不确定的就用 read 确认。没有确认的依赖边就去掉。'
  + (conds.length ? '\n\n你的文字写了下面这些条件。读者常常只看图，所以逐句查图上有没有：\n' + list(conds) + `\n\n和图讲的内容有关、图上却没有的，加到对应的判断、边的标签或成员名上（例如成员名后写“${en ? '(only if X)' : '（仅当 X）'}”）。` : '')
  + '\n\n把错的地方改到文字和图上，不要增加段落或图。改完或全部成立，都再次调用 submit_answer 提交完整的回答。' + (en ? ' The reader asked in English: every word of the answer and the diagrams stays in English.' : '')
const HURRY = '（Decode）已经查了 3 分钟，读者在等。现在就用已有证据整理回答（需要图的调用 submit_answer），不要再搜索。没查实的地方把证据标成 inferred，并在段落里写明没有查证。'

// Nested objects take extra keys (additionalProperties: true; dsh needs it stated): with false dsh would send the whole answer back for one stray
// field (a `note` on paragraph evidence, seen in about 3 % of answers) and the model rewrites all of it, 1–2 minutes;
// check.js keeps only the declared fields.
const EVIDENCE = {
  type: 'object', additionalProperties: true, properties: {
    file: { type: 'string', required: true, description: '仓库相对路径' },
    start: { type: 'integer', required: true },
    end: { type: 'integer', required: true },
    quote: { type: 'string', required: true, description: '从这段源码原样复制的 1–2 行关键代码（不带行号）；ran/inferred 可写空字符串' },
    kind: { type: 'string', required: true, enum: ['read', 'ran', 'inferred'], description: 'read 读到源码 / ran 运行验证过 / inferred 推断' },
  },
}

const PARAMETERS = {
  take: { type: 'string', required: true, description: '一句话白话结论（中文不超过 60 字，英文不超过 30 词）；代码名最多 3 个' },
  kind: { type: 'string', required: true, enum: KINDS, description: '问题类型：flow 怎么工作 / impact 改动影响 / state 生命周期 / decision 判断条件 / locate 在哪里 / explain 概念解释 / compare 比较 / data 数据结构 / deploy 运行部署 / use 能做什么' },
  views: {
    type: 'array', required: true, description: '1–3 张图。不需要图的问题不要调用 submit_answer，直接用普通消息回答。', items: {
      type: 'object', additionalProperties: true, properties: {
        id: { type: 'string', required: true, description: '图的 id，小写字母数字和连字符' },
        type: { type: 'string', required: true, enum: VIEW_TYPES },
        title: { type: 'string', required: true },
        spec: { type: 'string', required: true, description: 'cw-uml spec 的 JSON 字符串（格式见系统提示）' },
      },
    },
  },
  paras: {
    type: 'array', required: true, description: '正文段落，2–14 段，按阅读顺序。', items: {
      type: 'object', additionalProperties: true, properties: {
        text: { type: 'string', required: true, description: '1–4 句白话，用读者提问的语言。可用 [[显示文字|id]] 指向图中元素。代码名（函数、类、路径、事件名、配置值）一段最多 10 个，状态值、事件名、配置值写真实名字并用半句话说明含义' },
        view: { type: 'string', required: true, description: '本段对应的图 id；没有图时写空字符串' },
        now: { type: 'array', required: true, items: { type: 'string' }, description: '本段讲到的图元素 id，0–5 个' },
        upto: { type: 'string', required: true, description: '仅时序图：本段讲到的最后一条消息 id。其他情况写空字符串' },
        evidence: { type: 'array', required: true, items: EVIDENCE },
      },
    },
  },
  followups: { type: 'array', required: true, items: { type: 'string' }, description: '2–3 个值得继续问的问题' },
  // optional: an answer without it is still accepted
  areas: {
    type: 'array', description: '回答用到的代码所在的 2–8 个目录，从大到小，每个一句白话说它负责什么（显示在右侧的目录树上）', items: {
      type: 'object', additionalProperties: true, properties: {
        path: { type: 'string', required: true, description: '仓库相对的目录路径，如 packages/session' },
        role: { type: 'string', required: true, description: '它负责什么：中文 4–12 字，英文 2–6 词' },
      },
    },
  },
}

export function apply(ctx) {
  // agent -> {root, reads: Map(rel path -> [[start, end]]), tries}
  const state = new WeakMap()
  const stateOf = agent => { let s = state.get(agent); if (!s) state.set(agent, s = { root: null, reads: new Map(), tries: 0 }); return s }
  const rootOf = async (exec) => {
    const s = stateOf(exec.agent)
    if (!s.root) s.root = exec.agent ? await ctx.workingDirectory.ensure(exec.agent, exec.signal) : process.cwd()
    return s.root
  }

  ctx.effect(() => ctx.systemPrompt.section({
    name: 'decode', order: 10300, interpolate: false, text: instructions(),
  }), 'decode: rules')

  // what the agent read: path and line window of every successful read
  ctx.on('tools/result', async (exec, result) => {
    if (exec.name !== 'read' || !exec.agent || result?.isError) return
    try {
      const root = await rootOf(exec)
      const a = exec.arguments || {}
      const rel = relPath(root, result?.value?.path || a.file_path)
      if (!rel) return
      const start = Math.max(1, Number(result?.value?.offset ?? a.offset ?? 1))
      const n = Array.isArray(result?.value?.lines) ? result.value.lines.length : Number(a.limit ?? 2000)
      const s = stateOf(exec.agent)
      ;(s.reads.get(rel) || s.reads.set(rel, []).get(rel)).push([start, start + Math.max(0, n - 1)])
    } catch {}
  })

  // turn start, and the one late notice
  ctx.on('agent/pre-step', async ({ agent, turn, messages }, next) => {
    const d = await next()
    if (d.kind === 'reject' || !agent) return d
    const s = stateOf(agent)
    if (s.turn !== turn) {
      // the notice the reader sees follows the language of the question that started the turn
      // (the reader's last message, not the whole history: a follow-up may change language)
      const mine = (messages || []).filter(m => m.source?.kind === 'user' || m.role === 'user')
      const asked = (mine.length ? [mine.at(-1)] : messages || []).flatMap(m => m.content || []).map(c => c.text || '').join('')
      s.turn = turn; s.t0 = Date.now(); s.hurried = false; s.tries = 0; s.reviewed = false; s.en = !!asked && !/[㐀-鿿]/.test(asked)
      if (s.typesSent) return d
      s.typesSent = true
      try {
        if (!s.root) s.root = await ctx.workingDirectory.ensure(agent)
        const types = fileTypes(await loadTracked(s.root))
        if (!types.length) return d
        const summary = s.en ? 'File types of this repository' : '仓库的文件类型'
        return { ...d, messages: [...d.messages, createUserMessage({ content: [{ type: 'text', text: TYPES(types) }], source: { kind: 'decode', form: 'notice', summary } })] }
      } catch { return d }
    }
    if (s.hurried || Date.now() - s.t0 < DEADLINE_MS) return d
    s.hurried = true
    const summary = s.en ? 'Time is up: writing the answer from what was found' : '查证时间到，开始整理回答'
    return { ...d, messages: [...d.messages, createUserMessage({ content: [{ type: 'text', text: HURRY }], source: { kind: 'decode', form: 'notice', summary } })] }
  })

  ctx.effect(() => ctx.tools.register(defineTool({
    name: 'submit_answer',
    description: '提交需要图的回答：回答超过 3 句或要分几部分讲的仓库问题都用它（流程、结构、生命周期、判断条件、改动影响等）。打招呼、闲聊、3 句以内能说清的问题不要调用，直接用普通消息回答。校验不通过会返回全部问题，按问题修改后再次调用。',
    parameters: PARAMETERS,
    output: {
      schema: { type: 'json' },
      render: (_args, value) => [{ type: 'text', text: value.repairs?.length ? `已接受（已自动修复：${value.repairs.join('；')}）。只回复“完成”。` : '已接受。只回复“完成”。' }],
      presentationMeta: (_args, value) => value,
    },
    async execute(args, exec) {
      const root = await rootOf(exec)
      const s = stateOf(exec.agent)
      s.tries++
      await loadTracked(root)
      const r = checkAnswer(args, root, s.reads, s.tries > 1, { en: s.en })
      if (!r.ok) throw new Error('回答没有通过校验，请按下面的问题修改后再次调用 submit_answer：\n- ' + r.errors.join('\n- '))
      s.tries = 0
      if (!s.reviewed) { s.reviewed = true; throw new Error(REVIEW(readBack(r.answer.views), conditionsIn(r.answer.paras), s.en)) }
      const reads = [...s.reads].map(([file, ranges]) => ({ file, ranges }))
      try { exec.concludeTurn?.() } catch {}
      // hurried: written after the time-limit notice (the chat hides injected notices; the card tells the reader)
      return { root, reads, answer: r.answer, repairs: r.repairs, hurried: !!s.hurried }
    },
  })), 'decode: submit_answer')
}
