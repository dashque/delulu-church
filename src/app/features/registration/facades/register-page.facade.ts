import { inject, Service } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { RegisterFormService } from '@features/registration/services/register-form.service';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';
import { HotToastService } from '@ngxpert/hot-toast';

@Service({
  autoProvided: false,
})
export class RegisterPageFacade {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifications = inject(HotToastService);
  private readonly translocoService = inject(TranslocoService);
  public readonly registerForm = inject(RegisterFormService).registerForm;
  public readonly isLoading = this.authService.isLoading;

  public async signup() {
    const { email, password, name, dateOfBirth } = this.registerForm.getRawValue();

    if (this.registerForm.invalid || this.isLoading() || !email || !password) {
      return;
    }

    try {
      await this.authService.signup(email, password, { full_name: name, date_of_birth: dateOfBirth });

      this.registerForm.reset();

      void this.notifications.success(
        `${this.translocoService.translate('notifications.success-title', {}, 'register')}
         ${this.translocoService.translate('notifications.success', {}, 'register')}`
      );
      this.registerForm.markAsPristine();
      void this.router.navigate(['/']);
    } catch (error) {
      void this.notifications.error(
        `${this.translocoService.translate('notifications.failure', {}, 'register')} ${toErrorMessage(error)}`
      );
    }
  }
}
