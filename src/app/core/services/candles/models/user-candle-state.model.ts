import type { CandleCounts } from '@core/services/candles/models/candle-counts.model';
import type { SpiritSatisfaction } from '@core/services/candles/models/spirit-satisfaction.model';

export interface UserCandleState {
  candleCounts: CandleCounts;
  candles: number;
  spiritSatisfaction: SpiritSatisfaction;
}
