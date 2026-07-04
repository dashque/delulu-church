import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'ngKitty-wisdom',
  imports: [TranslocoPipe],
  templateUrl: './wisdom.component.html',
  styleUrl: './wisdom.component.scss',
})
export class WisdomComponent {}
