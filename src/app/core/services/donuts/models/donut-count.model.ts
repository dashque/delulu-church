export interface DonutCounts {
  sacrifice: number;
}

export const createEmptyDonutCounts = (): DonutCounts => ({
  sacrifice: 0,
});
