import { DestroyRef, inject, Service, signal } from '@angular/core';
import { LAYOUT_MOBILE_MEDIA_QUERY } from '@core/ui/components/layout/constants/layout-mobile-media-query';
import { AuthService } from '@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { uiStateStore } from '@core/store/ui-state.store';
import { CandlesService } from '@core/services/candles/candles.service';

@Service()
export class LayoutService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly candlesService = inject(CandlesService);
  private readonly uiStateStore = inject(uiStateStore);
  private readonly router = inject(Router);
  private readonly _isMobileNavOpen = signal(false);
  public readonly isMobileNavOpen = this._isMobileNavOpen.asReadonly();
  public readonly user = this.userProfileService.user;
  public readonly theme = this.uiStateStore.theme;
  public readonly isSpiritPleased = this.candlesService.isSpiritPleased;

  public onToggleMobileNav() {
    this._isMobileNavOpen.update((value) => !value);
  }

  public onCloseMobileNav() {
    this._isMobileNavOpen.set(false);
  }

  public watchMobileNavMediaQuery() {
    if (typeof globalThis.matchMedia === 'undefined') {
      return;
    }

    const mediaQueryList = globalThis.matchMedia(LAYOUT_MOBILE_MEDIA_QUERY);

    const closeNavOnDesktop = () => {
      if (!mediaQueryList.matches) {
        this._isMobileNavOpen.set(false);
      }
    };

    closeNavOnDesktop();
    mediaQueryList.addEventListener('change', closeNavOnDesktop);
    this.destroyRef.onDestroy(() => {
      mediaQueryList.removeEventListener('change', closeNavOnDesktop);
    });
  }

  public async logout() {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

  public toggleTheme() {
    void this.uiStateStore.toggleTheme();
  }
}
