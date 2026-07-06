import type { Signal } from '@angular/core';
import type { MockedFunction, MockedObject } from 'vitest';
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
  changePassword: vi.fn().mockResolvedValue(undefined),
} as const satisfies MockedObject<Partial<AuthService>>;

export const resetAuthServiceMock = (): void => {
  (authServiceMock.user as unknown as MockedFunction<() => User | null>).mockReset().mockReturnValue(null);
  (authServiceMock.isLoading as unknown as MockedFunction<() => boolean>).mockReset().mockReturnValue(false);
  (authServiceMock.error as unknown as MockedFunction<() => unknown | null>).mockReset().mockReturnValue(null);
  (authServiceMock.isAuthenticated as unknown as MockedFunction<() => boolean>).mockReset().mockReturnValue(false);
  authServiceMock.initialize.mockReset().mockResolvedValue(undefined);
  authServiceMock.loadUser.mockReset().mockResolvedValue(null);
  authServiceMock.login.mockReset().mockResolvedValue(null);
  authServiceMock.signup.mockReset().mockResolvedValue(null);
  authServiceMock.logout.mockReset().mockResolvedValue(undefined);
  authServiceMock.loginWithGithub.mockReset().mockResolvedValue(null);
  authServiceMock.loginWithGoogle.mockReset().mockResolvedValue(null);
  authServiceMock.requestPasswordRecovery.mockReset().mockResolvedValue(undefined);
};
