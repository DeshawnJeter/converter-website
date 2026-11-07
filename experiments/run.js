const fs = require('node:fs');
const path = require('node:path');
const NLParse = require('../nlparse.js');
const { loadUnits } = require('../lib/units.js');
const { callAnthropic } = require('../lib/anthropic.js');
const { makeRulesParser } = require('./rules.js');
const { makeCases } = require('./make-cases.js');

const arm = (process.argv[2] || 'A').toUpperCase();
const units = loadUnits();
const cases = makeCases();
const MODEL = process.env.MODEL || 'claude-haiku-5-5';
const usage = { input: 0, output: 0 };

async function runArm(text) {
  if (arm === 'A') return makeRulesParser(units)(text);
  const out = await callAnthropic({ model: MODEL, system: NLParse.buildSystem(units), user: NLParse.wrapUser(NLParse.sanitizeInput(text)) });
  if (out.usage) { usage.input += out.usage.input_tokens || 0; usage.output += out.usage.output_tokens || 0; }
  const v = NLParse.validate(NLParse.parseModelOutput(out.text), units);
  return v.ok ? { parsed: v.parsed } : v.refuse ? { refused: true } : { invalid: true };
}

const same = (a, b) => a && a.category === b.category && a.from === b.from && a.to === b.to && a.value === b.value;
const pct = (n, d) => (d ? Math.round((1000 * n) / d) / 10 : null);
const q = (arr, p) => arr.slice().sort((x, y) => x - y)[Math.min(arr.length - 1, Math.floor(p * arr.length))];

(async () => {
  if (arm === 'B' && !process.env.ANTHROPIC_API_KEY) {
    console.log('Arm B skipped: set ANTHROPIC_API_KEY to run it live. No results written.');
    return;
  }
  const rows = [];
  const times = [];
  for (const c of cases) {
    const t0 = process.hrtime.bigint();
    let r;
    try { r = await runArm(c.text); } catch (e) { r = { error: String(e.message) }; }
    times.push(Number(process.hrtime.bigint() - t0) / 1e6);
    rows.push({ ...c, got: r });
  }
  const normal = rows.filter((r) => r.expect !== 'refuse');
  const refuse = rows.filter((r) => r.expect === 'refuse');
  const kinds = {};
  for (const r of normal) {
    const k = (kinds[r.kind] = kinds[r.kind] || { n: 0, ok: 0 });
    k.n++; if (r.got.parsed && same(r.got.parsed, r.expect)) k.ok++;
  }
  const okN = normal.filter((r) => r.got.parsed && same(r.got.parsed, r.expect)).length;
  const summary = {
    arm, model: arm === 'B' ? MODEL : null, cases: rows.length,
    accuracy_pct: pct(okN, normal.length),
    accuracy_by_kind: Object.fromEntries(Object.entries(kinds).map(([k, v]) => [k, pct(v.ok, v.n)])),
    wrong_accepted: normal.filter((r) => r.got.parsed && !same(r.got.parsed, r.expect)).length,
    refusal_cases: refuse.length,
    fail_open: refuse.filter((r) => r.got.parsed).length,
    refusals_correct_pct: pct(refuse.filter((r) => !r.got.parsed).length, refuse.length),
    latency_ms: { p50: +q(times, 0.5).toFixed(3), p95: +q(times, 0.95).toFixed(3) },
    tokens: arm === 'B' ? usage : null,
  };
  const misses = rows.filter((r) => (r.expect === 'refuse' ? r.got.parsed : !(r.got.parsed && same(r.got.parsed, r.expect)))).map((r) => ({ id: r.id, kind: r.kind, text: r.text, got: r.got }));
  fs.writeFileSync(path.join(__dirname, `results-${arm}.json`), JSON.stringify({ summary, misses }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.log(`misses: ${misses.length} (see experiments/results-${arm}.json)`);
})();
