import { Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { MachineSpiritStatePipe } from '@shared/pipes/machine-spirit-state.pipe';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'ngKitty-statistics',
  imports: [TranslocoPipe, MachineSpiritStatePipe, UpperCasePipe],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  public readonly totalOfferings = input.required<number>();
  public readonly blessingLevel = input.required<number>();
  public readonly isSpiritPleased = input.required<boolean>();
}
