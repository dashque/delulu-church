import { inject, resource, Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { firestore } from '@env/environment';
import { TranslocoService } from '@jsverse/transloco';
import { PRIEST_QUOTES_COLLECTION } from '@features/sanctum/constants/priest-quotes.config';
import type { PriestQuote } from '@features/sanctum/data/models/priest-quote.model';
import type { PriestQuotesByPool } from '@features/sanctum/data/models/priest-quotes-by-pool.model';
import {
  createEmptyPriestQuotesByPool,
  groupPriestQuotesByPool,
} from '@features/sanctum/helpers/group-priest-quotes-by-pool.helper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { withTimeout } from '@shared/helpers/with-timeout.helper';
import { FIRESTORE_OPERATION_TIMEOUT_MS } from '@shared/constants/firestore-operation-timeout';

@Service({
  autoProvided: false,
})
export class PriestQuotesService {
  private readonly translocoService = inject(TranslocoService);
  private readonly cache = new Map<string, PriestQuotesByPool>();

  private readonly activeLang = toSignal(this.translocoService.langChanges$, {
    initialValue: this.translocoService.getActiveLang(),
  });

  public readonly quotesByPool = resource({
    params: () => this.activeLang(),
    loader: async ({ params: lang, abortSignal }) => {
      return this.loadQuotes(lang, abortSignal);
    },
  });

  public getQuotesByPool(): PriestQuotesByPool {
    const cached = this.quotesByPool.value();

    return cached ?? createEmptyPriestQuotesByPool();
  }

  private async loadQuotes(lang: string, abortSignal: AbortSignal): Promise<PriestQuotesByPool> {
    if (this.cache.has(lang)) {
      return this.cache.get(lang)!;
    }

    const priestQuotesQuery = query(collection(firestore, PRIEST_QUOTES_COLLECTION), where('lang', '==', lang));
    const snapshot = await withTimeout(getDocs(priestQuotesQuery), FIRESTORE_OPERATION_TIMEOUT_MS);

    if (abortSignal.aborted) {
      return createEmptyPriestQuotesByPool();
    }

    const quoteList = snapshot.docs.map((document) => {
      const data = document.data();

      return {
        lang: data['lang'] as string,
        pool: data['pool'] as PriestQuote['pool'],
        text: data['text'] as string,
      } satisfies PriestQuote;
    });
    const groupedQuotes = groupPriestQuotesByPool(quoteList);

    this.cache.set(lang, groupedQuotes);

    return groupedQuotes;
  }
}
