import type { FormControl } from '@angular/forms';

export interface ProfileSecurityFormGroup {
  name: FormControl<string>;
  currentPassword: FormControl<string>;
  newPassword: FormControl<string>;
  newPasswordConfirmation: FormControl<string>;
}
