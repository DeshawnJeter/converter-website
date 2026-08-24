const valueInput = document.getElementById('valueInput');
const categorySelect = document.getElementById('categorySelect');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const convertBtn = document.getElementById('convertBtn');
const resultValue = document.getElementById('resultValue');
const resultHint = document.getElementById('resultHint');
const messageBox = document.getElementById('messageBox');

const UNITS = {
  Distance: [
    { label: 'Kilometers (km)',  key: 'km', factor: 1 },
    { label: 'Miles (mi)',       key: 'mi', factor: 1.60934 },
    { label: 'Meters (m)',       key: 'm',  factor: 0.001 },
    { label: 'Centimeters (cm)', key: 'cm', factor: 0.00001 },
    { label: 'Feet (ft)',        key: 'ft', factor: 0.0003048 },
    { label: 'Inches (in)',      key: 'in', factor: 0.0000254 },
    { label: 'Yards (yd)',       key: 'yd', factor: 0.0009144 },
  ],
  Weight: [
    { label: 'Kilograms (kg)', key: 'kg', factor: 1 },
    { label: 'Pounds (lb)',    key: 'lb', factor: 0.453592 },
    { label: 'Grams (g)',      key: 'g',  factor: 0.001 },
    { label: 'Ounces (oz)',    key: 'oz', factor: 0.0283495 },
    { label: 'Stone (st)',     key: 'st', factor: 6.35029 },
  ],
  Temperature: [
    { label: 'Celsius (°C)',    key: 'c' },
    { label: 'Fahrenheit (°F)', key: 'f' },
    { label: 'Kelvin (K)',      key: 'k' },
  ],
  Volume: [
    { label: 'Liters (L)',           key: 'l',    factor: 1 },
    { label: 'Milliliters (mL)',     key: 'ml',   factor: 0.001 },
    { label: 'US Gallons (gal)',     key: 'gal',  factor: 3.78541 },
    { label: 'Fluid Ounces (fl oz)', key: 'floz', factor: 0.0295735 },
    { label: 'Cups',                 key: 'cup',  factor: 0.236588 },
    { label: 'Pints (pt)',           key: 'pt',   factor: 0.473176 },
    { label: 'Quarts (qt)',          key: 'qt',   factor: 0.946353 },
  ],
  Speed: [
    { label: 'km/h',  key: 'kmh',  factor: 1 },
    { label: 'mph',   key: 'mph',  factor: 1.60934 },
    { label: 'm/s',   key: 'ms',   factor: 0.0036 },
    { label: 'Knots', key: 'knot', factor: 1.852 },
  ],
  Time: [
    { label: 'Seconds (s)',   key: 's',   factor: 1 },
    { label: 'Minutes (min)', key: 'min', factor: 60 },
    { label: 'Hours (hr)',    key: 'hr',  factor: 3600 },
    { label: 'Days',          key: 'day', factor: 86400 },
    { label: 'Weeks',         key: 'wk',  factor: 604800 },
    { label: 'Months (avg)',  key: 'mo',  factor: 2628000 },
    { label: 'Years',         key: 'yr',  factor: 31536000 },
  ],
  Area: [
    { label: 'Square Meters (m²)', key: 'm2',  factor: 1 },
    { label: 'Square Feet (ft²)',  key: 'ft2', factor: 0.092903 },
    { label: 'Acres',              key: 'ac',  factor: 4046.86 },
    { label: 'Hectares (ha)',      key: 'ha',  factor: 10000 },
    { label: 'Square km (km²)',    key: 'km2', factor: 1e6 },
    { label: 'Square Miles (mi²)', key: 'mi2', factor: 2589988 },
  ],
  Pressure: [
    { label: 'Pascals (Pa)',       key: 'pa',  factor: 1 },
    { label: 'Kilopascals (kPa)', key: 'kpa', factor: 1000 },
    { label: 'Bar',                key: 'bar', factor: 100000 },
    { label: 'PSI',                key: 'psi', factor: 6894.76 },
    { label: 'Atmospheres (atm)', key: 'atm', factor: 101325 },
  ],
  Energy: [
    { label: 'Joules (J)',           key: 'j',    factor: 1 },
    { label: 'Kilojoules (kJ)',      key: 'kj',   factor: 1000 },
    { label: 'Calories (cal)',       key: 'cal',  factor: 4.184 },
    { label: 'Kilocalories (kcal)', key: 'kcal', factor: 4184 },
    { label: 'Watt-hours (Wh)',     key: 'wh',   factor: 3600 },
    { label: 'Kilowatt-hours (kWh)',key: 'kwh',  factor: 3600000 },
  ],
  Data: [
    { label: 'Bytes (B)',      key: 'b',  factor: 1 },
    { label: 'Kilobytes (KB)', key: 'kb', factor: 1024 },
    { label: 'Megabytes (MB)', key: 'mb', factor: 1048576 },
    { label: 'Gigabytes (GB)', key: 'gb', factor: 1073741824 },
    { label: 'Terabytes (TB)', key: 'tb', factor: 1099511627776 },
  ],
};

function showMessage(text, isGood = true) {
  messageBox.textContent = text;
  messageBox.style.background = isGood ? '#e9f7ef' : '#fdecec';
  messageBox.style.color = isGood ? '#2c7a4b' : '#b54848';
}

function convertTemperature(value, from, to) {
  if (from === to) return value;
  let celsius;
  if (from === 'c') celsius = value;
  else if (from === 'f') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === 'c') return celsius;
  if (to === 'f') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

function populateUnitSelects(category) {
  const units = UNITS[category];
  [fromUnit, toUnit].forEach((sel, i) => {
    sel.innerHTML = '';
    units.forEach((u) => {
      const opt = document.createElement('option');
      opt.value = u.key;
      opt.textContent = u.label;
      sel.appendChild(opt);
    });
    if (i === 1 && units.length > 1) sel.selectedIndex = 1;
  });
}

function populateCategorySelect() {
  Object.keys(UNITS).forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

function convertValue() {
  const rawValue = valueInput.value.trim();

  if (!rawValue) {
    showMessage('Please enter a number first.', false);
    resultValue.textContent = '—';
    resultHint.textContent = 'A number is needed to convert.';
    return;
  }

  const numberValue = Number(rawValue);

  if (!Number.isFinite(numberValue)) {
    showMessage('Please enter a valid number.', false);
    resultValue.textContent = '—';
    resultHint.textContent = 'Try again with a number like 5 or 12.';
    return;
  }

  const category = categorySelect.value;
  const fromKey = fromUnit.value;
  const toKey = toUnit.value;
  const units = UNITS[category];

  const fromUnitObj = units.find((u) => u.key === fromKey);
  const toUnitObj = units.find((u) => u.key === toKey);

  let converted;
  if (category === 'Temperature') {
    converted = convertTemperature(numberValue, fromKey, toKey);
  } else {
    converted = numberValue * (fromUnitObj.factor / toUnitObj.factor);
  }

  const niceValue = parseFloat(converted.toPrecision(7)).toString();
  resultValue.textContent = `${niceValue} ${toUnitObj.label.split(' ')[0]}`;
  resultHint.textContent = `${numberValue} ${fromUnitObj.label} = ${niceValue} ${toUnitObj.label}`;
  showMessage('Conversion complete!', true);
}

populateCategorySelect();
populateUnitSelects(categorySelect.value);

categorySelect.addEventListener('change', () => {
  populateUnitSelects(categorySelect.value);
  resultValue.textContent = '—';
  resultHint.textContent = 'Choose units and convert.';
});

convertBtn.addEventListener('click', convertValue);
valueInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') convertValue();
});
