import type { ExtractFormControl } from '@shared/models/utility-types';
import type { ProfileForm } from '@features/profile/models/profile-form.model';

export type ProfileFormValue = ExtractFormControl<ProfileForm>;
