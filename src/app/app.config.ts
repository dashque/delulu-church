import { provideTaiga } from '@taiga-ui/core';
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
import { provideHttpClient, withXhr } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@jsverse/transloco';
import { UserStateStrategy } from '@core/services/preloading-strategy/user-state-strategy.service';
import { Languages } from '@core/models/languages.model';
import { uiStateStore } from '@core/store/ui-state.store';
import { initialUiState } from '@core/store/constants/initial-ui-state';

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
    provideHttpClient(withXhr()),
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
  ],
};
