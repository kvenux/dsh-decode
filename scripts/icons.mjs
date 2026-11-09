// Make src/client/icon-svgs.js: the vscode-icons SVGs (MIT) of the ids src/client/icons.js names, taken from an
// iconify vscode-icons set (icons.json of @iconify-json/vscode-icons) or from claude-files-pane's hooks/icon-svgs.ts.
//   node scripts/icons.mjs <icons.json | icon-svgs.ts>
import fs from 'node:fs'
import vm from 'node:vm'

const src = process.argv[2]
if (!src) { console.error('usage: node scripts/icons.mjs <icons.json | icon-svgs.ts>'); process.exit(2) }
const at = p => new URL('../' + p, import.meta.url)
const ids = vm.runInNewContext(`${fs.readFileSync(at('src/client/icons.js'), 'utf8')}\niconIds()`)
const text = fs.readFileSync(src, 'utf8')
let svgs
if (src.endsWith('.json')) {
  const set = JSON.parse(text), w = set.width || 16, h = set.height || 16
  svgs = Object.fromEntries(Object.entries(set.icons).map(([id, i]) => [id, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${i.width || w} ${i.height || h}">${i.body}</svg>`]))
} else svgs = JSON.parse(text.slice(text.indexOf('= {') + 2).replace(/,\s*}\s*;?\s*$/, '}'))
const out = {}, lost = []
for (const id of ids) if (svgs[id]) out[id] = svgs[id]; else lost.push(id)
if (lost.length) console.error('not in the set:', lost.join(' '))
const body = `// Made by scripts/icons.mjs from vscode-icons (MIT, github.com/vscode-icons/vscode-icons): the icons icons.js names.\n// Make it again after naming a new id in icons.js rather than editing this file.\nconst ICON_SVGS = ${JSON.stringify(out, null, 0).replace(/","/g, '",\n"')}\n`
fs.writeFileSync(at('src/client/icon-svgs.js'), body)
console.log('src/client/icon-svgs.js', Object.keys(out).length, 'icons', body.length, 'bytes')
