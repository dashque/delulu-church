import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';
import type { PriestQuotesByPool } from '@features/sanctum/data/models/priest-quotes-by-pool.model';

export const priestQuotesByPoolFixture: PriestQuotesByPool = {
  busy: ['I am busy!', 'Wait for the decree!'],
  low_spirit: ['Spirit is low.', 'Light candles first!'],
  [DigitalPriestMood.IDLE]: ['Idle quote 1', 'Idle quote 2', 'Idle quote 3'],
  [DigitalPriestMood.PREACHING]: ['Preaching quote 1', 'Preaching quote 2', 'Preaching quote 3'],
  [DigitalPriestMood.BLESSING]: ['Blessing quote 1', 'Blessing quote 2', 'Blessing quote 3'],
  [DigitalPriestMood.DAMNING]: ['Damning quote 1', 'Damning quote 2', 'Damning quote 3'],
};
