import { Component, inject } from '@angular/core';
import { EyeBlinkDirective } from './directives/eye-blink.directive';
import { CoderQuotesService } from './services/coder-quotes.service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'ngKitty-ghost-coder',
  imports: [EyeBlinkDirective, TranslocoPipe],
  templateUrl: './ghost-coder.component.html',
  styleUrl: './ghost-coder.component.scss',
  host: {
    '(click)': 'onClick()',
  },
})
export class GhostCoderComponent {
  private readonly service = inject(CoderQuotesService);
  protected readonly currentQuote = this.service.randomQuote;

  public async onClick() {
    await this.service.loadRandomQuote();
  }
}
