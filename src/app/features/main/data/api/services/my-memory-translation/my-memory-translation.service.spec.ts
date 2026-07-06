import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { tarotResponseApiFixture } from '@features/main/data/api/fixtures/tarot-response-api.fixture';
import { MyMemoryTranslationService } from '@features/main/data/api/services/my-memory-translation/my-memory-translation.service';
import { Languages } from '@core/models/languages.model';
import { translatedTarotResponseApiFixture } from '@features/main/data/api/fixtures/translated-tarot-response-api.fixture';

const MY_MEMORY_URL = 'https://api.mymemory.translated.net/get';

describe('MyMemoryTranslationService', () => {
  let httpTestingController: HttpTestingController;
  let service: MyMemoryTranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyMemoryTranslationService, provideHttpClient(), provideHttpClientTesting()],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MyMemoryTranslationService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Выбран английский язык', () => {
    it('не должен отправлять запрос на перевод', () => {
      service.translateReading(tarotResponseApiFixture, Languages.EN).subscribe((reading) => {
        expect(reading).toBe(tarotResponseApiFixture);
      });

      httpTestingController.expectNone(MY_MEMORY_URL);
    });
  });

  describe('Выбран русский язык', () => {
    it('должен перевести расклад', () => {
      const [sourceCard] = tarotResponseApiFixture.cards;
      const [translatedCard] = translatedTarotResponseApiFixture.cards;
      const translationBySource = new Map<string, string>([
        [tarotResponseApiFixture.verdict_text, translatedTarotResponseApiFixture.verdict_text],
        [sourceCard.name, translatedCard.name],
        [sourceCard.narrative, translatedCard.narrative],
      ]);

      service.translateReading(tarotResponseApiFixture, Languages.RU).subscribe((reading) => {
        expect(reading).toEqual(translatedTarotResponseApiFixture);
      });

      const requestList = httpTestingController.match((request) => request.url === MY_MEMORY_URL);

      expect(requestList).toHaveLength(translationBySource.size);

      for (const request of requestList) {
        const sourceText = request.request.params.get('q') ?? '';

        expect(request.request.params.get('langpair')).toBe('en|ru');

        request.flush({
          responseData: {
            translatedText: translationBySource.get(sourceText) ?? sourceText,
            match: 1,
          },
          responseDetails: '',
          responseStatus: 200,
        });
      }
    });
  });

  describe('Пустой текст', () => {
    it('не должен отправлять запрос для пустой строки', () => {
      service
        .translateReading({ ...tarotResponseApiFixture, cards: [], verdict_text: '   ' }, Languages.RU)
        .subscribe((reading) => {
          expect(reading.verdict_text).toBe('   ');
        });

      httpTestingController.expectNone(MY_MEMORY_URL);
    });
  });

  describe('Ошибка API', () => {
    it('должен вернуть исходный текст при ошибке HTTP', () => {
      service.translateReading(tarotResponseApiFixture, Languages.RU).subscribe((reading) => {
        expect(reading).toEqual(tarotResponseApiFixture);
      });

      const requestList = httpTestingController.match((request) => request.url === MY_MEMORY_URL);

      for (const request of requestList) {
        request.error(new ProgressEvent('error'));
      }
    });
  });
});
