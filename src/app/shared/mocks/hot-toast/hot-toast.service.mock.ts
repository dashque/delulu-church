import type { MockedObject } from 'vitest';
import type { HotToastService } from '@ngxpert/hot-toast';
import { vi } from 'vitest';

export const hotToastServiceMock = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  loading: vi.fn(),
  show: vi.fn(),
} as const satisfies MockedObject<Pick<HotToastService, 'success' | 'error' | 'warning' | 'info' | 'loading' | 'show'>>;
