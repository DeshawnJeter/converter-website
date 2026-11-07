(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NLRules = api;
})(typeof self !== 'undefined' ? self : this, function () {
const ALIASES = {
  km: ['kilometers', 'kilometres', 'kilometer', 'km'], mi: ['miles', 'mile', 'mi'], m: ['meters', 'metres', 'meter', 'm'],
  cm: ['centimeters', 'centimeter', 'cm'], ft: ['feet', 'foot', 'ft'], in: ['inches', 'inch', 'in'], yd: ['yards', 'yard', 'yd'],
  kg: ['kilograms', 'kilogram', 'kg', 'kgs'], lb: ['pounds', 'pound', 'lb', 'lbs'], g: ['grams', 'gram', 'g'],
  oz: ['ounces', 'ounce', 'oz'], st: ['stone', 'st'],
  c: ['celsius', 'c', '°c'], f: ['fahrenheit', 'f', '°f'], k: ['kelvin', 'k'],
  l: ['liters', 'litres', 'liter', 'litre', 'l'], ml: ['milliliters', 'milliliter', 'ml'], gal: ['gallons', 'gallon', 'gal'],
  floz: ['fluid ounces', 'fl oz', 'floz'], cup: ['cups', 'cup'], pt: ['pints', 'pint', 'pt'], qt: ['quarts', 'quart', 'qt'],
  kmh: ['kilometers per hour', 'km/h', 'kph', 'kmh'], mph: ['miles per hour', 'mph'], ms: ['meters per second', 'm/s', 'mps'], knot: ['knots', 'knot'],
  s: ['seconds', 'second', 'sec', 's'], min: ['minutes', 'minute', 'min'], hr: ['hours', 'hour', 'hrs', 'hr'], day: ['days', 'day'],
  wk: ['weeks', 'week', 'wk'], mo: ['months', 'month'], yr: ['years', 'year', 'yr'],
  m2: ['square meters', 'sqm', 'm2'], ft2: ['square feet', 'sq ft', 'ft2'], ac: ['acres', 'acre'], ha: ['hectares', 'hectare', 'ha'],
  km2: ['square kilometers', 'km2'], mi2: ['square miles', 'mi2'],
  pa: ['pascals', 'pascal', 'pa'], kpa: ['kilopascals', 'kilopascal', 'kpa'], bar: ['bar'], psi: ['psi'], atm: ['atmospheres', 'atmosphere', 'atm'],
  j: ['joules', 'joule', 'j'], kj: ['kilojoules', 'kilojoule', 'kj'], cal: ['calories', 'calorie', 'cal'], kcal: ['kilocalories', 'kcal'],
  wh: ['watt hours', 'wh'], kwh: ['kilowatt hours', 'kwh'],
  b: ['bytes', 'byte'], kb: ['kilobytes', 'kb'], mb: ['megabytes', 'mb'], gb: ['gigabytes', 'gb'], tb: ['terabytes', 'tb'],
};

const LOOKUP = {};
for (const [key, names] of Object.entries(ALIASES)) for (const n of names) LOOKUP[n] = key;

function lev(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

const FUZZY = Object.keys(LOOKUP).filter((k) => k.length >= 4);

// Exact alias, else a typo match: only if exactly one unit is the closest within the allowed edit distance.
function resolveUnit(slot) {
  const s = slot.trim();
  if (LOOKUP[s]) return LOOKUP[s];
  const allowed = s.length >= 8 ? 2 : s.length >= 4 ? 1 : 0;
  if (!allowed) return null;
  let best = allowed + 1;
  const keys = new Set();
  for (const alias of FUZZY) {
    if (Math.abs(alias.length - s.length) > allowed) continue;
    const d = lev(s, alias);
    if (d < best) { best = d; keys.clear(); keys.add(LOOKUP[alias]); }
    else if (d === best) keys.add(LOOKUP[alias]);
  }
  return best <= allowed && keys.size === 1 ? [...keys][0] : null;
}

function makeRulesParser(units) {
  const catOf = {};
  for (const [c, list] of Object.entries(units)) for (const u of list) catOf[u.key] = c;
  const num = '(-?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[+-]?\\d+)?)';
  const slot = '[a-z°/² ]';
  const r1 = new RegExp('^(?:convert )?' + num + ' ?(' + slot + '+?) (?:to|into|in|as) (' + slot + '+)$');
  const r2 = new RegExp('^how many (' + slot + '+?) (?:are |is )?in ' + num + ' ?(' + slot + '+)$');
  const FILLER = /\b(what is that|what's that|how much is that|that is|is that|is equal to|equals|which is)\b/g;
  return function parse(text) {
    const t = String(text).toLowerCase().replace(/[?!.]+$/, '').replace(/\s+/g, ' ').trim();
    let a, b, v;
    let m = t.match(r1);
    if (m) { v = m[1]; a = m[2]; b = m[3]; }
    else if ((m = t.match(r2))) { b = m[1]; v = m[2]; a = m[3]; }
    else {
      const i = t.search(/-?\.?\d/);
      const c = i < 0 ? '' : t.slice(i).replace(/[,;]/g, ' ').replace(FILLER, ' ').replace(/\s+/g, ' ').trim();
      m = c.match(r1);
      if (!m) return { refused: true };
      v = m[1]; a = m[2]; b = m[3];
    }
    const ka = resolveUnit(a), kb = resolveUnit(b);
    if (!ka || !kb || catOf[ka] !== catOf[kb]) return { refused: true };
    return { parsed: { category: catOf[ka], from: ka, to: kb, value: Number(v) } };
  };
}
  return { ALIASES, makeRulesParser };
});
