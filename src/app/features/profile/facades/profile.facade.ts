import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { PROFILE_MOCK } from '../data/fixtures/profile.fixture';
import type { AchievementInfo, Profile, ProfileData, Statistics, Zodiac } from '../data/models/profile.model';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { CandlesService } from '@core/services/candles/candles.service';
import { ConfessService } from '@core/services/confess/confess.service';
import { ProfileFormService } from '../services/profile-form/profile-form';
import { AuthService } from '@core/services/auth/auth.service';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TuiNotificationService } from '@taiga-ui/core';
import { FirebaseError } from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class ProfileFacade {
  private readonly profileFormService = inject(ProfileFormService);

  private readonly authService = inject(AuthService);

  private readonly translocoService = inject(TranslocoService);

  private readonly notifications = inject(TuiNotificationService);

  private readonly destroyRef = inject(DestroyRef);

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

      const passwordMode = !!currentPassword?.trim() && !!newPassword?.trim();

      if (passwordMode) {
        await this.userProfileService.updateProfile(user.uid, {
          displayName: name,
        });
      }
      this.profileForm.markAsPristine();

      await this.showNotification(
        this.translocoService.translate('notifications.success', {}, 'profile'),
        this.translocoService.translate('notifications.success-title', {}, 'profile'),
        'positive'
      );
    } catch (error) {
      let message = this.translocoService.translate('notifications.failure-message', {}, 'profile');

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            message = this.translocoService.translate('notifications.invalid-password', {}, 'profile');
            break;
        }
        await this.showNotification(
          message,
          this.translocoService.translate('notifications.failure-title', {}, 'profile'),
          'negative'
        );
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  private showNotification(message: string, label: string, appearance: 'positive' | 'negative') {
    this.notifications
      .open(message, {
        label: label,
        appearance: appearance,
        autoClose: 5000,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
