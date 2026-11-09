#!/usr/bin/env bash
# One optimisation round: ask the 5 questions again with the plugin as it is now (two lanes at once), draw the diagrams,
# make the paired bundle against the reference run, and get the Codex review. The subagent review is started by hand.
#   bash bench/opt-round.sh <dsh url> <round name> <reference answers.json> <reference full dir> [ids lane a] [ids lane b]
set -u
U="$1"; N="$2"; REF="$3"; REFF="$4"; A="${5:-d1-flow,d2-impact,d3-state}"; B="${6:-d4-compare,d5-steps}"
cd "$(dirname "$0")/.."
export RC_PLAYWRIGHT="${RC_PLAYWRIGHT:?set RC_PLAYWRIGHT to a folder with playwright in node_modules}"
export RC_QFILE=bench/questions-dh.json RC_LOCALE=en-US RC_EFFORT=Low
O=bench/out/opt-$N; mkdir -p "$O"
node bench/rc-dsh.mjs "$U" deepseek-harness "$A" --out "opt-$N/a" > "$O/a.log" 2>&1 &
PA=$!
RC_PW_PROFILE=bench/out/pw-profile-std node bench/rc-dsh.mjs "$U" dh-std "$B" --out "opt-$N/b" > "$O/b.log" 2>&1 &
PB=$!
wait $PA $PB
node -e "
const fs=require('fs');const r=[...JSON.parse(fs.readFileSync('$O/a/answers.json','utf8')).result,...JSON.parse(fs.readFileSync('$O/b/answers.json','utf8')).result];
fs.writeFileSync('$O/answers.json',JSON.stringify({result:r},null,1));
for(const x of r)console.log(x.id,x.ok,x.secs+'s',x.end?.usage?.total,x.end?.effort,x.answer?x.answer.paras.length+' paras':'NO CARD',x.end?.error||'')"
node bench/full-diagrams.mjs "$O/answers.json" "$O/full" > /dev/null
bash bench/opt-review.sh "$N" "$REF" "$REFF" "$O/answers.json" "$O/full"
