import { TestBed } from '@angular/core/testing';

import { ConfessService } from './confess.service';

describe('ConfessService', () => {
  let service: ConfessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfessService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });
});
