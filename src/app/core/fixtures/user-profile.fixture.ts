import type { UserProfile } from '@core/services/user-profile/models/user-profile.model';
import { initialUiState } from '@core/store/constants/initial-ui-state';

export const userProfileFixture = {
  uid: 'jV1w8fUKGfWX9HZh83sMJe66QT63',
  email: 'dev@example.com',
  displayName: 'abob',
  dateOfBirth: '2000-01-07T00:00:01.651Z',
  createdAt: 'server-timestamp',
  candles: 0,
  sins: 0,
  uiState: initialUiState,
} as const satisfies UserProfile;
