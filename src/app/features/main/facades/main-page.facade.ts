import { computed, DestroyRef, effect, inject, linkedSignal, Service, signal } from '@angular/core';
import { TarotService } from '@features/main/data/api/services/tarot/tarot.service';
import type { TarotResponseApi } from '@features/main/data/api/models/deploy-tarot-response-api.model';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MyMemoryTranslationService } from '@features/main/data/api/services/my-memory-translation/my-memory-translation.service';
import { TranslocoService } from '@jsverse/transloco';
import { HttpErrorResponse } from '@angular/common/http';
import type { Languages } from '@core/models/languages.model';

@Service({
  autoProvided: false,
})
export class MainPageFacade {
  private readonly tarotService = inject(TarotService);
  private readonly myMemoryTranslationService = inject(MyMemoryTranslationService);
  private readonly translocoService = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly _error = signal<unknown>(null);
  private readonly _isTarotLoading = signal(false);
  private readonly _isTranslationLoading = signal(false);
  private readonly _result = signal<TarotResponseApi | null>(null);
  private readonly _sourceResult = linkedSignal<TarotResponseApi | null>(() => {
    this.role();
    this.intent();

    return null;
  });
  public readonly result = this._result.asReadonly();
  public readonly isLoading = computed(() => this._isTarotLoading() || this._isTranslationLoading());
  public intent = this.tarotService.intent;
  public role = this.tarotService.role;
  public readonly error = this._error.asReadonly();

  constructor() {
    effect((onCleanup) => {
      const sourceResult = this._sourceResult();
      const activeLang = this.translocoService.activeLang() as Languages;

      if (!sourceResult) {
        this._result.set(null);

        return;
      }

      this._isTranslationLoading.set(true);

      const subscription = this.myMemoryTranslationService
        .translateReading(sourceResult, activeLang)
        .pipe(finalize(() => this._isTranslationLoading.set(false)))
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
    this._isTarotLoading.set(true);
    this._error.set(null);

    this.tarotService
      .loadReading()
      .pipe(
        finalize(() => {
          this._isTarotLoading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (tarotResponse) => {
          this._sourceResult.set(tarotResponse);
        },
        error: (error: unknown) => {
          if (error instanceof HttpErrorResponse) {
            this._error.set(error.message);

            return;
          }
          this._error.set('Unknown error');
        },
      });
  }
}
