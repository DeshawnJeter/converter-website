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

function makeRulesParser(units) {
  const catOf = {};
  for (const [c, list] of Object.entries(units)) for (const u of list) catOf[u.key] = c;
  const num = '(-?(?:\\d+\\.?\\d*|\\.\\d+)(?:e[+-]?\\d+)?)';
  const r1 = new RegExp('^(?:convert )?' + num + ' ?([a-z°/² ]+?) (?:to|into|in|as) ([a-z°/² ]+)$');
  const r2 = new RegExp('^how many ([a-z°/² ]+?) (?:are |is )?in ' + num + ' ?([a-z°/² ]+)$');
  return function parse(text) {
    const t = String(text).toLowerCase().replace(/[?!.]+$/, '').replace(/\s+/g, ' ').trim();
    let a, b, v;
    let m = t.match(r1);
    if (m) { v = m[1]; a = m[2]; b = m[3]; }
    else if ((m = t.match(r2))) { b = m[1]; v = m[2]; a = m[3]; }
    else return { refused: true };
    const ka = LOOKUP[a.trim()], kb = LOOKUP[b.trim()];
    if (!ka || !kb || catOf[ka] !== catOf[kb]) return { refused: true };
    return { parsed: { category: catOf[ka], from: ka, to: kb, value: Number(v) } };
  };
}

module.exports = { ALIASES, makeRulesParser };
