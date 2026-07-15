import { Component, input, output } from '@angular/core';
import { TuiButton, TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'ngKitty-card',
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
  public readonly title = input<string>();
  public readonly subtitle = input<string>();
  public readonly description = input<string>();
  public readonly buttonLabel = input<string>();
  public readonly badge = input<string>();
  public readonly isClickable = input<boolean>(false);

  public readonly cardClicked = output<void>();
  public readonly buttonClicked = output<void>();

  protected onCardClick() {
    if (this.isClickable()) {
      this.cardClicked.emit();
    }
  }
}
