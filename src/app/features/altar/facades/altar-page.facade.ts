import { effect, inject, Service } from '@angular/core';
import { CandlesService } from '@core/services/candles/candles.service';
import type { CandleType } from '@core/services/candles/models/candle-type.model';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';
import { TranslocoService } from '@jsverse/transloco';
import { HotToastService } from '@ngxpert/hot-toast';

@Service({
  autoProvided: false,
})
export class AltarPageFacade {
  private readonly notifications = inject(HotToastService);
  private readonly translocoService = inject(TranslocoService);
  private readonly candlesService = inject(CandlesService);
  public readonly candleCounts = this.candlesService.candleCounts;
  public readonly litCandleList = this.candlesService.litCandleList;
  public readonly candleTypes = this.candlesService.candleTypes;
  public readonly totalOfferings = this.candlesService.totalOfferings;
  public readonly blessingLevel = this.candlesService.blessingLevel;
  public readonly isSpiritPleased = this.candlesService.isSpiritPleased;

  public constructor() {
    effect(() => {
      const error = this.candlesService.error();

      if (!error) {
        return;
      }

      void this.notifications.error(
        `${this.translocoService.translate('notifications.failure', {}, 'altar')}
        ${toErrorMessage(error)}`
      );
    });
  }

  public offerCandle(candle: CandleType): void {
    this.candlesService.offerCandle(candle);
  }
}
