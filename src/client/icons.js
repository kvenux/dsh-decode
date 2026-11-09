// File and folder icons for the folder tree. File icons are vscode-icons (MIT, github.com/vscode-icons/vscode-icons),
// picked the way VS Code picks them: a whole file name first, then a name prefix, then the longest extension. The SVGs
// are in icon-svgs.js, made by scripts/icons.mjs from the ids named here. Folders draw in the current text colour, so
// a folder can wear the colour of its place in the diagram. Icons that are large and rarely met are left out (the
// file gets the default icon).

const ICON_BY_NAME = {
  'package.json': 'file-type-npm', 'package-lock.json': 'file-type-npm', '.npmrc': 'file-type-npm',
  'pnpm-lock.yaml': 'file-type-pnpm', 'pnpm-workspace.yaml': 'file-type-pnpm', 'yarn.lock': 'file-type-yarn', 'bun.lock': 'file-type-bun',
  dockerfile: 'file-type-docker', 'docker-compose.yml': 'file-type-docker', 'docker-compose.yaml': 'file-type-docker', '.dockerignore': 'file-type-docker',
  '.gitignore': 'file-type-git', '.gitattributes': 'file-type-git', '.gitmodules': 'file-type-git',
  '.env': 'file-type-dotenv', '.prettierrc': 'file-type-prettier', '.prettierignore': 'file-type-prettier',
  
  'readme.md': 'file-type-readme', readme: 'file-type-readme', 'claude.md': 'file-type-claude', 'agents.md': 'file-type-agents',
  '.nvmrc': 'file-type-node', 'cargo.toml': 'file-type-rust', 'cargo.lock': 'file-type-rust', 'go.mod': 'file-type-go', 'go.sum': 'file-type-go',
}
const ICON_BY_PREFIX = [
  ['vite.config.', 'file-type-vite'], ['vitest.', 'file-type-vitest'], ['jest.config.', 'file-type-jest'], ['eslint.config.', 'file-type-eslint'],
  ['.eslintrc', 'file-type-eslint'], ['prettier.config.', 'file-type-prettier'], ['tailwind.config.', 'file-type-tailwind'], 
  ['playwright.config.', 'file-type-playwright'], ['webpack.config.', 'file-type-webpack'], 
  ['tsconfig.', 'file-type-tsconfig'], ['jsconfig.', 'file-type-jsconfig'], ['biome.json', 'file-type-biome'], ['dockerfile.', 'file-type-docker'], ['.env.', 'file-type-dotenv'],
]
const ICON_BY_EXT = {
  'd.ts': 'file-type-typescriptdef', 'test.ts': 'file-type-testts', 'spec.ts': 'file-type-testts', 'test.tsx': 'file-type-testts', 'e2e.ts': 'file-type-testts',
  'test.js': 'file-type-testjs', 'spec.js': 'file-type-testjs', 'test.mjs': 'file-type-testjs',
  ts: 'file-type-typescript', mts: 'file-type-typescript', cts: 'file-type-typescript', tsx: 'file-type-reactts',
  js: 'file-type-js', mjs: 'file-type-js', cjs: 'file-type-js', jsx: 'file-type-reactjs',
  json: 'file-type-json', jsonc: 'file-type-json', json5: 'file-type-json', jsonl: 'file-type-json',
  css: 'file-type-css', scss: 'file-type-scss', sass: 'file-type-scss', less: 'file-type-css', html: 'file-type-html', htm: 'file-type-html',
  md: 'file-type-markdown', markdown: 'file-type-markdown', mdx: 'file-type-mdx',
  yml: 'file-type-yaml', yaml: 'file-type-yaml', toml: 'file-type-toml', xml: 'file-type-xml', ini: 'file-type-light-ini',
  svg: 'file-type-svg', png: 'file-type-image', jpg: 'file-type-image', jpeg: 'file-type-image', gif: 'file-type-image', webp: 'file-type-image', ico: 'file-type-image',
  csv: 'file-type-csv', tsv: 'file-type-csv', txt: 'file-type-text', log: 'file-type-log', lock: 'file-type-text',
  py: 'file-type-python', rs: 'file-type-rust', go: 'file-type-go', java: 'file-type-java', kt: 'file-type-kotlin', swift: 'file-type-swift',
  c: 'file-type-c', h: 'file-type-cheader', cpp: 'file-type-cpp', cc: 'file-type-cpp', hpp: 'file-type-cppheader', cs: 'file-type-csharp',
  lua: 'file-type-lua',
  sh: 'file-type-shell', bash: 'file-type-shell', zsh: 'file-type-shell', ps1: 'file-type-powershell', bat: 'file-type-powershell', cmd: 'file-type-powershell',
  sql: 'file-type-sql', sqlite: 'file-type-sqlite', db: 'file-type-sqlite', graphql: 'file-type-graphql', gql: 'file-type-graphql',
  vue: 'file-type-vue', svelte: 'file-type-svelte', wasm: 'file-type-wasm', patch: 'file-type-diff', diff: 'file-type-diff',
  woff: 'file-type-font', woff2: 'file-type-font', ttf: 'file-type-font',
  mp3: 'file-type-audio', wav: 'file-type-audio', ipynb: 'file-type-jupyter', nix: 'file-type-nix', tf: 'file-type-terraform',
}
const ICON_EXTS = Object.keys(ICON_BY_EXT).sort((p, q) => q.length - p.length)

/** The vscode-icons SVG of a file, by its name (no folder). */
function fileIconSvg(name) {
  const n = String(name).split('/').pop().toLowerCase()
  const id = ICON_BY_NAME[n] || ICON_BY_PREFIX.find(([p]) => n.startsWith(p))?.[1] || ICON_EXTS.filter(e => n.endsWith('.' + e)).map(e => ICON_BY_EXT[e])[0]
  return (typeof ICON_SVGS !== 'undefined' && (ICON_SVGS[id] || ICON_SVGS['default-file'])) || ''
}

// a folder, closed or open, in the current text colour
const FOLDER_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M1.5 3.5A1 1 0 0 1 2.5 2.5h3.6l1.5 1.5h5.9a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z"/></svg>'
const FOLDER_OPEN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" opacity=".55" d="M1.5 3.5A1 1 0 0 1 2.5 2.5h3.6l1.5 1.5h5.9a1 1 0 0 1 1 1v1.5H1.5z"/><path fill="currentColor" d="M1.6 6.5h12.9a.6.6 0 0 1 .58.75l-1.4 5.5a1 1 0 0 1-.97.75H2.5a1 1 0 0 1-1-1z"/></svg>'
const CHEVRON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><path d="M4.5 2.75L7.75 6L4.5 9.25" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/** The icon ids this file names (scripts/icons.mjs copies their SVGs). */
function iconIds() { return [...new Set(['default-file', ...Object.values(ICON_BY_NAME), ...ICON_BY_PREFIX.map(x => x[1]), ...Object.values(ICON_BY_EXT)])] }
