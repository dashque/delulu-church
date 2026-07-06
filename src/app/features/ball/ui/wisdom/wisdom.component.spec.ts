import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { WisdomComponent } from './wisdom.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('WisdomComponent', () => {
  let component: WisdomComponent;
  let fixture: ComponentFixture<WisdomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WisdomComponent, TranslocoTestingMock],
    }).compileComponents();

    fixture = TestBed.createComponent(WisdomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });
});
