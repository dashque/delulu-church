import type { MockedObject } from 'vitest';

import { confessFormFixture } from '@features/shrift/fixtures/confess-form.fixture';
import type { ConfessFormService } from '@features/shrift/services/confess-form.service';

export const confessFormServiceMock = {
  confessForm: confessFormFixture,
} as const satisfies MockedObject<Partial<ConfessFormService>>;
