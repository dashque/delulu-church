import { DestroyRef, inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { TuiNotificationService } from '@taiga-ui/core';
import { LoginFormService } from '../services/login-form.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';

@Service({
  autoProvided: false,
})
export class LoginPageFacade {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(TuiNotificationService);
  private readonly translocoService = inject(TranslocoService);
  private readonly router = inject(Router);
  public readonly isLoading = signal(false);
  public readonly loginForm = inject(LoginFormService).loginForm;

  public async login() {
    if (this.loginForm.invalid || this.isLoading()) {
      return;
    }
    this.isLoading.set(true);

    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.authService.login(email, password);
      await this.completeSuccessfulLogin();
    } catch (error) {
      if (error instanceof Error) {
        this.showNotification(error.message, this.translocoService.translate('error.text', {}, 'login'), 'negative');
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  public async loginWithGithub() {
    if (this.isLoading()) {
      return;
    }

    await this.loginWithProvider(() => this.authService.loginWithGithub());
  }

  public async loginWithGoogle() {
    if (this.isLoading()) {
      return;
    }

    await this.loginWithProvider(() => this.authService.loginWithGoogle());
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

  private async loginWithProvider(login: () => Promise<unknown>) {
    this.isLoading.set(true);

    try {
      await login();
      await this.completeSuccessfulLogin();
    } catch (error) {
      if (error instanceof Error) {
        this.showNotification(error.message, this.translocoService.translate('error.text', {}, 'login'), 'negative');
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  private async completeSuccessfulLogin() {
    const [message, label] = await Promise.all([
      firstValueFrom<string>(this.translocoService.selectTranslate('success', {}, 'login')),
      firstValueFrom<string>(this.translocoService.selectTranslate('success-title', {}, 'login')),
    ]);

    this.showNotification(message, label, 'positive');
    this.loginForm.markAsPristine();
    await this.router.navigate(['/']);
  }
}
