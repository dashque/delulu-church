import { Component, computed, DestroyRef, inject, input, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { clampNumber } from '@shared/helpers/clamp-number.helper';
import {
  DIGITAL_PRIEST_MAX_EYE_OFFSET_X,
  DIGITAL_PRIEST_MAX_EYE_OFFSET_Y,
} from '@features/sanctum/ui/components/digital-priest/constants/digital-priest.config';
import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';
import { DigitalPriestService } from '@features/sanctum/ui/components/digital-priest/services/digital-priest.service';

@Component({
  selector: 'ngKitty-digital-priest',
  imports: [TranslocoPipe],
  providers: [DigitalPriestService],
  templateUrl: './digital-priest.component.html',
  styleUrl: './digital-priest.component.scss',
  host: {
    '[class.digital-priest-stage]': 'layout() === "stage"',
  },
})
export class DigitalPriestComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly priest = inject(DigitalPriestService);

  public readonly mood = input<DigitalPriestMood>(DigitalPriestMood.IDLE);
  public readonly spiritLevel = input(50);
  public readonly isBusy = input(false);
  public readonly layout = input<'default' | 'stage'>('default');
  public readonly ariaLabel = input<string>('Digital priest');
  public readonly priestRaged = output<void>();

  protected readonly speechText = signal<string | null>(null);
  protected readonly isEngaged = signal(false);
  protected readonly isPointerOver = signal(false);
  protected readonly eyeOffsetX = signal(0);
  protected readonly eyeOffsetY = signal(0);

  protected readonly eyesTransform = computed(
    () => `translate(${this.eyeOffsetX() * 0.35} ${this.eyeOffsetY() * 0.35})`
  );
  protected readonly headTransform = computed(() => {
    const tilt = this.eyeOffsetX() * 0.35;

    return `rotate(${tilt} 60 54)`;
  });

  public constructor() {
    this.destroyRef.onDestroy(() => {
      this.priest.cancelSpeech();
    });
  }

  protected onPointerMove(event: PointerEvent): void {
    const frame = event.currentTarget as HTMLElement;
    const rect = frame.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;

    this.eyeOffsetX.set(
      clampNumber(
        relativeX * DIGITAL_PRIEST_MAX_EYE_OFFSET_X * 2,
        -DIGITAL_PRIEST_MAX_EYE_OFFSET_X,
        DIGITAL_PRIEST_MAX_EYE_OFFSET_X
      )
    );
    this.eyeOffsetY.set(
      clampNumber(
        relativeY * DIGITAL_PRIEST_MAX_EYE_OFFSET_Y * 2,
        -DIGITAL_PRIEST_MAX_EYE_OFFSET_Y,
        DIGITAL_PRIEST_MAX_EYE_OFFSET_Y
      )
    );
    this.isPointerOver.set(true);
  }

  protected onPointerLeave(): void {
    this.eyeOffsetX.set(0);
    this.eyeOffsetY.set(0);
    this.isPointerOver.set(false);
  }

  protected onInteract(): void {
    if (this.isEngaged() || this.isBusy()) {
      return;
    }

    void this.speak();
  }

  private async speak(): Promise<void> {
    const quoteText = this.priest.pickQuote(this.mood(), this.spiritLevel(), this.isBusy());

    if (!quoteText) {
      return;
    }

    this.speechText.set(quoteText);
    this.isEngaged.set(true);
    this.priestRaged.emit();

    try {
      await this.priest.speakQuote(quoteText, this.mood());
    } finally {
      this.speechText.set(null);
      this.isEngaged.set(false);
    }
  }
}
