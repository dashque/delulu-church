import { signal } from '@angular/core';
import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import type { DonutService } from '../donut/donut.service';
import type { DonutCounts } from '../donut/models/donut-count.model';
import { createEmptyDonutCounts } from '../donut/data/constants/donut-count.constants';

const donutCountsSignal = signal<DonutCounts>(createEmptyDonutCounts());
const totalDonutsSignal = signal(0);

const getTotal = (counts: DonutCounts): number =>
  (Object.values(counts) as number[]).reduce((sum, count) => sum + count, 0);

export const donutServiceMock = {
  donutCounts: donutCountsSignal.asReadonly(),
  totalDonuts: totalDonutsSignal.asReadonly(),
  setDonutCounts: vi.fn((counts: DonutCounts) => {
    donutCountsSignal.set(counts);
    totalDonutsSignal.set(getTotal(counts));
  }),
  reset: vi.fn(() => {
    donutCountsSignal.set(createEmptyDonutCounts());
    totalDonutsSignal.set(0);
  }),
} as const satisfies MockedObject<Partial<DonutService>>;

export const resetDonutServiceMock = (): void => {
  donutCountsSignal.set(createEmptyDonutCounts());
  totalDonutsSignal.set(0);
  donutServiceMock.setDonutCounts.mockClear();
  donutServiceMock.reset.mockClear();
};

export const setDonutServiceMockCounts = (counts: DonutCounts): void => {
  donutCountsSignal.set(counts);
  totalDonutsSignal.set(getTotal(counts));
};
