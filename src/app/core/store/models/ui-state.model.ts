import type { Theme } from '@core/models/theme.model';
import type { Languages } from '@core/models/languages.model';

export interface UiState {
  theme: Theme;
  language: Languages;
}
