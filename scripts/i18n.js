const STORAGE_KEY = 'clockquest_language';
const storage = typeof localStorage !== 'undefined'
  ? localStorage
  : {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };

const translations = {
  pt: {
    brand: 'ClockQuest',
    ui: {
      language: 'Idioma',
      difficulty: 'Dificuldade',
      highContrast: 'Alto contraste',
      showMinutes: 'Mostrar minutos',
      highlightPointers: 'Realçar ponteiros',
      answerMode: 'Modo de resposta:',
      prompt: 'Qual é a hora?',
      generate: 'Gerar hora',
      check: 'Conferir resposta',
      skip: 'Pular',
      hint: 'Dica',
      confirmPT: 'Certo em PT! Tente agora em inglês.',
      alreadySolved: 'Você já acertou este desafio. Gere outro!',
      needGenerate: 'Gere uma hora para começar.',
      enterName: 'Como quer aparecer no ranking?',
      saved: 'Progresso salvo!',
      timerDone: 'Tempo esgotado!',
      challengeOver: 'Fim do desafio!',
      attemptLeft: 'Tentativas restantes: {{tries}}',
      minuteNumbersOn: 'Minutos visíveis.',
      minuteNumbersOff: 'Minutos ocultos.',
      contrastOn: 'Modo alto contraste ativo.',
      contrastOff: 'Modo alto contraste desativado.',
      highlightHour: 'Ponteiro das horas em destaque.',
      highlightMinute: 'Ponteiro dos minutos em destaque.',
      highlightOff: 'Realce desativado.',
      tutorialCta: 'Abrir tutorial',
      comboBoost: 'Combo +{{combo}}! Continue assim!',
      xpGain: '+{{xp}} XP',
      lostLife: 'Perdeu uma vida. Respire fundo e tente de novo!'
    },
    modes: {
      learn: 'Aprender',
      practice: 'Praticar',
      challenge: 'Desafio'
    },
    inputs: {
      multiple: 'Múltipla escolha',
      typing: 'Digitação',
      drag: 'Arrastar ponteiros',
      typingLabel: 'Digite em EN ou PT',
      typingHint: 'Aceita 3:15, three fifteen, três e quinze…',
      dragHint: 'Arraste os ponteiros para mostrar a hora pedida.'
    },
    stats: {
      lives: 'Vidas',
      stars: 'Estrelas',
      combo: 'Combo',
      xp: 'XP',
      timer: 'Cronômetro',
      skills: 'Habilidades'
    },
    skills: {
      h1: 'H1: horas x minutos',
      h2: 'H2: past / half past',
      h3: 'H3: to',
      h4: 'H4: palavra ↔ relógio'
    },
    challenge: {
      leaderboard: 'Ranking do desafio',
      clearScores: 'Limpar',
      report: 'Relatório',
      newRecord: 'Novo recorde! 🎉',
      timer: '90 segundos',
      askName: 'Digite um apelido para o ranking:'
    },
    tutorial: {
      back: 'Voltar',
      next: 'Próximo',
      done: 'Começar',
      steps: [
        {
          title: 'Bem-vindo ao ClockQuest!',
          body:
            'Neste mundo, cada número marca 5 minutos. Observe como o ponteiro pequeno marca as horas e o grande mostra os minutos.'
        },
        {
          title: 'past e half past',
          body:
            'De 1 a 29 minutos usamos past. Quando o ponteiro dos minutos chega no 6, dizemos half past (e meia).'
        },
        {
          title: 'to: faltam X para Y',
          body:
            'Dos 31 aos 59 minutos contamos quanto falta para a próxima hora. Ex.: 8:40 = twenty to nine (faltam 20 para as 9).'
        },
        {
          title: 'Hora de praticar!',
          body:
            'Gire os ponteiros para experimentar. O feedback te guia a cada passo. Bora jogar!'
        }
      ]
    },
    feedback: {
      correct: 'Mandou bem! {{text}}',
      correctEnglish: 'Mandou bem! {{text}} em inglês.',
      correctDrag: 'Ótimo! Você montou {{text}} certinho.',
      correctChallenge: 'Combo ativo! +{{points}} pontos.',
      wrong: 'Quase! Reveja os ponteiros e tente de novo.',
      wrongHint: 'Falta pouco! Veja a dica e tente novamente.',
      skipped: 'Tudo bem pular. Nova hora chegando!',
      challengeOver: 'Tempo! Você fez {{score}} pontos.'
    },
    hints: {
      past: 'Usamos “past” para minutos de 1 a 30. {{minutes}} minutos após as {{hour}}.',
      half: 'Half past marca 30 minutos. Meio caminho da próxima hora!',
      to: 'Usamos “to” para {{minutes}} minutos antes das {{nextHour}}.',
      oclock: 'Quando é hora cheia dizemos “o’clock”.'
    },
    footer: {
      cta: 'Pronto para publicar?'
    }
  },
  en: {
    brand: 'ClockQuest',
    ui: {
      language: 'Language',
      difficulty: 'Difficulty',
      highContrast: 'High contrast',
      showMinutes: 'Show minutes',
      highlightPointers: 'Highlight hands',
      answerMode: 'Answer mode:',
      prompt: 'What time is it?',
      generate: 'Generate time',
      check: 'Check answer',
      skip: 'Skip',
      hint: 'Hint',
      confirmPT: 'Correct in PT! Try it in English now.',
      alreadySolved: 'You already solved this one. Generate a new quest!',
      needGenerate: 'Generate a time to begin.',
      enterName: 'How should we call you on the leaderboard?',
      saved: 'Progress saved!',
      timerDone: 'Time is up!',
      challengeOver: 'Challenge finished!',
      attemptLeft: 'Attempts left: {{tries}}',
      minuteNumbersOn: 'Minute numbers shown.',
      minuteNumbersOff: 'Minute numbers hidden.',
      contrastOn: 'High contrast mode on.',
      contrastOff: 'High contrast mode off.',
      highlightHour: 'Hour hand highlighted.',
      highlightMinute: 'Minute hand highlighted.',
      highlightOff: 'Highlight removed.',
      tutorialCta: 'Open tutorial',
      comboBoost: 'Combo +{{combo}}! Keep going!',
      xpGain: '+{{xp}} XP',
      lostLife: 'Life lost. Take a deep breath and try again!'
    },
    modes: {
      learn: 'Learn',
      practice: 'Practice',
      challenge: 'Challenge'
    },
    inputs: {
      multiple: 'Multiple choice',
      typing: 'Typing',
      drag: 'Drag the hands',
      typingLabel: 'Type in EN or PT',
      typingHint: 'Accepts 3:15, three fifteen, três e quinze…',
      dragHint: 'Drag the hands to show the requested time.'
    },
    stats: {
      lives: 'Lives',
      stars: 'Stars',
      combo: 'Combo',
      xp: 'XP',
      timer: 'Timer',
      skills: 'Skills'
    },
    skills: {
      h1: 'H1: hours vs minutes',
      h2: 'H2: past / half past',
      h3: 'H3: to',
      h4: 'H4: words ↔ clock'
    },
    challenge: {
      leaderboard: 'Challenge leaderboard',
      clearScores: 'Clear',
      report: 'Report',
      newRecord: 'New record! 🎉',
      timer: '90 seconds',
      askName: 'Choose a nickname for the leaderboard:'
    },
    tutorial: {
      back: 'Back',
      next: 'Next',
      done: 'Let’s play',
      steps: [
        {
          title: 'Welcome to ClockQuest!',
          body:
            'Each number equals five minutes. The short hand tracks the hour while the long hand shows the minutes.'
        },
        {
          title: 'past & half past',
          body:
            'From 1 to 29 minutes we use “past”. When the minute hand lands on 6 we say “half past” (half an hour).'
        },
        {
          title: 'to: counting down',
          body:
            'From 31 to 59 we count how many minutes remain to the next hour. Example: 8:40 = twenty to nine.'
        },
        {
          title: 'Your turn!',
          body:
            'Rotate the hands to experiment. Friendly feedback will guide you. Ready for the quest!'
        }
      ]
    },
    feedback: {
      correct: 'Great! {{text}}',
      correctEnglish: 'Great! {{text}} in English.',
      correctDrag: 'Nice! You set {{text}} perfectly.',
      correctChallenge: 'Combo on! +{{points}} points.',
      wrong: 'Close! Check the hands and try again.',
      wrongHint: 'Almost there! Use the hint and retry.',
      skipped: 'Skipping is fine. New time coming up!',
      challengeOver: 'Time! You scored {{score}} points.'
    },
    hints: {
      past: 'Use “past” for minutes 1 to 30. {{minutes}} minutes past {{hour}}.',
      half: 'Half past marks 30 minutes. Halfway to the next hour!',
      to: 'Use “to” for {{minutes}} minutes to {{nextHour}}.',
      oclock: 'On the hour we say “o’clock”.'
    },
    footer: {
      cta: 'Ready to publish?'
    }
  }
};

let currentLanguage;
const storedLanguage = storage.getItem(STORAGE_KEY);
if (storedLanguage && translations[storedLanguage]) {
  currentLanguage = storedLanguage;
} else if (typeof navigator !== 'undefined' && navigator.language?.startsWith?.('pt')) {
  currentLanguage = 'pt';
} else {
  currentLanguage = 'en';
}
const listeners = new Set();

function resolve(path, lang) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), translations[lang]);
}

function interpolate(template, params = {}) {
  return template.replace(/{{(.*?)}}/g, (_, token) => {
    const key = token.trim();
    return key in params ? params[key] : `{{${key}}}`;
  });
}

export function t(key, params) {
  const value = resolve(key, currentLanguage);
  if (typeof value === 'string') {
    return params ? interpolate(value, params) : value;
  }
  if (Array.isArray(value)) {
    return value;
  }
  return key;
}

export function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLanguage = lang;
  storage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  listeners.forEach((fn) => fn(lang));
}

export function getLanguage() {
  return currentLanguage;
}

export function onLanguageChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function applyTranslations(root = document) {
  const nodes = root.querySelectorAll('[data-i18n]');
  nodes.forEach((node) => {
    const key = node.getAttribute('data-i18n');
    const value = t(key);
    if (typeof value === 'string') {
      node.textContent = value;
    }
  });
}

export function getTutorialSteps() {
  return t('tutorial.steps');
}

// initialize language
if (!translations[currentLanguage]) {
  currentLanguage = 'pt';
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = currentLanguage;
}

export default {
  t,
  setLanguage,
  getLanguage,
  onLanguageChange,
  applyTranslations,
  getTutorialSteps
};
