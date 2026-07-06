import { Component, computed, input, output, signal } from '@angular/core';
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
})
export class CandlesComponent {
  private readonly isDragActive = signal(false);

  public readonly candleListChanged = output<CandleType>();
  public readonly candleList = input.required<CandleType[]>();
  public readonly litCandleList = input.required<LitCandle[]>();
  public readonly candleCountsMap = input.required<CandleCounts>();

  protected readonly altarDropListData: CandleType[] = [];
  protected readonly canOfferCandle = computed(() => !this.isDragActive());

  protected offerCandle(candle: CandleType): void {
    if (!this.canOfferCandle()) {
      return;
    }

    this.candleListChanged.emit(candle);
  }

  protected onCandleKeydown(event: KeyboardEvent, candle: CandleType): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.offerCandle(candle);
  }

  protected onDragStarted(): void {
    this.isDragActive.set(true);
  }

  protected onDragEnded(): void {
    this.isDragActive.set(false);
  }

  protected onDrop(event: CdkDragDrop<CandleType[]>): void {
    if (event.container.id !== 'altar-drop-list' || event.previousContainer.id !== 'candles-source') {
      return;
    }

    this.offerCandle(event.previousContainer.data[event.previousIndex]);
  }
}
