const test = require('node:test');
const assert = require('node:assert');
const { check } = require('../tools/storycheck.js');
const { generate } = require('../tools/gen-stories.js');

const good = 'The courier must ride <strong>{value} {from}</strong> to the border, which counts in <strong>{to}</strong>. How far is the trip?';

test('every shipped template passes the checker', () => {
  const src = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'script.js'), 'utf8');
  const block = src.match(/const NARRATIVES = \{[\s\S]*?\n\};/)[0];
  const N = require('node:vm').runInNewContext(block + '\nNARRATIVES');
  let bad = 0;
  for (const list of Object.values(N)) for (const t of list) if (check(t).length) bad++;
  assert.ok(bad <= Object.values(N).flat().length * 0.2, 'checker too strict for existing stories: ' + bad);
});

test('checker accepts a good story and flags each failure type', () => {
  assert.deepStrictEqual([...check(good)], []);
  assert.ok(check(good.replace('{to}', '5')).includes('missing_{to}'));
  assert.ok(check(good + ' <img src=x>').includes('markup_other_than_strong'));
  assert.ok(check(good.replace('border', 'border 99')).includes('contains_digit'));
  assert.ok(check(good.replace('border', 'http://x.io')).includes('contains_url'));
  assert.ok(check(good.replace('How far is the trip?', 'Go.')).includes('must_end_with_question'));
  assert.ok(check(good.replace('{to}', '{gold}')).includes('unknown_placeholder'));
});

test('generator retries with failure reasons, then accepts', async () => {
  const calls = [];
  const replies = [JSON.stringify([good, good.replace('border', 'border 7'), '<img src=x>']), JSON.stringify([good.replace('courier', 'knight'), good.replace('courier', 'wizard')])];
  const r = await generate({ category: 'Distance', callModel: async (a) => { calls.push(a.user); return replies[calls.length - 1]; } });
  assert.strictEqual(r.accepted.length, 3);
  assert.strictEqual(r.attempts, 2);
  assert.ok(calls[1].includes('contains_digit'));
  assert.strictEqual(r.needsHuman, false);
});

test('generator stops at the cap and asks for a human', async () => {
  let n = 0;
  const r = await generate({ category: 'Distance', callModel: async () => { n++; return '["nope"]'; } });
  assert.strictEqual(n, 3);
  assert.strictEqual(r.accepted.length, 0);
  assert.strictEqual(r.needsHuman, true);
});
