import type { Signal } from '@angular/core';
import type { MockedObject } from 'vitest';
import { vi } from 'vitest';

import type { AuthService } from '@core/services/auth/auth.service';
import type { User } from 'firebase/auth';

export const authServiceMock = {
  user: vi.fn().mockReturnValue(null) as unknown as Signal<null | User>,
  isLoading: vi.fn().mockReturnValue(false) as unknown as Signal<boolean>,
  error: vi.fn().mockReturnValue(null) as unknown as Signal<unknown | null>,
  isAuthenticated: vi.fn().mockReturnValue(false) as unknown as Signal<boolean>,
  initialize: vi.fn().mockResolvedValue(undefined),
  loadUser: vi.fn().mockResolvedValue(null),
  login: vi.fn().mockResolvedValue(null),
  signup: vi.fn().mockResolvedValue(null),
  logout: vi.fn().mockResolvedValue(undefined),
  loginWithGithub: vi.fn().mockResolvedValue(null),
  loginWithGoogle: vi.fn().mockResolvedValue(null),
  requestPasswordRecovery: vi.fn().mockResolvedValue(undefined),
} as const satisfies MockedObject<Partial<AuthService>>;
