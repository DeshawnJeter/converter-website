const test = require('node:test');
const assert = require('node:assert');
const { loadUnits } = require('../lib/units.js');
const { makeRulesParser } = require('../experiments/rules.js');
const { makeCases } = require('../experiments/make-cases.js');

const parse = makeRulesParser(loadUnits());
const cases = makeCases();

test('case set is sized and mixed', () => {
  assert.ok(cases.length >= 90);
  for (const k of ['normal', 'typo', 'edge', 'cross', 'off-topic', 'unknown-unit', 'injection', 'junk']) {
    assert.ok(cases.some((c) => c.kind === k), k);
  }
});

test('rules baseline never accepts a refusal case and never accepts a wrong parse', () => {
  for (const c of cases) {
    const r = parse(c.text);
    if (c.expect === 'refuse') assert.ok(!r.parsed, `fail-open: ${c.text}`);
    else if (r.parsed) assert.deepStrictEqual({ ...r.parsed }, c.expect, `wrong accept: ${c.text}`);
  }
});
