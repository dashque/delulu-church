import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';
import { priestQuotesServiceMock } from '@features/sanctum/services/priest-quotes.service.mock';
import { PriestQuotesService } from '@features/sanctum/services/priest-quotes.service';
import { DigitalPriestService } from '@features/sanctum/ui/components/digital-priest/services/digital-priest.service';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('DigitalPriestService', () => {
  let service: DigitalPriestService;

  beforeEach(() => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }))
    );
    vi.stubGlobal('speechSynthesis', undefined);

    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [DigitalPriestService, { provide: PriestQuotesService, useValue: priestQuotesServiceMock }],
    });

    service = TestBed.inject(DigitalPriestService);
  });

  it('не должен повторять реплику, пока не исчерпан пул', () => {
    const quoteList = new Set<string>();

    for (let index = 0; index < 3; index += 1) {
      quoteList.add(service.pickQuote(DigitalPriestMood.IDLE, 80, false));
    }

    expect(quoteList.size).toBe(3);
  });

  it('не должен падать без Web Speech API', async () => {
    await expect(service.speakQuote('Заткнись!', DigitalPriestMood.IDLE)).resolves.toBeUndefined();
  });
});
