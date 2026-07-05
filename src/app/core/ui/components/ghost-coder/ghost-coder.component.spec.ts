import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { GhostCoderComponent } from './ghost-coder.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('GhostCoderComponent', () => {
  let component: GhostCoderComponent;
  let fixture: ComponentFixture<GhostCoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostCoderComponent, TranslocoTestingMock],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostCoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Инициализация компонента', () => {
    it('должен инициализироваться', () => {
      expect(component).toBeTruthy();
    });
  });
});
