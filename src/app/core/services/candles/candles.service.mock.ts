import { computed, signal } from '@angular/core';
import type { MockedObject } from 'vitest';
import { vi } from 'vitest';

import type { CandlesService } from '@core/services/candles/candles.service';
import { CANDLE_TYPES_CONFIG } from '@core/services/candles/constants/candle-types.config';
import { createEmptyCandleCounts } from '@core/services/candles/helpers/create-empty-candle-counts.helper';

const candleCountsSignal = signal(createEmptyCandleCounts());
const totalOfferingsSignal = signal(0);

export const candlesServiceMock = {
  candleTypes: CANDLE_TYPES_CONFIG,
  litCandleList: signal([]).asReadonly(),
  candleCounts: candleCountsSignal.asReadonly(),
  totalOfferings: totalOfferingsSignal.asReadonly(),
  blessingLevel: signal(0).asReadonly(),
  isSpiritPleased: computed(() => false),
  error: signal(null).asReadonly(),
  offerCandle: vi.fn(),
} as const satisfies MockedObject<Partial<CandlesService>>;

export const resetCandlesServiceMock = (): void => {
  candleCountsSignal.set(createEmptyCandleCounts());
  totalOfferingsSignal.set(0);
  candlesServiceMock.offerCandle.mockReset();
};

export const setCandlesServiceMockCounts = (counts: ReturnType<typeof createEmptyCandleCounts>): void => {
  candleCountsSignal.set(counts);
  totalOfferingsSignal.set(Object.values(counts).reduce((total, count) => total + count, 0));
};
