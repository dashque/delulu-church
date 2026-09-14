import type { ProfileFormValue } from '@features/profile/models/profile-form-value.model';
import type { UserProfile } from '@core/services/user-profile/models/user-profile.model';

export const convertUserToProfileFormValue = (userProfile: UserProfile): ProfileFormValue => {
  return {
    name: userProfile.displayName,
    dateOfBirth: userProfile.dateOfBirth instanceof Date ? userProfile.dateOfBirth : null,
    newPassword: null,
    currentPassword: null,
    newPasswordConfirmation: null,
  };
};
