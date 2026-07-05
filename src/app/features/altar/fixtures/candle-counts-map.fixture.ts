import { CandleId } from '@core/services/candles/models/candle-id.model';
import type { CandleCounts } from '@core/services/candles/models/candle-counts.model';
import { createEmptyCandleCounts } from '@core/services/candles/helpers/create-empty-candle-counts.helper';

export const candleCountsMapFixture = {
  ...createEmptyCandleCounts(),
  [CandleId.DEPLOY]: 3,
  [CandleId.BUG]: 1,
} as const satisfies CandleCounts;
