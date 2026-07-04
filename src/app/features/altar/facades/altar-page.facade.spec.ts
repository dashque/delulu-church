import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { AltarPageFacade } from './altar-page.facade';
import { CandlesService } from '@core/services/candles/candles.service';
import { candlesServiceMock, resetCandlesServiceMock } from '@core/services/candles/candles.service.mock';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { tuiNotificationServiceMock } from '@shared/mocks/tui-notification/tui-notification.service.mock';
import { TuiNotificationService } from '@taiga-ui/core';

describe('AltarPageFacade', () => {
  let facade: AltarPageFacade;
  const errorSignal = signal<unknown>(null);

  beforeEach(() => {
    resetCandlesServiceMock();
    errorSignal.set(null);
    tuiNotificationServiceMock.open.mockReset().mockReturnValue(of(undefined));

    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [
        AltarPageFacade,
        {
          provide: CandlesService,
          useValue: { ...candlesServiceMock, error: errorSignal.asReadonly() },
        },
        { provide: TuiNotificationService, useValue: tuiNotificationServiceMock },
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

    expect(tuiNotificationServiceMock.open).toHaveBeenCalledTimes(1);
  });

  it('должен делегировать offerCandle в CandlesService', () => {
    const candle = candlesServiceMock.candleTypes[0];

    facade.offerCandle(candle);

    expect(candlesServiceMock.offerCandle).toHaveBeenNthCalledWith(1, candle);
  });
});
