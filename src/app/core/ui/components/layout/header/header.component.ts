import { Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TuiButton, TuiIcon, TuiTitle } from '@taiga-ui/core';
import { TuiHeader } from '@taiga-ui/layout';
import { LanguageSwitcherComponent } from '@core/ui/components/language-switcher/language-switcher.component';
import { RouterLink } from '@angular/router';
import { MachineSpiritStatePipe } from '@shared/pipes/machine-spirit-state.pipe';

@Component({
  selector: 'ngKitty-header',
  imports: [
    TranslocoPipe,
    TuiTitle,
    TuiHeader,
    TuiButton,
    LanguageSwitcherComponent,
    TuiIcon,
    RouterLink,
    MachineSpiritStatePipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  public readonly themeChanged = output<void>();
  public readonly isSpiritPleased = input.required<boolean>();
}
