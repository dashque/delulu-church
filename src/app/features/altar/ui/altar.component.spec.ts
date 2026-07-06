import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AltarComponent } from './altar.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { AltarPageFacade } from '@features/altar/facades/altar-page.facade';
import { candlesServiceMock } from '@core/services/candles/candles.service.mock';
import { CandlesService } from '@core/services/candles/candles.service';
import { hotToastServiceMock } from '@shared/mocks/hot-toast/hot-toast.service.mock';
import { HotToastService } from '@ngxpert/hot-toast';

describe('AltarComponent', () => {
  let component: AltarComponent;
  let fixture: ComponentFixture<AltarComponent>;

  beforeEach(async () => {
    hotToastServiceMock.error.mockReset();

    await TestBed.configureTestingModule({
      imports: [AltarComponent, TranslocoTestingMock],
      providers: [
        AltarPageFacade,
        { provide: CandlesService, useValue: candlesServiceMock },
        { provide: HotToastService, useValue: hotToastServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AltarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });
});
