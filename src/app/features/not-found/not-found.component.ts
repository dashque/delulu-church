import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'ngKitty-not-found',
  imports: [TuiButton, TuiIcon, TranslocoModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  providers: [provideTranslocoScope('not-found')],
})
export class NotFoundComponent {
  private readonly router = inject(Router);

  protected onClick() {
    this.router.navigate(['/']);
  }
}
