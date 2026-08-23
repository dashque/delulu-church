import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { ProfileFacade } from './profile.facade';
import { userProfileFixture } from '@core/fixtures/user-profile.fixture';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { authServiceMock } from '@core/services/auth/auth.service.mock';
import { AuthService } from '@core/services/auth/auth.service';
import { DonutService } from '../services/donut/donut.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { hotToastServiceMock } from '@shared/mocks/hot-toast/hot-toast.service.mock';
import {
  resetUserProfileServiceMock,
  userProfileServiceMock,
} from '@core/services/user-profile/user-profile.service.mock';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { donutServiceMock } from '../services/donut/donut.service.mock';
import { PROFILE_MOCK } from '../fixtures/profile.fixture';
import { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';
import { profileFormServiceMock } from '@features/profile/services/profile-form/profile-form.service.mock';

describe('ProfileFacade', () => {
  let facade: ProfileFacade;

  beforeEach(() => {
    resetUserProfileServiceMock();
    (userProfileServiceMock.user as unknown as Mock).mockReturnValue(userProfileFixture);

    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [
        ProfileFacade,
        { provide: HotToastService, useValue: hotToastServiceMock },
        { provide: ProfileFormService, useValue: profileFormServiceMock },
        { provide: UserProfileService, useValue: userProfileServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: DonutService, useValue: donutServiceMock },
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

    it('должен собрать профиль из UserProfileService', () => {
      expect(facade.profile()).toEqual({
        uid: userProfileFixture.uid,
        displayName: userProfileFixture.displayName,
        email: userProfileFixture.email,
        avatarUrl: PROFILE_MOCK.profile.avatarUrl,
        dateOfBirth: userProfileFixture.dateOfBirth,
        candles: userProfileFixture.candles,
        sins: userProfileFixture.sins,
        metadata: {
          creationTime: String(userProfileFixture.createdAt),
          lastSignInTime: '',
        },
      });
    });

    it('должен подставить Anonymous при отсутствии displayName', () => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue({
        ...userProfileFixture,
        displayName: null,
      });

      expect(facade.profile()?.displayName).toBe('Anonymous');
    });
  });

  describe('Статистика', () => {
    it('должен посчитать количество свечей и исповедей', () => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue({
        ...userProfileFixture,
        candles: 3,
        sins: 1,
      });

      expect(facade.statistics()).toEqual({
        confesses: 1,
        candles: 3,
        donuts: 0,
      });
    });
  });

  describe('Достижения', () => {
    beforeEach(() => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue({
        ...userProfileFixture,
        candles: PROFILE_MOCK.statistics.candles,
        sins: PROFILE_MOCK.statistics.confesses,
      });
    });

    it('должен вернуть данные достижений из state', () => {
      expect(facade.achievementInfo()).toEqual(PROFILE_MOCK.achievementInfo);
    });

    it('должен вернуть количество достижений', () => {
      expect(facade.achievementsCount()).toBe(7);
    });

    it('должен вернуть количество разблокированных достижений', () => {
      expect(facade.unlockedAchievementsCount()).toBe(2);
    });

    it('должен вернуть прогресс достижений', () => {
      expect(facade.achievementProgress()).toEqual({ unlocked: 2, total: 7 });
    });
  });
});
