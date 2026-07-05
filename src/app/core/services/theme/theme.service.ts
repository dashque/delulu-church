import { computed, inject, Service } from '@angular/core';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { Theme } from '@core/models/theme.model';

@Service()
export class ThemeService {
  private readonly _theme = inject(TUI_DARK_MODE);
  public readonly theme = computed(() => (this._theme() ? Theme.DARK : Theme.LIGHT));

  public setTheme(theme: Theme) {
    this._theme.set(theme === Theme.DARK);
  }

  public toggleTheme() {
    this._theme.set(!this._theme());

    return this.theme();
  }
}
