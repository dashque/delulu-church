import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { ConfessComponent } from './confess.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { ShriftPageFacade } from '@features/shrift/facades/shrift-page.facade';
import { ConfessFormService } from '@features/shrift/services/confess-form.service';
import { ConfessService } from '@core/services/confess/confess.service';
import { confessServiceMock, resetConfessServiceMock } from '@core/services/confess/confess.service.mock';

describe('ConfessComponent', () => {
  let component: ConfessComponent;
  let fixture: ComponentFixture<ConfessComponent>;

  beforeEach(async () => {
    resetConfessServiceMock();

    await TestBed.configureTestingModule({
      imports: [ConfessComponent, TranslocoTestingMock],
      providers: [ShriftPageFacade, ConfessFormService, { provide: ConfessService, useValue: confessServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Компонент инициализирован', () => {
    it('должен инициализироваться', () => {
      expect(component).toBeTruthy();
    });
  });
});
