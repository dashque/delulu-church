import type { UserProfile } from '@core/services/user-profile/models/user-profile.model';

export type Profile = Omit<UserProfile, 'uiState' | 'createdAt'> & {
  avatarUrl: string;
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

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export interface AchievementInfo {
  total: number;
  unlocked: number;
  achievements: Achievement[];
}

export interface Zodiac {
  sign: string;
  description: string;
  icon: string;
}
export interface ProfileData {
  profile: Profile;
  statistics: Statistics;
  achievementInfo: AchievementInfo;
  zodiac: Zodiac;
}
