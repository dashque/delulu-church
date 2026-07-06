import type { FormControl } from '@angular/forms';
import type { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';

export interface SanctumForm {
  branch: FormControl<string>;
  ritualIntent: FormControl<RitualIntent>;
}
