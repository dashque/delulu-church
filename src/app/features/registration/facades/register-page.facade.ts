import { DestroyRef, inject, Service } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { RegisterFormService } from '@features/registration/services/register-form.service';
import { Router } from '@angular/router';
import { TuiNotificationService } from '@taiga-ui/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';

@Service({
  autoProvided: false,
})
export class RegisterPageFacade {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notifications = inject(TuiNotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);
  public readonly registerForm = inject(RegisterFormService).registerForm;
  public readonly isLoading = this.authService.isLoading;

  public async signup() {
    if (this.registerForm.invalid || this.isLoading()) {
      return;
    }

    const { email, password, name, dateOfBirth } = this.registerForm.getRawValue();

    try {
      await this.authService.signup(email, password, { full_name: name, date_of_birth: dateOfBirth });

      this.registerForm.reset();

      void this.showNotification(
        this.translocoService.translate('notifications.success', {}, 'register'),
        this.translocoService.translate('notifications.success-title', {}, 'register'),
        'positive'
      );
      this.registerForm.markAsPristine();
      void this.router.navigate(['/']);
    } catch (error) {
      void this.showNotification(
        toErrorMessage(error),
        this.translocoService.translate('notifications.failure', {}, 'register'),
        'negative'
      );
    }
  }

  private showNotification(message: string, label: string, appearance: 'positive' | 'negative') {
    this.notifications
      .open(message, {
        label: label,
        appearance: appearance,
        autoClose: 5000,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
