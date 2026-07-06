import type { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';

export type PriestQuotePoolId = DigitalPriestMood | 'busy' | 'low_spirit';

export interface PriestQuote {
  lang: string;
  pool: PriestQuotePoolId;
  text: string;
}
