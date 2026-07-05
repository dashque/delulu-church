import { signal } from '@angular/core';
import { vi } from 'vitest';

export function createTuiDarkModeMock(initialValue = false) {
  return Object.assign(signal(initialValue), {
    reset: vi.fn(),
  });
}

export const tuiDarkModeMock = createTuiDarkModeMock();
