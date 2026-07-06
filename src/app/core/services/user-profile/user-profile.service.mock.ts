import type { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { userProfileFixture } from '@core/fixtures/user-profile.fixture';
import type { Signal } from '@angular/core';
import type { MockedFunction, MockedObject } from 'vitest';
import { vi } from 'vitest';
import type { UserProfile } from './models/user-profile.model';

export const userProfileServiceMock = {
  user: vi.fn().mockReturnValue(null) as unknown as Signal<UserProfile | null>,
  loadProfile: vi.fn().mockResolvedValue(userProfileFixture),
  createProfile: vi.fn().mockResolvedValue(undefined),
  ensureProviderProfile: vi.fn().mockResolvedValue(undefined),
  updateProfile: vi.fn().mockResolvedValue(undefined),
  updateUiState: vi.fn().mockResolvedValue(undefined),
  clearProfile: vi.fn(),
} as const satisfies MockedObject<Partial<UserProfileService>>;

export const resetUserProfileServiceMock = (): void => {
  (userProfileServiceMock.user as unknown as MockedFunction<() => UserProfile | null>)
    .mockReset()
    .mockReturnValue(null);
  userProfileServiceMock.loadProfile.mockReset().mockResolvedValue(userProfileFixture);
  userProfileServiceMock.createProfile.mockReset().mockResolvedValue(undefined);
  userProfileServiceMock.ensureProviderProfile.mockReset().mockResolvedValue(undefined);
  userProfileServiceMock.updateProfile.mockReset().mockResolvedValue(undefined);
  userProfileServiceMock.updateUiState.mockReset().mockResolvedValue(undefined);
  userProfileServiceMock.clearProfile.mockReset();
};
