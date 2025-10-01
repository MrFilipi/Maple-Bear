import assert from 'node:assert/strict';
import { describeTime, generateTime } from './gameEngine.js';

function minutesOnly(times, predicate) {
  for (let i = 0; i < 200; i += 1) {
    const time = generateTime(times);
    if (!predicate(time.minutes)) {
      return false;
    }
  }
  return true;
}

// Core mapping tests
{
  const quarterPast = describeTime({ hours: 3, minutes: 15 });
  assert.equal(quarterPast.english, 'a quarter past three');
  assert(quarterPast.englishNormalized.has('a quarter past three'));
  assert(quarterPast.numericNormalized.has('3:15'));
  assert(quarterPast.portugueseNormalized.has('tres e quinze'));
}

{
  const halfPast = describeTime({ hours: 3, minutes: 30 });
  assert.equal(halfPast.english, 'half past three');
  assert(halfPast.englishNormalized.has('half past three'));
  assert(halfPast.portugueseNormalized.has('tres e meia'));
  assert.equal(halfPast.hintType, 'half');
}

{
  const twentyTo = describeTime({ hours: 8, minutes: 40 });
  assert.equal(twentyTo.english, 'twenty to nine');
  assert(twentyTo.portugueseNormalized.has('faltam vinte para as nove'));
  assert(twentyTo.ability.h3);
}

{
  const midnight = describeTime({ hours: 12, minutes: 0 });
  assert.equal(midnight.english, 'twelve o’clock');
  assert(midnight.portugueseNormalized.has('doze em ponto'));
  assert(midnight.ability.h1);
}

// Difficulty generation tests
assert(minutesOnly('easy', (minute) => minute % 5 === 0 && minute <= 30));
assert(minutesOnly('medium', (minute) => minute % 5 === 0));
assert(minutesOnly('hard', (minute) => minute >= 0 && minute < 60));

console.log('All engine tests passed.');
