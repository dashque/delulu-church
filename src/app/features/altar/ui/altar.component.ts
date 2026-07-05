import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { StatisticsComponent } from '@features/altar/ui/statistics/statistics.component';
import { PrayerComponent } from '@features/altar/ui/prayer/prayer.component';
import { InstructionsComponent } from '@features/altar/ui/instructions/instructions.component';
import { CandlesComponent } from '@features/altar/ui/candles/candles.component';
import { CandlesService } from '@core/services/candles/candles.service';

@Component({
  selector: 'ngKitty-altar',
  imports: [StatisticsComponent, PrayerComponent, InstructionsComponent, TranslocoPipe, CandlesComponent],
  templateUrl: './altar.component.html',
  styleUrl: './altar.component.scss',
})
export class AltarComponent {
  protected readonly candlesService = inject(CandlesService);
  protected readonly candleCounts = this.candlesService.candleCounts;
  protected readonly litCandleList = this.candlesService.litCandleList;
  protected readonly candleTypes = this.candlesService.candleTypes;
  protected readonly totalOfferings = this.candlesService.totalOfferings;
  protected readonly blessingLevel = this.candlesService.blessingLevel;
  protected readonly isSpiritPleased = this.candlesService.isSpiritPleased;
}
