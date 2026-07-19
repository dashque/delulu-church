import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { authServiceMock, resetAuthServiceMock } from '@core/services/auth/auth.service.mock';
import { routerMock } from '@shared/mocks/router/router.mock';
import { hotToastServiceMock } from '@shared/mocks/hot-toast/hot-toast.service.mock';
import { HotToastService } from '@ngxpert/hot-toast';

import { LoginPageFacade } from './login-page.facade';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { LoginFormService } from '@features/login/services/login-form.service';
import { loginFormServiceMock } from '@features/login/services/login-form.service.mock';

describe('LoginPageFacadeService', () => {
  let service: LoginPageFacade;

  beforeEach(() => {
    resetAuthServiceMock();
    authServiceMock.login.mockReset().mockResolvedValue(null);
    authServiceMock.loginWithGithub.mockReset().mockResolvedValue(null);
    authServiceMock.loginWithGoogle.mockReset().mockResolvedValue(null);
    routerMock.navigate.mockReset().mockReturnValue(Promise.resolve(true));
    hotToastServiceMock.success.mockReset();
    hotToastServiceMock.error.mockReset();

    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [
        LoginPageFacade,
        { provide: LoginFormService, useValue: loginFormServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: HotToastService, useValue: hotToastServiceMock },
      ],
    });
    service = TestBed.inject(LoginPageFacade);
    service.loginForm.reset();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Вход по email и паролю', () => {
    it('должен вызвать login и перенаправить при успехе', async () => {
      service.loginForm.setValue({ email: 'dev@example.com', password: 'Aa888888' });

      await service.login();

      expect(authServiceMock.login).toHaveBeenNthCalledWith(1, 'dev@example.com', 'Aa888888');
      expect(routerMock.navigate).toHaveBeenNthCalledWith(1, ['/']);
      expect(hotToastServiceMock.success).toHaveBeenCalledWith(expect.any(String));
    });

    it('должен показать уведомление об ошибке', async () => {
      service.loginForm.setValue({ email: 'dev@example.com', password: 'Aa888888' });
      authServiceMock.login.mockRejectedValue(new Error('Invalid credentials'));

      await service.login();

      expect(hotToastServiceMock.error).toHaveBeenNthCalledWith(1, expect.stringContaining('Invalid credentials'));
      expect(routerMock.navigate).not.toHaveBeenCalled();
    });

    it('не должен повторно вызывать login во время загрузки', async () => {
      service.loginForm.setValue({ email: 'dev@example.com', password: 'Aa888888' });
      service.isLoading.set(true);

      await service.login();

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });
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
