import type { FormControl } from '@angular/forms';

export interface ProfileForm {
  name: FormControl<string | null>;
  currentPassword: FormControl<string | null>;
  newPassword: FormControl<string | null>;
  newPasswordConfirmation: FormControl<string | null>;
  dateOfBirth: FormControl<Date | null>;
}
