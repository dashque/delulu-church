import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { catchError, forkJoin, from, map, mergeMap, of, toArray } from 'rxjs';

import type { TarotResponseApi } from '@features/main/data/api/models/deploy-tarot-response-api.model';
import type { MyMemoryTranslationResponseApi } from '@features/main/data/api/models/my-memory-translation-response-api.model';
import type { TarotCardApi } from '@features/main/data/api/models/tarot-card-api.model';
import { MY_MEMORY_TRANSLATION_URL } from '@features/main/data/api/tokens/my-memory-translation-url.token';
import { Languages } from '@core/models/languages.model';

@Injectable({ providedIn: 'root' })
export class MyMemoryTranslationService {
  private readonly httpClient = inject(HttpClient);
  private readonly url = inject(MY_MEMORY_TRANSLATION_URL);
  private readonly textEncoder = new TextEncoder();
  private readonly myMemoryTextByteLimit = 500;
  private readonly maxConcurrentRequests = 2;

  public translateReading(reading: TarotResponseApi, targetLang: Languages): Observable<TarotResponseApi> {
    if (targetLang === Languages.EN) {
      return of(reading);
    }

    return forkJoin({
      cards: this.translateCardList(reading.cards, targetLang),
      verdictText: this.translateText(reading.verdict_text, targetLang),
    }).pipe(
      map(({ cards, verdictText }) => ({
        ...reading,
        cards,
        verdict_text: verdictText,
      }))
    );
  }

  private translateCardList(cardList: TarotCardApi[], targetLang: Languages): Observable<TarotCardApi[]> {
    if (cardList.length === 0) {
      return of([]);
    }

    return forkJoin(cardList.map((card) => this.translateCard(card, targetLang)));
  }

  private translateCard(card: TarotCardApi, targetLang: Languages): Observable<TarotCardApi> {
    return forkJoin({
      name: this.translateText(card.name, targetLang),
      narrative: this.translateText(card.narrative, targetLang),
    }).pipe(
      map(({ name, narrative }) => ({
        ...card,
        name,
        narrative,
      }))
    );
  }

  private translateText(text: string, targetLang: Languages): Observable<string> {
    if (!text.trim()) {
      return of(text);
    }

    const chunkList = this.createChunkList(text);

    return from(chunkList.map((chunk, index) => ({ chunk, index }))).pipe(
      mergeMap(
        ({ chunk, index }) => this.translateChunk(chunk, targetLang).pipe(map((translated) => ({ index, translated }))),
        this.maxConcurrentRequests
      ),
      toArray(),
      map((itemList) =>
        itemList
          .sort((a, b) => a.index - b.index)
          .map((item) => item.translated)
          .join(' ')
      ),
      catchError(() => of(text))
    );
  }

  private translateChunk(chunk: string, targetLang: Languages): Observable<string> {
    const parameters = new HttpParams().set('q', chunk).set('langpair', `${Languages.EN}|${targetLang}`);

    return this.httpClient.get<MyMemoryTranslationResponseApi>(this.url, { params: parameters }).pipe(
      map((response) => {
        const status = Number(response.responseStatus);
        const translated = response.responseData?.translatedText ?? '';

        return status === 200 && translated && !translated.startsWith('MYMEMORY WARNING') ? translated : chunk;
      })
    );
  }

  private createChunkList(text: string): string[] {
    const chunkList = [];
    let currentChunk = '';

    for (const word of text.split(' ')) {
      const nextChunk = currentChunk ? `${currentChunk} ${word}` : word;

      if (this.getByteLength(nextChunk) <= this.myMemoryTextByteLimit) {
        currentChunk = nextChunk;
        continue;
      }

      if (currentChunk) {
        chunkList.push(currentChunk);
      }

      currentChunk = this.getByteLength(word) <= this.myMemoryTextByteLimit ? word : this.trimToByteLimit(word);
    }

    if (currentChunk) {
      chunkList.push(currentChunk);
    }

    return chunkList;
  }

  private trimToByteLimit(text: string): string {
    let trimmedText = '';

    for (const symbol of text) {
      const nextText = `${trimmedText}${symbol}`;

      if (this.getByteLength(nextText) > this.myMemoryTextByteLimit) {
        return trimmedText;
      }

      trimmedText = nextText;
    }

    return trimmedText;
  }

  private getByteLength(text: string): number {
    return this.textEncoder.encode(text).length;
  }
}
