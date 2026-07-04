import { computed, DestroyRef, effect, inject, Service } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CandlesService } from '@core/services/candles/candles.service';
import { RITUAL_INTENT_OPTIONS } from '@features/sanctum/constants/ritual-intent-options.config';
import { SanctumSoundPhase } from '@features/sanctum/data/models/sanctum-sound-phase.model';
import { resolvePriestMood } from '@features/sanctum/helpers/resolve-priest-mood.helper';
import { SanctumFormService } from '@features/sanctum/services/sanctum-form.service';
import { SanctumRitualService } from '@features/sanctum/services/sanctum-ritual.service';
import { SanctumSoundService } from '@features/sanctum/services/sanctum-sound.service';
import { PriestQuotesService } from '@features/sanctum/services/priest-quotes.service';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';
import { TranslocoService } from '@jsverse/transloco';
import { TuiNotificationService } from '@taiga-ui/core';

@Service({
  autoProvided: false,
})
export class SanctumPageFacade {
  private readonly notifications = inject(TuiNotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);
  private readonly candlesService = inject(CandlesService);
  private readonly sanctumRitual = inject(SanctumRitualService);
  private readonly sanctumSound = inject(SanctumSoundService);
  private readonly priestQuotes = inject(PriestQuotesService);

  public readonly sanctumForm = inject(SanctumFormService).sanctumForm;
  public readonly isJudging = this.sanctumRitual.isJudging;
  public readonly judgment = this.sanctumRitual.judgment;
  public readonly litanyLines = this.sanctumRitual.litanyLines;
  public readonly blessingLevel = this.candlesService.blessingLevel;
  public readonly ritualIntentOptions = RITUAL_INTENT_OPTIONS;
  public readonly priestMood = computed(() => resolvePriestMood(this.isJudging(), this.judgment()));

  public constructor() {
    effect(() => {
      const error = this.priestQuotes.quotesByPool.error();

      if (!error) {
        return;
      }

      void this.showNotification(
        toErrorMessage(error),
        this.translocoService.translate('notifications.failure', {}, 'sanctum')
      );
    });
  }

  public invokeJudgment(): void {
    if (this.sanctumForm.invalid || this.isJudging()) {
      return;
    }

    const { branch, ritualIntent } = this.sanctumForm.getRawValue();

    if (!branch) {
      return;
    }

    this.sanctumSound.prime();
    this.sanctumRitual.startRitual(branch, ritualIntent, this.candlesService.blessingLevel());
  }

  public onPriestRaged(): void {
    this.sanctumSound.play(SanctumSoundPhase.PRIEST_RAGE);
  }

  private showNotification(message: string, label: string) {
    this.notifications
      .open(message, {
        label: label,
        appearance: 'negative',
        autoClose: 5000,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
