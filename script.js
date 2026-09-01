// ── DOM refs ───────────────────────────────────────────────────
const valueInput    = document.getElementById('valueInput');
const categoryPills = document.getElementById('categoryPills');
const fromUnit      = document.getElementById('fromUnit');
const toUnit        = document.getElementById('toUnit');
const swapBtn       = document.getElementById('swapBtn');
const convertBtn    = document.getElementById('convertBtn');
const resultValue   = document.getElementById('resultValue');
const resultHint    = document.getElementById('resultHint');
const messageBox    = document.getElementById('messageBox');
const resultActions = document.getElementById('resultActions');
const copyBtn       = document.getElementById('copyBtn');
const shareBtn      = document.getElementById('shareBtn');
const toast         = document.getElementById('toast');
const portraitBg    = document.getElementById('portraitBg');
const jesterSpeech  = document.getElementById('jesterSpeech');
const xpCountEl     = document.getElementById('xpCount');

// ── Unit data ──────────────────────────────────────────────────
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
    { label: 'Liters (L)',            key: 'l',    factor: 1 },
    { label: 'Milliliters (mL)',      key: 'ml',   factor: 0.001 },
    { label: 'US Gallons (gal)',      key: 'gal',  factor: 3.78541 },
    { label: 'Fluid Ounces (fl oz)', key: 'floz', factor: 0.0295735 },
    { label: 'Cups',                  key: 'cup',  factor: 0.236588 },
    { label: 'Pints (pt)',            key: 'pt',   factor: 0.473176 },
    { label: 'Quarts (qt)',           key: 'qt',   factor: 0.946353 },
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
    { label: 'Months (avg)',  key: 'mo',  factor: 2629746 },
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
    { label: 'Pascals (Pa)',      key: 'pa',  factor: 1 },
    { label: 'Kilopascals (kPa)', key: 'kpa', factor: 1000 },
    { label: 'Bar',               key: 'bar', factor: 100000 },
    { label: 'PSI',               key: 'psi', factor: 6894.76 },
    { label: 'Atmospheres (atm)', key: 'atm', factor: 101325 },
  ],
  Energy: [
    { label: 'Joules (J)',           key: 'j',    factor: 1 },
    { label: 'Kilojoules (kJ)',      key: 'kj',   factor: 1000 },
    { label: 'Calories (cal)',       key: 'cal',  factor: 4.184 },
    { label: 'Kilocalories (kcal)', key: 'kcal', factor: 4184 },
    { label: 'Watt-hours (Wh)',      key: 'wh',   factor: 3600 },
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

let currentCategory = Object.keys(UNITS)[0];

// ── Jester dialogue ────────────────────────────────────────────
const JESTER = {
  idle: [
    "Greetings, traveler! What mysteries shall we unravel today?",
    "Step forth! Choose your quest category and let the magic begin!",
    "Heh heh! I await your command, brave converter of things!",
    "The arcane arts of measurement are at your disposal, my liege!",
  ],
  category: {
    Distance: "Ah, the roads of the realm! How far must we journey today?",
    Weight:   "Mass and matter! Even my jester's cap has weight, you know…",
    Temperature: "Hot or cold? Fire or frost? The cosmos cares not — but I do!",
    Volume:   "How much space does your magic occupy? Let us measure the vessel!",
    Speed:    "Fleet of foot or swift of wing — how fast does your quarry travel?",
    Time:     "Ah, time… even I cannot convert *that* back. Heh heh! Proceed!",
    Area:     "The breadth of kingdoms! Let us survey your domain, my liege.",
    Pressure: "Pressure? Don't worry — I never crack under it. Heh! What's the value?",
    Energy:   "Arcane energy flows through all things! How much courses through you?",
    Data:     "Bytes and bits — the tongue of the digital realm! Fascinating indeed.",
  },
  typing: [
    "I see the numbers forming… the spell takes shape…",
    "Hmm… carry the one… yes… the ether stirs!",
    "The ancient calculation awakens within the crystal!",
    "Concentrate… the arcane conversion draws near…",
  ],
  success: [
    "Behold! The oracle has spoken! Your answer is writ in starlight! ✦",
    "Magnificent! Even my mathematical jester-brain is impressed by that one!",
    "Heh heh! The arcane conversion is complete! You are most wise, traveler!",
    "By the crystal spires! The calculation is done! Splendid work!",
    "The mystical transformation is complete! The realm rejoices!",
  ],
  error:  "Hmm… that rune is unreadable! Enchant it with a proper number, please!",
  swap:   "Reversing the enchantment! What was the answer becomes the question! Heh!",
  click:  [
    "Yes, yes! Ask and the oracle shall answer!",
    "The spell is cast! Let the mathematics flow!",
    "Heh heh! Witness the arcane arts at work!",
  ],
  copy:  "The scroll has been copied to your mystical clipboard! Well done!",
  share: "The quest link is captured! Share it with fellow travelers of the realm!",
  portrait: [
    "Heh heh! Did you just poke me? The audacity! I love it!",
    "I am THE JESTER! Mystical guide and keeper of conversions!",
    "Careful! One more poke and I might convert YOU into a frog!",
    "Heh heh! My ethereal form is quite touchable, isn't it?",
    "Go on, choose a category! I don't bite… much.",
  ],
};

function pickLine(key) {
  const lines = JESTER[key];
  if (Array.isArray(lines)) {
    return lines[Math.floor(Math.random() * lines.length)];
  }
  return lines;
}

let speakTimer;
function jesterSpeak(line) {
  clearTimeout(speakTimer);
  jesterSpeech.classList.add('fading');
  speakTimer = setTimeout(() => {
    jesterSpeech.textContent = line;
    jesterSpeech.classList.remove('fading');
  }, 180);
}

function triggerAnimation(cls) {
  portraitBg.classList.remove('celebrating', 'erroring', 'pondering');
  void portraitBg.offsetWidth;
  portraitBg.classList.add(cls);
  portraitBg.addEventListener('animationend', () => {
    portraitBg.classList.remove(cls);
  }, { once: true });
}

// ── XP counter ─────────────────────────────────────────────────
let questsCompleted = parseInt(localStorage.getItem('uq_quests') || '0', 10);
xpCountEl.textContent = questsCompleted;

function bumpXP() {
  questsCompleted++;
  localStorage.setItem('uq_quests', questsCompleted);
  xpCountEl.textContent = questsCompleted;
  xpCountEl.classList.remove('bump');
  void xpCountEl.offsetWidth;
  xpCountEl.classList.add('bump');
  xpCountEl.addEventListener('animationend', () => xpCountEl.classList.remove('bump'), { once: true });
}

// ── Oracle status ──────────────────────────────────────────────
function showMessage(text, state = 'neutral') {
  messageBox.textContent = text;
  messageBox.classList.remove('is-good', 'is-error');
  if (state === 'good')  messageBox.classList.add('is-good');
  if (state === 'error') messageBox.classList.add('is-error');
}

// ── Temperature ────────────────────────────────────────────────
function convertTemperature(value, from, to) {
  if (from === to) return value;
  let celsius;
  if      (from === 'c') celsius = value;
  else if (from === 'f') celsius = (value - 32) * 5 / 9;
  else                   celsius = value - 273.15;

  if (to === 'c') return celsius;
  if (to === 'f') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

// ── Populate selects ───────────────────────────────────────────
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

function resetResult() {
  resultValue.textContent = '—';
  resultHint.textContent  = 'Choose units and cast the spell.';
  resultActions.hidden    = true;
}

// ── Category pills ─────────────────────────────────────────────
function buildCategoryPills() {
  categoryPills.innerHTML = '';
  Object.keys(UNITS).forEach((cat) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cat-pill';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', cat === currentCategory ? 'true' : 'false');
    btn.textContent = cat;
    btn.dataset.cat = cat;
    if (cat === currentCategory) btn.classList.add('cat-pill--active');
    btn.addEventListener('click', () => setCategory(cat));
    categoryPills.appendChild(btn);
  });
}

function setCategory(cat) {
  currentCategory = cat;
  categoryPills.querySelectorAll('.cat-pill').forEach((btn) => {
    const active = btn.dataset.cat === cat;
    btn.classList.toggle('cat-pill--active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  populateUnitSelects(cat);
  resetResult();
  showMessage('Await the arcane calculation…');
  jesterSpeak(JESTER.category[cat] || pickLine('idle'));
  triggerAnimation('pondering');
  if (valueInput.value.trim()) convertValue();
}

// ── Conversion ─────────────────────────────────────────────────
function convertValue() {
  const rawValue = valueInput.value.trim();

  if (!rawValue) {
    resetResult();
    showMessage('Await the arcane calculation…');
    return;
  }

  const numberValue = Number(rawValue);

  if (!Number.isFinite(numberValue)) {
    showMessage('That number rune is unreadable — try again!', 'error');
    resultValue.textContent = '—';
    resultHint.textContent  = 'Enter a valid number.';
    resultActions.hidden    = true;
    jesterSpeak(JESTER.error);
    triggerAnimation('erroring');
    return;
  }

  const fromKey    = fromUnit.value;
  const toKey      = toUnit.value;
  const units      = UNITS[currentCategory];
  const fromUnitObj = units.find((u) => u.key === fromKey);
  const toUnitObj   = units.find((u) => u.key === toKey);

  let converted;
  if (currentCategory === 'Temperature') {
    converted = convertTemperature(numberValue, fromKey, toKey);
  } else {
    converted = numberValue * (fromUnitObj.factor / toUnitObj.factor);
  }

  const niceValue = parseFloat(converted.toPrecision(7)).toString();

  // Pop animation on result
  resultValue.classList.remove('pop');
  void resultValue.offsetWidth;
  resultValue.classList.add('pop');
  resultValue.addEventListener('animationend', () => resultValue.classList.remove('pop'), { once: true });

  resultValue.textContent = `${niceValue} ${toUnitObj.label.split(' ')[0]}`;
  resultHint.textContent  = `${numberValue} ${fromUnitObj.label} = ${niceValue} ${toUnitObj.label}`;
  showMessage('The oracle has spoken!', 'good');
  resultActions.hidden = false;
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
}

// ── URL state ──────────────────────────────────────────────────
function getShareURL() {
  const url = new URL(location.href);
  url.search = '';
  url.searchParams.set('cat', currentCategory);
  url.searchParams.set('from', fromUnit.value);
  url.searchParams.set('to', toUnit.value);
  if (valueInput.value.trim()) url.searchParams.set('v', valueInput.value.trim());
  return url.toString();
}

function loadURLState() {
  const params = new URLSearchParams(location.search);
  const cat    = params.get('cat');
  const from   = params.get('from');
  const to     = params.get('to');
  const v      = params.get('v');

  if (cat && UNITS[cat]) currentCategory = cat;

  buildCategoryPills();
  populateUnitSelects(currentCategory);

  if (from) {
    const match = [...fromUnit.options].find((o) => o.value === from);
    if (match) fromUnit.value = from;
  }
  if (to) {
    const match = [...toUnit.options].find((o) => o.value === to);
    if (match) toUnit.value = to;
  }
  if (v) {
    valueInput.value = v;
    convertValue();
  }
}

// ── Init ───────────────────────────────────────────────────────
loadURLState();

// ── Event listeners ────────────────────────────────────────────

// Live conversion with jester typing lines
let typingTimer;
valueInput.addEventListener('input', () => {
  clearTimeout(typingTimer);
  if (valueInput.value.trim()) {
    typingTimer = setTimeout(() => jesterSpeak(pickLine('typing')), 400);
  }
  convertValue();
});

valueInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') convertValue(); });

fromUnit.addEventListener('change', () => { if (valueInput.value.trim()) convertValue(); });
toUnit.addEventListener('change',   () => { if (valueInput.value.trim()) convertValue(); });

// Convert button: celebrate + jester line
convertBtn.addEventListener('click', () => {
  const rawValue = valueInput.value.trim();
  if (!rawValue || !Number.isFinite(Number(rawValue))) {
    convertValue();
    return;
  }
  jesterSpeak(pickLine('click'));
  convertValue();
  // Celebrate after a short delay (let the conversion render)
  setTimeout(() => {
    if (resultActions.hidden === false) {
      jesterSpeak(pickLine('success'));
      triggerAnimation('celebrating');
      bumpXP();
    }
  }, 120);
});

// Swap button
swapBtn.addEventListener('click', () => {
  const tmp       = fromUnit.value;
  fromUnit.value  = toUnit.value;
  toUnit.value    = tmp;
  jesterSpeak(JESTER.swap);
  if (valueInput.value.trim()) convertValue();
});

// Copy
copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultValue.textContent);
    showToast('📜 Scroll copied!');
    jesterSpeak(JESTER.copy);
  } catch {
    showToast('Copy failed — select the text manually.');
  }
});

// Share
shareBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(getShareURL());
    showToast('🔗 Quest link copied!');
    jesterSpeak(JESTER.share);
  } catch {
    showToast('Could not copy link.');
  }
});

// Jester portrait is interactive — click for random lines
portraitBg.addEventListener('click', () => {
  jesterSpeak(pickLine('portrait'));
  triggerAnimation('celebrating');
});
portraitBg.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    jesterSpeak(pickLine('portrait'));
    triggerAnimation('celebrating');
  }
});

// Arrow-key navigation between category pills
categoryPills.addEventListener('keydown', (e) => {
  const pills = [...categoryPills.querySelectorAll('.cat-pill')];
  const idx   = pills.indexOf(document.activeElement);
  if (idx === -1) return;
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    pills[(idx + 1) % pills.length].focus();
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    pills[(idx - 1 + pills.length) % pills.length].focus();
  }
});
