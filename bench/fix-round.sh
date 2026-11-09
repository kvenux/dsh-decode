#!/usr/bin/env bash
# One round of the error-convergence loop: ask the 5 questions N times with the plugin as it is now (two lanes per run),
# then make the judge's file. The judge (a subagent, started by hand) counts diagram errors against bench/facts-dh.json.
#   bash bench/fix-round.sh <dsh url> <round name> [runs, default 3]
set -u
U="$1"; N="$2"; RUNS="${3:-3}"
cd "$(dirname "$0")/.."
export RC_PLAYWRIGHT="${RC_PLAYWRIGHT:?set RC_PLAYWRIGHT to a folder with playwright in node_modules}"
export RC_QFILE=bench/questions-dh.json RC_LOCALE=en-US RC_EFFORT="${RC_EFFORT:-Low}"
A=d1-flow,d2-impact,d3-state; B=d4-compare,d5-steps
for i in $(seq 1 "$RUNS"); do
  O="bench/out/fix-$N/run$i"; mkdir -p "$O"
  node bench/rc-dsh.mjs "$U" deepseek-harness "$A" --out "fix-$N/run$i/a" ${RC_MODEL:+--model "$RC_MODEL"} > "$O/a.log" 2>&1 &
  PA=$!
  RC_PW_PROFILE=bench/out/pw-profile-std node bench/rc-dsh.mjs "$U" dh-std "$B" --out "fix-$N/run$i/b" ${RC_MODEL:+--model "$RC_MODEL"} > "$O/b.log" 2>&1 &
  PB=$!
  wait $PA $PB
  node -e "
const fs=require('fs');const r=[...JSON.parse(fs.readFileSync('$O/a/answers.json','utf8')).result,...JSON.parse(fs.readFileSync('$O/b/answers.json','utf8')).result];
fs.writeFileSync('$O/answers.json',JSON.stringify({result:r},null,1));
for(const x of r)console.log('run$i',x.id,x.ok,x.secs+'s',x.end?.usage?.total,x.answer?x.answer.paras.length+' paras '+x.answer.views.map(v=>v.type).join('+'):'NO CARD',x.end?.error||'')"
  node bench/full-diagrams.mjs "$O/answers.json" "$O/full" > /dev/null
done
node bench/fix-bundle.mjs "bench/out/fix-$N" "$RUNS"
