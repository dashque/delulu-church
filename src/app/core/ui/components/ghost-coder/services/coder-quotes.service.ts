import { inject, Service, signal } from '@angular/core';
import { firestore } from '@env/environment';
import { TranslocoService } from '@jsverse/transloco';
import { collection, getDocs, query, where } from 'firebase/firestore';

export interface Quote {
  lang: string;
  text: string;
}

@Service()
export class CoderQuotesService {
  private readonly translocoService = inject(TranslocoService);
  private readonly cache = new Map<string, Quote[]>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  public readonly randomQuote = signal<string | null>(null);

  public async loadRandomQuote(): Promise<void> {
    const quotes = await this.getQuotes(this.translocoService.activeLang());
    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    this.showQuote(quote?.text ?? null);
  }

  public reactSins(action: 'add' | 'delete') {
    this.showQuote(this.translocoService.translate(`coder.sins.${action}`));
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

  private showQuote(text: string, duration = 5000) {
    this.randomQuote.set(text);

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.randomQuote.set(null);
      this.timer = null;
    }, duration);
  }
}
