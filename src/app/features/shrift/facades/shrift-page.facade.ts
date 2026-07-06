import { inject, Service } from '@angular/core';
import { ConfessFormService } from '../services/confess-form.service';
import { ConfessService } from '@core/services/confess/confess.service';
import { TranslocoService } from '@jsverse/transloco';
import { toErrorMessage } from '@shared/helpers/to-error-message.helper';
import { HotToastService } from '@ngxpert/hot-toast';

@Service({
  autoProvided: false,
})
export class ShriftPageFacade {
  private readonly notifications = inject(HotToastService);
  private readonly translocoService = inject(TranslocoService);
  private readonly confessService = inject(ConfessService);
  public readonly confessForm = inject(ConfessFormService).confessForm;
  public readonly sins = this.confessService.sins;
  public readonly isLoading = this.confessService.isLoading;

  constructor() {
    this.confessService.loadSins().catch((error: unknown) => {
      this.notifications.error(
        `${this.translocoService.translate('notifications.failure', {}, 'shrift')}
        ${toErrorMessage(error)}`
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
      this.notifications.error(
        `${this.translocoService.translate('notifications.failure', {}, 'shrift')}
        ${toErrorMessage(error)}`
      );
    }
  }

  public async onDelete(sinUid: string) {
    try {
      await this.confessService.deleteSin(sinUid);
    } catch (error) {
      this.notifications.error(
        `${this.translocoService.translate('notifications.failure', {}, 'shrift')}
        ${toErrorMessage(error)}`
      );
    }
  }
}
