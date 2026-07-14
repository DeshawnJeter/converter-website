const valueInput = document.getElementById('valueInput');
const directionSelect = document.getElementById('directionSelect');
const convertBtn = document.getElementById('convertBtn');
const resultValue = document.getElementById('resultValue');
const resultHint = document.getElementById('resultHint');
const messageBox = document.getElementById('messageBox');
const xpValue = document.getElementById('xpValue');
const streakValue = document.getElementById('streakValue');
const levelValue = document.getElementById('levelValue');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

const STORAGE_KEY = 'distance-quest-stats';
const initialStats = {
  xp: 0,
  streak: 0,
  level: 1,
};

let stats = loadStats();

function loadStats() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...initialStats };

  try {
    const parsed = JSON.parse(saved);
    return {
      xp: Number(parsed.xp) || 0,
      streak: Number(parsed.streak) || 0,
      level: Number(parsed.level) || 1,
    };
  } catch {
    return { ...initialStats };
  }
}

function saveStats() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function updateUI() {
  xpValue.textContent = stats.xp;
  streakValue.textContent = stats.streak;
  levelValue.textContent = stats.level;

  const xpToNextLevel = 100 * stats.level;
  const percent = Math.min(100, (stats.xp % xpToNextLevel) / xpToNextLevel * 100);
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `Next level in ${Math.max(0, xpToNextLevel - (stats.xp % xpToNextLevel))} XP`;
}

function awardXpAndStreak() {
  stats.xp += 10;
  stats.streak += 1;
  while (stats.xp >= 100 * stats.level) {
    stats.level += 1;
  }
  saveStats();
  updateUI();
}

function showMessage(text, isGood = true) {
  messageBox.textContent = text;
  messageBox.style.background = isGood ? '#e9f7ef' : '#fdecec';
  messageBox.style.color = isGood ? '#2c7a4b' : '#b54848';
}

function convertValue() {
  const rawValue = valueInput.value.trim();

  if (!rawValue) {
    showMessage('Please enter a number first.', false);
    resultValue.textContent = '—';
    resultHint.textContent = 'A number is needed to start your quest.';
    return;
  }

  const numberValue = Number(rawValue);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    showMessage('Please enter a valid positive number.', false);
    resultValue.textContent = '—';
    resultHint.textContent = 'Try again with a number like 5 or 12.';
    return;
  }

  const direction = directionSelect.value;
  let converted;
  let unitName;

  if (direction === 'km-to-mi') {
    converted = numberValue / 1.60934;
    unitName = 'miles';
  } else {
    converted = numberValue * 1.60934;
    unitName = 'kilometers';
  }

  const niceValue = converted.toFixed(2);
  resultValue.textContent = `${niceValue} ${unitName}`;
  resultHint.textContent = `${numberValue} ${direction === 'km-to-mi' ? 'kilometers' : 'miles'} became ${niceValue} ${unitName}.`;

  awardXpAndStreak();
  showMessage(`Awesome! You earned 10 XP and your streak is now ${stats.streak}.`, true);
}

convertBtn.addEventListener('click', convertValue);
valueInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    convertValue();
  }
});

updateUI();
