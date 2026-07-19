import type { DonutCounts } from '../../models/donut-count.model';

export const createEmptyDonutCounts = (): DonutCounts => ({
  sacrifice: 0,
});

export const INITIAL_DONUT_COUNTS: DonutCounts = {
  sacrifice: 1,
};
