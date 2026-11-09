# Decode usage details

**English** · [简体中文](usage.zh.md)

The README says why Decode exists and how to install it. This page has the full details: each part of an answer, time and tokens, tools and safety, the web routes, development.

## Install (all ways)

- Needs dsh 0.2.1-rc.5 or newer (npm `latest` and `next` both work). 0.1.x does not work: it has no right panel. With other 0.2.x prereleases (such as 0.2.3-rc.1) npm can give a peer warning: npm's version ranges do not include prereleases of other version numbers. dsh's own compatibility check does, and the plugin loads.
- From npm (the preview uses the `preview` tag): `dsh plugin --profile web add dsh-decode@preview`
- From a local folder (after a change to `src/client/`, run `npm run build` first; then refresh the page or restart dsh web): `dsh plugin --profile web add C:/path/to/dsh-decode`
- From a packed file: run `npm pack` in this repository, then `dsh plugin --profile web add C:/path/to/dsh-decode-0.1.0-preview.1.tgz`
- `dsh plugin add` adds the plugin to the profile's bundles. With a new profile name, dsh puts only `@deepseek-ai/dsh-base` there: add `@deepseek-ai/dsh-web-app` to the profile's `package.json` yourself (before the plugin).
- Restart dsh web.
- In the dsh web or desktop app: Plugins → Add plugin → `dsh-decode@preview` → Install. To upgrade, remove the plugin on its detail page and add it again.

## Reading an answer

- **The card**: a one-line conclusion, then numbered paragraphs. Under each paragraph, the number of quotes (code the model copied); a quote not found in the files is marked "without source". A line always at the top of the card: a quote found shows that the code exists, not that the conclusion is verified.
- **The right panel**: the diagram follows the paragraph you point at. At the top: the title, the paragraph progress and the current paragraph; below: the diagram and the files. The top-right switch gives three layouts: stacked (default), side by side, and tabs (diagram and files one at a time). The diagram scales to the pane and is shown whole; if its text would have to shrink below 0.78 of its size, it fills the width and the pane scrolls. In the stacked layout the diagram gets the height it needs (up to 80%), the files get the rest; drag the bar to resize, double-click to reset. The layout and the split are kept in the browser. A sequence diagram has a "Sequence / Communication" switch: the communication diagram uses the same data and shows who talks to whom, with numbered messages on the links.
  - "Files in this answer" has two views, "Tree" and "Map". The tree view, from top to bottom:
    - One line of numbers: files read, files cited, quotes in this paragraph; when the repository has files not committed, also "repository: N not committed" and the total +added −deleted lines (for the whole repository, not this answer). Below it, the colour key. The card itself shows only "N files cited"; "read" shows only here.
    - "Find" at the top (see below). Then the flat list of cited files: by default the files this paragraph cites; switch to "whole answer" to list every cited file, each with links to its paragraphs (up to 4, then +N; a click goes to that paragraph). Over 6 rows, the list folds. File names are shown in full; folders are shortened first. A row of this paragraph shows the cited lines on the right: click it to open the code below. Hover for Ask, Copy and Open. A cited file with uncommitted changes shows +added −deleted and "not committed": the quote was read from the working tree and can differ from the committed version.
    - "Find": type a few letters of a file name or path (in order is enough, such as `cwuml`); the matches replace the tree below. Esc clears it.
    - The folder tree of all files: the files used are put back into the repository's folders, each folder with a note on what it is for. The tree holds every file the answer used (orange = this paragraph, blue = cited, with the cited lines tinted; light blue = only read, not cited). The number to the right of a folder is the count of cited files under it. A click on a file in the tree opens it in the editor (to see the code, click it in the list above). "Collapse all" folds every folder; click again to open the folders with citations.
  - A file with uncommitted changes shows its git status letter after its name: M changed, A added, D deleted (`git status` is read again for each question and each time an answer opens; untracked files are not included). A folder with changes inside shows a purple dot, also when it is folded. File icons follow the file type (vscode-icons, MIT); folder icons use the colour of their place in the diagram. The top two levels of folders are always listed (unused ones grey and folded), so you see the repository's layout; other unused folders and files are under "…", which opens level by level like a file manager. In the "Map" view, this paragraph's evidence still shows below the diagram. The map is a treemap of the whole repository.
- **Asking next**: "Ask about this" on a paragraph quotes it in the input box; "Ask" on a piece of evidence puts `@path lines s–e:` in the input box. Neither sends anything.
- **While it looks**: the panel shows the files read so far, live, in the same tree: orange = being read now, blue = read; uncommitted changes are marked M/A/D in the same way.

Good questions: flows across modules, state changes, the impact of a change, how several approaches compare, processes and deployment. To look up one place in the code, the standard mode is faster.

## Time and tokens (measured)

- A question usually takes 1.5–4 minutes (DeepSeek-V4.1-Flash, reasoning high), about 1.9 times the standard mode. Most of the extra time goes into the paragraphs and the diagram. If looking takes more than 3 minutes, the plugin tells the model to finish with the evidence it has, and the card says so.
- Input is about 0.4M–2M tokens per question (shown in the session footer; over 90% cache hits), output about 20–35K tokens (measured at reasoning max).
- At reasoning low on the deepseek-harness repository (5 questions, 25 answers per mode), Decode used 696K tokens and 116 s per question, against 655K and 61 s for the standard mode.

## Tools and safety

- The mode gives the model read, grep, glob and the local terminal (PowerShell on Windows, bash elsewhere). It does not get the file write or edit tools: it does not need them to answer. Terminal commands get no extra limits: they run under dsh's own permission settings. The model reads the repository's files, and an untrusted repository can use their content to make the model run commands: for an unknown repository, set dsh's permissions so that terminal commands ask you first.
- As in the standard mode, each question puts the workspace's `AGENTS.md` and similar instruction files into the model's context (dsh's `agent-instructions` plugin, up to 64 KB): a repository's own architecture notes make the answers more complete and the looking faster. The repository's authors wrote these files, and the model reads them as instructions: an untrusted repository can also use them to make the model run commands. The protection is the same as above.
- Files read through the terminal do not show in the live file tree (only read is counted).
- Every command the plugin runs itself is git. It finds the full path of `git.exe`/`git` from the absolute folders in PATH, never the current folder (if it finds none, it runs nothing). It does not write the working tree, commits or the index; it runs asynchronously (dsh does not wait) with a 15 s limit per command:
  - `git ls-files -z` (the file list for the tree and the map, and to resolve evidence paths);
  - `git status --porcelain=v1 -z --no-renames --untracked-files=no --ignore-submodules=all` and `git diff-index HEAD --no-ext-diff --no-textconv --ignore-submodules=all --numstat -z --no-renames` (the uncommitted files and their line counts);
  - `git config -z --get-regexp ^filter\.` (to find the filters in the repository's config).
  - All but the filter read get `--no-optional-locks`, `-c core.fsmonitor=false` and `-c core.hooksPath=<a private empty folder made when the plugin starts>` (the repository's hooks do not run; if that folder cannot be made, git does not run). Status and diff also set the command of every filter in the repository's config to empty; if the config cannot be read, they do not run. Submodules are left out (they have their own config).
- Reading files: the code in the right panel comes only from tracked files; the quote check also reads untracked files in the working tree (so new files can be quoted). Neither reads the `.git` folder or files linked outside the repository, and neither reads files over 4 MB.
- The plugin's web routes are read-only and take only absolute paths of local git repositories; a path that starts with `\\` or `//` is refused, network paths `\\host\share` and the `\\?\` form included. Each route goes through dsh's connection check first: a request from another site (DNS rebinding included) gets 403, one without the login token gets 401, as for dsh's own routes. A logged-in user can read the tracked files of any local git repository, the same as the model's own read tool:
  - `GET /dsh-decode/inventory?root=<repository>`: the repository's file list; asked again within a minute, it gives the last result (an empty list is not kept).
  - `GET /dsh-decode/source?root=&file=&start=&end=`: some lines of one tracked file, up to about 40.
  - `GET /dsh-decode/changes?root=<repository>`: the uncommitted tracked files (M/A/D) and their line counts.
- The plugin uploads nothing. Model calls go through the service configured in dsh.

## Development

At run time the plugin uses two dsh packages: `@deepseek-ai/dsh-tools` and `@deepseek-ai/dsh-llm`. They must be in `peerDependencies` for dsh to give them to the plugin (a profile does not install peers). Without them the plugin's agent does not start: Decode is missing from the mode menu, with no error.

| Command | What it does |
|---|---|
| `npm run build` | Makes `lib/client.js` (cw-uml + `src/client/icon-svgs.js` + `icons.js` + `files.js` + `app.js`). Run it after a change to `src/client/` or `vendor/`, then refresh the dsh page. After a change to `src/agent.js`, `check.js`, `prompt.js` or `web.js`, restart dsh web. |
| `npm test` | Unit tests (node:test): the answer check, file grouping, the build output, the prompt. The 2 todos are known false alarms of the evidence check. |
| `npm run test:render` | In headless Chromium, draws every diagram and every paragraph of each answer in `tests/fixtures/answers.json` at the panel's size and counts text overflow, cuts, broken words, overlaps, and a current step out of view. Fails if a count goes up against `tests/render-baseline.json`; after a fix, write the new baseline with `-- --update`. |
| `npm run shots -- <url> <list> <out> [--ask] [--live]` | Opens saved sessions in a real dsh web and takes screenshots; asks nothing, spends no tokens. `--ask` checks Ask and Copy, `--live` checks the live panel. |
| `node bench/promo-gif.mjs <url> <sessionId> <out> [name]` | The README GIF from one saved session (English UI, needs ffmpeg). |

The browser tests need playwright: set `RC_PLAYWRIGHT` (a folder whose node_modules has playwright) and `RC_CHROME` (a Chromium executable), or install playwright in this repository.

`bench/` holds the real-question evaluation (`rc-dsh.mjs`, spends tokens; `RC_LOCALE=en-US` for the English dsh UI), blind scoring (`judge.mjs`) and an earlier review (`review-2026-11-04.md`). `bench/out/` is not in git (it holds browser profiles).

## Code

| File | What it holds |
|---|---|
| `cordis.patch.yml` | The mode: tools, prompt plugins, web routes |
| `src/agent.js` | The mode's agent plugin: the prompt, the `submit_answer` tool, the lines read, the 3-minute notice |
| `src/check.js` | Answer check and repair: can the diagram be drawn, evidence checked by content, language and code-name checks |
| `src/prompt.js` | The prompt |
| `src/web.js` | The web routes |
| `src/client/app.js`, `files.js` | Browser side: the card, the panel, the live panel, the folder tree |
| `src/client/icons.js`, `icon-svgs.js` | File icons: vscode-icons (MIT) by file name and extension; `icon-svgs.js` is made by `node scripts/icons.mjs <icon-svgs.ts or icons.json>` |
| `vendor/cw-uml.*` | The interactive diagram library (copied from codewiki-next, same author, MIT). Class names in a diagram keep only letters, digits, `_` and `-`: the spec comes from the model and is data |
| `THIRD_PARTY_NOTICES.md` | Third-party material: vscode-icons, claude-files-pane (MIT) |

## Known limits

- A "quote" only shows that the code the model copied is in the file, not that it supports the paragraph. Documents count too. Three cases are in doubt: no source found, inferred (no code quoted), no such file.
- A quote made of lines that are not next to each other, or that the model wrapped again, is marked "not verified" in error (see the todos in `tests/check.test.js`).
- An answer does not record the repository's commit; you cannot ask with a diff or an error attached.
