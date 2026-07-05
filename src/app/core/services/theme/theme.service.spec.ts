import { TestBed } from '@angular/core/testing';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { createTuiDarkModeMock } from '@shared/mocks/tui-dark-mode/tui-dark-mode.mock';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: TUI_DARK_MODE, useValue: createTuiDarkModeMock() }],
    });
    service = TestBed.inject(ThemeService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });
});
