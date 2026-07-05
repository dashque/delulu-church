import { Theme } from '@core/models/theme.model';
import { Languages } from '@core/models/languages.model';
import type { UiState } from '@core/store/models/ui-state.model';

export const initialUiState: UiState = {
  theme: Theme.DARK,
  language: Languages.RU,
};
