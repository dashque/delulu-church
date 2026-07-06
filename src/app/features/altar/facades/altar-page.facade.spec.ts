import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { AltarPageFacade } from './altar-page.facade';
import { CandlesService } from '@core/services/candles/candles.service';
import { candlesServiceMock, resetCandlesServiceMock } from '@core/services/candles/candles.service.mock';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { hotToastServiceMock } from '@shared/mocks/hot-toast/hot-toast.service.mock';
import { HotToastService } from '@ngxpert/hot-toast';

describe('AltarPageFacade', () => {
  let facade: AltarPageFacade;
  const errorSignal = signal<unknown>(null);

  beforeEach(() => {
    resetCandlesServiceMock();
    errorSignal.set(null);
    hotToastServiceMock.error.mockReset();

    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [
        AltarPageFacade,
        {
          provide: CandlesService,
          useValue: { ...candlesServiceMock, error: errorSignal.asReadonly() },
        },
        { provide: HotToastService, useValue: hotToastServiceMock },
      ],
    });
    facade = TestBed.inject(AltarPageFacade);
  });

  it('должен инициализироваться', () => {
    expect(facade).toBeTruthy();
  });

  it('должен показать уведомление при ошибке CandlesService', () => {
    errorSignal.set(new Error('Firestore error'));
    TestBed.flushEffects();

    expect(hotToastServiceMock.error).toHaveBeenCalledTimes(1);
  });

  it('должен делегировать offerCandle в CandlesService', () => {
    const candle = candlesServiceMock.candleTypes[0];

    facade.offerCandle(candle);

    expect(candlesServiceMock.offerCandle).toHaveBeenNthCalledWith(1, candle);
  });
});
