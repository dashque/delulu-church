import { TestBed } from '@angular/core/testing';

import { LAYOUT_MOBILE_MEDIA_QUERY } from '@core/ui/components/layout/constants/layout-mobile-media-query';
import { LAYOUT_MOBILE_MAX_WIDTH_PX } from '@core/ui/components/layout/constants/layout-mobile-max-width';
import { AuthService } from '@core/services/auth/auth.service';
import { authServiceMock } from '@core/services/auth/auth.service.mock';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import {
  resetUserProfileServiceMock,
  userProfileServiceMock,
} from '@core/services/user-profile/user-profile.service.mock';
import { LayoutService } from './layout.service';
import { uiStateStore } from '@core/store/ui-state.store';
import { resetUiStateStoreMock, uiStateStoreMock } from '@core/store/ui-state.store.mock';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    resetUserProfileServiceMock();
    resetUiStateStoreMock();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        LayoutService,
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserProfileService, useValue: userProfileServiceMock },
        { provide: uiStateStore, useValue: uiStateStoreMock },
      ],
    });
    service = TestBed.inject(LayoutService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Переключение открытия сайдбара', () => {
    it('должен открыть мобильную навигацию', () => {
      service.onToggleMobileNav();

      expect(service.isMobileNavOpen()).toBe(true);
    });

    it('должен закрыть мобильную навигацию после повторного вызова', () => {
      service.onToggleMobileNav();
      service.onToggleMobileNav();

      expect(service.isMobileNavOpen()).toBe(false);
    });
  });

  describe('Закрытие сайдбара', () => {
    it('должен закрыть мобильную навигацию', () => {
      service.onToggleMobileNav();
      service.onCloseMobileNav();

      expect(service.isMobileNavOpen()).toBe(false);
    });
  });

  describe('Отслеживание ширины экрана', () => {
    describe('MatchMedia не определен', () => {
      beforeEach(() => {
        vi.stubGlobal('matchMedia', undefined);
      });

      it('не должен закрывать мобильную навигацию', () => {
        service.onToggleMobileNav();
        service.watchMobileNavMediaQuery();

        expect(service.isMobileNavOpen()).toBe(true);
      });
    });

    describe(`Ширина экрана больше ${LAYOUT_MOBILE_MAX_WIDTH_PX} пикселей`, () => {
      beforeEach(() => {
        vi.stubGlobal(
          'matchMedia',
          vi.fn(() => ({
            matches: false,
            media: LAYOUT_MOBILE_MEDIA_QUERY,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          }))
        );
      });

      it('должен закрыть мобильную навигацию', () => {
        service.watchMobileNavMediaQuery();

        expect(service.isMobileNavOpen()).toBe(false);
      });
    });
  });
});
