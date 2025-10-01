import GameEngine from './gameEngine.js';
import { applyTranslations } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  const engine = new GameEngine({ root: document.body });
  engine.generate(true);
});
