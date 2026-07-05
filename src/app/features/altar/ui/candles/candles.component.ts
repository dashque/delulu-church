import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import type { CandleType } from '@core/services/candles/models/candle-type.model';
import type { LitCandle } from '@core/services/candles/models/lit-candle.model';
import type { CandleCounts } from '@core/services/candles/models/candle-counts.model';

@Component({
  selector: 'ngKitty-candles',
  imports: [TuiIcon, TranslocoPipe, CdkDrag, CdkDropList],
  templateUrl: './candles.component.html',
  styleUrl: './candles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CandlesComponent {
  public readonly candleListChanged = output<CandleType>();
  public readonly candleList = input.required<CandleType[]>();
  public readonly litCandleList = input.required<LitCandle[]>();
  public readonly candleCountsMap = input.required<CandleCounts>();

  protected onDrop(event: CdkDragDrop<CandleType[]>): void {
    if (event.container.id !== 'altar-drop-list' || event.previousContainer.id !== 'candles-source') {
      return;
    }

    const candle = event.previousContainer.data[event.previousIndex];

    this.candleListChanged.emit(candle);
  }
}
