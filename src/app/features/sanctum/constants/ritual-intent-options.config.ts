import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';

export interface RitualIntentOption {
  readonly value: RitualIntent;
}

export const RITUAL_INTENT_OPTIONS = [
  { value: RitualIntent.MERGE },
  { value: RitualIntent.DEPLOY },
  { value: RitualIntent.PENANCE },
] as const satisfies readonly RitualIntentOption[];
