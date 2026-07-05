import type { UiState } from '@core/store/models/ui-state.model';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  dateOfBirth: unknown;
  createdAt: unknown;
  candles: number;
  sins: number;
  uiState: UiState;
}
