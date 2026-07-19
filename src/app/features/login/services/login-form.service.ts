import { inject, Service } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import type { LoginForm } from '../models/login-form.model';
import { EMAIL_PATTERN } from '@shared/patterns/email-pattern';
import { PASSWORD_PATTERN } from '@shared/patterns/password-pattern';

@Service({
  autoProvided: false,
})
export class LoginFormService {
  private readonly fb = inject(FormBuilder);
  public readonly loginForm = this.fb.nonNullable.group<LoginForm>({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
    password: this.fb.nonNullable.control('', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]),
  });
}
