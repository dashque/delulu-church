import { inject, Service } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PASSWORD_PATTERN } from '@shared/patterns/password-pattern';
import { passwordConfirmationValidator } from '@shared/validators/password-confirmation.validator';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@shared/constants/password-length';
import type { ProfileSecurityFormGroup } from '@features/profile/data/models/profileSecurity.model';

@Service()
export class ProfileFormService {
  private readonly fb = inject(FormBuilder);
  public readonly form = this.createFormInstance();

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.togglePasswordValidators();
    });

    this.togglePasswordValidators();
  }

  private createFormInstance() {
    return this.fb.group<ProfileSecurityFormGroup>(
      {
        name: this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(30)]),
        currentPassword: this.fb.nonNullable.control('', []),
        newPassword: this.fb.nonNullable.control('', []),
        newPasswordConfirmation: this.fb.nonNullable.control('', []),
      },
      { validators: passwordConfirmationValidator('newPassword', 'newPasswordConfirmation') }
    );
  }

  private togglePasswordValidators() {
    const { currentPassword, newPassword, newPasswordConfirmation } = this.form.controls;

    const hasPassword = !!currentPassword.value || !!newPassword.value || !!newPasswordConfirmation.value;

    const validators = hasPassword
      ? [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH),
          Validators.maxLength(PASSWORD_MAX_LENGTH),
          Validators.pattern(PASSWORD_PATTERN),
        ]
      : [];

    currentPassword.setValidators(validators);
    newPassword.setValidators(validators);
    newPasswordConfirmation.setValidators(validators);

    currentPassword.updateValueAndValidity({ emitEvent: false });
    newPassword.updateValueAndValidity({ emitEvent: false });
    newPasswordConfirmation.updateValueAndValidity({ emitEvent: false });
  }
}
