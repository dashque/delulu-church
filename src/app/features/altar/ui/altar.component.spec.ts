import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AltarComponent } from './altar.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { CandlesService } from '@core/services/candles/candles.service';
import { candlesServiceMock } from '@core/services/candles/candles.service.mock';

describe('AltarComponent', () => {
  let component: AltarComponent;
  let fixture: ComponentFixture<AltarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltarComponent, TranslocoTestingMock],
      providers: [{ provide: CandlesService, useValue: candlesServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(AltarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });
});
