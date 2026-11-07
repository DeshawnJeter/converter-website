const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const src = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const splitFn = src.match(/function splitStory[\s\S]*?\n\}/)[0];
const narrBlock = src.match(/const NARRATIVES = \{[\s\S]*?\n\};/)[0];
const { splitStory, NARRATIVES } = vm.runInNewContext(`${splitFn}\n${narrBlock}\n({ splitStory, NARRATIVES })`);

test('only <strong> is treated as markup', () => {
  const parts = splitStory('Go <strong>5 km</strong> now');
  assert.strictEqual(JSON.stringify(parts), JSON.stringify([
    { strong: false, text: 'Go ' }, { strong: true, text: '5 km' }, { strong: false, text: ' now' },
  ]));
});

test('injected markup stays plain text', () => {
  const evil = '<img src=x onerror=alert(1)> and <script>bad()</script>';
  const parts = splitStory(evil);
  assert.ok(parts.every((p) => p.strong === false));
  assert.strictEqual(parts.map((p) => p.text).join(''), evil);
});

test('a <strong> containing another tag is not trusted', () => {
  const parts = splitStory('<strong><img src=x></strong>');
  assert.ok(parts.every((p) => p.strong === false));
});

test('every shipped narrative template uses no tag other than <strong>', () => {
  for (const [cat, list] of Object.entries(NARRATIVES)) {
    for (const t of list) {
      const stripped = t.replace(/<\/?strong>/g, '');
      assert.ok(!/[<>]/.test(stripped), `${cat}: unexpected markup in "${t.slice(0, 50)}"`);
    }
  }
});
