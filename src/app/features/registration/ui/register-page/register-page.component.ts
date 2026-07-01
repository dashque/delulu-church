import { Component, inject } from '@angular/core';
import { RegisterPageFacade } from '@features/registration/facades/register-page.facade';
import { TuiInputDate, tuiInputDateOptionsProvider, TuiPassword } from '@taiga-ui/kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiButton, TuiError, TuiIcon, TuiInputDirective, TuiLoader, tuiLoaderOptionsProvider } from '@taiga-ui/core';

import { RouterLink } from '@angular/router';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'ngKitty-register-page',
  imports: [
    TranslocoPipe,
    TuiInputDirective,
    TuiPassword,
    TuiButton,
    TuiLoader,
    RouterLink,
    TuiIcon,
    TuiCardLarge,
    TuiForm,
    TuiError,
    ReactiveFormsModule,
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
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly registerPageFacade = inject(RegisterPageFacade);
  public readonly form = this.registerPageFacade.registerForm;
  protected readonly isLoading = this.registerPageFacade.isLoading;

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    void this.registerPageFacade.signup();
  }
}
