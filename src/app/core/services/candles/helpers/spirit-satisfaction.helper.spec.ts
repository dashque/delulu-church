import { describe, expect, it } from 'vitest';

import {
  SPIRIT_SATISFACTION_DECAY_INTERVAL_MS,
  SPIRIT_SATISFACTION_DECAY_STEP,
} from '@core/services/candles/constants/spirit-satisfaction.config';
import {
  calculateDecayedSpiritSatisfaction,
  createSpiritSatisfactionFromCounts,
  decreaseSpiritSatisfaction,
  increaseSpiritSatisfaction,
  resolveSpiritSatisfaction,
} from '@core/services/candles/helpers/spirit-satisfaction.helper';
import { createEmptyCandleCounts } from '@core/services/candles/helpers/create-empty-candle-counts.helper';

describe('spiritSatisfaction helpers', () => {
  it('должен создавать начальный уровень из количества подношений', () => {
    expect(
      createSpiritSatisfactionFromCounts(
        {
          ...createEmptyCandleCounts(),
          deploy: 4,
        },
        1_000
      )
    ).toEqual({ level: 20, updatedAt: 1_000 });
  });

  it('должен уменьшать уровень за прошедшие интервалы затухания', () => {
    const spiritSatisfaction = { level: 80, updatedAt: 0 };
    const now = SPIRIT_SATISFACTION_DECAY_INTERVAL_MS * 3;

    expect(calculateDecayedSpiritSatisfaction(spiritSatisfaction, now)).toEqual({
      level: 80 - SPIRIT_SATISFACTION_DECAY_STEP * 3,
      updatedAt: SPIRIT_SATISFACTION_DECAY_INTERVAL_MS * 3,
    });
  });

  it('не должен опускать уровень ниже нуля при затухании', () => {
    const spiritSatisfaction = { level: 10, updatedAt: 0 };
    const now = SPIRIT_SATISFACTION_DECAY_INTERVAL_MS * 200;

    expect(calculateDecayedSpiritSatisfaction(spiritSatisfaction, now)).toEqual({
      level: 0,
      updatedAt: SPIRIT_SATISFACTION_DECAY_INTERVAL_MS * 10,
    });
  });

  it('должен использовать сохранённое состояние при resolve', () => {
    const storedSpiritSatisfaction = { level: 60, updatedAt: 0 };
    const now = SPIRIT_SATISFACTION_DECAY_INTERVAL_MS * 2;

    expect(resolveSpiritSatisfaction(storedSpiritSatisfaction, createEmptyCandleCounts(), now)).toEqual({
      level: 60 - SPIRIT_SATISFACTION_DECAY_STEP * 2,
      updatedAt: SPIRIT_SATISFACTION_DECAY_INTERVAL_MS * 2,
    });
  });

  it('должен увеличивать и уменьшать уровень с обновлением метки времени', () => {
    const spiritSatisfaction = { level: 50, updatedAt: 100 };

    expect(increaseSpiritSatisfaction(spiritSatisfaction, 5, 200)).toEqual({ level: 55, updatedAt: 200 });
    expect(decreaseSpiritSatisfaction(spiritSatisfaction, 1, 300)).toEqual({ level: 49, updatedAt: 300 });
  });
});
