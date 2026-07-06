import { inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { LoginFormService } from '../services/login-form.service';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';
import { HotToastService } from '@ngxpert/hot-toast';

@Service({
  autoProvided: false,
})
export class LoginPageFacade {
  private readonly authService = inject(AuthService);
  private readonly notifications = inject(HotToastService);
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
      this.notifications.error(
        `${this.translocoService.translate('error.text', {}, 'login')} ${toErrorMessage(error)}`
      );
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

  private async loginWithProvider(login: () => Promise<unknown>) {
    this.isLoading.set(true);

    try {
      await login();
      await this.completeSuccessfulLogin();
    } catch (error) {
      this.notifications.error(
        `${this.translocoService.translate('error.text', {}, 'login')} ${toErrorMessage(error)}`
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  private async completeSuccessfulLogin() {
    const [message, label] = await Promise.all([
      firstValueFrom<string>(this.translocoService.selectTranslate('success', {}, 'login')),
      firstValueFrom<string>(this.translocoService.selectTranslate('success-title', {}, 'login')),
    ]);

    this.notifications.success(`${label} ${message}`);
    this.loginForm.markAsPristine();
    await this.router.navigate(['/']);
  }
}
