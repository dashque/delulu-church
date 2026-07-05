import type { OnDestroy, OnInit } from '@angular/core';
import { Directive, signal } from '@angular/core';

@Directive({
  selector: '[ngKittyEyeBlink]',
  host: {
    '[class.is-blinking]': 'isBlinking()',
  },
})
export class EyeBlinkDirective implements OnInit, OnDestroy {
  private timerId = 0;
  public readonly isBlinking = signal<boolean>(false);

  public ngOnInit() {
    this.scheduleBlink();
  }

  public ngOnDestroy() {
    clearTimeout(this.timerId);
  }

  private scheduleBlink() {
    const delay = 2200 + Math.random() * 2600;

    this.timerId = window.setTimeout(() => {
      this.isBlinking.set(true);

      this.timerId = window.setTimeout(() => {
        this.isBlinking.set(false);
        this.scheduleBlink();
      }, 400);
    }, delay);
  }
}
