import type { PipeTransform } from '@angular/core';
import { inject, Pipe } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Pipe({
  name: 'machineSpiritState',
  pure: false,
})
export class MachineSpiritStatePipe implements PipeTransform {
  private readonly translocoService = inject(TranslocoService);
  transform(value: boolean): string {
    return value
      ? this.translocoService.translate(marker('header.status_pleased'))
      : this.translocoService.translate(marker('header.status_unstable'));
  }
}
