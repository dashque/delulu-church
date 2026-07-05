import { DestroyRef, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firestore } from '@env/environment';
import { TranslocoService } from '@jsverse/transloco';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { timer } from 'rxjs';

export interface Quote {
  lang: string;
  text: string;
}

@Service()
export class CoderQuotesService {
  private readonly translocoService = inject(TranslocoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cache = new Map<string, Quote[]>();
  public readonly randomQuote = signal<string | null>(null);

  public async loadRandomQuote(): Promise<void> {
    const quotes = await this.getQuotes(this.translocoService.activeLang());
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    this.randomQuote.set(quote?.text ?? null);

    timer(5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.randomQuote.set(null);
      });
  }

  private async getQuotes(lang: string): Promise<Quote[]> {
    if (this.cache.has(lang)) {
      return this.cache.get(lang)!;
    }

    const coderQuotes = query(collection(firestore, 'coder_quotes'), where('lang', '==', lang));
    const snapshot = await getDocs(coderQuotes);

    const quotes = snapshot.docs.map((document) => {
      const data = document.data();

      return {
        lang: data['lang'] as string,
        text: data['text'] as string,
      };
    });

    this.cache.set(lang, quotes);

    return quotes;
  }
}
