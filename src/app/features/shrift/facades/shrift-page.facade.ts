import { DestroyRef, inject, Service } from '@angular/core';
import { ConfessFormService } from '../services/confess-form.service';
import { ConfessService } from '@core/services/confess/confess.service';
import { TuiNotificationService } from '@taiga-ui/core';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';

@Service({
  autoProvided: false,
})
export class ShriftPageFacade {
  private readonly notifications = inject(TuiNotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly translocoService = inject(TranslocoService);
  private readonly confessService = inject(ConfessService);
  public readonly confessForm = inject(ConfessFormService).confessForm;
  public readonly sins = this.confessService.sins;
  public readonly isLoading = this.confessService.isLoading;

  constructor() {
    this.confessService.loadSins().catch((error: unknown) => {
      void this.showNotification(
        toErrorMessage(error),
        this.translocoService.translate('notifications.failure', {}, 'shrift')
      );
    });
  }

  public async onSubmit() {
    if (this.confessForm.invalid) {
      return;
    }

    const { text, severity } = this.confessForm.getRawValue();

    try {
      await this.confessService.addSin(text, severity);
      this.confessForm.reset();
    } catch (error) {
      void this.showNotification(
        toErrorMessage(error),
        this.translocoService.translate('notifications.failure', {}, 'shrift')
      );
    }
  }

  public async onDelete(sinUid: string) {
    try {
      await this.confessService.deleteSin(sinUid);
    } catch (error) {
      void this.showNotification(
        toErrorMessage(error),
        this.translocoService.translate('notifications.failure', {}, 'shrift')
      );
    }
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
