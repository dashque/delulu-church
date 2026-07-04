import { describe, expect, it } from 'vitest';

import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';
import type { PriestQuote } from '@features/sanctum/data/models/priest-quote.model';
import { groupPriestQuotesByPool } from '@features/sanctum/helpers/group-priest-quotes-by-pool.helper';

describe('groupPriestQuotesByPool', () => {
  it('должен группировать цитаты по пулам', () => {
    const quoteList: PriestQuote[] = [
      { lang: 'en', pool: DigitalPriestMood.IDLE, text: 'One' },
      { lang: 'en', pool: 'busy', text: 'Busy' },
    ];
    const groupedQuotes = groupPriestQuotesByPool(quoteList);

    expect(groupedQuotes.busy).toEqual(['Busy']);
    expect(groupedQuotes[DigitalPriestMood.IDLE]).toEqual(['One']);
  });
});
