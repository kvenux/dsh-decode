import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { changes, rejected, apply, inject, source } from '../src/web.js'
import { trackedFiles, findGit } from '../src/check.js'

const git = (root, ...a) => execFileSync('git', ['-C', root, ...a], { windowsHide: true })

test('changes: tracked files not committed get M / A / D; untracked files and committed ones none', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-changes-'))
  try {
    git(root, 'init', '-q')
    for (const f of ['a.js', 'b.js', '目录/c.js']) { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), 'x\n') }
    git(root, 'add', '.'); git(root, '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 'one')
    fs.writeFileSync(path.join(root, '目录/c.js'), 'y\n')
    fs.rmSync(path.join(root, 'b.js'))
    fs.writeFileSync(path.join(root, 'new.js'), 'z\n'); git(root, 'add', 'new.js')
    fs.writeFileSync(path.join(root, 'loose.js'), 'z\n')
    const c = await changes(root)
    assert.deepEqual({ ...c.files }, { '目录/c.js': 'M', 'b.js': 'D', 'new.js': 'A' })
    // lines added / removed against the last commit
    assert.deepEqual({ ...c.lines }, { '目录/c.js': [1, 1], 'b.js': [0, 1], 'new.js': [1, 0] })
  } finally { fs.rmSync(root, { recursive: true, force: true }) }
})

test('routes: each one asks the connection service first and answers its 401/403 without reading anything', async () => {
  assert.ok(inject.includes('connection'))
  const routes = [], res = () => ({ statusCode: 200, body: null, writeHead(s) { this.statusCode = s }, end(b) { this.body = b ?? '' } })
  const ctx = { effect: f => f(), webServer: { register: r => routes.push(r) } }
  let answer = 401
  Object.defineProperty(ctx, 'connection', { get: () => ({ requestRejection: () => answer }) })
  apply(ctx)
  assert.equal(routes.length, 3)
  for (const code of [401, 403]) {
    answer = code
    for (const r of routes) { const out = res(); await r.handler({ method: 'GET', url: r.path + '?root=' + encodeURIComponent(process.cwd()), headers: {} }, out); assert.equal(out.statusCode, code, r.path); assert.equal(out.body, '') }
  }
  answer = undefined
  const out = res(); await routes.find(r => r.path.endsWith('/changes')).handler({ method: 'GET', url: '/dsh-decode/changes?root=' + encodeURIComponent(process.cwd()), headers: {} }, out)
  assert.equal(out.statusCode, 200)
})

test('rejected: no connection service, or one that throws, closes the route', () => {
  const out = () => ({ statusCode: 200, end() {} })
  const a = out(); assert.equal(rejected(undefined, {}, a), true); assert.equal(a.statusCode, 401)
  const b = out(); assert.equal(rejected({ requestRejection: () => { throw new Error('x') } }, {}, b), true); assert.equal(b.statusCode, 403)
  const c = out(); assert.equal(rejected({ requestRejection: () => undefined }, {}, c), false); assert.equal(c.statusCode, 200)
})

test('source: a tracked symbolic link that points out of the repository is not read', async (t) => {
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-out-')), root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-link-'))
  fs.writeFileSync(path.join(outside, 'secret.txt'), 'secret\n'); fs.writeFileSync(path.join(root, 'a.txt'), 'a\n')
  try { fs.symlinkSync(path.join(outside, 'secret.txt'), path.join(root, 'link.txt')) } catch { t.skip('no symlinks here'); return }
  git(root, 'init', '-q'); git(root, '-c', 'core.symlinks=true', 'add', '.')
  if (!trackedFiles(root).includes('link.txt')) { t.skip('git did not track the link'); return }
  assert.equal((await source(root, 'link.txt', 1, 1)).error, 'outside the repository, too large, or unreadable')
  assert.deepEqual((await source(root, 'a.txt', 1, 1)).lines.slice(0, 1), ['a'])
})

test('source: a tracked file under a folder link that points out of the repository is not read', async () => {
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-out-')), root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-junc-'))
  fs.mkdirSync(path.join(root, 'd')); fs.writeFileSync(path.join(root, 'd', 'secret.txt'), 'inside\n'); fs.writeFileSync(path.join(outside, 'secret.txt'), 'secret\n')
  git(root, 'init', '-q'); git(root, 'add', '.')
  // after git tracked d/secret.txt, d becomes a link to a folder out of the repository (a junction needs no rights on Windows)
  fs.rmSync(path.join(root, 'd'), { recursive: true }); fs.symlinkSync(outside, path.join(root, 'd'), 'junction')
  assert.equal(fs.readFileSync(path.join(root, 'd', 'secret.txt'), 'utf8'), 'secret\n')
  assert.ok(trackedFiles(root).includes('d/secret.txt'))
  assert.equal((await source(root, 'd/secret.txt', 1, 1)).error, 'outside the repository, too large, or unreadable')
})

test('changes: filter commands from the repository config do not run', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-filter-'))
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\n')
  git(root, 'init', '-q'); git(root, 'add', '.'); git(root, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'i')
  const mark = path.join(root, 'RAN').split(path.sep).join('/')
  fs.writeFileSync(path.join(root, '.gitattributes'), '*.txt filter=evil\n')
  git(root, 'config', 'filter.evil.clean', `node -e "require('fs').writeFileSync('${mark}','')" & cat`)
  git(root, 'config', 'filter.evil.process', `node -e "require('fs').writeFileSync('${mark}','')"`)
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\nb\n')
  const c = await changes(root)
  assert.equal(fs.existsSync(mark), false, 'a filter command ran')
  assert.equal(c.files['a.txt'], 'M')
})

test('changes: a config that cannot be read runs nothing (fails closed)', async () => {
  const c = await changes(path.join(os.tmpdir(), 'rc-no-such-repo-' + Date.now()))
  assert.deepEqual({ ...c.files }, {}); assert.deepEqual({ ...c.lines }, {})
})

test('changes: a submodule is left out (its own config could name filters)', async () => {
  const sub = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-sub-')), root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-super-'))
  const id = ['-c', 'user.email=t@t', '-c', 'user.name=t']
  fs.writeFileSync(path.join(sub, 's.txt'), 's\n'); git(sub, 'init', '-q'); git(sub, 'add', '.'); git(sub, ...id, 'commit', '-qm', 's')
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\n'); git(root, 'init', '-q'); git(root, 'add', '.')
  git(root, '-c', 'protocol.file.allow=always', 'submodule', 'add', '-q', sub.split(path.sep).join('/'), 'm')
  git(root, ...id, 'commit', '-qm', 'i')
  const mark = path.join(root, 'RAN').split(path.sep).join('/')
  git(path.join(root, 'm'), 'config', 'filter.evil.clean', `node -e "require('fs').writeFileSync('${mark}','')" & cat`)
  fs.writeFileSync(path.join(root, 'm', '.gitattributes'), '*.txt filter=evil\n'); fs.writeFileSync(path.join(root, 'm', 's.txt'), 's\nt\n')
  const c = await changes(root)
  assert.equal(fs.existsSync(mark), false, 'a submodule filter ran')
  assert.equal(c.files.m, undefined)
})

test('changes: a filter whose name holds "=" cannot be emptied, so nothing runs', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-eq-'))
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\n')
  git(root, 'init', '-q'); git(root, 'add', '.'); git(root, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'i')
  const mark = path.join(root, 'RAN').split(path.sep).join('/')
  fs.appendFileSync(path.join(root, '.git', 'config'), `[filter "a=b"]\n\tclean = node -e \\"require('fs').writeFileSync('${mark}','')\\" & cat\n`)
  fs.writeFileSync(path.join(root, '.gitattributes'), 'a.txt filter=a=b\n')
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\nb\n')
  const c = await changes(root)
  assert.equal(fs.existsSync(mark), false, 'a filter command ran')
  assert.deepEqual({ ...c.files }, {})
})

test('git: found by absolute path only; a git.exe in the current folder does not run', async (t) => {
  assert.equal(findGit({ PATH: ['.', '', 'rel/bin'].join(path.delimiter) }, process.platform), null)
  const real = findGit()
  if (!real) { t.skip('no git on PATH'); return }
  assert.ok(path.isAbsolute(real))
  assert.equal(findGit({ PATH: ['.', path.dirname(real)].join(path.delimiter) }, process.platform), real)
  if (process.platform !== 'win32') return
  // a folder like a repository that ships its own git.exe (here: a copy of hostname.exe, which prints the machine name)
  const bad = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-fakegit-')), repo = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-real-'))
  fs.copyFileSync(path.join(process.env.SystemRoot || 'C:\Windows', 'System32', 'hostname.exe'), path.join(bad, 'git.exe'))
  fs.writeFileSync(path.join(repo, 'a.txt'), 'a\n'); git(repo, 'init', '-q'); git(repo, 'add', '.')
  // in a child without NoDefaultCurrentDirectoryInExePath (the Windows default; some shells set it), started in that folder
  const env = { ...process.env }; for (const k of Object.keys(env)) if (/^NoDefaultCurrentDirectoryInExePath$/i.test(k)) delete env[k]
  const check = new URL('../src/check.js', import.meta.url).href
  const out = execFileSync(process.execPath, ['--input-type=module', '-e', `const m = await import(${JSON.stringify(check)}); console.log(JSON.stringify(await m.loadTracked(${JSON.stringify(repo)})))`], { cwd: bad, env, encoding: 'utf8' })
  assert.deepEqual(JSON.parse(out), ['a.txt'])
})

test('changes: paths named like object fields are kept', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-proto-'))
  for (const f of ['__proto__', 'constructor']) fs.writeFileSync(path.join(root, f), 'a\n')
  git(root, 'init', '-q'); git(root, 'add', '.'); git(root, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'i')
  for (const f of ['__proto__', 'constructor']) fs.writeFileSync(path.join(root, f), 'b\n')
  const c = await changes(root)
  assert.deepEqual(Object.keys(c.files).sort(), ['__proto__', 'constructor'])
})

test('changes: hooks of the repository do not run (diff writes the index, which runs post-index-change)', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-hook-'))
  for (const f of ['a.txt', 'b.txt']) fs.writeFileSync(path.join(root, f), f + '\n')
  git(root, 'init', '-q'); git(root, 'add', '.'); git(root, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'i')
  const mark = path.join(root, 'RAN').split(path.sep).join('/')
  for (const dir of ['.git/hooks', '.githooks']) {
    fs.mkdirSync(path.join(root, dir), { recursive: true })
    for (const h of ['post-index-change', 'post-checkout', 'pre-commit']) fs.writeFileSync(path.join(root, dir, h), `#!/bin/sh\necho ${h} >> "${mark}"\n`, { mode: 0o755 })
  }
  // a content change and a stat-only change: git diff then refreshes and writes the index
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\nchanged\n')
  const t0 = new Date(Date.now() - 86400e3); fs.utimesSync(path.join(root, 'b.txt'), t0, t0)
  await changes(root)
  git(root, 'config', 'core.hooksPath', '.githooks')
  fs.utimesSync(path.join(root, 'b.txt'), new Date(), new Date())
  await changes(root)
  assert.equal(fs.existsSync(mark), false, fs.existsSync(mark) ? fs.readFileSync(mark, 'utf8') : '')
})

test('changes: the index is not written (no hook can run, no lock is taken)', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rc-idx-'))
  for (const f of ['a.txt', 'b.txt']) fs.writeFileSync(path.join(root, f), f + '\n')
  git(root, 'init', '-q'); git(root, 'add', '.'); git(root, '-c', 'user.email=t@t', '-c', 'user.name=t', 'commit', '-qm', 'i')
  fs.writeFileSync(path.join(root, 'a.txt'), 'a\nchanged\n')
  const t0 = new Date(Date.now() - 86400e3); fs.utimesSync(path.join(root, 'b.txt'), t0, t0)
  const idx = path.join(root, '.git', 'index'), before = fs.readFileSync(idx), mtime = fs.statSync(idx).mtimeMs
  const c = await changes(root)
  assert.deepEqual({ ...c.lines }, { 'a.txt': [2, 1] })
  assert.ok(fs.readFileSync(idx).equals(before)); assert.equal(fs.statSync(idx).mtimeMs, mtime)
})

test('routes: a network path as the repository is refused before anything touches it', async () => {
  const routes = [], ctx = { effect: f => f(), webServer: { register: r => routes.push(r) } }
  Object.defineProperty(ctx, 'connection', { get: () => ({ requestRejection: () => undefined }) })
  apply(ctx)
  for (const r of routes) {
    const out = { statusCode: 200, body: '', writeHead(s) { this.statusCode = s }, end(b) { this.body = b ?? '' } }
    await r.handler({ method: 'GET', url: r.path + '?root=' + encodeURIComponent('\\203.0.113.9\share\repo'), headers: {} }, out)
    assert.equal(out.statusCode, 400, r.path)
  }
  // the file system is never asked about the path (on Windows that would open a connection to the host)
  const seen = [], real = fs.existsSync
  fs.existsSync = p => { seen.push(String(p)); return real(p) }
  try {
    for (const r of routes) {
      const out = { statusCode: 200, body: '', writeHead(s) { this.statusCode = s }, end(b) { this.body = b ?? '' } }
      await r.handler({ method: 'GET', url: r.path + '?root=' + encodeURIComponent('\\\\203.0.113.9\\share\\repo'), headers: {} }, out)
    }
  } finally { fs.existsSync = real }
  assert.deepEqual(seen.filter(p => p.includes('203.0.113.9')), [])
})

test('the private hooks folder is removed when the host exits', () => {
  const check = new URL('../src/check.js', import.meta.url).href
  const dir = execFileSync(process.execPath, ['--input-type=module', '-e', `const m = await import(${JSON.stringify(check)}); console.log(m.GIT_SAFE.at(-1).slice('core.hooksPath='.length))`], { encoding: 'utf8' }).trim()
  assert.match(dir, /dsh-decode-no-hooks-/)
  assert.equal(fs.existsSync(dir), false)
})
