import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { PrayerComponent } from './prayer.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('PrayerComponent', () => {
  let component: PrayerComponent;
  let fixture: ComponentFixture<PrayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrayerComponent, TranslocoTestingMock],
    }).compileComponents();

    fixture = TestBed.createComponent(PrayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });
});
