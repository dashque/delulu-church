import { TestBed } from '@angular/core/testing';

import { CoderQuotesService } from './coder-quotes.service';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('CoderQuotesService', () => {
  let service: CoderQuotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
    });
    service = TestBed.inject(CoderQuotesService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });
});
