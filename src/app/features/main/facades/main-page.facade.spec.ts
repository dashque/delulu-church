import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

import { MainPageFacade } from './main-page.facade';
import { expect } from 'vitest';
import { tarotResponseApiFixture } from '@features/main/data/api/fixtures/tarot-response-api.fixture';
import { MyMemoryTranslationService } from '@features/main/data/api/services/my-memory-translation/my-memory-translation.service';
import { TarotService } from '@features/main/data/api/services/tarot/tarot.service';
import { tarotServiceMock } from '@features/main/data/api/services/tarot/tarot.service.mock';
import { myMemoryTranslationServiceMock } from '@features/main/data/api/services/my-memory-translation/my-memory-translation.service.mock';
import { translatedTarotResponseApiFixture } from '@features/main/data/api/fixtures/translated-tarot-response-api.fixture';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { Languages } from '@core/models/languages.model';
import { ApplicationRef } from '@angular/core';

describe('MainPageFacade', () => {
  let service: MainPageFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MainPageFacade,
        { provide: MyMemoryTranslationService, useValue: myMemoryTranslationServiceMock },
        { provide: TarotService, useValue: tarotServiceMock },
      ],
      imports: [TranslocoTestingMock],
    });
    service = TestBed.inject(MainPageFacade);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Загрузка таро', () => {
    it('должен вызвать метод сервиса', () => {
      service.loadTarot();
      TestBed.tick();

      expect(tarotServiceMock.loadReading).toHaveBeenCalledTimes(1);
    });

    it('должен переводить результат перед сохранением', () => {
      service.loadTarot();
      TestBed.tick();

      expect(service.result()).toBe(translatedTarotResponseApiFixture);
    });

    it('должен вызвать сервис перевода с активным языком', () => {
      service.loadTarot();
      TestBed.tick();

      expect(myMemoryTranslationServiceMock.translateReading).toHaveBeenNthCalledWith(
        1,
        tarotResponseApiFixture,
        Languages.RU
      );
    });

    describe('Получена ошибка', () => {
      it('должен сохранить message из HttpErrorResponse', () => {
        tarotServiceMock.loadReading.mockReturnValueOnce(
          throwError(() => new HttpErrorResponse({ error: 'fail', status: 500, statusText: 'Server Error' }))
        );

        service.loadTarot();
        TestBed.tick();

        expect(service.error()).toBeInstanceOf(HttpErrorResponse);
        expect(service.error()?.message).toBe('Http failure response for (unknown url): 500 Server Error');
      });
    });

    it('должен использовать исходный результат при ошибке перевода', async () => {
      myMemoryTranslationServiceMock.translateReading.mockReturnValueOnce(
        throwError(() => new Error('Translation failed'))
      );

      service.loadTarot();
      await TestBed.inject(ApplicationRef).whenStable();

      expect(service.result()).toBe(tarotResponseApiFixture);
    });
  });
});
