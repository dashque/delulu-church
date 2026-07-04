import { signal } from '@angular/core';
import type { MockedObject } from 'vitest';
import { vi } from 'vitest';

import type { ConfessService } from '@core/services/confess/confess.service';
import type { Sin } from '@features/shrift/models/sin.model';

const sinsSignal = signal<Sin[] | null>(null);
const isLoadingSignal = signal(false);

export const confessServiceMock = {
  sins: sinsSignal.asReadonly(),
  isLoading: isLoadingSignal.asReadonly(),
  loadSins: vi.fn().mockResolvedValue(undefined),
  addSin: vi.fn().mockResolvedValue(undefined),
  deleteSin: vi.fn().mockResolvedValue(undefined),
  getSinsCount: vi.fn().mockResolvedValue(0),
  updateSinsCount: vi.fn().mockResolvedValue(undefined),
  error: signal(null).asReadonly(),
} as const satisfies MockedObject<Partial<ConfessService>>;

export const resetConfessServiceMock = (): void => {
  sinsSignal.set(null);
  isLoadingSignal.set(false);
  confessServiceMock.loadSins.mockReset().mockResolvedValue(undefined);
  confessServiceMock.addSin.mockReset().mockResolvedValue(undefined);
  confessServiceMock.deleteSin.mockReset().mockResolvedValue(undefined);
  confessServiceMock.getSinsCount.mockReset().mockResolvedValue(0);
  confessServiceMock.updateSinsCount.mockReset().mockResolvedValue(undefined);
};

export const setConfessServiceMockSins = (sins: Sin[] | null): void => {
  sinsSignal.set(sins);
};
