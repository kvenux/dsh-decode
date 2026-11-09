// The bench must run on any machine: no one's home folder in its scripts or rubrics.
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('docs and the top-level notes hold no absolute home paths', () => {
  const root = path.join(import.meta.dirname, '..')
  const files = [...fs.readdirSync(root).filter(f => f.endsWith('.md')), ...fs.readdirSync(path.join(root, 'docs')).filter(f => f.endsWith('.md')).map(f => 'docs/' + f)]
  assert.deepEqual(files.filter(f => /[A-Za-z]:[\\/]+Users[\\/]|\/home\/[a-z]|\/Users\/[a-z]/.test(fs.readFileSync(path.join(root, f), 'utf8'))), [])
})

test('bench scripts and rubrics hold no absolute home paths', () => {
  const dir = path.join(import.meta.dirname, '..', 'bench')
  const bad = fs.readdirSync(dir).filter(f => /\.(mjs|sh|md|json)$/.test(f)).filter(f => /[A-Za-z]:[\\/]+Users[\\/]|\/home\/[a-z]|\/Users\/[a-z]/.test(fs.readFileSync(path.join(dir, f), 'utf8')))
  assert.deepEqual(bad, [])
})
