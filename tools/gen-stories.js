const fs = require('node:fs');
const path = require('node:path');
const { check } = require('./storycheck.js');

const SYSTEM = [
  'You write short fantasy word problems for a unit-conversion game.',
  'Each story is one string with the placeholders {value}, {from}, {to} (all three required).',
  'Wrap {value} {from} and {to} in <strong></strong>. Use no other markup, no digits, no links.',
  'End with a question. 40 to 300 characters. Output only a JSON array of strings.',
].join('\n');

function parseList(text) {
  const m = String(text).match(/\[[\s\S]*\]/);
  try { const a = JSON.parse(m[0]); return Array.isArray(a) ? a : []; } catch (e) { return []; }
}

// Evaluator-optimizer with a plain-code evaluator; retry with the failure reasons; capped.
async function generate({ category, callModel, n = 3, cap = 2 }) {
  const accepted = [];
  const rejected = [];
  let attempts = 0;
  let feedback = '';
  while (attempts <= cap && accepted.length < n) {
    attempts++;
    const out = await callModel({ system: SYSTEM, user: `Category: ${category}. Write ${n - accepted.length} stories.${feedback}` });
    const fails = [];
    for (const t of parseList(typeof out === 'string' ? out : out.text)) {
      const probs = check(t);
      if (probs.length === 0 && !accepted.includes(t)) accepted.push(t);
      else if (probs.length) { rejected.push({ template: String(t).slice(0, 120), problems: probs }); fails.push(...probs); }
    }
    feedback = fails.length ? ` Previous attempt failed checks: ${[...new Set(fails)].join(', ')}. Fix these.` : '';
  }
  return { accepted: accepted.slice(0, n), rejected, attempts, needsHuman: accepted.length < n };
}

function writePending(category, result, model) {
  const file = path.join(__dirname, '..', 'stories', 'pending', `${category}.json`);
  const rows = result.accepted.map((template) => ({ template, approved: false, model, generated: new Date().toISOString().slice(0, 10) }));
  fs.writeFileSync(file, JSON.stringify(rows, null, 2));
  return file;
}

module.exports = { generate, writePending, SYSTEM };

if (require.main === module) {
  const { callAnthropic } = require('../lib/anthropic.js');
  const { loadUnits } = require('../lib/units.js');
  const category = process.argv[2];
  const model = process.env.MODEL || 'claude-haiku-5-5';
  if (!category || !loadUnits()[category]) { console.log('Usage: node tools/gen-stories.js <Category>'); process.exit(1); }
  if (!process.env.ANTHROPIC_API_KEY) { console.log('Set ANTHROPIC_API_KEY to generate. Nothing written.'); process.exit(0); }
  generate({ category, callModel: (a) => callAnthropic({ model, maxTokens: 600, timeoutMs: 20000, temperature: 0.7, ...a }) }).then((r) => {
    console.log(`attempts ${r.attempts}, accepted ${r.accepted.length}, rejected ${r.rejected.length}${r.needsHuman ? ' (needs human)' : ''}`);
    console.log('Written (all approved:false):', writePending(category, r, model));
    console.log('A human must review the file, set approved:true, and copy templates into NARRATIVES by hand.');
  });
}
