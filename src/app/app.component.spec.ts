import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TuiRootComponentMock } from '@shared/mocks/tui-root/tui-root.component.mock';
import { TuiRoot } from '@taiga-ui/core';
import { uiStateStore } from '@core/store/ui-state.store';
import { uiStateStoreMock } from '@core/store/ui-state.store.mock';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    TestBed.overrideComponent(AppComponent, {
      add: {
        imports: [TuiRootComponentMock],
      },
      remove: {
        imports: [TuiRoot],
      },
    });

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [{ provide: uiStateStore, useValue: uiStateStoreMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
