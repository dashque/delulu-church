import { effect, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import type { Theme } from '@core/models/theme.model';
import type { Languages } from '@core/models/languages.model';
import { UI_STATE } from '@core/store/tokens/ui-state.token';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { initialUiState } from './constants/initial-ui-state';
import { ThemeService } from '@core/services/theme/theme.service';

export const uiStateStore = signalStore(
  { providedIn: 'root' },
  withState(() => inject(UI_STATE)),
  withMethods((store, userProfileService = inject(UserProfileService), themeService = inject(ThemeService)) => {
    const persistUiState = async () => {
      const profile = userProfileService.user();

      if (!profile) {
        return;
      }

      await userProfileService.updateUiState(profile.uid, {
        theme: store.theme(),
        language: store.language(),
      });
    };

    return {
      async setTheme(theme: Theme) {
        patchState(store, { theme });
        await persistUiState();
      },
      async setLanguage(language: Languages) {
        patchState(store, { language });
        await persistUiState();
      },
      async toggleTheme() {
        const theme = themeService.toggleTheme();

        patchState(store, { theme });
        await persistUiState();
      },
    };
  }),
  withHooks({
    onInit(
      store,
      userProfileService = inject(UserProfileService),
      themeService = inject(ThemeService),
      translocoService = inject(TranslocoService)
    ) {
      effect(() => {
        const profile = userProfileService.user();

        patchState(store, profile?.uiState ?? initialUiState);
      });

      effect(() => {
        themeService.setTheme(store.theme());
      });

      effect((onCleanup) => {
        const language = store.language();
        const subscription = translocoService.load(language).subscribe(() => {
          translocoService.setActiveLang(language);
        });

        onCleanup(() => {
          subscription.unsubscribe();
        });
      });
    },
  })
);
