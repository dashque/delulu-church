import { inject, Service } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PASSWORD_PATTERN } from '@shared/patterns/password-pattern';
import { EMAIL_PATTERN } from '@shared/patterns/email-pattern';
import { passwordConfirmationValidator } from '@shared/validators/password-confirmation.validator';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@shared/constants/password-length';
import type { RegisterFormGroup } from '@features/registration/models/register-form.model';

@Service({
  autoProvided: false,
})
export class RegisterFormService {
  private readonly fb = inject(FormBuilder);
  public readonly registerForm = this.createFormInstance();

  private createFormInstance() {
    return this.fb.group<RegisterFormGroup>(
      {
        name: this.fb.control(null, [Validators.required, Validators.maxLength(30)]),
        email: this.fb.control(null, [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
        password: this.fb.control(null, [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH),
          Validators.maxLength(PASSWORD_MAX_LENGTH),
          Validators.pattern(PASSWORD_PATTERN),
        ]),
        passwordConfirmation: this.fb.control(null, [
          Validators.required,
          Validators.minLength(PASSWORD_MIN_LENGTH),
          Validators.maxLength(PASSWORD_MAX_LENGTH),
          Validators.pattern(PASSWORD_PATTERN),
        ]),
        dateOfBirth: this.fb.control(null, [Validators.required]),
      },
      { validators: passwordConfirmationValidator('password', 'passwordConfirmation') }
    );
  }
}
