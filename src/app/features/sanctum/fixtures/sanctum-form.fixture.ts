import { FormBuilder } from '@angular/forms';
import type { SanctumForm } from '@features/sanctum/data/models/sanctum-form.model';
import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';

const fb = new FormBuilder();

export const sanctumFormFixture = fb.group<SanctumForm>({
  branch: fb.nonNullable.control('feat/sanctum-branch-blessing'),
  ritualIntent: fb.nonNullable.control(RitualIntent.MERGE),
});
