// lib/client.js is what dsh loads in the browser: it must be built from the current sources and load as a module.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { instructions } from '../src/prompt.js'
import { VIEW_TYPES } from '../src/check.js'

const read = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8')

test('lib/client.js is built from the current sources (run npm run build)', () => {
  const lib = read('lib/client.js')
  for (const f of ['vendor/cw-uml.js', 'src/client/icon-svgs.js', 'src/client/icons.js', 'src/client/files.js', 'src/client/app.js']) assert.ok(lib.includes(read(f)), `${f} changed after the last build`)
})
test('lib/client.js loads and gives the client plugin', () => {
  let mod = null
  const react = new Proxy({}, { get: () => () => {} })
  const sandbox = { window: { __ModuleLoader__: { load: m => { mod = m.factory(n => (n === 'react' ? react : {})) } } }, document: {}, navigator: {}, console }
  vm.runInNewContext(read('lib/client.js'), sandbox)
  assert.deepEqual(Object.keys(mod).sort(), ['apply', 'inject'])
  assert.ok(mod.inject.includes('uiConversation'))
})
test('the prompt teaches each view type and asks for no key judgments or tables', () => {
  const p = instructions()
  for (const t of VIEW_TYPES) assert.match(p, new RegExp(`- ${t}：`), `no spec example for ${t}`)
  assert.doesNotMatch(p, /judgments|关键判断/)
  assert.doesNotMatch(p, /- table：/)
})
// dsh gives a plugin only the host packages it names as peers (profiles do not install peers): an import left out of
// peerDependencies stops the agent, and the mode is missing from the menu with no error (found on dsh 0.2.1 and 0.2.2)
test('every dsh package the server code imports is a peer dependency', () => {
  const peers = Object.keys(JSON.parse(read('package.json')).peerDependencies || {})
  for (const f of ['src/agent.js', 'src/check.js', 'src/prompt.js', 'src/web.js'])
    for (const [, name] of read(f).matchAll(/^import [^'"]*['"]((?:@[^/'"]+\/)?[^./'"][^/'"]*)/gm))
      if (!name.startsWith('node:')) assert.ok(peers.includes(name), `${f} imports ${name}, which is not in peerDependencies`)
})
