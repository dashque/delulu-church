import type { UserProfile } from '@core/services/user-profile/models/user-profile.model';
import type { Achievement } from '@features/profile/models/achievement.model';
import type { Zodiac } from '@features/profile/models/zodiac.model';

export type Profile = Omit<UserProfile, 'uiState' | 'createdAt' | 'dateOfBirth'> & {
  avatarUrl: string;
  dateOfBirth: string | null;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
};

export interface Statistics {
  confesses: number;
  candles: number;
  donuts: number;
}

export interface AchievementInfo {
  total: number;
  unlocked: number;
  achievements: Achievement[];
}

export interface ProfileData {
  profile: Profile;
  statistics: Statistics;
  achievementInfo: AchievementInfo;
  zodiac: Zodiac;
}
