import { FormControl, FormGroup } from '@angular/forms';

import type { Severity } from '@features/shrift/models/sin.model';

export const confessFormFixture = new FormGroup({
  text: new FormControl('', { nonNullable: true }),
  severity: new FormControl<Severity>('low', { nonNullable: true }),
});
