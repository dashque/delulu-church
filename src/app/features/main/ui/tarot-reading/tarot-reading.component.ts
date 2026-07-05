import type { ElementRef } from '@angular/core';
import { Component, computed, effect, input, viewChildren } from '@angular/core';
import type { TarotResponseApi } from '@features/main/data/api/models/deploy-tarot-response-api.model';
import { TuiIcon } from '@taiga-ui/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'ngKitty-tarot-reading',
  imports: [TuiIcon, TranslocoPipe, UpperCasePipe],
  templateUrl: './tarot-reading.component.html',
  styleUrl: './tarot-reading.component.scss',
})
export class TarotReadingComponent {
  private readonly tarotCardElementList = viewChildren<ElementRef<HTMLDetailsElement>>('tarotCard');
  public readonly tarotReading = input.required<TarotResponseApi | null>();
  protected readonly verdictClassName = computed(() => {
    return 'tarot-verdict ' + this.tarotReading()?.verdict;
  });

  constructor() {
    effect(() => {
      const tarotReading = this.tarotReading();
      const tarotCardElementList = this.tarotCardElementList();

      if (!tarotReading) {
        return;
      }

      for (const tarotCardElement of tarotCardElementList) {
        tarotCardElement.nativeElement.open = false;
      }
    });
  }
}
