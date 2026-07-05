import { CandleId } from '@core/services/candles/models/candle-id.model';
import type { CandleCounts } from '@core/services/candles/models/candle-counts.model';

export const createEmptyCandleCounts = (): CandleCounts => ({
  [CandleId.BUG]: 0,
  [CandleId.DATABASE]: 0,
  [CandleId.DEPLOY]: 0,
  [CandleId.LEGACY]: 0,
  [CandleId.REFACTOR]: 0,
  [CandleId.REVIEW]: 0,
});
