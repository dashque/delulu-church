import { TranslocoTestingModule } from '@jsverse/transloco';
import { Languages } from '@core/models/languages.model';
import { initialUiState } from '@core/store/constants/initial-ui-state';

export const TranslocoTestingMock = TranslocoTestingModule.forRoot({
  langs: { en: {}, ru: {} },
  translocoConfig: {
    availableLangs: Object.values(Languages),
    defaultLang: initialUiState.language,
  },
});
