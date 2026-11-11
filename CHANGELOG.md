# Changelog

## 0.1.0-preview.3

- Diagram layout: activity diagrams split decision branches from the diamond's corners and join edges into the same
  step before they enter it; text in boxes wraps into lines of even width without breaking words.
- Component and class diagrams: an edge going up to the row above turns once and enters the box from the side, and
  the horizontal segments in each gap are ordered to cross as little as possible.
- Fixes found by reviewing real answers: sequence fragment labels no longer overlap, nested deployment links no longer
  cross titles, and an inheritance label sits on its shortest branch.

## 0.1.0-preview.2

- The mode is called "Decode" in the mode menu (it was "Decode 读懂代码"): dsh cannot translate a plugin's mode name, so the
  name now reads the same in English and Chinese; the description has both languages.
- README in English (default) and Chinese (`README.zh.md`), built around cognitive surrender, with screenshots and a GIF of
  English answers on the deepseek-harness repository. The detailed usage moved to `docs/usage.md` (`docs/usage.zh.md`).
- Activity diagrams are checked before an answer is accepted: every end has a name, every decision has at least two
  exits with conditions, and every step can reach an end. The end names show in the diagram.
- A question in English gets diagrams in English only. A diagram with Chinese text is sent back once.
- Once per answer, the model reads back what its diagrams say and checks it against the code and the conditions in its text.
- Structure diagrams draw only imports or calls the model confirmed.
- These checks made diagrams more complete, but blind reviews found no gain in accuracy.

## 0.1.0-preview.1

- The Decode mode loads the workspace's `AGENTS.md` (and the other instruction files dsh reads) into the model's
  context, up to 64 KB, as the standard mode does. On a private repository (5 questions, DeepSeek-V4.1-Flash, reasoning
  low): average review score 83.7 → 85.1 (within run-to-run noise), total time 484 s → 362 s, total tokens +10%
  (non-cached input +6%).

## 0.1.0-preview.0

First preview, for dsh 0.2.1-rc.5 or newer (0.2.x).

- A "Decode 读懂代码" mode in the mode menu: the model reads the repository (read, grep, glob, and the
  terminal under dsh's own permission settings; no file write or edit tools) and answers with
  a card: one-line conclusion, numbered paragraphs, quoted code per paragraph, checked against the files.
- The right panel shows an interactive diagram (one of 8 types: sequence, component, package, class, state, activity,
  deployment, use case) that follows the current paragraph, and the files the answer read and cited: a cited list
  (this paragraph / whole answer), find, the folder tree, a repository map, and uncommitted git changes with line counts.
- While the model looks, the panel shows the files it read, live.
- Host routes `/dsh-decode/inventory`, `/source`, `/changes`: read-only, behind dsh's login and origin check.
- Diagram specs from the model are data (the model reads files that may not be trusted): the answer check drops a
  `kind` that is not a short word and a colour that is not a colour, caps grid numbers and text length, and sends back a
  spec over 800 elements or of a shape it cannot read; the diagram also keeps class names to letters, digits, `_` and `-`, and colours to colours.
- Git runs by its absolute path from PATH (never a git.exe in the current folder), asynchronously with a 15 s limit, fsmonitor off, the repository's filter commands emptied (nothing runs when
  the config cannot be read or names a filter git cannot be given), no optional locks, hooks pointed at a private empty folder, the index never written (diff-index), and submodules left out; files are read only inside the repository (links out of it and
  `.git` are refused) and up to 4 MB.

Known limits: see "已知限制" in README.md.
