/* ═══════════════════════════════════════════════════════════════
   UNIT QUEST — Game + Converter Script
═══════════════════════════════════════════════════════════════ */

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
    { label: 'Liters (L)',           key: 'l',    factor: 1 },
    { label: 'Milliliters (mL)',     key: 'ml',   factor: 0.001 },
    { label: 'US Gallons (gal)',     key: 'gal',  factor: 3.78541 },
    { label: 'Fluid Ounces (fl oz)',key: 'floz', factor: 0.0295735 },
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

// ═══════════════════════════════════════════════════════════════
//  CONVERTER CORE (free mode)
// ═══════════════════════════════════════════════════════════════

const JESTER = {
  idle: [
    "Greetings, traveler! What mysteries shall we unravel today?",
    "Step forth! Choose your quest category and let the magic begin!",
    "Heh heh! I await your command, brave converter of things!",
    "The arcane arts of measurement are at your disposal, my liege!",
  ],
  category: {
    Distance:    "Ah, the roads of the realm! How far must we journey today?",
    Weight:      "Mass and matter! Even my jester's cap has weight, you know…",
    Temperature: "Hot or cold? Fire or frost? The cosmos cares not — but I do!",
    Volume:      "How much space does your magic occupy? Let us measure the vessel!",
    Speed:       "Fleet of foot or swift of wing — how fast does your quarry travel?",
    Time:        "Ah, time… even I cannot convert *that* back. Heh heh! Proceed!",
    Area:        "The breadth of kingdoms! Let us survey your domain, my liege.",
    Pressure:    "Pressure? Don't worry — I never crack under it. Heh! What's the value?",
    Energy:      "Arcane energy flows through all things! How much courses through you?",
    Data:        "Bytes and bits — the tongue of the digital realm! Fascinating indeed.",
  },
  typing: [
    "I see the numbers forming… the spell takes shape…",
    "Hmm… carry the one… yes… the ether stirs!",
    "The ancient calculation awakens within the crystal!",
    "Concentrate… the arcane conversion draws near…",
  ],
  success: [
    "Behold! The oracle has spoken! Your answer is writ in starlight! ✦",
    "Magnificent! Even my mathematical jester-brain is impressed!",
    "Heh heh! The arcane conversion is complete! You are most wise!",
    "By the crystal spires! The calculation is done! Splendid work!",
    "The mystical transformation is complete! The realm rejoices!",
  ],
  error:   "Hmm… that rune is unreadable! Enchant it with a proper number, please!",
  swap:    "Reversing the enchantment! What was the answer becomes the question! Heh!",
  click:   ["Yes, yes! Ask and the oracle shall answer!", "The spell is cast! Let the mathematics flow!", "Heh heh! Witness the arcane arts at work!"],
  copy:    "The scroll has been copied to your mystical clipboard! Well done!",
  share:   "The quest link is captured! Share it with fellow travelers of the realm!",
  portrait:["Heh heh! Did you just poke me? The audacity! I love it!", "I am THE JESTER! Mystical guide and keeper of conversions!", "Careful! One more poke and I might convert YOU into a frog!", "Heh heh! My ethereal form is quite touchable, isn't it?", "Go on, choose a category! I don't bite… much."],
};

function pickLine(key, obj = JESTER) {
  const v = obj[key];
  return Array.isArray(v) ? v[Math.floor(Math.random() * v.length)] : v;
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
  portraitBg.addEventListener('animationend', () => portraitBg.classList.remove(cls), { once: true });
}

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

function showMessage(text, state = 'neutral') {
  messageBox.textContent = text;
  messageBox.classList.remove('is-good', 'is-error');
  if (state === 'good')  messageBox.classList.add('is-good');
  if (state === 'error') messageBox.classList.add('is-error');
}

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

function convertValue() {
  const rawValue = valueInput.value.trim();
  if (!rawValue) { resetResult(); showMessage('Await the arcane calculation…'); return; }
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
  const fromKey     = fromUnit.value;
  const toKey       = toUnit.value;
  const units       = UNITS[currentCategory];
  const fromUnitObj = units.find((u) => u.key === fromKey);
  const toUnitObj   = units.find((u) => u.key === toKey);
  let converted;
  if (currentCategory === 'Temperature') {
    converted = convertTemperature(numberValue, fromKey, toKey);
  } else {
    converted = numberValue * (fromUnitObj.factor / toUnitObj.factor);
  }
  const niceValue = parseFloat(converted.toPrecision(7)).toString();
  resultValue.classList.remove('pop');
  void resultValue.offsetWidth;
  resultValue.classList.add('pop');
  resultValue.addEventListener('animationend', () => resultValue.classList.remove('pop'), { once: true });
  resultValue.textContent = `${niceValue} ${toUnitObj.label.split(' ')[0]}`;
  resultHint.textContent  = `${numberValue} ${fromUnitObj.label} = ${niceValue} ${toUnitObj.label}`;
  showMessage('The oracle has spoken!', 'good');
  resultActions.hidden = false;
}

let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2200);
}

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
  const cat = params.get('cat'), from = params.get('from'), to = params.get('to'), v = params.get('v');
  if (cat && UNITS[cat]) currentCategory = cat;
  buildCategoryPills();
  populateUnitSelects(currentCategory);
  if (from) { const m = [...fromUnit.options].find(o => o.value === from); if (m) fromUnit.value = from; }
  if (to)   { const m = [...toUnit.options].find(o => o.value === to);   if (m) toUnit.value = to; }
  if (v) { valueInput.value = v; convertValue(); }
}

// Free mode event listeners
let typingTimer;
valueInput.addEventListener('input', () => {
  clearTimeout(typingTimer);
  if (valueInput.value.trim() && GAME.mode === 'free') {
    typingTimer = setTimeout(() => jesterSpeak(pickLine('typing')), 400);
  }
  convertValue();
});
valueInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') convertValue(); });
fromUnit.addEventListener('change', () => { if (valueInput.value.trim()) convertValue(); });
toUnit.addEventListener('change',   () => { if (valueInput.value.trim()) convertValue(); });

convertBtn.addEventListener('click', () => {
  const rawValue = valueInput.value.trim();
  if (!rawValue || !Number.isFinite(Number(rawValue))) { convertValue(); return; }
  jesterSpeak(pickLine('click'));
  convertValue();
  setTimeout(() => {
    if (!resultActions.hidden) { jesterSpeak(pickLine('success')); triggerAnimation('celebrating'); bumpXP(); }
  }, 120);
});

swapBtn.addEventListener('click', () => {
  const tmp = fromUnit.value;
  fromUnit.value = toUnit.value; toUnit.value = tmp;
  jesterSpeak(JESTER.swap);
  if (valueInput.value.trim()) convertValue();
});

copyBtn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(resultValue.textContent); showToast('📜 Scroll copied!'); jesterSpeak(JESTER.copy); }
  catch { showToast('Copy failed — select the text manually.'); }
});

shareBtn.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(getShareURL()); showToast('🔗 Quest link copied!'); jesterSpeak(JESTER.share); }
  catch { showToast('Could not copy link.'); }
});

portraitBg.addEventListener('click', () => { jesterSpeak(pickLine('portrait')); triggerAnimation('celebrating'); });
portraitBg.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); jesterSpeak(pickLine('portrait')); triggerAnimation('celebrating'); }
});

categoryPills.addEventListener('keydown', (e) => {
  const pills = [...categoryPills.querySelectorAll('.cat-pill')];
  const idx = pills.indexOf(document.activeElement);
  if (idx === -1) return;
  if (e.key === 'ArrowRight') { e.preventDefault(); pills[(idx + 1) % pills.length].focus(); }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); pills[(idx - 1 + pills.length) % pills.length].focus(); }
});

// ═══════════════════════════════════════════════════════════════
//  GAME SYSTEM
// ═══════════════════════════════════════════════════════════════

// ── Realm definitions ─────────────────────────────────────────
const REALMS = {
  Distance:    { icon: '🗺️', name: 'The Road to the Crystal Citadel', cost: 0 },
  Weight:      { icon: '⚖️', name: "The Merchant's Grand Market",      cost: 0 },
  Temperature: { icon: '🔥', name: 'The Elemental Forge',              cost: 0 },
  Volume:      { icon: '⚗️', name: "The Alchemist's Laboratory",       cost: 50 },
  Speed:       { icon: '🐉', name: 'The Dragon Racing Circuit',        cost: 80 },
  Time:        { icon: '⏳', name: 'The Clockwork Tower',              cost: 80 },
  Area:        { icon: '📐', name: 'The Kingdom Surveyor',             cost: 120 },
  Pressure:    { icon: '🌊', name: 'The Deep Sea Vault',               cost: 150 },
  Energy:      { icon: '⚡', name: 'The Arcane Generator',             cost: 150 },
  Data:        { icon: '💻', name: 'The Digital Dungeon',              cost: 200 },
};

// ── Quest difficulty tiers (pairs + values per category) ──────
const QUEST_TIERS = {
  Distance: {
    easy:   [{ f:'km',t:'m',  v:3  },{ f:'km',t:'m',  v:7   }],
    medium: [{ f:'km',t:'mi', v:5  },{ f:'mi',t:'km', v:10  }],
    hard:   [{ f:'mi',t:'ft', v:2.5},{ f:'ft',t:'m',  v:5280}],
  },
  Weight: {
    easy:   [{ f:'kg',t:'g',  v:2  },{ f:'kg',t:'g',  v:5   }],
    medium: [{ f:'lb',t:'kg', v:10 },{ f:'kg',t:'lb', v:4   }],
    hard:   [{ f:'st',t:'kg', v:3  },{ f:'oz',t:'kg', v:32  }],
  },
  Temperature: {
    easy:   [{ f:'c', t:'k',  v:27 },{ f:'c', t:'k',  v:100 }],
    medium: [{ f:'f', t:'c',  v:98.6},{ f:'c',t:'f',  v:37  }],
    hard:   [{ f:'k', t:'f',  v:373.15},{ f:'f',t:'k',v:32  }],
  },
  Volume: {
    easy:   [{ f:'l', t:'ml', v:3  },{ f:'l', t:'ml', v:5   }],
    medium: [{ f:'gal',t:'l', v:5  },{ f:'l', t:'gal',v:10  }],
    hard:   [{ f:'pt',t:'ml', v:6  },{ f:'cup',t:'l', v:4   }],
  },
  Speed: {
    easy:   [{ f:'kmh',t:'mph',v:100},{ f:'mph',t:'kmh',v:60}],
    medium: [{ f:'kmh',t:'ms', v:72 },{ f:'ms', t:'kmh',v:20}],
    hard:   [{ f:'knot',t:'ms',v:30 },{ f:'mph',t:'ms', v:60}],
  },
  Time: {
    easy:   [{ f:'min',t:'s',  v:5  },{ f:'hr', t:'min',v:2  }],
    medium: [{ f:'day',t:'hr', v:3  },{ f:'wk', t:'day',v:4  }],
    hard:   [{ f:'yr', t:'wk', v:2  },{ f:'mo', t:'day',v:6  }],
  },
  Area: {
    easy:   [{ f:'ha', t:'m2', v:2  },{ f:'km2',t:'ha', v:5  }],
    medium: [{ f:'ac', t:'m2', v:3  },{ f:'m2', t:'ft2',v:100}],
    hard:   [{ f:'mi2',t:'ac', v:2  },{ f:'ac', t:'ha', v:50 }],
  },
  Pressure: {
    easy:   [{ f:'kpa',t:'pa', v:5  },{ f:'bar',t:'pa', v:2  }],
    medium: [{ f:'atm',t:'kpa',v:3  },{ f:'psi',t:'kpa',v:30 }],
    hard:   [{ f:'atm',t:'psi',v:5  },{ f:'bar',t:'psi',v:3  }],
  },
  Energy: {
    easy:   [{ f:'kj', t:'j',  v:5  },{ f:'kcal',t:'j',v:2  }],
    medium: [{ f:'kwh',t:'kj', v:2  },{ f:'cal', t:'j',v:100 }],
    hard:   [{ f:'kwh',t:'cal',v:3  },{ f:'wh',  t:'j',v:500 }],
  },
  Data: {
    easy:   [{ f:'kb', t:'b',  v:5  },{ f:'mb', t:'kb', v:2  }],
    medium: [{ f:'gb', t:'mb', v:4  },{ f:'mb', t:'b',  v:10 }],
    hard:   [{ f:'tb', t:'mb', v:2  },{ f:'gb', t:'kb', v:3  }],
  },
};

// ── Narrative templates per category ─────────────────────────
const NARRATIVES = {
  Distance: [
    'The royal courier must ride <strong>{value} {from}</strong> to deliver the king\'s decree. The border checkpoint only records distances in <strong>{to}</strong>. How far is the journey?',
    'A dragon has been spotted <strong>{value} {from}</strong> from the citadel. The watchtower logs all sightings in <strong>{to}</strong>. How far is the beast?',
    'Sir Galwin challenges you to race across <strong>{value} {from}</strong> of open terrain. The finish banner is measured in <strong>{to}</strong>. What distance must you cross?',
  ],
  Weight: [
    'The merchant\'s enchanted chest holds <strong>{value} {from}</strong> of rare ore. The guild pays by the <strong>{to}</strong>. What is the weight in <strong>{to}</strong>?',
    'The dragon\'s hoard weighs <strong>{value} {from}</strong>. The royal treasury\'s scales measure only in <strong>{to}</strong>. What does the treasure weigh?',
    'A potion recipe calls for <strong>{value} {from}</strong> of powdered moonstone. Your apothecary balance measures in <strong>{to}</strong>. How much do you need?',
  ],
  Temperature: [
    'The elemental forge burns at <strong>{value} {from}</strong>. The ancient scroll records temperatures in <strong>{to}</strong>. What temperature must the scroll record?',
    'A fever spell raises the patient\'s body temperature to <strong>{value} {from}</strong>. The healing crystal must be calibrated in <strong>{to}</strong>. What temperature is that?',
    'The ice cavern plunges to <strong>{value} {from}</strong> at midnight. Your enchanted thermometer reads in <strong>{to}</strong>. How cold is the cavern?',
  ],
  Volume: [
    'The alchemist\'s great cauldron holds <strong>{value} {from}</strong> of transformation potion. The recipe measures in <strong>{to}</strong>. How much potion does the cauldron hold?',
    'The tavern keeper brewed <strong>{value} {from}</strong> of golden mead. The royal order specifies the amount in <strong>{to}</strong>. How much mead was made?',
    'A magical spring produces <strong>{value} {from}</strong> of enchanted water daily. The water tax is measured in <strong>{to}</strong>. How much water must be reported?',
  ],
  Speed: [
    'The messenger hawk soars at <strong>{value} {from}</strong>. The speed recorded in the war chronicle is measured in <strong>{to}</strong>. How fast is the hawk in <strong>{to}</strong>?',
    'A river current flows at <strong>{value} {from}</strong>. The naval charts measure current speed in <strong>{to}</strong>. What is the current speed?',
    'The racing dragon achieves <strong>{value} {from}</strong> on the final straightaway. The judges record speed in <strong>{to}</strong>. What is the speed in <strong>{to}</strong>?',
  ],
  Time: [
    'The enchanted clock shows <strong>{value} {from}</strong> have elapsed since the wizard began the ritual. The prophecy measures time in <strong>{to}</strong>. How long is that?',
    'The royal curse lasts exactly <strong>{value} {from}</strong>. The prophecy speaks of its duration only in <strong>{to}</strong>. How long will the curse endure?',
    'The grand tournament runs for <strong>{value} {from}</strong>. The herald must announce the total duration in <strong>{to}</strong>. How long is the tournament?',
  ],
  Area: [
    'The king grants you <strong>{value} {from}</strong> of land beyond the eastern wall. The royal deed must be recorded in <strong>{to}</strong>. What area is your domain?',
    'The great battle raged across <strong>{value} {from}</strong> of terrain. The war chronicle maps area only in <strong>{to}</strong>. How large was the battlefield?',
    'The enchanted garden covers <strong>{value} {from}</strong>. The druid\'s fertilizer spell covers areas measured in <strong>{to}</strong>. What area must be treated?',
  ],
  Pressure: [
    'The arcane submarine descends until the hull gauge reads <strong>{value} {from}</strong>. The safety manual lists limits in <strong>{to}</strong>. What is the reading in <strong>{to}</strong>?',
    'The steam golem\'s engine generates <strong>{value} {from}</strong> of pressure. The safety valve is rated in <strong>{to}</strong>. What is the pressure in <strong>{to}</strong>?',
    'The weather wizard reads an atmospheric pressure of <strong>{value} {from}</strong>. The forecast spell requires the value in <strong>{to}</strong>. What is the pressure?',
  ],
  Energy: [
    'The arcane crystal stores <strong>{value} {from}</strong> of spell energy. The enchantment requires the energy stated in <strong>{to}</strong>. How much energy is stored?',
    'A bolt of lightning strikes the tower with <strong>{value} {from}</strong> of raw power. The ward is rated in <strong>{to}</strong>. How powerful was the bolt?',
    'The dragon breathes <strong>{value} {from}</strong> of fire energy. The fire ward is calibrated in <strong>{to}</strong>. How much energy must the ward absorb?',
  ],
  Data: [
    'The wizard\'s enchanted tome contains <strong>{value} {from}</strong> of magical knowledge. The digital archive stores data in <strong>{to}</strong>. How much knowledge is stored?',
    'The crystal ball transmits <strong>{value} {from}</strong> of vision data to the scrying mirror. The mirror only accepts data measured in <strong>{to}</strong>. How much was sent?',
    'The enchanted map file is <strong>{value} {from}</strong> in size. The magic mirror\'s storage limit is shown in <strong>{to}</strong>. How large is the map in <strong>{to}</strong>?',
  ],
};

// ── Jester quest dialogue ─────────────────────────────────────
const JQUEST = {
  intro:   [
    "Your quest begins, traveler! Enter the value shown into the converter and submit your answer!",
    "A new challenge awaits! Use the converter below — enter the number shown and witness the transformation!",
    "Listen well! Type the number from the story into the converter and submit what the oracle reveals!",
  ],
  correct: [
    "Brilliant! You have mastered the arcane conversion! The realm is grateful! ✦",
    "Correct! The oracle's wisdom flows through you! Well done, traveler!",
    "Heh heh! I knew you had the mathematical gift in you! Magnificent!",
    "The conversion is perfect! You are a true scholar of the arcane academy!",
    "By the crystal spires! You have solved it! Gold and glory are yours!",
  ],
  wrong:   [
    "Hmm… not quite, brave traveler. Double-check the value you entered and try again!",
    "The oracle sees a different answer… Make sure you entered the correct number from the story!",
    "Close! But not close enough for the academy. Enter the highlighted value and try once more!",
  ],
  wrong2:  [
    "Fear not — even great wizards struggle sometimes. Here is the formula to study!",
    "No shame in learning, traveler! Study the formula below and grow stronger for next time!",
    "The arcane arts take practice! Review the formula — it will serve you well on future quests!",
  ],
  hint:    [
    "Psst! Enter <strong>{value}</strong> into the converter box above — that is the key!",
    "Heh heh! A little hint: type <strong>{value}</strong> into the number field above!",
    "The secret: the value from the story is <strong>{value}</strong> — enter it into the converter!",
  ],
};

// ── localStorage save/load ─────────────────────────────────────
const SAVE = {
  _gold:     () => parseInt(localStorage.getItem('uq_gold')     || '0', 10),
  _stars:    () => JSON.parse(localStorage.getItem('uq_stars')  || '{}'),
  _unlocked: () => JSON.parse(localStorage.getItem('uq_unlock') || '["Distance","Weight","Temperature"]'),

  gold()     { return this._gold(); },
  stars()    { return this._stars(); },
  unlocked() { return this._unlocked(); },

  addGold(n) {
    const g = this._gold() + n;
    localStorage.setItem('uq_gold', g);
    return g;
  },
  setStars(realm, n) {
    const s = this._stars();
    s[realm] = Math.max(s[realm] || 0, n);
    localStorage.setItem('uq_stars', JSON.stringify(s));
  },
  unlock(realm) {
    const u = this._unlocked();
    if (!u.includes(realm)) { u.push(realm); localStorage.setItem('uq_unlock', JSON.stringify(u)); }
  },
  isUnlocked(realm) { return this._unlocked().includes(realm); },
};

// ── Game state ─────────────────────────────────────────────────
const GAME = {
  mode:        'free',
  realm:       null,
  questIdx:    0,
  quests:      [],
  quest:       null,
  lives:       3,
  streak:      0,
  peakStreak:  0,
  goldRun:     0,
  correctCount:0,
  hintsLeft:   2,
};

// ── Screen manager ─────────────────────────────────────────────
let activeScreen = 'screen-title';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  activeScreen = id;
}

// ── Quest generator ────────────────────────────────────────────
function generateQuests(category) {
  const tiers = QUEST_TIERS[category];
  const templates = NARRATIVES[category];
  const units = UNITS[category];
  const order = ['easy', 'easy', 'medium', 'medium', 'hard'];
  const quests = [];

  order.forEach((diff, i) => {
    const pool = tiers[diff];
    const entry = pool[i % pool.length];
    const fromUnitObj = units.find(u => u.key === entry.f);
    const toUnitObj   = units.find(u => u.key === entry.t);
    const value = entry.v;

    let answer;
    if (category === 'Temperature') {
      answer = convertTemperature(value, entry.f, entry.t);
    } else {
      answer = value * (fromUnitObj.factor / toUnitObj.factor);
    }

    const fromLabel = fromUnitObj.label.split('(')[0].trim();
    const toLabel   = toUnitObj.label.split('(')[0].trim();

    const template = templates[i % templates.length];
    const narrative = template
      .replace(/{value}/g, value)
      .replace(/{from}/g, fromLabel)
      .replace(/{to}/g, toLabel);

    // Tolerance: 2% for large answers, 0.5 absolute for near-zero
    const tolerance = Math.abs(answer) < 2 ? 0.6 : 0.02;

    quests.push({ category, fromUnit: fromUnitObj, toUnit: toUnitObj, value, answer, tolerance, narrative, difficulty: diff, attempts: 0 });
  });

  return quests;
}

// ── Formula builder ────────────────────────────────────────────
function buildFormula(quest) {
  const { fromUnit: fu, toUnit: tu, value, answer, category } = quest;
  const fromLabel = fu.label.split('(')[0].trim();
  const toLabel   = tu.label.split('(')[0].trim();
  const niceAnswer = parseFloat(answer.toPrecision(7));

  if (category === 'Temperature') {
    return buildTempFormula(fu.key, tu.key, value, niceAnswer);
  }

  const ratio = fu.factor / tu.factor;
  const niceRatio = parseFloat(ratio.toPrecision(6));

  return `
    <div class="formula-line">
      <span class="formula-num">${value}</span>
      <span class="formula-unit">${fromLabel}</span>
      <span class="formula-op">×</span>
      <span class="formula-ratio">${niceRatio}</span>
      <span class="formula-op">=</span>
      <span class="formula-answer">${niceAnswer}</span>
      <span class="formula-unit">${toLabel}</span>
    </div>
    <div class="formula-explain">
      (Because: 1 ${fromLabel} = ${niceRatio} ${toLabel})
    </div>`;
}

function buildTempFormula(fromKey, toKey, value, answer) {
  const steps = [];
  if (fromKey === 'f' && toKey === 'c') {
    const step1 = value - 32;
    steps.push(`(${value} − 32) = ${step1}`);
    steps.push(`${step1} × 5⁄9 = ${answer} °C`);
  } else if (fromKey === 'c' && toKey === 'f') {
    const step1 = parseFloat((value * 1.8).toPrecision(6));
    steps.push(`${value} × 9⁄5 = ${step1}`);
    steps.push(`${step1} + 32 = ${answer} °F`);
  } else if (fromKey === 'c' && toKey === 'k') {
    steps.push(`${value} + 273.15 = ${answer} K`);
  } else if (fromKey === 'k' && toKey === 'c') {
    steps.push(`${value} − 273.15 = ${answer} °C`);
  } else if (fromKey === 'f' && toKey === 'k') {
    const c = parseFloat(((value - 32) * 5/9).toPrecision(5));
    steps.push(`Step 1 (°F→°C): (${value} − 32) × 5⁄9 = ${c} °C`);
    steps.push(`Step 2 (°C→K): ${c} + 273.15 = ${answer} K`);
  } else if (fromKey === 'k' && toKey === 'f') {
    const c = parseFloat((value - 273.15).toPrecision(5));
    steps.push(`Step 1 (K→°C): ${value} − 273.15 = ${c} °C`);
    steps.push(`Step 2 (°C→°F): (${c} × 9⁄5) + 32 = ${answer} °F`);
  }
  return `<div class="formula-steps">${steps.map(s => `<div class="formula-step">${s}</div>`).join('')}</div>`;
}

// ── HUD updater ────────────────────────────────────────────────
function updateHUD() {
  const livesIcons = '❤️'.repeat(GAME.lives) + '🖤'.repeat(3 - GAME.lives);
  document.getElementById('hudLives').textContent   = livesIcons;
  document.getElementById('hudCenter').textContent  = `${REALMS[GAME.realm].icon} Quest ${GAME.questIdx + 1} of ${GAME.quests.length}`;
  document.getElementById('hudGold').textContent    = GAME.goldRun;
}

// ── Quest mode toggle ──────────────────────────────────────────
function setQuestMode(isQuest) {
  GAME.mode = isQuest ? 'quest' : 'free';

  // Elements shown only in quest mode
  document.getElementById('questHud').hidden     = !isQuest;
  document.getElementById('questNarrative').hidden = !isQuest;
  document.getElementById('questBtns').hidden    = !isQuest;
  document.getElementById('exitQuestBtn').hidden = !isQuest;

  // Elements shown only in free mode
  document.getElementById('categorySec').hidden = isQuest;
  convertBtn.hidden                             = isQuest;
  document.getElementById('xpHud').hidden       = isQuest;
  document.getElementById('resultActions').hidden = true; // always reset

  // Swap button hidden in quest mode (units are locked)
  swapBtn.hidden = isQuest;

  // Lock unit selects in quest mode
  fromUnit.disabled = isQuest;
  toUnit.disabled   = isQuest;

  if (isQuest) {
    document.getElementById('offeringHd').textContent = '📜 ENTER THE VALUE FROM THE STORY';
  } else {
    document.getElementById('offeringHd').textContent = '📜 YOUR OFFERING';
  }
}

// ── Start a realm ──────────────────────────────────────────────
function startRealm(category) {
  GAME.realm        = category;
  GAME.questIdx     = 0;
  GAME.quests       = generateQuests(category);
  GAME.lives        = 3;
  GAME.streak       = 0;
  GAME.peakStreak   = 0;
  GAME.goldRun      = 0;
  GAME.correctCount = 0;
  GAME.hintsLeft    = 2;
  document.getElementById('hintCountDisplay').textContent = '(2 left)';

  setQuestMode(true);
  showScreen('screen-quest');
  loadQuest(GAME.quests[0]);
}

// ── Load a quest ───────────────────────────────────────────────
function loadQuest(quest) {
  GAME.quest = quest;
  quest.attempts = 0;

  // Pre-set category and units (locked)
  currentCategory = quest.category;
  populateUnitSelects(quest.category);
  fromUnit.value = quest.fromUnit.key;
  toUnit.value   = quest.toUnit.key;

  // Clear value input and result
  valueInput.value = '';
  resetResult();
  showMessage('Enter the value from the story and watch the oracle reveal your answer…');

  // Show narrative
  document.getElementById('questStory').innerHTML    = quest.narrative;
  document.getElementById('questChallenge').textContent =
    `${quest.value} ${quest.fromUnit.label.split('(')[0].trim()} → ? ${quest.toUnit.label.split('(')[0].trim()}`;
  document.getElementById('questNarrative').hidden = false;

  updateHUD();
  jesterSpeak(pickLine('intro', JQUEST));
  triggerAnimation('pondering');

  // Focus value input for quick entry
  setTimeout(() => valueInput.focus(), 100);
}

// ── Check and submit answer ────────────────────────────────────
function submitAnswer() {
  const quest = GAME.quest;
  const rawText = resultValue.textContent.trim();
  const parsed  = parseFloat(rawText.split(' ')[0]);

  if (!rawText || rawText === '—' || isNaN(parsed)) {
    jesterSpeak("You haven't entered a value yet, traveler! Type the number from the story above!");
    triggerAnimation('erroring');
    return;
  }

  quest.attempts++;
  const { answer, tolerance } = quest;
  const correct = Math.abs(answer) < 2
    ? Math.abs(parsed - answer) <= tolerance
    : Math.abs(parsed - answer) / Math.abs(answer) <= tolerance;

  showFeedbackScreen(correct, quest, parsed);
}

// ── Show feedback screen ───────────────────────────────────────
function showFeedbackScreen(correct, quest, userValue) {
  const fromLabel = quest.fromUnit.label.split('(')[0].trim();
  const toLabel   = quest.toUnit.label.split('(')[0].trim();
  const niceAnswer = parseFloat(quest.answer.toPrecision(7));

  // Verdict
  document.getElementById('feedbackVerdict').textContent = correct ? '✅' : (quest.attempts >= 2 ? '📖' : '❌');

  // Answer reveal
  const revealEl = document.getElementById('feedbackReveal');
  if (correct) {
    revealEl.innerHTML = `<span>Your answer is correct!</span>
      <span class="correct-answer">${niceAnswer} ${toLabel}</span>`;
  } else if (quest.attempts >= 2) {
    revealEl.innerHTML = `<span>The correct answer:</span>
      <span class="correct-answer">${niceAnswer} ${toLabel}</span>`;
  } else {
    revealEl.innerHTML = `<span>Not quite — you answered ${userValue} ${toLabel}.</span>
      <br><span style="color:var(--muted);font-size:0.82rem">Enter <strong style="color:var(--primary)">${quest.value}</strong> into the converter above and try again!</span>`;
  }

  // Formula
  document.getElementById('formulaContent').innerHTML = buildFormula(quest);

  // Jester feedback speech
  const feedbackSpeechEl = document.getElementById('feedbackSpeech');
  if (correct) {
    feedbackSpeechEl.textContent = pickLine('correct', JQUEST);
  } else if (quest.attempts >= 2) {
    feedbackSpeechEl.textContent = pickLine('wrong2', JQUEST);
  } else {
    feedbackSpeechEl.textContent = pickLine('wrong', JQUEST);
  }

  // Gold
  let goldEarned = 0;
  if (correct) {
    goldEarned = quest.difficulty === 'easy' ? 10 : quest.difficulty === 'medium' ? 15 : 25;
    if (GAME.streak >= 2) goldEarned += 5; // streak bonus
    GAME.streak++;
    GAME.peakStreak  = Math.max(GAME.peakStreak, GAME.streak);
    GAME.goldRun    += goldEarned;
    GAME.correctCount++;
  } else if (quest.attempts < 2) {
    // Wrong on first attempt → go back for retry, don't show feedback screen yet
    GAME.lives = Math.max(0, GAME.lives - 1);
    updateHUD();
    jesterSpeak(pickLine('wrong', JQUEST));
    triggerAnimation('erroring');
    showScreen('screen-quest');
    return;
  } else {
    // 2nd wrong → show feedback, no gold, lose a life
    GAME.lives   = Math.max(0, GAME.lives - 1);
    GAME.streak  = 0;
    goldEarned   = 0;
  }

  document.getElementById('goldBadge').textContent = correct ? `+${goldEarned} 💰` : '+0 💰';
  document.getElementById('goldBadge').style.opacity = correct ? '1' : '0.4';

  // Update next button label
  const isLast = GAME.questIdx >= GAME.quests.length - 1;
  document.getElementById('nextQuestBtn').textContent = isLast ? 'COMPLETE REALM ✦' : 'NEXT QUEST →';

  showScreen('screen-feedback');
  if (correct) triggerAnimation('celebrating');

  jesterSpeak(feedbackSpeechEl.textContent);
}

// ── Advance to next quest ──────────────────────────────────────
function nextQuest() {
  GAME.questIdx++;
  if (GAME.questIdx >= GAME.quests.length) {
    endRealm();
  } else {
    // Gold animations on HUD
    SAVE.addGold(0); // triggers nothing; gold added at realm end
    showScreen('screen-quest');
    loadQuest(GAME.quests[GAME.questIdx]);
  }
}

// ── End realm ─────────────────────────────────────────────────
function endRealm() {
  const totalGold = SAVE.addGold(GAME.goldRun);

  // Stars based on lives remaining
  const stars = GAME.lives === 3 ? 3 : GAME.lives === 2 ? 2 : GAME.lives >= 1 ? 1 : 1;
  SAVE.setStars(GAME.realm, stars);

  // Unlock next realms if enough gold
  Object.entries(REALMS).forEach(([key, r]) => {
    if (r.cost <= totalGold && !SAVE.isUnlocked(key)) SAVE.unlock(key);
  });

  // Fill star row
  ['star1','star2','star3'].forEach((id, i) => {
    const el = document.getElementById(id);
    el.textContent = '☆';
    el.classList.remove('filled');
    if (i < stars) {
      setTimeout(() => { el.textContent = '⭐'; el.classList.add('filled'); }, i * 300 + 200);
    }
  });

  document.getElementById('completeIcon').textContent    = REALMS[GAME.realm].icon;
  document.getElementById('completeRealmName').textContent = REALMS[GAME.realm].name;
  document.getElementById('completeGold').textContent    = `${GAME.goldRun} 💰`;
  const acc = GAME.quests.length > 0 ? Math.round((GAME.correctCount / GAME.quests.length) * 100) : 0;
  document.getElementById('completeAccuracy').textContent = `${acc}%`;
  document.getElementById('completeStreak').textContent  = `${GAME.peakStreak} 🔥`;

  showScreen('screen-complete');
}

// ── Build realm grid ───────────────────────────────────────────
function buildRealmGrid() {
  const grid   = document.getElementById('realmGrid');
  const gold   = SAVE.gold();
  const stars  = SAVE.stars();

  grid.innerHTML = '';

  Object.entries(REALMS).forEach(([key, realm]) => {
    const unlocked = SAVE.isUnlocked(key);
    const earned   = stars[key] || 0;
    const starStr  = '⭐'.repeat(earned) + '☆'.repeat(3 - earned);

    const card = document.createElement('div');
    card.className = `realm-card${unlocked ? '' : ' locked'}`;
    card.setAttribute('data-realm', key);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', unlocked ? '0' : '-1');
    card.setAttribute('aria-label', `${realm.name}${unlocked ? '' : ', locked'}`);

    card.innerHTML = `
      ${!unlocked ? '<span class="realm-lock-icon">🔒</span>' : ''}
      <span class="realm-icon">${realm.icon}</span>
      <span class="realm-name">${key}</span>
      <span class="realm-flavor">${realm.name}</span>
      <span class="realm-stars">${starStr}</span>
      <span class="realm-status${unlocked ? '' : ' locked-cost'}">
        ${unlocked ? (earned ? 'PLAY AGAIN' : 'FREE') : `${realm.cost} Gold`}
      </span>`;

    if (unlocked) {
      card.addEventListener('click', () => startRealm(key));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startRealm(key); } });
    }

    grid.appendChild(card);
  });

  document.getElementById('realmGold').textContent = gold;
}

// ── Title screen ───────────────────────────────────────────────
function refreshTitleGold() {
  document.getElementById('titleGold').textContent = SAVE.gold();
}

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════

// Check URL params — if they exist, go directly to free practice
const _hasParams = new URLSearchParams(location.search).has('cat') || new URLSearchParams(location.search).has('v');

if (_hasParams) {
  // Shared link — open free practice mode directly
  setQuestMode(false);
  showScreen('screen-quest');
  loadURLState();
} else {
  // Normal start — show title screen
  refreshTitleGold();
  buildCategoryPills();
  populateUnitSelects(currentCategory);
}

// ── Title buttons ──────────────────────────────────────────────
document.getElementById('beginQuestBtn').addEventListener('click', () => {
  buildRealmGrid();
  showScreen('screen-realm');
});

document.getElementById('freePracticeBtn').addEventListener('click', () => {
  setQuestMode(false);
  showScreen('screen-quest');
  if (!_hasParams) loadURLState();
  jesterSpeak(pickLine('idle'));
});

// ── Realm screen ──────────────────────────────────────────────
document.getElementById('realmBackBtn').addEventListener('click', () => {
  refreshTitleGold();
  showScreen('screen-title');
});

// ── Quest screen buttons ───────────────────────────────────────
document.getElementById('questSubmitBtn').addEventListener('click', submitAnswer);

document.getElementById('hintBtn').addEventListener('click', () => {
  if (GAME.hintsLeft <= 0) return;
  GAME.hintsLeft--;
  document.getElementById('hintCountDisplay').textContent = `(${GAME.hintsLeft} left)`;
  if (GAME.hintsLeft <= 0) document.getElementById('hintBtn').disabled = true;

  const line = pickLine('hint', JQUEST).replace('{value}', GAME.quest.value);
  jesterSpeak(line.replace(/<[^>]*>/g, ''));
  showToast(`💡 Hint: Enter ${GAME.quest.value} into the converter!`);
});

document.getElementById('exitQuestBtn').addEventListener('click', () => {
  setQuestMode(false);
  refreshTitleGold();
  showScreen('screen-title');
});

// ── Feedback screen ────────────────────────────────────────────
document.getElementById('nextQuestBtn').addEventListener('click', nextQuest);

// ── Complete screen ────────────────────────────────────────────
document.getElementById('playAgainBtn').addEventListener('click', () => startRealm(GAME.realm));

document.getElementById('chooseRealmBtn').addEventListener('click', () => {
  buildRealmGrid();
  showScreen('screen-realm');
});
