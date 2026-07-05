import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'ngKitty-prayer',
  imports: [TranslocoPipe],
  templateUrl: './prayer.component.html',
  styleUrl: './prayer.component.scss',
})
export class PrayerComponent {}
