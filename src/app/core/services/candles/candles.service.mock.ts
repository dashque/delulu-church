import { computed, signal } from '@angular/core';
import type { MockedObject } from 'vitest';
import { vi } from 'vitest';

import type { CandlesService } from '@core/services/candles/candles.service';
import { CANDLE_TYPES_CONFIG } from '@core/services/candles/constants/candle-types.config';
import { createEmptyCandleCounts } from '@core/services/candles/helpers/create-empty-candle-counts.helper';

export const candlesServiceMock = {
  candleTypes: CANDLE_TYPES_CONFIG,
  litCandleList: signal([]).asReadonly(),
  candleCounts: signal(createEmptyCandleCounts()).asReadonly(),
  totalOfferings: signal(0).asReadonly(),
  blessingLevel: computed(() => 0),
  isSpiritPleased: computed(() => false),
  error: signal(null).asReadonly(),
  offerCandle: vi.fn(),
} as const satisfies MockedObject<Partial<CandlesService>>;
