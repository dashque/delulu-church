import { vi } from 'vitest';

import type { PriestQuotesByPool } from '@features/sanctum/data/models/priest-quotes-by-pool.model';
import { priestQuotesByPoolFixture } from '@features/sanctum/fixtures/priest-quotes-by-pool.fixture';
import type { PriestQuotesService } from '@features/sanctum/services/priest-quotes.service';

export const priestQuotesServiceMock = {
  getQuotesByPool: vi.fn(() => priestQuotesByPoolFixture),
} as const satisfies Pick<PriestQuotesService, 'getQuotesByPool'>;

priestQuotesServiceMock.getQuotesByPool.mockReturnValue(priestQuotesByPoolFixture satisfies PriestQuotesByPool);
