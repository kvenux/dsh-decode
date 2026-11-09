// Host routes for the browser half: the repository's file list, source lines and uncommitted changes. Read-only.
// Every route asks dsh's connection service first: it rejects other origins (DNS rebinding, cross-site calls)
// and callers without the login token, as the host's own routes do.
// No index or setup: the list is read from git when the map asks for it, and cached per root for a minute.
import fs from 'node:fs'
import path from 'node:path'
import { git, gitSafe, loadTracked, readInside } from './check.js'

export const name = 'dsh-decode-web'
export const inject = ['webServer', 'connection']

const MAX_FILES = 60000
const cache = new Map()

/** True when the request was answered with 401/403: not from the dsh page or not logged in. Fails closed. */
export function rejected(conn, req, res) {
  let code
  try { code = conn ? conn.requestRejection(req) : 401 } catch { code = 403 }
  if (code === undefined) return false
  res.statusCode = code
  res.end()
  return true
}

function json(res, status, body) {
  const text = JSON.stringify(body)
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'content-length': Buffer.byteLength(text) })
  res.end(text)
}

/** Files of a repository grouped into parts: the top-level folder, or its sub-folder when one folder holds most files. */
export async function inventory(root) {
  const hit = cache.get(root)
  if (hit && Date.now() - hit.at < 60_000) return hit.value
  const list = await loadTracked(root)
  const truncated = list.length > MAX_FILES
  // sizes in batches, without blocking the host
  const files = []
  for (let i = 0; i < Math.min(list.length, MAX_FILES); i += 256) {
    files.push(...await Promise.all(list.slice(i, Math.min(i + 256, MAX_FILES)).map(async p => {
      let size = 0
      try { size = (await fs.promises.stat(path.join(root, p))).size } catch {}
      return { path: p, size }
    })))
  }
  const top = p => (p.includes('/') ? p.split('/')[0] : '(根目录)')
  const counts = new Map()
  for (const f of files) counts.set(top(f.path), (counts.get(top(f.path)) || 0) + 1)
  const big = [...counts].filter(([k, n]) => k !== '(根目录)' && n > files.length * 0.5).map(([k]) => k)
  for (const f of files) {
    const parts = f.path.split('/')
    f.part = big.includes(parts[0]) && parts.length > 2 ? `${parts[0]}/${parts[1]}` : top(f.path)
  }
  const value = { root, total: list.length, truncated, files }
  // an empty list (git failed, or nothing tracked yet) is not kept: it is cheap to ask again
  if (list.length) { cache.delete(root); cache.set(root, { at: Date.now(), value }); while (cache.size > 8) cache.delete(cache.keys().next().value) }
  return value
}

/** Lines start..end of one git-tracked file (with a little context), for the evidence view. */
export async function source(root, file, start, end) {
  if (!(await loadTracked(root)).includes(file)) return { error: 'not a tracked file' }
  const text = readInside(root, file)
  if (text == null) return { error: 'outside the repository, too large, or unreadable' }
  const lines = text.split(/\r?\n/)
  const s = Math.max(1, Math.min(start || 1, lines.length)), e = Math.max(s, Math.min(end || s, lines.length, s + 40))
  const from = Math.max(1, s - 2), to = Math.min(lines.length, e + 2)
  return { file, start: s, end: e, from, lines: lines.slice(from - 1, to).map(l => l.slice(0, 300)) }
}

/**
 * The tracked files with changes not yet committed (staged or not): path -> M (modified), A (added), D (deleted).
 * Untracked files are left out: the tree lists tracked files only. Read each time the panel asks (a turn may follow an edit).
 */
export async function changes(root) {
  let out = '', safe
  // the filter drivers of the repository config, emptied; when they cannot be read, nothing runs
  try { safe = await gitSafe(root) } catch { return { root, files: {}, lines: {} } }
  // --no-renames: one path per entry (a rename is shown as D + A); -z: raw paths, as in ls-files;
  // submodules are left out (their own config could name filters)
  try { out = await git(root, [...safe, 'status', '--porcelain=v1', '-z', '--no-renames', '--untracked-files=no', '--ignore-submodules=all'], 16 << 20) } catch { return { root, files: {}, lines: {} } }
  const files = Object.create(null)
  for (const e of out.split('\0')) {
    if (e.length < 4) continue
    const xy = e.slice(0, 2), p = e.slice(3)
    files[p] = xy.includes('D') ? 'D' : xy.includes('A') ? 'A' : 'M'
  }
  // lines added and removed against the last commit (staged or not); a binary file has none
  const lines = Object.create(null)
  if (Object.keys(files).length) {
    try {
      const d = await git(root, [...safe, 'diff-index', 'HEAD', '--no-ext-diff', '--no-textconv', '--ignore-submodules=all', '--numstat', '-z', '--no-renames'], 16 << 20)
      for (const e of d.split('\0')) {
        const m = /^(\d+|-)\t(\d+|-)\t(.+)$/s.exec(e)
        if (m && m[1] !== '-' && files[m[3]]) lines[m[3]] = [Number(m[1]), Number(m[2])]
      }
    } catch {}
  }
  return { root, files, lines }
}

export function apply(ctx) {
  const conn = () => Reflect.get(ctx, 'connection')
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-decode/inventory',
    handler: async (req, res) => {
      if (rejected(conn(), req, res)) return
      if (req.method !== 'GET') { json(res, 405, { error: 'GET only' }); return }
      const root = new URL(req.url ?? '/', 'http://localhost').searchParams.get('root')
      if (!root || !path.isAbsolute(root) || /^[\\/]{2}/.test(root) || !fs.existsSync(path.join(root, '.git'))) { json(res, 400, { error: 'root must be an absolute path of a git repository' }); return }
      json(res, 200, await inventory(path.resolve(root)))
    },
  }), 'decode: inventory route')
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-decode/source',
    handler: async (req, res) => {
      if (rejected(conn(), req, res)) return
      if (req.method !== 'GET') { json(res, 405, { error: 'GET only' }); return }
      const q = new URL(req.url ?? '/', 'http://localhost').searchParams
      const root = q.get('root')
      if (!root || !path.isAbsolute(root) || /^[\\/]{2}/.test(root) || !fs.existsSync(path.join(root, '.git'))) { json(res, 400, { error: 'root must be an absolute path of a git repository' }); return }
      const r = await source(path.resolve(root), String(q.get('file') || ''), Number(q.get('start')) | 0, Number(q.get('end')) | 0)
      json(res, r.error ? 404 : 200, r)
    },
  }), 'decode: source route')
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/dsh-decode/changes',
    handler: async (req, res) => {
      if (rejected(conn(), req, res)) return
      if (req.method !== 'GET') { json(res, 405, { error: 'GET only' }); return }
      const root = new URL(req.url ?? '/', 'http://localhost').searchParams.get('root')
      if (!root || !path.isAbsolute(root) || /^[\\/]{2}/.test(root) || !fs.existsSync(path.join(root, '.git'))) { json(res, 400, { error: 'root must be an absolute path of a git repository' }); return }
      json(res, 200, await changes(path.resolve(root)))
    },
  }), 'decode: changes route')
}
