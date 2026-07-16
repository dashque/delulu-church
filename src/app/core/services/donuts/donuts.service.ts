import { computed, Service, signal } from '@angular/core';
import type { DonutCounts } from '@core/services/donuts/models/donut-count.model';
import { createEmptyDonutCounts } from '@core/services/donuts/models/donut-count.model';
import { DONUTS_MOCK } from './donuts.service.mock';

@Service()
export class DonutService {
  private readonly _donutCounts = signal<DonutCounts>(createEmptyDonutCounts());
  public readonly donutCounts = this._donutCounts.asReadonly();
  public readonly totalDonuts = computed(() => {
    const counts = Object.values(this._donutCounts()) as number[];

    return counts.reduce((sum, count) => sum + count, 0);
  });

  constructor() {
    this.setDonutCounts(DONUTS_MOCK);
  }
  public setDonutCounts(counts: DonutCounts): void {
    this._donutCounts.set(counts);
  }

  public reset(): void {
    this._donutCounts.set(createEmptyDonutCounts());
  }
}
