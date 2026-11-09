# Counting diagram errors

You check diagrams against code. Do not modify any file except the one output file. The repository path is given in your instructions.

`answers.md` holds answers with labels x01, x02, and so on. Each has a conclusion, paragraphs (P1, P2, ...) and views. **Each view is a picture: open every picture. The picture is what the reader sees, and it is all you get of the view.** `facts.json` holds facts that were read in the code, per question.

Do not score quality, length, or style. Count only errors.

## For each answer

**1. Each fact of that question.** Look only at the pictures, and give one verdict:
- `correct`: a picture shows the fact as it is.
- `contradict`: a picture shows something the fact rules out (see `fail_if`). A step placed in the wrong order, a step shown as always done when it is conditional, a failure path that continues into success: all of these contradict.
- `absent`: no picture shows it. An omission is not an error.

**2. Other errors in the views.** List each other place where a picture contradicts the code. Before you list one, open the code and confirm it, and give `path:line`. If you did not confirm it in the code, do not list it. Do not list omissions.

**2b. Errors of the drawing.** List each place where the picture itself misleads or loses content: a label that reads as the label of another line, a line that passes behind a box and reads as ending there, a line whose two ends cannot be told, text cut or outside the picture, a condition or a frame that is hard to see or read. For each, say what a reader would wrongly believe or could not read. Do not list taste: a drawing that is plain, long or not pretty, with nothing misread, is not an error.

**3. Text.** List only places where the paragraphs or the conclusion contradict the code, or contradict the answer's own view. Confirm in the code, and give `path:line`.

Read a sequence picture as a reader does: steps after a fragment happen after it on every path, unless a message is marked `FLOW ENDS HERE`.

## Output

Write this JSON and nothing else:

```json
{"answers":[{"label":"x01","id":"d1-flow",
  "facts":[{"id":"d1a","verdict":"correct|contradict|absent","view":"view id or empty","why":"one short sentence"}],
  "view_errors":[{"view":"view id","type":"sequence|state|activity|component|class|package|deployment|usecase","kind":"order|branch|condition|state|relation|other","what":"one short sentence","evidence":"path:line"}],
  "drawing_errors":[{"view":"view id","kind":"label|hidden_line|cut_text|unseen_condition|other","what":"what a reader would wrongly believe or could not read"}],
  "text_errors":[{"what":"one short sentence","evidence":"path:line"}]}]}
```

Include every answer in `answers.md`. An answer with no card has empty lists.
