import { Component, inject } from '@angular/core';
import { ShriftItemComponent } from './components/shrift-item/shrift-item.component';
import { provideTranslocoScope, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ConfessComponent } from './components/confess/confess.component';
import { ShriftPageFacade } from '../facades/shrift-page.facade';
import { ConfessFormService } from '@features/shrift/services/confess-form.service';

@Component({
  selector: 'ngKitty-shrift',
  imports: [ShriftItemComponent, ConfessComponent, TranslocoPipe],
  templateUrl: './shrift.component.html',
  styleUrl: './shrift.component.scss',
  providers: [provideTranslocoScope('shrift'), ShriftPageFacade, ConfessFormService],
})
export class ShriftComponent {
  protected readonly facade = inject(ShriftPageFacade);
  protected readonly translocoService = inject(TranslocoService);

  protected async onDelete(sinUid: string) {
    await this.facade.onDelete(sinUid);
  }
}
