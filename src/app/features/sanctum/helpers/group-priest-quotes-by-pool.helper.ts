import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';
import type { PriestQuote } from '@features/sanctum/data/models/priest-quote.model';
import type { PriestQuotesByPool } from '@features/sanctum/data/models/priest-quotes-by-pool.model';

const EMPTY_PRIEST_QUOTES_BY_POOL: PriestQuotesByPool = {
  busy: [],
  low_spirit: [],
  [DigitalPriestMood.IDLE]: [],
  [DigitalPriestMood.PREACHING]: [],
  [DigitalPriestMood.BLESSING]: [],
  [DigitalPriestMood.DAMNING]: [],
};

export function groupPriestQuotesByPool(quoteList: readonly PriestQuote[]): PriestQuotesByPool {
  const groupedQuotes: PriestQuotesByPool = {
    busy: [],
    low_spirit: [],
    [DigitalPriestMood.IDLE]: [],
    [DigitalPriestMood.PREACHING]: [],
    [DigitalPriestMood.BLESSING]: [],
    [DigitalPriestMood.DAMNING]: [],
  };

  for (const quote of quoteList) {
    groupedQuotes[quote.pool] = [...groupedQuotes[quote.pool], quote.text];
  }

  return groupedQuotes;
}

export function createEmptyPriestQuotesByPool(): PriestQuotesByPool {
  return { ...EMPTY_PRIEST_QUOTES_BY_POOL };
}
