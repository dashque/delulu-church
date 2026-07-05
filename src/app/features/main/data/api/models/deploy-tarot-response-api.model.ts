import type { TarotCardApi } from '@features/main/data/api/models/tarot-card-api.model';
import type { TarotVerdict } from '@features/main/data/api/models/verdict.model';

export interface TarotResponseApi {
  verdict: TarotVerdict;
  verdict_label: string;
  verdict_text: string;
  role: string;
  intent: string;
  cards: TarotCardApi[];
  share_url: string;
}
