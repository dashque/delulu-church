import { Component, input, output } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'ngKitty-stat-card',
  imports: [TuiIcon, TuiButton],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  host: {
    '[attr.tabindex]': 'isClickable() ? 0 : null',
    '(click)': 'onCardClick()',
    '(keydown.enter)': 'onCardClick()',
  },
})
export class CardComponent {
  public readonly icon = input<string>();
  public readonly statNumber = input<string>();
  public readonly statLabel = input<string>();
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
