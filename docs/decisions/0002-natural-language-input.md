# 0002: Natural-language input ("ask in words")

Status: provisional. Arm A measured. Arm B (model) NOT yet run live (no API key in this environment).

## Decision
- Core conversion stays plain code. The model only turns text into a fixed JSON shape; plain code validates it against `UNITS` and does the math.
- Ships behind `?ai=1`, off by default, with fallback to the normal form on any failure.
- The model has no tools and no access to gold, stars, or `localStorage`.

## Experiment (92 cases: 60 normal, 10 typo, 6 edge, 16 must-refuse incl. injections)
Arm A = rules parser (plain code, no AI). Real results, `experiments/results-A.json`:

| Metric | Arm A |
|---|---|
| Accuracy, normal phrasings | 100% |
| Accuracy, typos | 0% |
| Accuracy, edge cases | 83.3% |
| Wrong answers accepted | 0 |
| Must-refuse cases accepted (fail-open) | 0 of 16 |
| Latency p50 / p95 | 0.01 ms / 0.10 ms |

The gap a model could close: 11 of 76 answerable cases (all 10 typos, plus one chatty sentence).
Arm B = model workflow. Run: `ANTHROPIC_API_KEY=... node experiments/run.js B`.
Arm C (agent with lookup tool) was not built: there is no multi-step task for it to do.

## Decision rule for making B the default (set before running)
Adopt B only if live: accuracy >= 95% across normal+typo+edge; wrong accepted = 0; fail-open = 0 of 16; p95 latency <= 1500 ms. Otherwise keep rules (A).
Candidate to test: hybrid, rules first and model only when rules refuse. It keeps cost near zero and uses the model only for the 14% gap.

## Risks and controls
Prompt injection: model output must match the schema; extra fields rejected (tested). Cost: 10 calls/min per IP, 200-char input, 4 s timeout, no calls per keystroke. Privacy: no player data sent. Key stays server-side.

## Not done
Live arm B results; model-version pinning beyond the `MODEL` env default (`claude-haiku-5-5`); hybrid arm.
