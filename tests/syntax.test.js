// Every source file parses. The plugin loads them at run time, and a file with a syntax error drops the whole mode with no message.
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const src = path.join(path.dirname(fileURLToPath(import.meta.url)), '../src')
for (const f of fs.readdirSync(src).filter(n => n.endsWith('.js'))) {
  test(`src/${f} parses`, () => {
    const r = spawnSync(process.execPath, ['--check', path.join(src, f)], { encoding: 'utf8' })
    assert.equal(r.status, 0, r.stderr)
  })
}
