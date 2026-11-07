# converter-website

A playful distance converter built with HTML, CSS, and JavaScript. It supports kilometer-to-mile and mile-to-kilometer conversion with a simple gamified experience.

## Run locally
Open the index.html file in your browser.

## Tests and optional AI features
- `npm test` runs all tests (exact unit factors, safe story rendering, input validation, proxy behavior, experiment baseline). No API key needed.
- `npm start` serves the site on http://127.0.0.1:8080. Add `?ai=1` to show the "ask in words" box. Needs `ANTHROPIC_API_KEY` in the environment; without it the box falls back to the normal form.
- `node experiments/run.js A` runs the no-AI baseline. `node experiments/run.js B` runs the model arm (needs a key).
- `node tools/gen-stories.js <Category>` drafts new quest stories into `stories/pending/` (needs a key). A person must approve them.
- Decisions: `docs/decisions/`.
