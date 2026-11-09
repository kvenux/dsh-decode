// Build lib/client.js: one dsh client module = cw-uml + styles + src/client/{icon-svgs,icons,files,app}.js, wrapped for
// the module loader (the client files share one scope).
import fs from 'node:fs'
const at = p => new URL('../' + p, import.meta.url)
const { name } = JSON.parse(fs.readFileSync(at('package.json'), 'utf8'))
const css = fs.readFileSync(at('vendor/cw-uml.css'), 'utf8')
const out = [
  `window.__ModuleLoader__.load({ id: ${JSON.stringify(name)}, factory: (require) => {`,
  'var module = { exports: {} }; var exports = module.exports;',
  `var CW_UML_CSS = ${JSON.stringify(css)};`,
  fs.readFileSync(at('vendor/cw-uml.js'), 'utf8'),
  ';(function () {',
  fs.readFileSync(at('src/client/icon-svgs.js'), 'utf8'),
  fs.readFileSync(at('src/client/icons.js'), 'utf8'),
  fs.readFileSync(at('src/client/files.js'), 'utf8'),
  fs.readFileSync(at('src/client/app.js'), 'utf8'),
  '})();',
  'return module.exports; } });',
].join('\n')
fs.mkdirSync(at('lib'), { recursive: true })
fs.writeFileSync(at('lib/client.js'), out)
console.log('lib/client.js', out.length, 'bytes')
