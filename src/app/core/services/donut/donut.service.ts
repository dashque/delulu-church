import { computed, Injectable, signal } from '@angular/core';
import type { DonutCounts } from '@core/services/donut/models/donut-count.model';

export const createEmptyDonutCounts = (): DonutCounts => ({
  sacrifice: 0,
});

export const INITIAL_DONUT_COUNTS: DonutCounts = {
  sacrifice: 1,
};

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
