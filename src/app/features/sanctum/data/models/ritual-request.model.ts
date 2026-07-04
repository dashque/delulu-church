import type { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';

export interface RitualRequest {
  branch: string;
  ritualIntent: RitualIntent;
  spiritLevel: number;
  requestId: number;
}
