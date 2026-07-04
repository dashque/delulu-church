import { TestBed } from '@angular/core/testing';
import type { HttpInterceptorFn } from '@angular/common/http';

import { httpErrorInterceptor } from './http-error-interceptor';

describe('httpErrorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (request, next) =>
    TestBed.runInInjectionContext(() => httpErrorInterceptor(request, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('должен инициализироваться', () => {
    expect(interceptor).toBeTruthy();
  });
});
