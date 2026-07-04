import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { BallComponent } from './ball.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('BallComponent', () => {
  let component: BallComponent;
  let fixture: ComponentFixture<BallComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [BallComponent, TranslocoTestingMock],
    }).compileComponents();

    fixture = TestBed.createComponent(BallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });

  describe('Взаимодействие с шаром', () => {
    it('должен начать загрузку после клика', () => {
      component.onBallClick();

      expect(component.isCharging()).toBe(true);
      expect(component.answerText()).toBeNull();
    });
  });

  describe('Взаимодействие с таймером', () => {
    it('должен показать ответ через 1800 мс', () => {
      component.onBallClick();

      vi.advanceTimersByTime(1800);

      expect(component.answerText()).not.toBeNull();
    });

    it('должен очистить ответ и завершить загрузку через 4000 мс после появления ответа', () => {
      component.onBallClick();

      vi.advanceTimersByTime(1800);

      expect(component.answerText()).not.toBeNull();

      vi.advanceTimersByTime(4000);

      expect(component.answerText()).toBeNull();
      expect(component.isCharging()).toBe(false);
    });

    it('не должен повторно запускать загрузку, если она уже выполняется', () => {
      component.onBallClick();

      expect(component.isCharging()).toBe(true);

      component.onBallClick();

      vi.advanceTimersByTime(1800);

      expect(component.answerText()).not.toBeNull();
    });
  });
});
