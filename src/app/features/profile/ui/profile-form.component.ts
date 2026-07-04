import { Component, inject } from '@angular/core';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { TuiPassword } from '@taiga-ui/kit';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  TuiButton,
  TuiErrorComponent,
  TuiIcon,
  TuiInputDirective,
  TuiLoader,
  tuiLoaderOptionsProvider,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { VALIDATION_ERRORS_DICT } from '@shared/dictionaries/validation-errors.dictionary';
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@shared/constants/password-length';

@Component({
  selector: 'ngKitty-profile-form',
  imports: [
    TranslocoPipe,
    TuiInputDirective,
    TuiPassword,
    TuiButton,
    TuiLoader,
    TuiIcon,
    TuiCardLarge,
    TuiForm,
    TuiErrorComponent,
    ReactiveFormsModule,
  ],
  providers: [tuiLoaderOptionsProvider({ size: 'm' })],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
  private readonly profileFacade = inject(ProfileFacade);
  protected readonly isLoading = this.profileFacade.isLoading;
  protected readonly form = this.profileFacade.profileForm;
  protected readonly validationErrors = VALIDATION_ERRORS_DICT;
  protected readonly passwordHints = {
    minLength: PASSWORD_MIN_LENGTH,
    maxLength: PASSWORD_MAX_LENGTH,
  } as const;

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    void this.profileFacade.submit();
  }
}
