import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { marker } from '@jsverse/transloco-keys-manager/marker';

@Pipe({
  name: 'machineSpiritState',
})
export class MachineSpiritStatePipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? marker('header.status_pleased') : marker('header.status_unstable');
  }
}
