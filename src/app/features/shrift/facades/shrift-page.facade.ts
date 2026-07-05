import { inject, Service } from '@angular/core';
import { ConfessFormService } from '../services/confess-form.service';
import { ConfessService } from '@core/services/confess/confess.service';

@Service({
  autoProvided: false,
})
export class ShriftPageFacade {
  private readonly confessService = inject(ConfessService);
  public readonly confessForm = inject(ConfessFormService).confessForm;
  public readonly sins = this.confessService.sins;
  public readonly isLoading = this.confessService.isLoading;

  constructor() {
    this.confessService.loadSins().catch((error: unknown) => {
      console.error('Failed to load sins', error);
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
      console.error('Failed to add sin', error);
    }
  }

  public onDelete(sinUid: string) {
    this.confessService.deleteSin(sinUid);
  }
}
