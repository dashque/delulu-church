import { Component, input, output } from '@angular/core';
import { TuiInputDate, TuiInputDateDirective, tuiInputDateOptionsProvider, TuiPassword } from '@taiga-ui/kit';
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
import { TuiDay } from '@taiga-ui/cdk';

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
    ...TuiInputDate,
  ],
  providers: [
    tuiLoaderOptionsProvider({ size: 'm' }),
    tuiInputDateOptionsProvider({
      valueTransformer: {
        fromControlValue: (value: Date | null): TuiDay | null => value && TuiDay.fromUtcNativeDate(value),
        toControlValue: (value: TuiDay | null): Date | null => value?.toUtcNativeDate() || null,
      },
    }),
  ],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
  public readonly isLoading = input.required<boolean>();
  public readonly form = input.required<FormGroup<ProfileForm>>();
  public readonly formSubmitted = output<void>();
}
