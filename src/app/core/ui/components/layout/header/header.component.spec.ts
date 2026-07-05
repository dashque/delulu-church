import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { ActivatedRoute } from '@angular/router';
import { activatedRouteMock } from '@shared/mocks/activated-route/activated-route.mock';
import { uiStateStore } from '@core/store/ui-state.store';
import { resetUiStateStoreMock, uiStateStoreMock } from '@core/store/ui-state.store.mock';

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    resetUiStateStoreMock();

    await TestBed.configureTestingModule({
      imports: [HeaderComponent, TranslocoTestingMock],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: uiStateStore, useValue: uiStateStoreMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    fixture.componentRef.setInput('isSpiritPleased', false);
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
