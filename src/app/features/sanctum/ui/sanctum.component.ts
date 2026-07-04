import { UpperCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiButton, TuiIcon, TuiInput, TuiRadio, TuiTextfieldComponent } from '@taiga-ui/core';
import { TuiBlock, TuiFade } from '@taiga-ui/kit';
import { SanctumPageFacade } from '@features/sanctum/facades/sanctum-page.facade';
import { DigitalPriestComponent } from '@features/sanctum/ui/components/digital-priest/digital-priest.component';

@Component({
  selector: 'ngKitty-sanctum',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    TuiBlock,
    TuiButton,
    TuiFade,
    TuiIcon,
    TuiInput,
    TuiRadio,
    TuiTextfieldComponent,
    UpperCasePipe,
    DigitalPriestComponent,
  ],
  templateUrl: './sanctum.component.html',
  styleUrl: './sanctum.component.scss',
})
export class SanctumComponent {
  protected readonly facade = inject(SanctumPageFacade);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.facade.invokeJudgment();
  }

  protected onPriestRaged(): void {
    this.facade.onPriestRaged();
  }
}
