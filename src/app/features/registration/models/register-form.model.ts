import type { FormControl } from '@angular/forms';

export interface RegisterFormGroup {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  passwordConfirmation: FormControl<string | null>;
  dateOfBirth: FormControl<Date | null>;
}
