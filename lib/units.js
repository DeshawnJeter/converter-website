const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadUnits() {
  const src = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
  const block = src.match(/const UNITS = \{[\s\S]*?\n\};/)[0];
  return JSON.parse(JSON.stringify(vm.runInNewContext(block + '\nUNITS')));
}

module.exports = { loadUnits };
