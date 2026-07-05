import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { authServiceMock } from '@core/services/auth/auth.service.mock';
import { routerMock } from '@shared/mocks/router/router.mock';
import { tuiNotificationServiceMock } from '@shared/mocks/tui-notification/tui-notification.service.mock';
import { TuiNotificationService } from '@taiga-ui/core';

import { LoginPageFacade } from './login-page.facade';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('LoginPageFacadeService', () => {
  let service: LoginPageFacade;

  beforeEach(() => {
    authServiceMock.loginWithGithub.mockReset().mockResolvedValue(null);
    authServiceMock.loginWithGoogle.mockReset().mockResolvedValue(null);
    routerMock.navigate.mockReset().mockReturnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [
        LoginPageFacade,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: TuiNotificationService, useValue: tuiNotificationServiceMock },
      ],
    });
    service = TestBed.inject(LoginPageFacade);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Вход через Google', () => {
    it('должен вызвать вход через Google', async () => {
      await service.loginWithGoogle();

      expect(authServiceMock.loginWithGoogle).toHaveBeenCalledTimes(1);
    });

    it('должен перенаправить на главную страницу', async () => {
      await service.loginWithGoogle();

      expect(routerMock.navigate).toHaveBeenNthCalledWith(1, ['/']);
    });
  });

  describe('Вход через GitHub', () => {
    it('должен вызвать вход через GitHub', async () => {
      await service.loginWithGithub();

      expect(authServiceMock.loginWithGithub).toHaveBeenCalledTimes(1);
    });

    it('должен перенаправить на главную страницу', async () => {
      await service.loginWithGithub();

      expect(routerMock.navigate).toHaveBeenNthCalledWith(1, ['/']);
    });
  });
});
