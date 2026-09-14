import type { ProfileForm } from '@features/profile/models/profile-form.model';
import type { ExtractFormControl } from '@shared/models/utility-types';
import { registerFormValidValueFixture } from '@features/registration/fixtures/register-form-value.fixture';

export const profileFormValueFixture = {
  name: registerFormValidValueFixture.name,
  newPassword: registerFormValidValueFixture.password,
  newPasswordConfirmation: registerFormValidValueFixture.passwordConfirmation,
  dateOfBirth: registerFormValidValueFixture.dateOfBirth,
  currentPassword: registerFormValidValueFixture.password,
} satisfies ExtractFormControl<ProfileForm>;
