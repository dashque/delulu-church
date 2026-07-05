import type { CandleId } from '@core/services/candles/models/candle-id.model';

export interface Candle {
  id: CandleId;
  purpose: string;
  icon: string;
  color: string;
  isLit: boolean;
  count: number;
}
