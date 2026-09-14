import { effect, inject, Service, signal } from '@angular/core';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';
import { convertUserToProfileFormValue } from '@features/profile/helpers/convert-user-to-profile-form-value.helper';
import { FirebaseError } from 'firebase/app';
import { AuthService } from '@core/services/auth/auth.service';
import { TranslocoService } from '@jsverse/transloco';
import { HotToastService } from '@ngxpert/hot-toast';

@Service({
  autoProvided: false,
})
export class NewProfileFacade {
  private readonly userProfileService = inject(UserProfileService);
  private readonly authService = inject(AuthService);
  private readonly translocoService = inject(TranslocoService);
  private readonly toastService = inject(HotToastService);
  private readonly profileFormService = inject(ProfileFormService);
  private readonly _isLoading = signal(false);
  private readonly currentUser = this.userProfileService.user;
  public readonly profileForm = this.profileFormService.form;
  public readonly profileFormValueChanges = this.profileFormService.formValueChanges;
  public readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    effect(() => {
      const user = this.currentUser();

      if (user && this.profileForm.pristine) {
        this.profileFormService.setFormValue(convertUserToProfileFormValue(user));
      }
    });
  }

  public async submit() {
    if (this.profileForm.invalid || this.isLoading()) {
      return;
    }

    const user = this.currentUser();

    if (!user) {
      return;
    }

    this._isLoading.set(true);

    try {
      const { name, currentPassword, newPassword, dateOfBirth } = this.profileForm.getRawValue();

      if (currentPassword && newPassword) {
        await this.authService.changePassword(currentPassword, newPassword);
      }

      await this.userProfileService.updateProfile(user.uid, {
        displayName: name ?? '',
        dateOfBirth: dateOfBirth,
      });

      this.profileForm.markAsPristine();
      this.toastService.success(this.translocoService.translate('notifications.success', {}, 'profile'));
    } catch (error) {
      let message = this.translocoService.translate('notifications.failure-message', {}, 'profile');

      if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        message = this.translocoService.translate('notifications.invalid-password', {}, 'profile');
      }

      this.toastService.error(message);
    } finally {
      this._isLoading.set(false);
    }
  }
}
