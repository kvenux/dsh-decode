#!/usr/bin/env bash
# The paired review alone, from runs already made: bundle + Codex.
#   bash bench/opt-review.sh <round name> <reference answers.json> <reference full dir> <candidate answers.json> <candidate full dir>
set -u
REPO="${RC_REPO:?set RC_REPO to the repository that was asked about}"
N="$1"; REF="$2"; REFF="$3"; CAND="$4"; CANDF="$5"
cd "$(dirname "$0")/.."
R="bench/out/opt-review/$N/q"; rm -rf "bench/out/opt-review/$N"; mkdir -p "$R"
node bench/pair-bundle.mjs bench/questions-dh.json "$REF" "$REFF" "$CAND" "$CANDF" "$R" "$N"
cp bench/rubric-pair.md "$R/rubric.md"
printf '\n## 题目文件\n\n和这个文件同一目录下的 d1-flow.md、d2-impact.md、d3-state.md、d4-compare.md、d5-steps.md，共 5 个。5 题都要打分。\n\n被问的仓库：`%s`\n' "$REPO" >> "$R/rubric.md"
IMGS=(); for f in "$R"/img/*.png; do IMGS+=(-i "$f"); done
P="先完整阅读评审说明 $PWD/$R/rubric.md，然后按它评审 5 个题目文件（同一目录）。题目文件里列出的图已作为图片附在本次输入里（文件名形如 d1-flow-A-1.png，对应回答 A 的第 1 张图），请逐张看。你是只读环境，不能写文件：把 rubric 要求的 JSON 作为你最后一条消息完整输出，只输出 JSON。只看这个目录和被问的仓库，不要看其他目录。"
codex exec --skip-git-repo-check -s read-only -C "$(dirname "$PWD")" "${IMGS[@]}" -o "$R/codex.json" -- "$P" > "$R/codex.log" 2>&1 < /dev/null
echo "codex exit $? $(wc -c < "$R/codex.json") bytes"
node bench/pair-tally.mjs "$R" | cut -c1-400
