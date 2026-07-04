import type { MockedFunction, MockedObject } from 'vitest';
import { vi } from 'vitest';
import { Theme } from '@core/models/theme.model';
import type { Signal } from '@angular/core';
import type { ThemeService } from '@core/services/theme/theme.service';

export const themeServiceMock = {
  theme: vi.fn().mockReturnValue(Theme.DARK) as unknown as Signal<Theme>,
  setTheme: vi.fn(),
  toggleTheme: vi.fn().mockReturnValue(Theme.DARK),
} as const satisfies MockedObject<Partial<ThemeService>>;

export const resetThemeServiceMock = (): void => {
  (themeServiceMock.theme as unknown as MockedFunction<() => Theme>).mockReset().mockReturnValue(Theme.DARK);
  themeServiceMock.setTheme.mockReset();
  themeServiceMock.toggleTheme.mockReset().mockReturnValue(Theme.DARK);
};
