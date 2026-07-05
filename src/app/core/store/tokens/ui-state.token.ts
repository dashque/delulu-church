import { InjectionToken } from '@angular/core';
import { initialUiState } from '@core/store/constants/initial-ui-state';

export const UI_STATE = new InjectionToken('UiState', {
  factory: () => initialUiState,
});
