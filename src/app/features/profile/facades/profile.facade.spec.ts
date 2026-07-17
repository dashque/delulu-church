import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { expect } from 'vitest';
import { ProfileFacade } from './profile.facade';
import { userProfileFixture } from '@core/fixtures/user-profile.fixture';
import { PROFILE_MOCK } from '../data/fixtures/profile.fixture';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { authServiceMock } from '@core/services/auth/auth.service.mock';
import { AuthService } from '@core/services/auth/auth.service';
import { CandlesService } from '@core/services/candles/candles.service';
import { ConfessService } from '@core/services/confess/confess.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { hotToastServiceMock } from '@shared/mocks/hot-toast/hot-toast.service.mock';
import { candlesServiceMock, resetCandlesServiceMock } from '@core/services/candles/candles.service.mock';

import { confessServiceMock, resetConfessServiceMock } from '@core/services/confess/confess.service.mock';

import {
  resetUserProfileServiceMock,
  userProfileServiceMock,
} from '@core/services/user-profile/user-profile.service.mock';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('ProfileFacade', () => {
  let facade: ProfileFacade;

  beforeEach(() => {
    resetUserProfileServiceMock();
    resetCandlesServiceMock();
    resetConfessServiceMock();
    (userProfileServiceMock.user as unknown as Mock).mockReturnValue(userProfileFixture);

    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [
        ProfileFacade,
        { provide: HotToastService, useValue: hotToastServiceMock },
        { provide: UserProfileService, useValue: userProfileServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: CandlesService, useValue: candlesServiceMock },
        { provide: ConfessService, useValue: confessServiceMock },
      ],
    });
    facade = TestBed.inject(ProfileFacade);
  });

  it('должен инициализироваться', () => {
    expect(facade).toBeTruthy();
  });

  describe('Профиль', () => {
    it('должен вернуть null без пользователя', () => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue(null);

      expect(facade.profile()).toBeNull();
    });

    it('должен подставить Anonymous при отсутствии displayName', () => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue({
        ...userProfileFixture,
        displayName: null,
      });

      expect(facade.profile()?.displayName).toBe('Anonymous');
    });
  });

  describe('Знак зодиака', () => {
    it('должен вернуть Unknown без даты рождения', () => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue({
        ...userProfileFixture,
        dateOfBirth: null,
      });

      expect(facade.zodiac()).toEqual({
        sign: 'Unknown',
        description: 'Нет данных о дате рождения',
        icon: 'assets/star.svg',
      });
    });

    it('должен определить знак Овен', () => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue({
        ...userProfileFixture,
        dateOfBirth: '2020-03-25',
      });

      expect(facade.zodiac().sign).toBe('Овен');
    });

    it('должен определить знак Телец', () => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue({
        ...userProfileFixture,
        dateOfBirth: '2020-04-25',
      });

      expect(facade.zodiac().sign).toBe('Телец');
    });
  });

  describe('Достижения', () => {
    it('должен вернуть данные достижений из state', () => {
      expect(facade.achievementInfo()).toEqual(PROFILE_MOCK.achievementInfo);
    });

    it('должен посчитать прогресс достижений', () => {
      expect(facade.achievementsCount()).toBe(5);
      expect(facade.unlockedAchievementsCount()).toBe(0);
      expect(facade.achievementProgress()).toEqual({ unlocked: 0, total: 5 });
    });
  });
});
