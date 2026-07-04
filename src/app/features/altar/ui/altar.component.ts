import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { StatisticsComponent } from '@features/altar/ui/statistics/statistics.component';
import { PrayerComponent } from '@features/altar/ui/prayer/prayer.component';
import { InstructionsComponent } from '@features/altar/ui/instructions/instructions.component';
import { CandlesComponent } from '@features/altar/ui/candles/candles.component';
import { AltarPageFacade } from '@features/altar/facades/altar-page.facade';

@Component({
  selector: 'ngKitty-altar',
  imports: [StatisticsComponent, PrayerComponent, InstructionsComponent, TranslocoPipe, CandlesComponent],
  templateUrl: './altar.component.html',
  styleUrl: './altar.component.scss',
})
export class AltarComponent {
  protected readonly facade = inject(AltarPageFacade);
  protected readonly candleCounts = this.facade.candleCounts;
  protected readonly litCandleList = this.facade.litCandleList;
  protected readonly candleTypes = this.facade.candleTypes;
  protected readonly totalOfferings = this.facade.totalOfferings;
  protected readonly blessingLevel = this.facade.blessingLevel;
  protected readonly isSpiritPleased = this.facade.isSpiritPleased;
}
