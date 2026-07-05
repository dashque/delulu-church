import { TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';

import { MainPageFacade } from './main-page.facade';
import { expect, vi } from 'vitest';
import { tarotResponseApiFixture } from '@features/main/data/api/fixtures/tarot-response-api.fixture';
import { MyMemoryTranslationService } from '@features/main/data/api/services/my-memory-translation/my-memory-translation.service';
import { TarotService } from '@features/main/data/api/services/tarot/tarot.service';
import { tarotServiceMock } from '@features/main/data/api/services/tarot/tarot.service.mock';
import { myMemoryTranslationServiceMock } from '@features/main/data/api/services/my-memory-translation/my-memory-translation.service.mock';
import { translatedTarotResponseApiFixture } from '@features/main/data/api/fixtures/translated-tarot-response-api.fixture';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { Languages } from '@core/models/languages.model';

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
    it('должен начать загрузку', () => {
      const setSpy = vi.spyOn(service['_isTarotLoading'], 'set');

      service.loadTarot();

      expect(setSpy).toHaveBeenNthCalledWith(1, true);
    });

    it('должен сбросить ошибку', () => {
      const setSpy = vi.spyOn(service['_error'], 'set');

      service.loadTarot();

      expect(setSpy).toHaveBeenNthCalledWith(1, null);
    });

    it('должен вызвать метод сервиса', () => {
      service.loadTarot();

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
      it('ошибка установлена в сигнал', () => {
        tarotServiceMock.loadReading.mockReturnValueOnce(
          throwError(() => {
            return 'error';
          })
        );

        const setSpy = vi.spyOn(service['_error'], 'set');

        service.loadTarot();

        expect(setSpy).toHaveBeenNthCalledWith(2, 'Unknown error');
      });
    });

    it('должен завершить загрузку', () => {
      const setSpy = vi.spyOn(service['_isTarotLoading'], 'set');

      service.loadTarot();

      expect(setSpy).toHaveBeenNthCalledWith(2, false);
    });
  });
});
