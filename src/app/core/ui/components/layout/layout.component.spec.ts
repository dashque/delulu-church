import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { LayoutService } from '@core/services/layout/layout.service';
import { layoutServiceMock } from '@core/services/layout/layout.service.mock';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { activatedRouteMock } from '@shared/mocks/activated-route/activated-route.mock';
import { uiStateStore } from '@core/store/ui-state.store';
import { resetUiStateStoreMock, uiStateStoreMock } from '@core/store/ui-state.store.mock';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetUiStateStoreMock();

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, TranslocoTestingMock],
      providers: [
        { provide: LayoutService, useValue: layoutServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: uiStateStore, useValue: uiStateStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Инициализация компонента', () => {
    it('должен инициализироваться', () => {
      expect(component).toBeTruthy();
    });

    it('должен подписаться на отслеживание ширины экрана', () => {
      expect(layoutServiceMock.watchMobileNavMediaQuery).toHaveBeenCalledTimes(1);
    });
  });

  describe('Переключение открытия сайдбара', () => {
    it('должен вызывать метод сервиса', () => {
      component.onToggleMobileNav();

      expect(layoutServiceMock.onToggleMobileNav).toHaveBeenCalledTimes(1);
    });
  });

  describe('Закрытие сайдбара', () => {
    it('должен вызывать метод сервиса', () => {
      component.onCloseMobileNav();

      expect(layoutServiceMock.onCloseMobileNav).toHaveBeenCalledTimes(1);
    });
  });
});
