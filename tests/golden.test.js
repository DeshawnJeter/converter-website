const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const src = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
const unitsBlock = src.match(/const UNITS = \{[\s\S]*?\n\};/)[0];
const tempFn = src.match(/function convertTemperature[\s\S]*?\n\}/)[0];
const { UNITS, convertTemperature } = vm.runInNewContext(
  `${unitsBlock}\n${tempFn}\n({ UNITS, convertTemperature })`
);

const convert = (cat, v, from, to) => {
  if (cat === 'Temperature') return convertTemperature(v, from, to);
  const f = UNITS[cat].find((u) => u.key === from).factor;
  const t = UNITS[cat].find((u) => u.key === to).factor;
  return v * (f / t);
};

// Exact international definitions, in each category's base unit.
// Distance km, Weight kg, Volume L, Speed km/h, Time s, Area m2, Pressure Pa, Energy J, Data B.
const EXACT = {
  Distance: { km: 1, mi: 1.609344, m: 0.001, cm: 0.00001, ft: 0.0003048, in: 0.0000254, yd: 0.0009144 },
  Weight: { kg: 1, lb: 0.45359237, g: 0.001, oz: 0.028349523125, st: 6.35029318 },
  Volume: { l: 1, ml: 0.001, gal: 3.785411784, floz: 0.0295735295625, cup: 0.2365882365, pt: 0.473176473, qt: 0.946352946 },
  Speed: { kmh: 1, mph: 1.609344, ms: 3.6, knot: 1.852 },
  Time: { s: 1, min: 60, hr: 3600, day: 86400, wk: 604800, mo: 2629746, yr: 31536000 },
  Area: { m2: 1, ft2: 0.09290304, ac: 4046.8564224, ha: 10000, km2: 1e6, mi2: 2589988.110336 },
  Pressure: { pa: 1, kpa: 1000, bar: 100000, psi: 6894.757293168, atm: 101325 },
  Energy: { j: 1, kj: 1000, cal: 4.184, kcal: 4184, wh: 3600, kwh: 3600000 },
  Data: { b: 1, kb: 1024, mb: 1048576, gb: 1073741824, tb: 1099511627776 },
};

const close = (a, b, rel = 1e-9) => Math.abs(a - b) <= rel * Math.max(Math.abs(a), Math.abs(b), 1e-12);

for (const [cat, table] of Object.entries(EXACT)) {
  test(`${cat}: every unit factor matches its exact definition`, () => {
    const keys = JSON.stringify(UNITS[cat].map((u) => u.key).sort());
    assert.strictEqual(keys, JSON.stringify(Object.keys(table).sort()), 'unit list changed: update EXACT');
    for (const u of UNITS[cat]) {
      assert.ok(close(u.factor, table[u.key]), `${cat}.${u.key}: code has ${u.factor}, exact is ${table[u.key]}`);
    }
  });

  test(`${cat}: round trip A to B to A returns A`, () => {
    for (const a of UNITS[cat]) for (const b of UNITS[cat]) {
      assert.ok(close(convert(cat, convert(cat, 123.456, a.key, b.key), b.key, a.key), 123.456), `${a.key}<->${b.key}`);
    }
  });

  test(`${cat}: converting a unit to itself is identity`, () => {
    for (const u of UNITS[cat]) assert.strictEqual(convert(cat, 7, u.key, u.key), 7);
  });
}

test('Temperature fixed points', () => {
  assert.ok(close(convertTemperature(0, 'c', 'f'), 32));
  assert.ok(close(convertTemperature(100, 'c', 'f'), 212));
  assert.ok(close(convertTemperature(-40, 'c', 'f'), -40));
  assert.ok(close(convertTemperature(0, 'c', 'k'), 273.15));
  assert.ok(close(convertTemperature(32, 'f', 'c'), 0, 1e-9) || Math.abs(convertTemperature(32, 'f', 'c')) < 1e-12);
});

test('Temperature round trips', () => {
  for (const a of ['c', 'f', 'k']) for (const b of ['c', 'f', 'k']) {
    assert.ok(close(convertTemperature(convertTemperature(37.5, a, b), b, a), 37.5), `${a}<->${b}`);
  }
});

test('Known sanity values a person would recognize', () => {
  assert.ok(close(convert('Speed', 1, 'ms', 'kmh'), 3.6));
  assert.ok(close(convert('Distance', 1, 'mi', 'km'), 1.609344));
  assert.ok(close(convert('Distance', 26.2, 'mi', 'km'), 42.164812800000004));
  assert.ok(close(convert('Weight', 1, 'lb', 'kg'), 0.45359237));
});
