import { TestBed } from '@angular/core/testing';

import { PriestQuotesService } from './priest-quotes.service';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('PriestQuotesService', () => {
  let service: PriestQuotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [PriestQuotesService],
    });
    service = TestBed.inject(PriestQuotesService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });
});
