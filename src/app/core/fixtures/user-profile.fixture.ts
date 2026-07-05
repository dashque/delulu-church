import type { UserProfile } from '@core/services/user-profile/models/user-profile.model';
import { initialUiState } from '@core/store/constants/initial-ui-state';

export const userProfileFixture = {
  uid: 'jV1w8fUKGfWX9HZh83sMJe66QT63',
  email: 'dev@example.com',
  displayName: 'abob',
  dateOfBirth: null,
  createdAt: 'server-timestamp',
  candles: 0,
  sins: 0,
  uiState: initialUiState,
} as const satisfies UserProfile;
