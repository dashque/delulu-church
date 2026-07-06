import { TestBed } from '@angular/core/testing';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { createTuiDarkModeMock } from '@shared/mocks/tui-dark-mode/tui-dark-mode.mock';
import { Theme } from '@core/models/theme.model';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let darkModeSignal: ReturnType<typeof createTuiDarkModeMock>;

  beforeEach(() => {
    darkModeSignal = createTuiDarkModeMock(false);

    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: TUI_DARK_MODE, useValue: darkModeSignal }],
    });
    service = TestBed.inject(ThemeService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Текущая тема', () => {
    it('должен вернуть светлую тему, если dark mode выключен', () => {
      expect(service.theme()).toBe(Theme.LIGHT);
    });

    it('должен вернуть тёмную тему, если dark mode включен', () => {
      darkModeSignal.set(true);

      expect(service.theme()).toBe(Theme.DARK);
    });
  });

  describe('Установка темы', () => {
    it('должен включить dark mode для тёмной темы', () => {
      service.setTheme(Theme.DARK);

      expect(darkModeSignal()).toBe(true);
    });

    it('должен выключить dark mode для светлой темы', () => {
      darkModeSignal.set(true);

      service.setTheme(Theme.LIGHT);

      expect(darkModeSignal()).toBe(false);
    });
  });

  describe('Переключение темы', () => {
    it('должен переключить тему и вернуть новое значение', () => {
      expect(service.toggleTheme()).toBe(Theme.DARK);
      expect(service.theme()).toBe(Theme.DARK);
    });
  });
});
