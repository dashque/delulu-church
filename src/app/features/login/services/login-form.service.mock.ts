import type { MockedObject } from 'vitest';

import { loginFormFixture } from '@features/login/fixtures/login-form.fixture';
import type { LoginFormService } from '@features/login/services/login-form.service';

export const loginFormServiceMock = {
  loginForm: loginFormFixture,
} as const satisfies MockedObject<Partial<LoginFormService>>;
