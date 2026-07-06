import { vi } from 'vitest';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CandlesComponent } from './candles.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { CANDLE_TYPES_CONFIG } from '@core/services/candles/constants/candle-types.config';
import { candleCountsMapFixture } from '@features/altar/fixtures/candle-counts-map.fixture';

describe('CandlesComponent', () => {
  let component: CandlesComponent;
  let fixture: ComponentFixture<CandlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandlesComponent, TranslocoTestingMock],
    }).compileComponents();

    fixture = TestBed.createComponent(CandlesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('candleList', CANDLE_TYPES_CONFIG);
    fixture.componentRef.setInput('litCandleList', []);
    fixture.componentRef.setInput('candleCountsMap', candleCountsMapFixture);
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });

  it('должен эмитить candleListChanged при клике на свечу', () => {
    const emitSpy = vi.spyOn(component.candleListChanged, 'emit');
    const candle = CANDLE_TYPES_CONFIG[0];

    (fixture.nativeElement.querySelector('.candle') as HTMLElement).click();

    expect(emitSpy).toHaveBeenCalledWith(candle);
  });
});
