import { TestBed } from '@angular/core/testing';

import { ConfessFormService } from './confess-form.service';

describe('ConfessFormService', () => {
  let service: ConfessFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfessFormService],
    });
    service = TestBed.inject(ConfessFormService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Валидация формы', () => {
    it('должен иметь severity по умолчанию low', () => {
      expect(service.confessForm.controls.severity.value).toBe('low');
    });

    it('должен считать форму невалидной при пустом тексте', () => {
      expect(service.confessForm.valid).toBe(false);
    });

    it('должен отклонить текст короче 3 символов', () => {
      service.confessForm.setValue({ text: 'no', severity: 'low' });

      expect(service.confessForm.controls.text.valid).toBe(false);
    });

    it('должен принять валидный текст', () => {
      service.confessForm.setValue({ text: 'Forgot to write tests', severity: 'critical' });

      expect(service.confessForm.valid).toBe(true);
    });

    it('должен отклонить текст длиннее 500 символов', () => {
      service.confessForm.setValue({ text: 'a'.repeat(501), severity: 'medium' });

      expect(service.confessForm.controls.text.valid).toBe(false);
    });
  });
});
