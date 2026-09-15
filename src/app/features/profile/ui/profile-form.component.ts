import { Component, inject } from '@angular/core';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { TuiPassword } from '@taiga-ui/kit';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  TuiButton,
  TuiError,
  TuiIcon,
  TuiInputDirective,
  TuiLabel,
  tuiLoaderOptionsProvider,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { DeluluLoaderDirective } from '@shared/directives/delulu-loader/delulu-loader.directive';

@Component({
  selector: 'ngKitty-profile-form',
  imports: [
    TranslocoPipe,
    TuiInputDirective,
    TuiPassword,
    TuiButton,
    TuiLabel,
    TuiIcon,
    TuiCardLarge,
    TuiForm,
    TuiTextfieldComponent,
    ReactiveFormsModule,
    TuiError,
    DeluluLoaderDirective,
  ],
  providers: [tuiLoaderOptionsProvider({ size: 'm' })],
  templateUrl: './profile-form.component.html',
  styleUrl: './profile-form.component.scss',
})
export class ProfileFormComponent {
  private readonly profileFacade = inject(ProfileFacade);
  protected readonly isLoading = this.profileFacade.isLoading;
  protected readonly form = this.profileFacade.profileForm;

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();
    void this.profileFacade.submit();
  }
}
