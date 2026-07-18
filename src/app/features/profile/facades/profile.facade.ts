import { computed, effect, inject, Service, signal } from '@angular/core';
import { PROFILE_MOCK } from '../data/fixtures/profile.fixture';
import type { AchievementInfo, Profile, ProfileData, Statistics, Zodiac } from '../data/models/profile.model';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { ProfileFormService } from '../services/profile-form/profile-form.service';
import { AuthService } from '@core/services/auth/auth.service';
import { TranslocoService } from '@jsverse/transloco';
import { FirebaseError } from 'firebase/app';
import { HotToastService } from '@ngxpert/hot-toast';
import type { Achievement } from '../data/models/achievement.model';
import type { StatCard } from '../data/models/stats-card.model';
import { DonutService } from '@core/services/donut/donut.service';

@Service({
  autoProvided: false,
})
export class ProfileFacade {
  private readonly profileFormService = inject(ProfileFormService);
  private readonly authService = inject(AuthService);
  private readonly translocoService = inject(TranslocoService);
  private readonly donutService = inject(DonutService);
  private readonly toast = inject(HotToastService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly _currentUser = this.userProfileService.user;
  private readonly _isLoading = signal(false);
  private readonly _state = signal<ProfileData>(PROFILE_MOCK);
  public readonly profileForm = this.profileFormService.form;
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly state = this._state.asReadonly();
  public readonly profile = computed<Profile | null>(() => {
    const user = this._currentUser();

    if (!user) {
      return null;
    }

    return {
      uid: user.uid,
      displayName: user.displayName ?? 'Anonymous',
      email: user.email,
      avatarUrl: PROFILE_MOCK.profile.avatarUrl,
      dateOfBirth: String(user.dateOfBirth),
      candles: user.candles,
      sins: user.sins,
      metadata: {
        creationTime: String(user.createdAt),
        lastSignInTime: '',
      },
    };
  });

  public readonly statistics = computed<Statistics>(() => ({
    candles: Number(this.profile()?.candles ?? 0),
    confesses: Number(this.profile()?.sins ?? 0),
    donuts: this.donutService.totalDonuts(),
  }));

  public readonly statCards = computed<StatCard[]>(() => {
    return [
      {
        id: 'confessions',
        icon: '@tui.scroll-text',
        value: this.statistics()?.confesses,
        label: 'profile.stats.confessions',
      },
      {
        id: 'candles',
        icon: '@tui.flame',
        value: this.statistics()?.candles,
        label: 'profile.stats.candles',
      },
    ];
  });

  public readonly achievementInfo = computed<AchievementInfo>(() => {
    const statistics = this.statistics();
    const achievements: Achievement[] = [
      {
        id: 'first_confession',
        icon: './assets/pray.svg',
        title: 'profile.achieve.first_confession.title',
        description: 'profile.achieve.first_confession.description',
        unlocked: statistics.confesses >= 1,
      },
      {
        id: 'penitent',
        icon: './assets/beads.svg',
        title: 'profile.achieve.penitent.title',
        description: 'profile.achieve.penitent.description',
        unlocked: statistics.confesses >= 10,
      },
      {
        id: 'first_candle',
        icon: './assets/candle.svg',
        title: 'profile.achieve.first_candle.title',
        description: 'profile.achieve.first_candle.description',
        unlocked: statistics.candles >= 1,
      },
      {
        id: 'flame_keeper',
        icon: './assets/flame.svg',
        title: 'profile.achieve.flame_keeper.title',
        description: 'profile.achieve.flame_keeper.description',
        unlocked: statistics.candles >= 20,
      },
      {
        id: 'altar_master',
        icon: './assets/oil.svg',
        title: 'profile.achieve.altar_master.title',
        description: 'profile.achieve.altar_master.description',
        unlocked: statistics.candles >= 50,
      },
      {
        id: 'saved',
        icon: './assets/angel.svg',
        title: 'profile.achieve.saved.title',
        description: 'profile.achieve.saved.description',
        unlocked: statistics.confesses >= 50,
      },
      {
        id: 'saint',
        icon: './assets/coins.svg',
        title: 'profile.achieve.saint.title',
        description: 'profile.achieve.saint.description',
        unlocked: statistics.donuts >= 1,
      },
    ];

    return {
      achievements,
      total: achievements.length,
      unlocked: achievements.filter((a) => a.unlocked).length,
    };
  });

  public readonly zodiac = computed<Zodiac>(() => {
    const user = this._currentUser();
    const birth = user?.dateOfBirth as string | null;

    if (!birth) {
      return {
        sign: 'Unknown',
        description: 'Нет данных о дате рождения',
        icon: 'assets/star.svg',
      };
    }

    const date = new Date(birth);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const sign =
      (month === 3 && day >= 21) || (month === 4 && day <= 19)
        ? 'Овен'
        : (month === 4 && day >= 20) || (month === 5 && day <= 20)
          ? 'Телец'
          : 'Неизвестно';

    return {
      sign,
      description: 'Определяется по дате рождения',
      icon: 'assets/star.svg',
    };
  });
  public readonly achievementsCount = computed(() => {
    if (!this.achievementInfo()) {
      return 0;
    }

    return this.achievementInfo().achievements.length;
  });
  public readonly unlockedAchievementsCount = computed(
    () => this.achievementInfo().achievements.filter((achievement) => achievement.unlocked).length
  );
  public readonly achievementProgress = computed(() => ({
    unlocked: this.unlockedAchievementsCount(),
    total: this.achievementsCount(),
  }));

  constructor() {
    effect(() => {
      const user = this._currentUser();

      if (!user) {
        return;
      }

      this.profileForm.patchValue({ name: user.displayName ?? '' }, { emitEvent: false });
    });
  }

  public async submit() {
    if (this.profileForm.invalid || this.isLoading()) {
      return;
    }

    const user = this._currentUser();

    if (!user) {
      return;
    }

    this._isLoading.set(true);

    try {
      const { name, currentPassword, newPassword } = this.profileForm.getRawValue();

      if (currentPassword && newPassword) {
        await this.authService.changePassword(currentPassword, newPassword);
      }

      await this.userProfileService.updateProfile(user.uid, {
        displayName: name,
      });

      this.profileForm.markAsPristine();
      this.toast.success(this.translocoService.translate('notifications.success', {}, 'profile'));
    } catch (error) {
      let message = this.translocoService.translate('notifications.failure-message', {}, 'profile');

      if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        message = this.translocoService.translate('notifications.invalid-password', {}, 'profile');
      }

      this.toast.error(message);
    } finally {
      this._isLoading.set(false);
    }
  }
}
