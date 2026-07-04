import { inject, Service, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import {
  PRIEST_LOW_SPIRIT_CHANCE,
  PRIEST_LOW_SPIRIT_THRESHOLD,
} from '@features/sanctum/constants/priest-quotes.config';
import type { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';
import type { PriestQuotesByPool } from '@features/sanctum/data/models/priest-quotes-by-pool.model';
import { PriestQuotesService } from '@features/sanctum/services/priest-quotes.service';
import { isPrefersReducedMotion } from '@shared/helpers/is-prefers-reduced-motion.helper';

interface QuotePickerState {
  poolId: string;
  queue: string[];
}

const EMPTY_QUOTE_PICKER_STATE: QuotePickerState = {
  poolId: '',
  queue: [],
};

@Service({
  autoProvided: false,
})
export class DigitalPriestService {
  private readonly priestQuotes = inject(PriestQuotesService);
  private readonly translocoService = inject(TranslocoService);
  private readonly pickerState = signal<QuotePickerState>(EMPTY_QUOTE_PICKER_STATE);
  private speechSession = 0;

  public pickQuote(mood: DigitalPriestMood, spiritLevel: number, isBusy: boolean): string {
    const quotesByPool = this.priestQuotes.getQuotesByPool();
    const pool = this.resolveQuotePool(quotesByPool, mood, spiritLevel, isBusy);

    if (pool.quoteList.length === 0) {
      const fallback = quotesByPool[mood];

      if (fallback.length === 0) {
        return '';
      }

      return this.takeQuote(mood, fallback);
    }

    return this.takeQuote(pool.poolId, pool.quoteList);
  }

  public async speakQuote(text: string, mood: DigitalPriestMood): Promise<void> {
    if (isPrefersReducedMotion()) {
      return;
    }

    const trimmedText = text.trim();
    const synthesis = globalThis.speechSynthesis;

    if (!trimmedText || !synthesis) {
      return;
    }

    this.cancelSpeech();

    await new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(trimmedText);
      const activeLang = this.translocoService.getActiveLang();

      utterance.lang = activeLang === 'ru' ? 'ru-RU' : 'en-US';
      utterance.rate = mood === 'damning' ? 0.92 : 1;
      utterance.pitch = mood === 'blessing' ? 1.05 : 0.9;
      utterance.onend = () => {
        resolve();
      };
      utterance.onerror = () => {
        resolve();
      };

      synthesis.speak(utterance);
    });
  }

  public cancelSpeech(): void {
    this.speechSession += 1;
    globalThis.speechSynthesis?.cancel();
  }

  private takeQuote(poolId: string, quoteList: readonly string[]): string {
    const current = this.pickerState();
    const queue =
      current.poolId === poolId && current.queue.length > 0 ? [...current.queue] : this.shuffle([...quoteList]);
    const quoteText = queue.pop() ?? quoteList[0];

    this.pickerState.set({ poolId, queue });

    return quoteText;
  }

  private resolveQuotePool(
    quotesByPool: PriestQuotesByPool,
    mood: DigitalPriestMood,
    spiritLevel: number,
    isBusy: boolean,
    randomValue = Math.random()
  ): { poolId: string; quoteList: readonly string[] } {
    if (isBusy) {
      return { poolId: 'busy', quoteList: quotesByPool.busy };
    }

    if (spiritLevel < PRIEST_LOW_SPIRIT_THRESHOLD && randomValue < PRIEST_LOW_SPIRIT_CHANCE) {
      return { poolId: 'low_spirit', quoteList: quotesByPool.low_spirit };
    }

    return { poolId: mood, quoteList: quotesByPool[mood] };
  }

  private shuffle(quoteList: string[]): string[] {
    for (let index = quoteList.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const current = quoteList[index];
      const swap = quoteList[swapIndex];

      quoteList[index] = swap;
      quoteList[swapIndex] = current;
    }

    return quoteList;
  }
}
