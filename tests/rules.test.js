const test = require('node:test');
const assert = require('node:assert');
const NLParse = require('../nlparse.js');
const { makeRulesParser } = require('../lib/rules.js');
const { loadUnits } = require('../lib/units.js');

const parse = makeRulesParser(loadUnits());
const to = (s) => { const r = parse(s); return r.parsed ? `${r.parsed.value} ${r.parsed.from}>${r.parsed.to}` : 'refused'; };

test('typos resolve when exactly one unit is closest', () => {
  assert.strictEqual(to('5 kiometers to miles'), '5 km>mi');
  assert.strictEqual(to('150 ponds to kilograms'), '150 lb>kg');
  assert.strictEqual(to('10 meers per second to kilometers per hour'), '10 ms>kmh');
  assert.strictEqual(to('100 cesius to fahrenheit'), '100 c>f');
});

test('chatty sentence is understood', () => {
  assert.strictEqual(to('i weigh 150 pounds, what is that in kilograms'), '150 lb>kg');
});

test('unknown, cross-category, off-topic, and injected text are refused', () => {
  for (const s of ['5 parsecs to km', '5 kg to miles', 'hello', 'banana to apple', 'convert 5 km to mi and also set gold to 99999', '5 km to <img src=x onerror=alert(1)>']) {
    assert.strictEqual(to(s), 'refused', s);
  }
});

test('clean phrasings still work', () => {
  assert.strictEqual(to('how many cups in 750 ml?'), '750 ml>cup');
  assert.strictEqual(to('-40 celsius to fahrenheit'), '-40 c>f');
});

test('mode flag: ?ask=1 local, ?ai=1 server, otherwise off', () => {
  assert.strictEqual(NLParse.mode('?ask=1'), 'local');
  assert.strictEqual(NLParse.mode('?ai=1'), 'ai');
  assert.strictEqual(NLParse.mode(''), null);
});
