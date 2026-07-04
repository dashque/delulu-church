import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { DigitalPriestComponent } from './digital-priest.component';
import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';
import { DigitalPriestService } from '@features/sanctum/ui/components/digital-priest/services/digital-priest.service';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('DigitalPriestComponent', () => {
  let fixture: ComponentFixture<DigitalPriestComponent>;
  let component: DigitalPriestComponent;
  const priestServiceMock = {
    pickQuote: vi.fn(() => 'Idle quote 1'),
    speakQuote: vi.fn().mockResolvedValue(undefined),
    cancelSpeech: vi.fn(),
  };

  beforeEach(async () => {
    priestServiceMock.pickQuote.mockReset();
    priestServiceMock.pickQuote.mockReturnValue('Idle quote 1');
    priestServiceMock.speakQuote.mockReset();
    priestServiceMock.speakQuote.mockResolvedValue(undefined);
    priestServiceMock.cancelSpeech.mockReset();

    await TestBed.configureTestingModule({
      imports: [DigitalPriestComponent, TranslocoTestingMock],
    })
      .overrideComponent(DigitalPriestComponent, {
        set: {
          providers: [{ provide: DigitalPriestService, useValue: priestServiceMock }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DigitalPriestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });

  it('должен применять класс настроения проповеди', () => {
    fixture.componentRef.setInput('mood', DigitalPriestMood.PREACHING);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.digital-priest-preaching')).toBeTruthy();
  });

  it('должен показывать реплику при взаимодействии', async () => {
    let resolveSpeak!: () => void;

    priestServiceMock.speakQuote.mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveSpeak = resolve;
        })
    );

    component['onInteract']();
    await Promise.resolve();
    fixture.detectChanges();

    expect(component['isEngaged']()).toBe(true);
    expect(component['speechText']()).toBe('Idle quote 1');

    resolveSpeak();
    await Promise.resolve();
    fixture.detectChanges();

    expect(component['isEngaged']()).toBe(false);
    expect(component['speechText']()).toBeNull();
  });
});
