import type { Candle } from '@core/services/candles/models/candle.model';

export type CandleType = Omit<Candle, 'count' | 'isLit'>;
