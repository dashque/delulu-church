import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TuiLoader } from '@taiga-ui/core';

@Directive({
  selector: 'ng-template[deluluLoader]',
})
export class DeluluLoaderDirective {
  private readonly templateRef = inject(TemplateRef);
  private readonly vcr = inject(ViewContainerRef);

  public readonly isLoading = input.required({ alias: 'deluluLoader' });

  constructor() {
    effect(() => {
      if (this.isLoading()) {
        this.vcr.clear();
        this.vcr.createComponent(TuiLoader);
      } else {
        this.vcr.clear();
        this.vcr.createEmbeddedView(this.templateRef);
      }
    });
  }
}
