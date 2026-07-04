import { Component, DestroyRef, inject, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { TuiIcon } from '@taiga-ui/core';
import { WisdomComponent } from './wisdom/wisdom.component';
import { ANSWER_KEYS } from '../constants/answer-keys';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'ngKitty-ball',
  imports: [TranslocoPipe, TuiIcon, WisdomComponent],
  templateUrl: './ball.component.html',
  styleUrl: './ball.component.scss',
})
export class BallComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  public readonly isCharging = signal(false);
  public readonly answerText = signal<string | null>(null);

  public onBallClick(): void {
    if (this.isCharging()) {
      return;
    }

    this.answerText.set(null);
    this.isCharging.set(true);

    timer(1800)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const randomKey = this.pickRandomAnswerKey();
        const translated = this.transloco.translate(`ball.answers.${randomKey}`);

        this.answerText.set(translated);

        timer(4000)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.answerText.set(null);
            this.isCharging.set(false);
          });
      });
  }

  private pickRandomAnswerKey(): string {
    const index = Math.floor(Math.random() * ANSWER_KEYS.length);

    return ANSWER_KEYS[index];
  }
}
