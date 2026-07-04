import { signal } from '@angular/core';
import type { MockedObject } from 'vitest';
import { vi } from 'vitest';

import type { CoderQuotesService } from '@core/ui/components/ghost-coder/services/coder-quotes.service';

const randomQuoteSignal = signal<string | null>(null);

export const coderQuotesServiceMock = {
  randomQuote: randomQuoteSignal,
  loadRandomQuote: vi.fn().mockResolvedValue(undefined),
} as const satisfies MockedObject<Partial<CoderQuotesService>>;

export const resetCoderQuotesServiceMock = (): void => {
  randomQuoteSignal.set(null);
  coderQuotesServiceMock.loadRandomQuote.mockReset().mockResolvedValue(undefined);
};

export const setCoderQuotesServiceMockQuote = (quote: string | null): void => {
  randomQuoteSignal.set(quote);
};
