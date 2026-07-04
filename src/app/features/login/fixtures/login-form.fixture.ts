import { FormControl, FormGroup } from '@angular/forms';

export const loginFormFixture = new FormGroup({
  email: new FormControl('', { nonNullable: true }),
  password: new FormControl('', { nonNullable: true }),
});
