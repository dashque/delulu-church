import { FormControl, FormGroup } from '@angular/forms';
import type { RegisterFormGroup } from '@features/registration/models/register-form.model';

export const registerFormFixture = new FormGroup<RegisterFormGroup>({
  name: new FormControl<string | null>(null),
  email: new FormControl<string | null>(null),
  password: new FormControl<string | null>(null),
  passwordConfirmation: new FormControl<string | null>(null),
  dateOfBirth: new FormControl<Date | null>(null),
});
