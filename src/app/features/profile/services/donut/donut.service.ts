import { computed, Injectable, signal } from '@angular/core';
import type { DonutCounts } from './models/donut-count.model';
import { createEmptyDonutCounts } from './data/constants/donut-count.constants';
import { INITIAL_DONUT_COUNTS } from './data/constants/donut-count.constants';

@Injectable()
export class DonutService {
  private readonly _donutCounts = signal<DonutCounts>(createEmptyDonutCounts());
  public readonly donutCounts = this._donutCounts.asReadonly();
  public readonly totalDonuts = computed(() => {
    const counts = Object.values(this._donutCounts()) as number[];

    return counts.reduce((sum, count) => sum + count, 0);
  });

  constructor() {
    this.setDonutCounts(INITIAL_DONUT_COUNTS);
  }
  public setDonutCounts(counts: DonutCounts): void {
    this._donutCounts.set(counts);
  }

  public reset(): void {
    this._donutCounts.set(createEmptyDonutCounts());
  }
}
