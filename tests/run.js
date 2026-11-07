const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const files = fs.readdirSync(__dirname).filter((f) => f.endsWith('.test.js')).map((f) => path.join(__dirname, f));
const r = spawnSync(process.execPath, ['--test', '--test-reporter=tap', ...files], { encoding: 'utf8' });
const out = r.stdout + r.stderr;
const n = (k) => (out.match(new RegExp('^# ' + k + ' (\\d+)', 'm')) || [, '?'])[1];
const failed = out.split('\n').filter((l) => /^not ok/.test(l));
console.log(`${n('tests')} tests: ${n('pass')} pass, ${n('fail')} fail`);
failed.forEach((l) => console.log('  ' + l));
process.exit(r.status === 0 ? 0 : 1);
