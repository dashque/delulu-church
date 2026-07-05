import { Component, inject } from '@angular/core';
import { ShriftItemComponent } from './components/shrift-item/shrift-item.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ConfessComponent } from './components/confess/confess.component';
import { ShriftPageFacade } from '../facades/shrift-page.facade';

@Component({
  selector: 'ngKitty-shrift',
  imports: [ShriftItemComponent, ConfessComponent, TranslocoPipe],
  templateUrl: './shrift.component.html',
  styleUrl: './shrift.component.scss',
})
export class ShriftComponent {
  protected readonly facade = inject(ShriftPageFacade);
  protected readonly translocoService = inject(TranslocoService);

  protected onDelete(sinUid: string) {
    this.facade.onDelete(sinUid);
  }
}
