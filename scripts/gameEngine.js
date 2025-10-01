import Clock from './clock.js';
import {
  t,
  setLanguage,
  getLanguage,
  onLanguageChange,
  applyTranslations,
  getTutorialSteps
} from './i18n.js';
import {
  loadState,
  saveState,
  updateProgress,
  recordChallengeScore,
  clearScores,
  recordLapse,
  saveSettings
} from './store.js';

const numberWords = {
  0: 'twelve',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve'
};

const minuteWords = {
  0: 'o’clock',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
  11: 'eleven',
  12: 'twelve',
  13: 'thirteen',
  14: 'fourteen',
  15: 'a quarter',
  16: 'sixteen',
  17: 'seventeen',
  18: 'eighteen',
  19: 'nineteen',
  20: 'twenty',
  21: 'twenty-one',
  22: 'twenty-two',
  23: 'twenty-three',
  24: 'twenty-four',
  25: 'twenty-five',
  26: 'twenty-six',
  27: 'twenty-seven',
  28: 'twenty-eight',
  29: 'twenty-nine',
  30: 'half'
};

const minutePortuguese = {
  0: 'em ponto',
  1: 'um',
  2: 'dois',
  3: 'três',
  4: 'quatro',
  5: 'cinco',
  6: 'seis',
  7: 'sete',
  8: 'oito',
  9: 'nove',
  10: 'dez',
  11: 'onze',
  12: 'doze',
  13: 'treze',
  14: 'catorze',
  15: 'um quarto',
  16: 'dezesseis',
  17: 'dezessete',
  18: 'dezoito',
  19: 'dezenove',
  20: 'vinte',
  21: 'vinte e um',
  22: 'vinte e dois',
  23: 'vinte e três',
  24: 'vinte e quatro',
  25: 'vinte e cinco',
  26: 'vinte e seis',
  27: 'vinte e sete',
  28: 'vinte e oito',
  29: 'vinte e nove',
  30: 'meia'
};

function pad(value) {
  return String(value).padStart(2, '0');
}

function to12(hour) {
  const normalized = ((hour % 12) + 12) % 12;
  return normalized === 0 ? 12 : normalized;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9: ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeNumeric(input) {
  return input.replace(/h/i, ':').replace(/\s+/g, '').toLowerCase();
}

function describeTime(time) {
  const hours12 = to12(time.hours);
  const hourWord = numberWords[hours12];
  const minute = time.minutes;
  const minuteWord = minuteWords[minute] || minuteWords[minute];
  const nextHour = to12(hours12 + 1);
  const nextHourWord = numberWords[nextHour];
  const numeric = [`${hours12}:${pad(minute)}`, `${pad(hours12)}:${pad(minute)}`];
  const numericPT = [`${hours12}h${pad(minute)}`, `${pad(hours12)}h${pad(minute)}`];

  let english;
  let englishVariants = [];
  let portuguese;
  let portugueseVariants = [];
  let hintType = 'past';

  if (minute === 0) {
    english = `${hourWord} o’clock`;
    englishVariants = [english, `${hourWord} ${minuteWords[0]}`, `${hours12} o'clock`, `${hours12} o’clock`];
    portuguese = `${numberToPortuguese(hours12)} em ponto`;
    portugueseVariants = [portuguese, `${numberToPortuguese(hours12)} horas`];
    hintType = 'oclock';
  } else if (minute === 15) {
    english = `a quarter past ${hourWord}`;
    englishVariants = [english, `quarter past ${hourWord}`, `${hourWord} fifteen`, `${hours12}:${pad(minute)}`];
    portuguese = `${numberToPortuguese(hours12)} e quinze`;
    portugueseVariants = [portuguese, `${numberToPortuguese(hours12)} e um quarto`];
  } else if (minute === 30) {
    english = `half past ${hourWord}`;
    englishVariants = [english, `${hourWord} thirty`, `${hours12}:${pad(minute)}`];
    portuguese = `${numberToPortuguese(hours12)} e meia`;
    portugueseVariants = [portuguese];
    hintType = 'half';
  } else if (minute < 30) {
    const valueWord = minuteWords[minute] || `${minuteWords[Math.floor(minute / 10) * 10]}-${minuteWords[minute % 10]}`;
    english = `${valueWord} past ${hourWord}`;
    englishVariants = [
      english,
      `${minuteWords[minute] || minute} past ${hourWord}`,
      `${hourWord} ${minuteWord}`,
      `${hours12}:${pad(minute)}`
    ];
    portuguese = `${numberToPortuguese(hours12)} e ${minutePortuguese[minute] || minute}`;
    portugueseVariants = [portuguese];
  } else {
    const remaining = 60 - minute;
    const remainingWord = minuteWords[remaining] || `${minuteWords[Math.floor(remaining / 10) * 10]}-${minuteWords[remaining % 10]}`;
    english = `${remaining === 15 ? 'a quarter' : remainingWord} to ${nextHourWord}`;
    englishVariants = [
      english,
      `${remainingWord} to ${nextHourWord}`,
      `${nextHourWord} minus ${minuteWords[remaining] || remaining}`,
      `${hours12}:${pad(minute)}`
    ];
    const connector = nextHour === 1 ? 'para a' : 'para as';
    portuguese = `faltam ${minutePortuguese[remaining] || remaining} ${connector} ${numberToPortuguese(nextHour)}`;
    portugueseVariants = [
      portuguese,
      `${numberToPortuguese(nextHour)} menos ${minutePortuguese[remaining] || remaining}`
    ];
    hintType = 'to';
  }

  const ability = {
    h1: true,
    h2: minute > 0 && minute <= 30,
    h3: minute >= 31,
    h4: true
  };

  const englishNormalized = new Set(englishVariants.map((value) => slugify(value)));
  englishNormalized.add(slugify(english));
  const portugueseNormalized = new Set(portugueseVariants.map((value) => slugify(value)));
  const numericNormalized = new Set([...numeric, ...numericPT].map(normalizeNumeric));

  return {
    english,
    englishVariants,
    portuguese,
    portugueseVariants,
    numeric,
    numericPT,
    englishNormalized,
    portugueseNormalized,
    numericNormalized,
    hintType,
    ability
  };
}

function numberToPortuguese(value) {
  const base = {
    1: 'uma',
    2: 'duas',
    3: 'três',
    4: 'quatro',
    5: 'cinco',
    6: 'seis',
    7: 'sete',
    8: 'oito',
    9: 'nove',
    10: 'dez',
    11: 'onze',
    12: 'doze'
  };
  return base[value] || String(value);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTime(difficulty) {
  const hour = randomInt(1, 12);
  if (difficulty === 'easy') {
    const options = [0, 5, 10, 15, 20, 25, 30];
    return { hours: hour, minutes: options[randomInt(0, options.length - 1)] };
  }
  if (difficulty === 'medium') {
    const minute = randomInt(0, 11) * 5;
    return { hours: hour, minutes: minute };
  }
  return { hours: hour, minutes: randomInt(0, 59) };
}

function buildQuestion({ mode, difficulty, inputMode }) {
  const time = generateTime(difficulty);
  const description = describeTime(time);
  const promptText = inputMode === 'drag' ? description.english : formatTimeForPrompt(time);
  const supportText = inputMode === 'drag' ? description.portuguese : description.english;
  const options = inputMode === 'multiple' ? createOptions(time, description, difficulty) : [];
  return {
    time,
    description,
    promptText,
    supportText,
    options,
    mode,
    difficulty,
    inputMode,
    solved: false,
    attempts: 3
  };
}

function formatTimeForPrompt(time) {
  const hours12 = to12(time.hours);
  const minute = pad(time.minutes);
  return `${hours12}:${minute}`;
}

function cloneTime(time) {
  return { hours: time.hours, minutes: time.minutes };
}

function shiftMinutes(time, delta) {
  const total = (time.hours % 12) * 60 + time.minutes + delta;
  const normalized = (total + 720) % 720;
  return { hours: Math.floor(normalized / 60) || 12, minutes: normalized % 60 };
}

function createOptions(time, description, difficulty) {
  const options = new Map();
  options.set(slugify(description.english), description.english);

  while (options.size < 3) {
    const roll = Math.random();
    let candidate;
    if (roll < 0.5) {
      const delta = Math.random() > 0.5 ? 5 : -5;
      candidate = shiftMinutes(time, delta);
    } else {
      if (description.hintType === 'to') {
        candidate = shiftMinutes(time, 5);
      } else {
        candidate = shiftMinutes(time, -5);
      }
    }
    const desc = describeTime(candidate);
    options.set(slugify(desc.english), desc.english);
  }

  const shuffled = Array.from(options.values()).sort(() => Math.random() - 0.5);
  return shuffled.map((text) => ({ text, value: slugify(text), isCorrect: slugify(text) === slugify(description.english) }));
}

function secondsToClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad(minutes)}:${pad(seconds)}`;
}

export class GameEngine {
  constructor({ root }) {
    this.root = root;
    this.state = loadState();
    this.mode = 'learn';
    this.inputMode = 'multiple';
    this.difficulty = this.state.settings?.difficulty || 'easy';
    this.clock = new Clock(document.getElementById('analogClock'));
    this.currentQuestion = null;
    this.timer = null;
    this.timeLeft = 90;
    this.score = 0;
    this.combo = 0;
    this.seenTutorial = false;
    this.bindUI();
    this.restoreSettings();
    this.updateStatus();
    this.attachLanguage();
    this.updateLeaderboard();
    this.updateReport();
    if (this.mode === 'learn') {
      this.openTutorial();
      this.seenTutorial = true;
    }
    this.clock.on('change', () => {
      if (this.inputMode === 'drag') {
        this.feedback(t('ui.attemptLeft', { tries: this.currentQuestion?.attempts ?? 3 }));
      }
    });
    this.clock.on('dragend', () => {
      if (this.inputMode === 'drag' && this.mode !== 'challenge') {
        this.autoCheck();
      }
    });
  }

  bindUI() {
    this.feedbackNode = document.getElementById('feedback');
    this.promptText = document.getElementById('promptText');
    this.promptSupport = document.getElementById('promptSupport');
    this.multipleChoice = document.getElementById('multipleChoice');
    this.typingField = document.getElementById('typingField');
    this.typingInput = document.getElementById('typingInput');
    this.dragHint = document.getElementById('dragHint');
    this.generateBtn = document.getElementById('generateBtn');
    this.checkBtn = document.getElementById('checkBtn');
    this.skipBtn = document.getElementById('skipBtn');
    this.hintBtn = document.getElementById('hintBtn');
    this.languageSelect = document.getElementById('languageSelect');
    this.difficultySelect = document.getElementById('difficultySelect');
    this.modeButtons = Array.from(document.querySelectorAll('.mode-button'));
    this.inputButtons = Array.from(document.querySelectorAll('.input-mode-button'));
    this.livesDisplay = document.getElementById('livesDisplay');
    this.starsDisplay = document.getElementById('starsDisplay');
    this.comboDisplay = document.getElementById('comboDisplay');
    this.xpDisplay = document.getElementById('xpDisplay');
    this.timerDisplay = document.getElementById('timerDisplay');
    this.skillBars = {
      h1: document.getElementById('skillH1'),
      h2: document.getElementById('skillH2'),
      h3: document.getElementById('skillH3'),
      h4: document.getElementById('skillH4')
    };
    this.leaderboardList = document.getElementById('leaderboardList');
    this.reportList = document.getElementById('reportList');
    this.clearScoresBtn = document.getElementById('clearScores');
    this.contrastToggle = document.getElementById('contrastToggle');
    this.minuteToggle = document.getElementById('minuteToggle');
    this.highlightToggle = document.getElementById('highlightToggle');

    this.generateBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.generate();
    });
    this.checkBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.checkAnswer();
    });
    this.skipBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.skip();
    });
    this.hintBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.showHint();
    });
    this.clearScoresBtn.addEventListener('click', () => {
      this.state = clearScores(this.state);
      this.updateLeaderboard();
    });

    this.languageSelect.value = getLanguage();
    this.languageSelect.addEventListener('change', (event) => {
      setLanguage(event.target.value);
    });

    this.difficultySelect.value = this.difficulty;
    this.difficultySelect.addEventListener('change', (event) => {
      this.difficulty = event.target.value;
      this.state = saveSettings(this.state, { difficulty: this.difficulty });
    });

    this.modeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.setMode(button.dataset.mode);
      });
    });

    this.inputButtons.forEach((button) => {
      button.addEventListener('click', () => this.setInputMode(button.dataset.input));
    });

    this.multipleChoice.addEventListener('click', (event) => {
      if (event.target.closest('button')) {
        const choice = event.target.closest('button');
        this.multipleChoice
          .querySelectorAll('.choice-button')
          .forEach((btn) => {
            btn.classList.remove('is-selected');
            btn.setAttribute('aria-pressed', 'false');
          });
        choice.classList.add('is-selected');
        choice.setAttribute('aria-pressed', 'true');
      }
    });
  }

  attachLanguage() {
    applyTranslations();
    onLanguageChange(() => {
      applyTranslations();
      this.updateUIAfterLanguage();
    });
  }

  restoreSettings() {
    const { settings } = this.state;
    if (settings?.contrast) {
      document.body.classList.add('is-high-contrast');
      this.contrastToggle.checked = true;
      this.clock.setHighContrast(true);
    }
    if (settings?.showMinutes) {
      this.clock.toggleMinuteNumbers(true);
      this.minuteToggle.checked = true;
    }
    this.highlightState = settings?.highlight || 'none';
    if (this.highlightState !== 'none') {
      this.clock.setHighlight(this.highlightState);
      this.highlightToggle.classList.add('is-active');
      this.highlightToggle.setAttribute('aria-pressed', 'true');
    } else {
      this.highlightToggle.setAttribute('aria-pressed', 'false');
    }

    this.contrastToggle.addEventListener('change', () => {
      document.body.classList.toggle('is-high-contrast', this.contrastToggle.checked);
      this.clock.setHighContrast(this.contrastToggle.checked);
      this.state = saveSettings(this.state, { contrast: this.contrastToggle.checked });
      this.feedback(t(this.contrastToggle.checked ? 'ui.contrastOn' : 'ui.contrastOff'));
    });

    this.minuteToggle.addEventListener('change', () => {
      this.clock.toggleMinuteNumbers(this.minuteToggle.checked);
      this.state = saveSettings(this.state, { showMinutes: this.minuteToggle.checked });
      this.feedback(
        this.minuteToggle.checked ? t('ui.minuteNumbersOn') : t('ui.minuteNumbersOff')
      );
    });

    this.highlightToggle.addEventListener('click', () => {
      this.highlightState = this.nextHighlightState(this.highlightState);
      const isActive = this.highlightState !== 'none';
      this.clock.setHighlight(this.highlightState);
      this.highlightToggle.classList.toggle('is-active', isActive);
      this.highlightToggle.setAttribute('aria-pressed', String(isActive));
      this.state = saveSettings(this.state, { highlight: this.highlightState });
      if (this.highlightState === 'hour') this.feedback(t('ui.highlightHour'));
      else if (this.highlightState === 'minute') this.feedback(t('ui.highlightMinute'));
      else this.feedback(t('ui.highlightOff'));
    });
  }

  nextHighlightState(current) {
    if (current === 'hour') return 'minute';
    if (current === 'minute') return 'none';
    return 'hour';
  }

  getChallengeDifficulty() {
    if (this.score >= 80 || this.state.skills.h4 >= 60) return 'hard';
    if (this.score >= 40 || this.state.skills.h2 >= 40) return 'medium';
    return 'easy';
  }

  pickChallengeInput(difficulty) {
    if (difficulty === 'easy') return 'multiple';
    if (difficulty === 'medium') {
      return Math.random() > 0.5 ? 'multiple' : 'typing';
    }
    const options = ['typing', 'drag'];
    return options[Math.floor(Math.random() * options.length)];
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.modeButtons.forEach((btn) => {
      const isActive = btn.dataset.mode === mode;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-checked', String(isActive));
    });
    if (mode === 'challenge') {
      this.startChallenge();
    } else {
      this.stopChallenge();
      this.resetLives();
      if (mode === 'learn' && !this.seenTutorial) {
        this.openTutorial();
        this.seenTutorial = true;
      }
    }
    this.generate(true);
  }

  setInputMode(mode, { silent = false } = {}) {
    this.inputMode = mode;
    this.inputButtons.forEach((btn) => {
      const active = btn.dataset.input === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-checked', String(active));
    });

    this.multipleChoice.classList.toggle('hidden', mode !== 'multiple');
    this.typingField.classList.toggle('hidden', mode !== 'typing');
    this.dragHint.classList.toggle('hidden', mode !== 'drag');
    this.checkBtn.disabled = mode === 'drag';

    if (mode === 'drag') {
      this.clock.toggleMinuteNumbers(true);
    } else {
      const show = this.state.settings?.showMinutes;
      this.clock.toggleMinuteNumbers(Boolean(show));
    }

    if (this.currentQuestion && !silent) {
      this.generate(true);
    }
  }

  startChallenge() {
    this.timeLeft = 90;
    this.score = 0;
    this.resetLives();
    this.updateStatus();
    this.timerDisplay.textContent = secondsToClock(this.timeLeft);
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.endChallenge();
      }
      this.timerDisplay.textContent = secondsToClock(this.timeLeft);
    }, 1000);
  }

  stopChallenge() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.timerDisplay.textContent = '--:--';
    }
  }

  endChallenge() {
    this.stopChallenge();
    this.feedback(t('feedback.challengeOver', { score: this.score }));
    const asker = typeof prompt === 'function' ? prompt : () => '';
    const answer = asker(t('challenge.askName')) || '';
    const nickname = answer.trim() || t('ui.enterName');
    const entry = {
      name: nickname || 'Hero',
      score: this.score,
      date: new Date().toISOString()
    };
    this.state = recordChallengeScore(this.state, entry);
    this.updateLeaderboard();
    this.updateReport();
  }

  resetLives() {
    this.state.lives = 3;
    this.state.combo = 0;
    saveState(this.state);
    this.updateStatus();
  }

  generate(auto = false) {
    if (!auto && this.mode === 'challenge' && this.timeLeft <= 0) {
      this.feedback(t('ui.timerDone'));
      return;
    }
    let difficulty = this.difficulty;
    let inputMode = this.inputMode;
    if (this.mode === 'challenge') {
      difficulty = this.getChallengeDifficulty();
      inputMode = this.pickChallengeInput(difficulty);
      this.setInputMode(inputMode, { silent: true });
    }
    this.currentQuestion = buildQuestion({
      mode: this.mode,
      difficulty,
      inputMode
    });
    this.renderQuestion();
    this.feedback(t('ui.attemptLeft', { tries: this.currentQuestion.attempts }));
  }

  renderQuestion() {
    if (!this.currentQuestion) return;
    const { time, description, options } = this.currentQuestion;
    if (this.inputMode === 'drag') {
      this.clock.setTime(12, 0);
    } else {
      this.clock.setTime(time.hours, time.minutes);
    }
    this.promptText.textContent = this.currentQuestion.promptText;
    this.promptSupport.textContent = this.currentQuestion.supportText;

    if (this.inputMode === 'multiple') {
      this.multipleChoice.innerHTML = '';
      options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'choice-button';
        button.dataset.value = option.value;
        button.setAttribute('aria-pressed', 'false');
        button.textContent = `${String.fromCharCode(65 + index)}. ${option.text}`;
        this.multipleChoice.append(button);
      });
    }

    if (this.inputMode === 'typing') {
      this.typingInput.value = '';
      this.typingInput.focus();
    }
  }

  autoCheck() {
    if (!this.currentQuestion || this.currentQuestion.solved) return;
    const diff = this.differenceFromTarget();
    if (diff <= 2) {
      this.resolveAnswer({ correct: true, language: 'drag' });
    }
  }

  differenceFromTarget() {
    const actual = this.clock.getRoundedTime(1);
    const target = this.currentQuestion.time;
    const actualTotal = (actual.hours % 12) * 60 + actual.minutes;
    const targetTotal = (target.hours % 12) * 60 + target.minutes;
    return Math.abs(actualTotal - targetTotal);
  }

  checkAnswer() {
    if (!this.currentQuestion) {
      this.feedback(t('ui.needGenerate'));
      return;
    }
    if (this.currentQuestion.solved) {
      this.feedback(t('ui.alreadySolved'));
      return;
    }
    let result = { correct: false };
    if (this.inputMode === 'multiple') {
      const selected = this.multipleChoice.querySelector('.choice-button.is-selected');
      if (!selected) {
        this.feedback(t('ui.needGenerate'));
        return;
      }
      const value = selected.dataset.value;
      result.correct = value === slugify(this.currentQuestion.description.english);
      result.language = 'en';
    } else if (this.inputMode === 'typing') {
      const answer = this.typingInput.value.trim();
      if (!answer) {
        this.feedback(t('ui.needGenerate'));
        return;
      }
      result = this.evaluateTypedAnswer(answer);
    } else {
      result.correct = this.differenceFromTarget() <= 2;
      result.language = 'drag';
    }

    this.resolveAnswer(result);
  }

  evaluateTypedAnswer(answer) {
    const numeric = normalizeNumeric(answer);
    const normalized = slugify(answer);
    const { description } = this.currentQuestion;
    if (description.numericNormalized.has(numeric)) {
      return { correct: true, language: 'numeric' };
    }
    if (description.englishNormalized.has(normalized)) {
      return { correct: true, language: 'en' };
    }
    if (description.portugueseNormalized.has(normalized)) {
      return { correct: true, language: 'pt' };
    }
    return { correct: false };
  }

  resolveAnswer(result) {
    if (!this.currentQuestion) return;
    if (result.correct) {
      this.currentQuestion.solved = true;
      this.onCorrect(result.language);
    } else {
      this.onMistake();
    }
  }

  onCorrect(language) {
    const { description } = this.currentQuestion;
    const xpGain = this.currentQuestion.attempts * 4;
    const newCombo = this.state.combo + 1;
    this.state = updateProgress(this.state, {
      xp: xpGain,
      stars: this.currentQuestion.attempts === 3 ? 1 : 0,
      combo: newCombo,
      lives: this.state.lives,
      skills: this.calculateSkillGains(description.ability)
    });
    this.combo = newCombo;
    if (this.mode === 'challenge') {
      const bonus = this.currentQuestion.attempts === 3 ? 5 : 0;
      const points = 10 + bonus;
      this.score += points;
      this.feedback(t('feedback.correctChallenge', { points }));
    } else if (language === 'pt') {
      this.feedback(t('ui.confirmPT'));
    } else if (language === 'drag') {
      this.feedback(t('feedback.correctDrag', { text: description.english }));
    } else if (language === 'numeric') {
      this.feedback(t('feedback.correct', { text: description.english }));
    } else {
      this.feedback(t('feedback.correctEnglish', { text: description.english }));
    }
    this.updateStatus();
    saveState(this.state);
    this.updateReport();
    if (this.mode !== 'challenge') {
      setTimeout(() => this.generate(true), 800);
    }
  }

  calculateSkillGains(ability) {
    const gains = {};
    if (ability.h1) gains.h1 = 2;
    if (ability.h2) gains.h2 = 2;
    if (ability.h3) gains.h3 = 2;
    if (ability.h4) gains.h4 = 2;
    return gains;
  }

  onMistake() {
    this.currentQuestion.attempts -= 1;
    if (this.currentQuestion.attempts <= 0) {
      this.feedback(t('feedback.wrongHint'));
      this.state.lives = Math.max(0, this.state.lives - 1);
      this.state.combo = 0;
      if (this.mode === 'challenge') {
        this.score = Math.max(0, this.score - 1);
      }
      const minuteRange = this.getMinuteRange(this.currentQuestion.time.minutes);
      this.state = recordLapse(this.state, minuteRange);
      saveState(this.state);
      if (this.state.lives === 0 && this.mode === 'challenge') {
        this.endChallenge();
        return;
      }
      this.generate(true);
    } else {
      if (this.currentQuestion.attempts === 1) {
        this.showHint(true);
      }
      this.feedback(t('feedback.wrong'));
    }
    this.updateStatus();
  }

  getMinuteRange(minutes) {
    if (minutes <= 5) return '00-05';
    if (minutes <= 10) return '06-10';
    if (minutes <= 15) return '11-15';
    if (minutes <= 20) return '16-20';
    if (minutes <= 30) return '21-30';
    if (minutes <= 40) return '31-40';
    if (minutes <= 50) return '41-50';
    return '51-59';
  }

  skip() {
    if (!this.currentQuestion) return;
    this.feedback(t('feedback.skipped'));
    this.state.combo = 0;
    saveState(this.state);
    this.generate(true);
    this.updateStatus();
  }

  showHint(force = false) {
    if (!this.currentQuestion) return;
    if (!force && this.currentQuestion.attempts > 1) {
      this.feedback(t('feedback.wrongHint'));
      return;
    }
    const { time, description } = this.currentQuestion;
    const { minutes } = time;
    let message;
    if (minutes === 0) {
      message = t('hints.oclock');
      this.clock.setHighlight('hour');
    } else if (minutes === 30) {
      message = t('hints.half');
      this.clock.setHighlight('minute');
    } else if (minutes <= 30) {
      message = t('hints.past', {
        minutes,
        hour: numberToPortuguese(to12(time.hours))
      });
      this.clock.setHighlight('minute');
    } else {
      message = t('hints.to', {
        minutes: 60 - minutes,
        nextHour: numberToPortuguese(to12(time.hours + 1))
      });
      this.clock.setHighlight('hour');
    }
    this.feedback(message);
  }

  updateStatus() {
    this.livesDisplay.dataset.text = '❤'.repeat(this.state.lives) + '♡'.repeat(Math.max(0, 3 - this.state.lives));
    this.starsDisplay.textContent = `${this.state.stars}`;
    this.comboDisplay.textContent = `${this.state.combo}`;
    this.xpDisplay.textContent = `${this.state.xp}`;
    if (this.mode !== 'challenge') {
      this.timerDisplay.textContent = '--:--';
    }
    Object.entries(this.skillBars).forEach(([key, node]) => {
      node.style.width = `${this.state.skills[key]}%`;
    });
    saveState(this.state);
  }

  updateLeaderboard() {
    this.leaderboardList.innerHTML = '';
    (this.state.challenge?.bestScores || []).forEach((entry) => {
      const li = document.createElement('li');
      const date = new Date(entry.date).toLocaleDateString();
      li.textContent = `${entry.name} — ${entry.score} (${date})`;
      this.leaderboardList.append(li);
    });
  }

  updateReport() {
    this.reportList.innerHTML = '';
    const lapses = Object.entries(this.state.lapses || {}).sort((a, b) => b[1] - a[1]);
    if (lapses.length === 0) {
      const dt = document.createElement('dt');
      dt.textContent = '✔';
      const dd = document.createElement('dd');
      dd.textContent = 'Sem lapsos frequentes.';
      this.reportList.append(dt, dd);
      return;
    }
    lapses.slice(0, 4).forEach(([range, count]) => {
      const dt = document.createElement('dt');
      dt.textContent = `${range}`;
      const dd = document.createElement('dd');
      dd.textContent = `${count} erros`;
      this.reportList.append(dt, dd);
    });
  }

  feedback(message) {
    this.feedbackNode.textContent = message;
  }

  openTutorial() {
    const overlay = document.getElementById('tutorial');
    const title = document.getElementById('tutorialTitle');
    const body = document.getElementById('tutorialBody');
    const back = document.getElementById('tutorialBack');
    const next = document.getElementById('tutorialNext');
    const steps = getTutorialSteps();
    let index = 0;
    const render = () => {
      const step = steps[index];
      title.textContent = step.title;
      body.textContent = step.body;
      back.disabled = index === 0;
      next.textContent = index === steps.length - 1 ? t('tutorial.done') : t('tutorial.next');
    };
    const close = () => {
      overlay.classList.add('hidden');
      back.removeEventListener('click', onBack);
      next.removeEventListener('click', onNext);
    };
    const onBack = () => {
      index = Math.max(0, index - 1);
      render();
    };
    const onNext = () => {
      if (index === steps.length - 1) {
        close();
        return;
      }
      index += 1;
      render();
    };
    overlay.classList.remove('hidden');
    back.addEventListener('click', onBack);
    next.addEventListener('click', onNext);
    render();
  }

  skipTutorial() {
    const overlay = document.getElementById('tutorial');
    overlay.classList.add('hidden');
  }

  updateUIAfterLanguage() {
    if (this.currentQuestion) {
      if (this.inputMode === 'drag') {
        this.promptText.textContent = this.currentQuestion.description.english;
        this.promptSupport.textContent = this.currentQuestion.description.portuguese;
      } else {
        this.promptText.textContent = formatTimeForPrompt(this.currentQuestion.time);
        this.promptSupport.textContent = this.currentQuestion.description.english;
      }
    }
    this.updateLeaderboard();
    this.updateReport();
  }
}

export default GameEngine;
export { describeTime, generateTime, formatTimeForPrompt };
