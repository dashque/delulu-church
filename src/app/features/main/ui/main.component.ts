import { Component, computed, inject } from '@angular/core';
import { MainPageFacade } from '@features/main/facades/main-page.facade';
import { TarotOracleComponent } from '@features/main/ui/tarot-oracle/tarot-oracle.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { TarotReadingComponent } from '@features/main/ui/tarot-reading/tarot-reading.component';

@Component({
  selector: 'ngKitty-main',
  imports: [TarotOracleComponent, TranslocoPipe, TarotReadingComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  private readonly mainPageFacade = inject(MainPageFacade);
  protected currentRole = this.mainPageFacade.role;
  protected currentIntent = this.mainPageFacade.intent;
  protected readonly result = this.mainPageFacade.result;
  protected readonly isLoading = this.mainPageFacade.isLoading;
  protected readonly canDrawCards = computed(
    () => Boolean(this.currentRole()) && Boolean(this.currentIntent()) && !this.isLoading()
  );

  public onDrawCards() {
    if (!this.canDrawCards()) {
      return;
    }
    this.mainPageFacade.loadTarot();
  }
}
