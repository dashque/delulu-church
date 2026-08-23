import { inject, Service, signal } from '@angular/core';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';

@Service({
  autoProvided: false,
})
export class NewProfileFacade {
  private readonly userProfileService = inject(UserProfileService);
  private readonly profileFormService = inject(ProfileFormService);
  private readonly _isLoading = signal(false);
  private readonly currentUser = this.userProfileService.user;
  public readonly profileForm = this.profileFormService.form;
  public readonly profileFormValueChanges = this.profileFormService.formValueChanges;
  public readonly isLoading = this._isLoading.asReadonly();
}
