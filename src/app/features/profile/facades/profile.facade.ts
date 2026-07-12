import { computed, effect, inject, Service, signal } from '@angular/core';
import { PROFILE_MOCK } from '../data/fixtures/profile.fixture';
import type { AchievementInfo, Profile, ProfileData, Statistics, Zodiac } from '../data/models/profile.model';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { CandlesService } from '@core/services/candles/candles.service';
import { ConfessService } from '@core/services/confess/confess.service';
import { ProfileFormService } from '../services/profile-form/profile-form.service';
import { AuthService } from '@core/services/auth/auth.service';
import { TranslocoService } from '@jsverse/transloco';
import { FirebaseError } from 'firebase/app';
import { HotToastService } from '@ngxpert/hot-toast';
import type { StatCard } from '../data/models/stats-card.model';

@Service({
  autoProvided: false,
})
export class ProfileFacade {
  private readonly profileFormService = inject(ProfileFormService);

  private readonly authService = inject(AuthService);

  private readonly translocoService = inject(TranslocoService);

  private readonly toast = inject(HotToastService);

  public readonly profileForm = this.profileFormService.form;

  public readonly state = signal<ProfileData>(PROFILE_MOCK);

  public readonly userProfileService = inject(UserProfileService);

  public readonly profile = computed<Profile | null>(() => {
    const user = this.userProfileService.user();

    if (!user) {
      return null;
    }

    return {
      id: user.uid,
      name: user.displayName ?? 'Anonymous',
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

  public readonly candlesService = inject(CandlesService);
  public readonly confessService = inject(ConfessService);

  public readonly statistics = computed<Statistics>(() => ({
    candles: Number(this.candlesService.totalOfferings?.() ?? 0),
    confesses: Number(this.confessService.sins?.()?.length ?? 0),
  }));

  public readonly statCards = computed<StatCard[]>(() => {
    const statistics = this.statistics();

    return [
      {
        id: 'confessions',
        icon: '@tui.scroll-text',
        value: statistics.confesses ?? 0,
        label: this.translocoService.translate('profile.stats.confessions'),
      },
      {
        id: 'candles',
        icon: '@tui.flame',
        value: statistics.candles ?? 0,
        label: this.translocoService.translate('profile.stats.candles'),
      },
    ];
  });

  public readonly achievementInfo = computed<AchievementInfo>(() => this.state().achievementInfo);

  public readonly zodiac = computed<Zodiac>(() => {
    const user = this.userProfileService.user();

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

  public readonly isLoading = signal(false);

  public readonly achievementsCount = computed(() => this.achievementInfo().achievements.length);

  public readonly unlockedAchievementsCount = computed(
    () => this.achievementInfo().achievements.filter((achievement) => achievement.unlocked).length
  );

  public readonly achievementProgress = computed(() => ({
    unlocked: this.unlockedAchievementsCount(),
    total: this.achievementsCount(),
  }));

  constructor() {
    effect(() => {
      console.log(this.statistics());
      console.log(this.confessService.sins?.());
      const user = this.userProfileService.user();

      if (!user) {
        return;
      }

      this.profileForm.patchValue(
        {
          name: user.displayName ?? '',
        },
        { emitEvent: false }
      );
    });
  }

  public async submit() {
    if (this.profileForm.invalid || this.isLoading()) {
      return;
    }

    const user = this.authService.user();

    if (!user) {
      return;
    }

    this.isLoading.set(true);

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
      this.isLoading.set(false);
    }
  }
}
