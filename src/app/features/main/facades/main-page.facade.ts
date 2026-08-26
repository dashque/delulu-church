import { computed, effect, inject, linkedSignal, Service, signal } from '@angular/core';
import { TarotService } from '@features/main/data/api/services/tarot/tarot.service';
import type { TarotResponseApi } from '@features/main/data/api/models/deploy-tarot-response-api.model';
import { finalize } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { MyMemoryTranslationService } from '@features/main/data/api/services/my-memory-translation/my-memory-translation.service';
import { TranslocoService } from '@jsverse/transloco';
import type { Languages } from '@core/models/languages.model';

@Service({
  autoProvided: false,
})
export class MainPageFacade {
  private readonly tarotService = inject(TarotService);
  private readonly myMemoryTranslationService = inject(MyMemoryTranslationService);
  private readonly translocoService = inject(TranslocoService);
  private readonly isTranslationLoading = signal(false);
  private readonly _result = signal<TarotResponseApi | null>(null);
  private readonly sourceResult = linkedSignal<TarotResponseApi | null>(() => {
    this.role();
    this.intent();

    return null;
  });
  private readonly useRxResource = rxResource({
    params: () => ({
      role: this.role,
      intent: this.intent,
    }),

    stream: ({ params: { intent, role } }) => this.tarotService.loadReading(role(), intent()),
  });

  public readonly result = this._result.asReadonly();
  public readonly isLoading = computed(() => this.useRxResource.isLoading() || this.isTranslationLoading());
  public intent = this.tarotService.intent;
  public role = this.tarotService.role;
  public readonly error = this.useRxResource.error;

  constructor() {
    effect((onCleanup) => {
      const sourceResult = this.sourceResult();
      const activeLang = this.translocoService.activeLang() as Languages;

      if (!sourceResult) {
        this._result.set(null);

        return;
      }

      this.isTranslationLoading.set(true);

      const subscription = this.myMemoryTranslationService
        .translateReading(sourceResult, activeLang)
        .pipe(finalize(() => this.isTranslationLoading.set(false)))
        .subscribe({
          next: (translatedResult) => {
            this._result.set(translatedResult);
          },
          error: () => {
            this._result.set(sourceResult);
          },
        });

      onCleanup(() => {
        subscription.unsubscribe();
      });
    });
  }

  public loadTarot(): void {
    if (this.useRxResource.hasValue()) {
      this.sourceResult.set(this.useRxResource.value());
    }
  }
}
