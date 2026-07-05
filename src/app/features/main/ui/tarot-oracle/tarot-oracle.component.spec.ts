import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TarotOracleComponent } from './tarot-oracle.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { TarotIntent } from '@features/main/data/api/models/intent.model';
import { TarotRole } from '@features/main/data/api/models/role.model';
import { describe } from 'vitest';

describe('TarotOracleComponent', () => {
  let component: TarotOracleComponent;
  let fixture: ComponentFixture<TarotOracleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarotOracleComponent, TranslocoTestingMock],
    }).compileComponents();

    fixture = TestBed.createComponent(TarotOracleComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('role', TarotRole.DEVOPS);
    fixture.componentRef.setInput('intent', TarotIntent.FULL_RELEASE);
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });
});
