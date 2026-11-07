// Held-out cases written after tuning the fuzzy parser, to check it generalizes. Not used to tune.
const { makeRulesParser } = require('../lib/rules.js');
const { loadUnits } = require('../lib/units.js');
const parse = makeRulesParser(loadUnits());
const ok = [
  ['12 celcius to kelvin', 'c>k'], ['3 litrs to gallons', 'l>gal'], ['200 grms to ounces', 'g>oz'], ['5 hectars to acres', 'ha>ac'],
  ['70 kilogam to pounds', 'kg>lb'], ['how many feet are in 2 miels', 'mi>ft'], ['my car goes 60 mph how fast is that in km/h', 'mph>kmh'],
  ['convert 2 hours into minutes', 'hr>min'], ['100 fahrenheit to celsius', 'f>c'], ['16 oz in pounds', 'oz>lb'],
  ['how many bytes in 3 kb', 'kb>b'], ['2.5 pounts to kilos', 'lb>kg'],
];
const no = ['tell me a joke about 5 pounds', '5 kg to meters', '7 widgets to gadgets', 'what is 5 plus 5'];
const got = (s) => { const r = parse(s); return r.parsed ? `${r.parsed.from}>${r.parsed.to}` : 'refused'; };
let hit = 0;
for (const [s, e] of ok) { const g = got(s); if (g === e) hit++; else console.log(`miss: "${s}" -> ${g} (expected ${e})`); }
let bad = 0;
for (const s of no) { const g = got(s); if (g !== 'refused') { bad++; console.log(`accepted: "${s}" -> ${g}`); } }
console.log(`held-out: ${hit}/${ok.length} answerable correct, ${no.length - bad}/${no.length} refusals correct`);
