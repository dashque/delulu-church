import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  TuiButton,
  TuiError,
  TuiIcon,
  TuiInput,
  TuiLabel,
  tuiLoaderOptionsProvider,
  TuiTextfieldComponent,
} from '@taiga-ui/core';
import { TuiPassword } from '@taiga-ui/kit';
import { TuiCardLarge, TuiForm } from '@taiga-ui/layout';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { LoginPageFacade } from '../facades/login-page.facade';
import { LoginFormService } from '@features/login/services/login-form.service';
import { DeluluLoaderDirective } from '@shared/directives/delulu-loader/delulu-loader.directive';

@Component({
  selector: 'ngKitty-login',
  imports: [
    ReactiveFormsModule,
    TuiTextfieldComponent,
    TuiButton,
    TuiInput,
    TuiLabel,
    TuiIcon,
    TuiPassword,
    TuiCardLarge,
    TuiForm,
    TranslocoModule,
    RouterLink,
    TuiError,
    DeluluLoaderDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [
    tuiLoaderOptionsProvider({ size: 's' }),
    provideTranslocoScope('login'),
    LoginPageFacade,
    LoginFormService,
  ],
})
export class LoginComponent {
  public readonly facade = inject(LoginPageFacade);
  public readonly form = this.facade.loginForm;
}
