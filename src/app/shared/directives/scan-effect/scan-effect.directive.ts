import { Directive, input } from '@angular/core';

@Directive({
  selector: '[ngKittyScanEffect]',
  host: {
    class: 'scan-effect',
    '[class.is-scanning]': 'scanEnabled()',
    '[style.--scan-color]': 'scanColor()',
    '[style.--scan-duration]': 'scanDuration()',
    '[style.--scan-beam-height]': 'scanBeamHeight()',
    '[style.--scan-opacity]': 'scanOpacity()',
  },
})
export class ScanEffectDirective {
  public readonly scanColor = input<string>('var(--accent-primary)');
  public readonly scanDuration = input<string>('10s');
  public readonly scanBeamHeight = input<string>('2rem');
  public readonly scanOpacity = input<number>(0.28);
  public readonly scanEnabled = input<boolean>(true);
}
