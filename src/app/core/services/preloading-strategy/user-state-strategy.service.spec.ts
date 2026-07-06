import { TestBed } from '@angular/core/testing';
import type { Route } from '@angular/router';
import { of } from 'rxjs';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { AuthService } from '@core/services/auth/auth.service';
import { authServiceMock, resetAuthServiceMock } from '@core/services/auth/auth.service.mock';

import { UserStateStrategy } from './user-state-strategy.service';

describe('UserStateStrategy', () => {
  let strategy: UserStateStrategy;
  const loadedModule$ = of('loaded-module');
  const loadMock = vi.fn(() => loadedModule$);

  beforeEach(() => {
    resetAuthServiceMock();
    (authServiceMock.isAuthenticated as unknown as Mock).mockReturnValue(false);
    loadMock.mockClear();

    TestBed.configureTestingModule({
      providers: [UserStateStrategy, { provide: AuthService, useValue: authServiceMock }],
    });
    strategy = TestBed.inject(UserStateStrategy);
  });

  it('должен инициализироваться', () => {
    expect(strategy).toBeTruthy();
  });

  describe('Preload для гостя', () => {
    const guestRoute = { data: { preloadFor: 'guest' } } as Route;

    it('должен загрузить модуль для неавторизованного пользователя', () => {
      const result = strategy.preload(guestRoute, loadMock);

      expect(loadMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(loadedModule$);
    });

    it('не должен загружать модуль для авторизованного пользователя', () => {
      (authServiceMock.isAuthenticated as unknown as Mock).mockReturnValue(true);

      const result = strategy.preload(guestRoute, loadMock);

      expect(loadMock).not.toHaveBeenCalled();
      result.subscribe((value) => {
        expect(value).toBeNull();
      });
    });
  });

  describe('Preload для авторизованного', () => {
    const authRoute = { data: { preloadFor: 'auth' } } as Route;

    it('должен загрузить модуль для авторизованного пользователя', () => {
      (authServiceMock.isAuthenticated as unknown as Mock).mockReturnValue(true);

      const result = strategy.preload(authRoute, loadMock);

      expect(loadMock).toHaveBeenCalledTimes(1);
      expect(result).toBe(loadedModule$);
    });

    it('не должен загружать модуль для гостя', () => {
      const result = strategy.preload(authRoute, loadMock);

      expect(loadMock).not.toHaveBeenCalled();
      result.subscribe((value) => {
        expect(value).toBeNull();
      });
    });
  });

  describe('Preload по умолчанию', () => {
    it('не должен загружать модуль без preloadFor', () => {
      const result = strategy.preload({ data: {} } as Route, loadMock);

      expect(loadMock).not.toHaveBeenCalled();
      result.subscribe((value) => {
        expect(value).toBeNull();
      });
    });
  });
});
