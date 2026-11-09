// Attention-cost numbers that need no reviewer, the same rules for both modes. English answers.
//   node bench/attention-metrics.mjs <questions.json> <decode answers.json> <standard answers.json> <out.json>
// What the reader has to read: Decode = the conclusion and the paragraphs (quotes are folded by default, so they are
// counted apart); standard = the whole reply. Reading time at 238 words a minute (Brysbaert 2019, silent non-fiction).
// Terms = distinct code-like tokens (backticked, a path, camelCase, snake_case, kebab with a slash or a dot).
// A "block" is a paragraph, list item or table row of at least 8 words. A block is located when it names a file and
// line. Decode's evidence is structured, so a paragraph is located when it holds a quote whose status is verified;
// that status was checked by the plugin against the file; a line reference in a standard reply was not checked here.
import fs from 'node:fs'

const [qfile, decFile, stdFile, outFile] = process.argv.slice(2)
const qs = JSON.parse(fs.readFileSync(qfile, 'utf8'))
const dec = JSON.parse(fs.readFileSync(decFile, 'utf8')).result, std = JSON.parse(fs.readFileSync(stdFile, 'utf8')).result

const NL = String.fromCharCode(10)
const clean = t => String(t || '').replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1')
const words = t => clean(t).split(/\s+/).filter(Boolean).length
const TERM = /`[^`]+`|[\w.@-]+\/[\w./@-]+|\b[a-z]+[A-Z]\w*\b|\b[A-Z][a-z]+[A-Z]\w*\b|\b[a-z]+_[a-z_]+\b/g
const terms = t => new Set((clean(t).match(TERM) || []).map(x => x.replace(/`/g, '').toLowerCase()))
const FILELINE = /[\w.-]+\.[a-z]{1,5}(?:`)?\s*(?::|#L|,?\s*lines?\s*)\s*\d+/i, FILE = /[\w-]+(?:\/[\w.-]+)*\.[a-z]{1,5}\b/i

function blocks(md) {
  const noFence = md.replace(/```[\s\S]*?```/g, ' ')
  return noFence.split(NL).map(l => l.trim()).filter(l => l && !l.startsWith('#') && !/^\|?[\s:|-]+\|?$/.test(l) && words(l) >= 8)
}

const out = []
for (const q of qs) {
  const a = dec.find(r => r.id === q.id)?.answer, s = std.find(r => r.id === q.id), sText = s?.end?.finalText || s?.plain || ''
  const row = (mode, text, nBlocks, nLine, nFile, extra) => { const w = words(text), n = terms(text).size
    return { id: q.id, mode, words: w, readMin: +(w / 238).toFixed(1), terms: n, termsPer100: w ? +(n / w * 100).toFixed(1) : null, blocks: nBlocks, located: nLine, namesFile: nFile, locatedPct: nBlocks ? Math.round(nLine / nBlocks * 100) : null, ...extra } }
  if (a) {
    const text = [a.take, ...a.paras.map(p => p.text)].join(NL)
    const ok = a.paras.filter(p => (p.evidence || []).some(e => e.status === 'verified')).length, any = a.paras.filter(p => (p.evidence || []).length).length
    const ev = a.paras.flatMap(p => p.evidence || [])
    out.push(row('decode', text, a.paras.length, ok, any, { quotes: ev.length, quotesVerified: ev.filter(e => e.status === 'verified').length, quoteWords: ev.reduce((n, e) => n + words(e.quote), 0), diagrams: a.views.length }))
  }
  if (sText) {
    const b = blocks(sText)
    out.push(row('standard', sText, b.length, b.filter(x => FILELINE.test(x)).length, b.filter(x => FILE.test(x)).length, { quotes: 0, quotesVerified: 0, quoteWords: 0, diagrams: 0 }))
  }
}
fs.writeFileSync(outFile, JSON.stringify(out, null, 1))
for (const r of out) console.log(r.id.padEnd(11), r.mode.padEnd(9), 'words', String(r.words).padStart(5), 'read', String(r.readMin).padStart(4) + 'm', 'terms/100', String(r.termsPer100).padStart(5), 'located', `${r.located}/${r.blocks}`, 'diagrams', r.diagrams)
