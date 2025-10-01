const STORAGE_KEY = 'clockquest_state';

const storage = typeof localStorage !== 'undefined'
  ? localStorage
  : {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    };

const defaultState = {
  xp: 0,
  stars: 0,
  combo: 0,
  lives: 3,
  skills: {
    h1: 0,
    h2: 0,
    h3: 0,
    h4: 0
  },
  lapses: {},
  challenge: {
    bestScores: []
  },
  settings: {
    contrast: false,
    showMinutes: false,
    highlight: 'none',
    difficulty: 'easy'
  }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

export function loadState() {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);
  try {
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...parsed,
      skills: { ...defaultState.skills, ...parsed.skills },
      settings: { ...defaultState.settings, ...parsed.settings }
    };
  } catch (error) {
    console.warn('Failed to parse state', error);
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  saveState(structuredClone(defaultState));
}

export function updateProgress(state, updates) {
  const next = { ...state };
  if (typeof updates.xp === 'number') {
    next.xp = Math.max(0, next.xp + updates.xp);
  }
  if (typeof updates.stars === 'number') {
    next.stars = Math.max(0, next.stars + updates.stars);
  }
  if (typeof updates.combo === 'number') {
    next.combo = Math.max(0, updates.combo);
  }
  if (typeof updates.lives === 'number') {
    next.lives = clamp(updates.lives, 0, 5);
  }
  if (updates.skills) {
    next.skills = { ...next.skills };
    for (const key of Object.keys(updates.skills)) {
      next.skills[key] = clamp((next.skills[key] || 0) + updates.skills[key], 0, 100);
    }
  }
  return next;
}

export function saveSettings(state, newSettings) {
  const merged = { ...state, settings: { ...state.settings, ...newSettings } };
  saveState(merged);
  return merged;
}

export function recordLapse(state, minuteRange) {
  const lapses = { ...state.lapses };
  lapses[minuteRange] = (lapses[minuteRange] || 0) + 1;
  const next = { ...state, lapses };
  saveState(next);
  return next;
}

export function recordChallengeScore(state, entry) {
  const bestScores = [...(state.challenge?.bestScores || [])];
  bestScores.push(entry);
  bestScores.sort((a, b) => b.score - a.score);
  const trimmed = bestScores.slice(0, 5);
  const next = {
    ...state,
    challenge: {
      ...state.challenge,
      bestScores: trimmed
    }
  };
  saveState(next);
  return next;
}

export function clearScores(state) {
  const next = {
    ...state,
    challenge: {
      ...state.challenge,
      bestScores: []
    }
  };
  saveState(next);
  return next;
}

export function structuredClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default {
  loadState,
  saveState,
  resetState,
  updateProgress,
  recordChallengeScore,
  clearScores,
  recordLapse,
  saveSettings,
  defaultState
};
