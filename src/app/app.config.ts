import { provideTaiga, tuiValidationErrorsProvider } from '@taiga-ui/core';
import type { ApplicationConfig } from '@angular/core';
import {
  inject,
  isDevMode,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withPreloading, withViewTransitions } from '@angular/router';

import { AuthService } from '@core/services/auth/auth.service';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { UserStateStrategy } from '@core/services/preloading-strategy/user-state-strategy.service';
import { Languages } from '@core/models/languages.model';
import { uiStateStore } from '@core/store/ui-state.store';
import { initialUiState } from '@core/store/constants/initial-ui-state';
import { httpErrorInterceptor } from '@core/interceptors/http-error-interceptor';
import { VALIDATION_ERRORS_DICT } from '@shared/dictionaries/validation-errors.dictionary';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@shared/constants/password-length';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withPreloading(UserStateStrategy)),
    provideTaiga(),
    provideAppInitializer(() => {
      inject(uiStateStore);

      return inject(AuthService).initialize();
    }),
    provideHttpClient(withXhr(), withInterceptors([httpErrorInterceptor])),
    provideTransloco({
      config: {
        availableLangs: Object.values(Languages),
        defaultLang: initialUiState.language,
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    tuiValidationErrorsProvider(() => {
      const transloco = inject(TranslocoService);

      return {
        required: () => transloco.translate(VALIDATION_ERRORS_DICT.required),
        maxlength: (context) => transloco.translate(VALIDATION_ERRORS_DICT.maxLength, context),
        minlength: (context) => transloco.translate(VALIDATION_ERRORS_DICT.minLength, context),
        pattern: (context) => {
          return context?.['requiredPattern']
            ? transloco.translate(VALIDATION_ERRORS_DICT.passwordPattern, {
                minLength: PASSWORD_MIN_LENGTH,
                maxLength: PASSWORD_MAX_LENGTH,
              })
            : transloco.translate(VALIDATION_ERRORS_DICT.emailPattern);
        },
        confirmPasswordError: (key) => transloco.translate(key as string),
      };
    }),
    provideHotToastConfig({
      theme: 'glassmorphism',
      className: 'toast',
    }),
  ],
};
