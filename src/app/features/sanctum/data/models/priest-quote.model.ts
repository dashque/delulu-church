import type { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';

export interface PriestQuote {
  lang: string;
  pool: DigitalPriestMood | 'busy' | 'low_spirit';
  text: string;
}
