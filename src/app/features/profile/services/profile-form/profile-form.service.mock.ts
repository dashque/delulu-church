import type { MockedObject } from 'vitest';
import type { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';
import { profileFormFixture } from '@features/profile/fixtures/profile-form.fixture';
import { EMPTY } from 'rxjs';

export const profileFormServiceMock = {
  form: profileFormFixture,
  setFormValue: vi.fn(),
  get formValueChanges() {
    return EMPTY;
  },
} as const satisfies MockedObject<Partial<ProfileFormService>>;
