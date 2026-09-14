import { FormControl, FormGroup } from '@angular/forms';
import type { ProfileForm } from '@features/profile/models/profile-form.model';

export const profileFormFixture = new FormGroup<ProfileForm>({
  name: new FormControl(null),
  currentPassword: new FormControl(null),
  dateOfBirth: new FormControl(null),
  newPassword: new FormControl(null),
  newPasswordConfirmation: new FormControl(null),
});
