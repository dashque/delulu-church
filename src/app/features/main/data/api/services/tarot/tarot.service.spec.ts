import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TarotService } from './tarot.service';
import { tarotResponseApiFixture } from '@features/main/data/api/fixtures/tarot-response-api.fixture';
import { TarotIntent } from '@features/main/data/api/models/intent.model';
import { TarotRole } from '@features/main/data/api/models/role.model';
import { TAROT_URL } from '@features/main/data/api/tokens/tarot-url.token';

describe('TarotService', () => {
  const tarotUrlFixture = '/api/tarot-test';
  let httpTestingController: HttpTestingController;
  let service: TarotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TarotService,
        { provide: TAROT_URL, useValue: tarotUrlFixture },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(TarotService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Загрузка расклада', () => {
    it('должен отправлять запрос с параметрами по умолчанию', () => {
      service.loadReading().subscribe((response) => {
        expect(response).toBe(tarotResponseApiFixture);
      });

      const request = httpTestingController.expectOne((httpRequest) => httpRequest.url === tarotUrlFixture);

      expect(request.request.method).toBe('GET');
      expect(request.request.params.get('role')).toBe(TarotRole.DEVOPS);
      expect(request.request.params.get('intent')).toBe(TarotIntent.FULL_RELEASE);

      request.flush(tarotResponseApiFixture);
    });

    it('должен отправлять запрос с переданными параметрами', () => {
      service.loadReading(TarotRole.AI_AGENT, TarotIntent.IPO).subscribe((response) => {
        expect(response).toBe(tarotResponseApiFixture);
      });

      const request = httpTestingController.expectOne((httpRequest) => httpRequest.url === tarotUrlFixture);

      expect(request.request.params.get('role')).toBe(TarotRole.AI_AGENT);
      expect(request.request.params.get('intent')).toBe(TarotIntent.IPO);

      request.flush(tarotResponseApiFixture);
    });
  });
});
