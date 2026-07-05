import { Component, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiTextfield } from '@taiga-ui/core';
import { TuiButtonSelect, TuiDataListWrapper } from '@taiga-ui/kit';
import { uiStateStore } from '@core/store/ui-state.store';
import type { Languages } from '@core/models/languages.model';

@Component({
  selector: 'ngKitty-language-switcher',
  imports: [FormsModule, TuiButton, TuiButtonSelect, TuiDataListWrapper, TuiTextfield],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private readonly translocoService = inject(TranslocoService);
  private readonly uiStateStore = inject(uiStateStore);

  protected readonly languageList = this.translocoService
    .getAvailableLangs()
    .map((lang) => (typeof lang === 'string' ? lang : lang.id));

  protected readonly currentLang = this.uiStateStore.language;

  public onChangeLanguage(lang: Languages): void {
    void this.uiStateStore.setLanguage(lang);
  }
}
