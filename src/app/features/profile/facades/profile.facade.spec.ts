import { TestBed } from '@angular/core/testing';

import { ProfileFacade } from './profile.facade';
import { expect, vi } from 'vitest';
import { of } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { TuiNotificationService } from '@taiga-ui/core';

describe('ProfileFacade', () => {
  let facade: ProfileFacade;

  const userProfileServiceMock = {
    user: vi.fn().mockReturnValue(null),
  };

  const authServiceMock = {
    user: vi.fn().mockReturnValue({ uid: '1' }),
    changePassword: vi.fn().mockResolvedValue(undefined),
  };

  const candlesServiceMock = {
    totalOfferings: vi.fn().mockReturnValue(0),
  };

  const confessServiceMock = {
    sins: vi.fn().mockReturnValue([]),
  };

  beforeEach(() => {
    resetUserProfileServiceMock();
    resetCandlesServiceMock();
    resetConfessServiceMock();
    (userProfileServiceMock.user as unknown as Mock).mockReturnValue(userProfileFixture);

    TestBed.configureTestingModule({
      providers: [
        ProfileFacade,
        {
          provide: TranslocoService,
          useValue: {
            translate: vi.fn().mockReturnValue('translated'),
          },
        },

        {
          provide: TuiNotificationService,
          useValue: {
            open: vi.fn().mockReturnValue(of(null)),
          },
        },
        { provide: 'UserProfileService', useValue: userProfileServiceMock },
        { provide: 'AuthService', useValue: authServiceMock },
        { provide: 'CandlesService', useValue: candlesServiceMock },
        { provide: 'ConfessService', useValue: confessServiceMock },
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
        id: userProfileFixture.uid,
        name: userProfileFixture.displayName,
        email: userProfileFixture.email,
        avatarUrl: PROFILE_MOCK.profile.avatarUrl,
        dateOfBirth: String(userProfileFixture.dateOfBirth),
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

      expect(facade.profile()?.name).toBe('Anonymous');
    });
  });

  describe('Статистика', () => {
    it('должен посчитать количество свечей и исповедей', () => {
      setCandlesServiceMockCounts({ ...createEmptyCandleCounts(), deploy: 2, bug: 1 });
      setConfessServiceMockSins([
        { uid: '1', text: 'Sin', severity: 'low', status: 'none' },
        { uid: '2', text: 'Sin 2', severity: 'critical', status: 'full' },
      ]);

      expect(facade.statistics()).toEqual({ candles: 3, confesses: 2 });
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
