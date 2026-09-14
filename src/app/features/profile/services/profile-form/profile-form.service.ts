import { inject, Service } from '@angular/core';
import type { ValidatorFn } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { PASSWORD_PATTERN } from '@shared/patterns/password-pattern';
import { passwordConfirmationValidator } from '@shared/validators/password-confirmation.validator';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@shared/constants/password-length';
import { tap } from 'rxjs';
import type { ProfileForm } from '@features/profile/models/profile-form.model';
import type { ProfileFormValue } from '@features/profile/models/profile-form-value.model';

@Service({ autoProvided: false })
export class ProfileFormService {
  private readonly fb = inject(FormBuilder);
  public readonly form = this.createFormInstance();

  public get formValueChanges() {
    return this.form.valueChanges.pipe(tap(() => this.togglePasswordValidators()));
  }

  public setFormValue(formValue: ProfileFormValue) {
    this.form.setValue(formValue, { emitEvent: false });
  }

  private createFormInstance() {
    return this.fb.group<ProfileForm>(
      {
        name: this.fb.control(null, [Validators.required, Validators.maxLength(30)]),
        currentPassword: this.fb.control(null, []),
        newPassword: this.fb.control(null, []),
        newPasswordConfirmation: this.fb.control(null, []),
        dateOfBirth: this.fb.control(null),
      },
      { validators: passwordConfirmationValidator('newPassword', 'newPasswordConfirmation') }
    );
  }

  private togglePasswordValidators() {
    this.setValidators(this.passwordValidatorList);
    this.updatePasswordControlsValidity();
  }

  private setValidators(validatorList: ValidatorFn[]) {
    const { currentPassword, newPassword, newPasswordConfirmation } = this.form.controls;

    currentPassword.setValidators(validatorList);
    newPassword.setValidators(validatorList);
    newPasswordConfirmation.setValidators(validatorList);
  }

  private updatePasswordControlsValidity() {
    const { currentPassword, newPassword, newPasswordConfirmation } = this.form.controls;

    currentPassword.updateValueAndValidity({ emitEvent: false });
    newPassword.updateValueAndValidity({ emitEvent: false });
    newPasswordConfirmation.updateValueAndValidity({ emitEvent: false });
  }

  private get passwordValidatorList(): ValidatorFn[] {
    const { currentPassword, newPassword, newPasswordConfirmation } = this.form.controls;
    const hasPassword = !!currentPassword.value || !!newPassword.value || !!newPasswordConfirmation.value;

    return hasPassword
      ? [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH),
          Validators.maxLength(PASSWORD_MAX_LENGTH),
          Validators.pattern(PASSWORD_PATTERN),
        ]
      : [];
  }
}
