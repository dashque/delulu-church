import { BLESSING_LEVEL_STEP } from '@core/services/candles/constants/blessing-level-step';
import {
  SPIRIT_SATISFACTION_DECAY_INTERVAL_MS,
  SPIRIT_SATISFACTION_DECAY_STEP,
} from '@core/services/candles/constants/spirit-satisfaction.config';
import type { CandleCounts } from '@core/services/candles/models/candle-counts.model';
import type { SpiritSatisfaction } from '@core/services/candles/models/spirit-satisfaction.model';

export function createEmptySpiritSatisfaction(now = Date.now()): SpiritSatisfaction {
  return { level: 0, updatedAt: now };
}

export function createSpiritSatisfactionFromCounts(candleCounts: CandleCounts, now = Date.now()): SpiritSatisfaction {
  const totalOfferings = Object.values(candleCounts).reduce((total, count) => total + count, 0);

  return {
    level: Math.min(100, totalOfferings * BLESSING_LEVEL_STEP),
    updatedAt: now,
  };
}

export function parseSpiritSatisfaction(data: Record<string, unknown>): SpiritSatisfaction | null {
  const level = data['spiritSatisfaction'];
  const updatedAt = data['spiritSatisfactionUpdatedAt'];

  if (typeof level !== 'number' || typeof updatedAt !== 'number') {
    return null;
  }

  return { level, updatedAt };
}

export function resolveSpiritSatisfaction(
  storedSpiritSatisfaction: SpiritSatisfaction | null,
  candleCounts: CandleCounts,
  now = Date.now()
): SpiritSatisfaction {
  if (!storedSpiritSatisfaction) {
    return createSpiritSatisfactionFromCounts(candleCounts, now);
  }

  return calculateDecayedSpiritSatisfaction(storedSpiritSatisfaction, now);
}

export function calculateDecayedSpiritSatisfaction(
  spiritSatisfaction: SpiritSatisfaction,
  now = Date.now()
): SpiritSatisfaction {
  const { level, updatedAt } = spiritSatisfaction;
  const elapsedMs = Math.max(0, now - updatedAt);
  const elapsedDecaySteps = Math.floor(elapsedMs / SPIRIT_SATISFACTION_DECAY_INTERVAL_MS);

  if (elapsedDecaySteps <= 0) {
    return spiritSatisfaction;
  }

  const maxDecaySteps = Math.ceil(level / SPIRIT_SATISFACTION_DECAY_STEP);
  const appliedDecaySteps = Math.min(elapsedDecaySteps, maxDecaySteps);

  return {
    level: Math.max(0, level - appliedDecaySteps * SPIRIT_SATISFACTION_DECAY_STEP),
    updatedAt: updatedAt + appliedDecaySteps * SPIRIT_SATISFACTION_DECAY_INTERVAL_MS,
  };
}

export function increaseSpiritSatisfaction(
  spiritSatisfaction: SpiritSatisfaction,
  step = BLESSING_LEVEL_STEP,
  now = Date.now()
): SpiritSatisfaction {
  return {
    level: Math.min(100, spiritSatisfaction.level + step),
    updatedAt: now,
  };
}

export function decreaseSpiritSatisfaction(
  spiritSatisfaction: SpiritSatisfaction,
  step = SPIRIT_SATISFACTION_DECAY_STEP,
  now = Date.now()
): SpiritSatisfaction {
  return {
    level: Math.max(0, spiritSatisfaction.level - step),
    updatedAt: now,
  };
}
