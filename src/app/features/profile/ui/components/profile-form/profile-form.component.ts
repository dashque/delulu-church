import { Component, input, output } from '@angular/core';
import { TuiInputDateDirective, TuiInputPhone, TuiPassword } from '@taiga-ui/kit';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  TuiButton,
  TuiCalendar,
  TuiError,
  TuiIcon,
  TuiInputDirective,
  TuiLabel,
  TuiLoader,
  tuiLoaderOptionsProvider,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import type { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import type { ProfileForm } from '@features/profile/models/profile-form.model';

@Component({
  selector: 'ngKitty-profile-form',
  imports: [
    TranslocoPipe,
    TuiInputDirective,
    TuiPassword,
    TuiButton,
    TuiLabel,
    TuiLoader,
    TuiIcon,
    TuiCardLarge,
    TuiForm,
    TuiTextfieldComponent,
    ReactiveFormsModule,
    TuiError,
    TuiCalendar,
    TuiInputDateDirective,
    TuiInputPhone,
  ],
  providers: [tuiLoaderOptionsProvider({ size: 'm' })],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
  public readonly isLoading = input.required<boolean>();
  public readonly form = input.required<FormGroup<ProfileForm>>();
  public readonly formSubmitted = output<void>();
}
