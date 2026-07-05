import { signal } from '@angular/core';
import { Theme } from '@core/models/theme.model';
import { Languages } from '@core/models/languages.model';
import { vi } from 'vitest';

export const uiStateStoreMock = {
  theme: signal<Theme>(Theme.DARK),
  language: signal<Languages>(Languages.RU),
  setTheme: vi.fn(),
  setLanguage: vi.fn(),
  toggleTheme: vi.fn(),
};

export const resetUiStateStoreMock = () => {
  uiStateStoreMock.theme.set(Theme.DARK);
  uiStateStoreMock.language.set(Languages.RU);
  uiStateStoreMock.setTheme.mockReset();
  uiStateStoreMock.setLanguage.mockReset();
  uiStateStoreMock.toggleTheme.mockReset();
};
