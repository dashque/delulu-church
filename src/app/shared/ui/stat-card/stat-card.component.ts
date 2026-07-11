import { Component, input, output } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';
import type { StatCard } from '@features/profile/data/models/stats-card.model';

@Component({
  selector: 'ngKitty-stat-card',
  standalone: true,
  imports: [TuiIcon],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
  host: {
    '[attr.tabindex]': 'isClickable() ? 0 : null',
    '(click)': 'onCardClick()',
    '(keydown.enter)': 'onCardClick()',
  },
})
export class StatCardComponent {
  public readonly stat = input.required<StatCard>();

  public readonly isClickable = input<boolean>(false);

  public readonly cardClicked = output<void>();
  public readonly buttonClicked = output<void>();

  protected onCardClick() {
    if (this.isClickable()) {
      this.cardClicked.emit();
    }
  }

  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.buttonClicked.emit();
  }
}
