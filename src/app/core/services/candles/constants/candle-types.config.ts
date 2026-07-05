import { CandleId } from '@core/services/candles/models/candle-id.model';
import type { CandleType } from '@core/services/candles/models/candle-type.model';

export const CANDLE_TYPES_CONFIG: CandleType[] = [
  { id: CandleId.DEPLOY, purpose: 'altar.candles.purposes.deploy', icon: '@tui.rocket', color: '#00ffcc' },
  { id: CandleId.BUG, purpose: 'altar.candles.purposes.bug', icon: '@tui.bug', color: '#ff006e' },
  { id: CandleId.REVIEW, purpose: 'altar.candles.purposes.review', icon: '@tui.git-branch', color: '#9d4edd' },
  { id: CandleId.REFACTOR, purpose: 'altar.candles.purposes.refactor', icon: '@tui.code', color: '#ffaa00' },
  { id: CandleId.DATABASE, purpose: 'altar.candles.purposes.database', icon: '@tui.database', color: '#00ffcc' },
  { id: CandleId.LEGACY, purpose: 'altar.candles.purposes.legacy', icon: '@tui.terminal', color: '#9d4edd' },
];
