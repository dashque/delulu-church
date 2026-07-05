import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TarotReadingComponent } from './tarot-reading.component';
import { tarotResponseApiFixture } from '@features/main/data/api/fixtures/tarot-response-api.fixture';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('CardViewComponent', () => {
  let component: TarotReadingComponent;
  let fixture: ComponentFixture<TarotReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarotReadingComponent, TranslocoTestingMock],
    }).compileComponents();

    fixture = TestBed.createComponent(TarotReadingComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tarotReading', tarotResponseApiFixture);
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });
});
