import { TestBed } from '@angular/core/testing';

import { LoginFormService } from './login-form.service';

describe('LoginFormService', () => {
  let service: LoginFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginFormService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Валидация формы', () => {
    it('должен считать форму невалидной при пустых полях', () => {
      expect(service.loginForm.valid).toBe(false);
    });

    it('должен принять корректные email и пароль', () => {
      service.loginForm.setValue({
        email: 'dev@example.com',
        password: 'Aa888888',
      });

      expect(service.loginForm.valid).toBe(true);
    });

    it('должен отклонить некорректный email', () => {
      service.loginForm.setValue({
        email: 'not-an-email',
        password: 'Aa888888',
      });

      expect(service.loginForm.controls.email.valid).toBe(false);
    });

    it('должен отклонить слабый пароль', () => {
      service.loginForm.setValue({
        email: 'dev@example.com',
        password: 'weak',
      });

      expect(service.loginForm.controls.password.valid).toBe(false);
    });
  });
});
