import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TranslocoService } from '@jsverse/transloco';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { LanguageSwitcherComponent } from './language-switcher.component';
import { signal } from '@angular/core';
import { Languages } from '@core/models/languages.model';
import { uiStateStore } from '@core/store/ui-state.store';
import { resetUiStateStoreMock, uiStateStoreMock } from '@core/store/ui-state.store.mock';

describe('LanguageSwitcherComponent', () => {
  let component: LanguageSwitcherComponent;
  let fixture: ComponentFixture<LanguageSwitcherComponent>;

  const mockTranslocoService = {
    getActiveLang: vi.fn().mockReturnValue(Languages.RU),
    getAvailableLangs: vi.fn().mockReturnValue(Object.values(Languages)),
    setActiveLang: vi.fn(),
    activeLang: signal(Languages.RU),
  };

  beforeEach(async () => {
    resetUiStateStoreMock();

    await TestBed.configureTestingModule({
      imports: [LanguageSwitcherComponent, TranslocoTestingMock],
      providers: [
        { provide: TranslocoService, useValue: mockTranslocoService },
        { provide: uiStateStore, useValue: uiStateStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Компонент инициализирован', () => {
    it('должен инициализироваться', () => {
      expect(component).toBeTruthy();
    });

    it('должен получить список доступных языков', async () => {
      expect(mockTranslocoService.getAvailableLangs).toHaveBeenCalled();
    });
  });
});
