import { TestBed } from '@angular/core/testing';

import { RegisterFormService } from './register-form.service';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { registerFormValidValueFixture } from '@features/registration/fixtures/register-form-value.fixture';

describe('RegisterFormService', () => {
  let service: RegisterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
    });
    service = TestBed.inject(RegisterFormService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Получение формы', () => {
    it('должен вернуть инстанс формы с ожидаемыми контролами', () => {
      expect(service.registerForm.controls).toMatchObject({
        name: expect.anything(),
        email: expect.anything(),
        password: expect.anything(),
        passwordConfirmation: expect.anything(),
        dateOfBirth: expect.anything(),
      });
    });
  });

  describe('Валидация формы', () => {
    it('должен принять валидные данные', () => {
      service.registerForm.setValue(registerFormValidValueFixture);

      expect(service.registerForm.valid).toBe(true);
    });

    it('должен отклонить несовпадающие пароли', () => {
      service.registerForm.setValue({
        ...registerFormValidValueFixture,
        passwordConfirmation: 'Bb999999',
      });

      expect(service.registerForm.valid).toBe(false);
    });

    it('должен отклонить пустое имя', () => {
      service.registerForm.setValue({
        ...registerFormValidValueFixture,
        name: '',
      });

      expect(service.registerForm.controls.name.valid).toBe(false);
    });
  });
});
