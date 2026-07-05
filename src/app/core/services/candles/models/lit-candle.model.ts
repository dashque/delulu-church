import type { Candle } from '@core/services/candles/models/candle.model';

export interface LitCandle extends Omit<Candle, 'count'> {
  instanceId: string;
  isLit: true;
}
