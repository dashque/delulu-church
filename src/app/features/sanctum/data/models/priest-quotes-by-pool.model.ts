import type { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';

export interface PriestQuotesByPool {
  busy: readonly string[];
  low_spirit: readonly string[];
  [DigitalPriestMood.IDLE]: readonly string[];
  [DigitalPriestMood.PREACHING]: readonly string[];
  [DigitalPriestMood.BLESSING]: readonly string[];
  [DigitalPriestMood.DAMNING]: readonly string[];
}
