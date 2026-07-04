import { TestBed } from '@angular/core/testing';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { vi } from 'vitest';

import { CoderQuotesService } from './coder-quotes.service';

describe('CoderQuotesService', () => {
  let service: CoderQuotesService;

  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [CoderQuotesService],
    });
    service = TestBed.inject(CoderQuotesService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Загрузка цитаты', () => {
    it('должен установить случайную цитату', async () => {
      vi.spyOn(
        service as unknown as { getQuotes: (lang: string) => Promise<{ lang: string; text: string }[]> },
        'getQuotes'
      ).mockResolvedValue([
        { lang: 'ru', text: 'Keep calm and npm install' },
        { lang: 'ru', text: 'It works on my machine' },
      ]);

      await service.loadRandomQuote();

      expect(service.randomQuote()).toBe('Keep calm and npm install');
    });

    it('должен использовать кэш при повторном запросе', async () => {
      const cache = (service as unknown as { cache: Map<string, { lang: string; text: string }[]> }).cache;

      cache.set('ru', [{ lang: 'ru', text: 'Cached quote' }]);

      await service.loadRandomQuote();

      expect(service.randomQuote()).toBe('Cached quote');
    });

    it('должен очистить цитату через 5 секунд', async () => {
      vi.spyOn(
        service as unknown as { getQuotes: (lang: string) => Promise<{ lang: string; text: string }[]> },
        'getQuotes'
      ).mockResolvedValue([{ lang: 'ru', text: 'Temporary quote' }]);

      await service.loadRandomQuote();
      expect(service.randomQuote()).toBe('Temporary quote');

      await vi.waitFor(() => service.randomQuote() === null, { timeout: 6000 });
    });
  });
});
