import { inject, Service } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import type { SanctumForm } from '@features/sanctum/data/models/sanctum-form.model';
import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';

@Service({
  autoProvided: false,
})
export class SanctumFormService {
  private readonly fb = inject(FormBuilder);

  public readonly sanctumForm = this.fb.group<SanctumForm>({
    branch: this.fb.nonNullable.control('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(72)],
    }),
    ritualIntent: this.fb.nonNullable.control(RitualIntent.MERGE),
  });
}
