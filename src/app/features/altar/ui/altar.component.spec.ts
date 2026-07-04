import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { AltarComponent } from './altar.component';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { AltarPageFacade } from '@features/altar/facades/altar-page.facade';
import { candlesServiceMock } from '@core/services/candles/candles.service.mock';
import { CandlesService } from '@core/services/candles/candles.service';
import { tuiNotificationServiceMock } from '@shared/mocks/tui-notification/tui-notification.service.mock';
import { TuiNotificationService } from '@taiga-ui/core';
import { of } from 'rxjs';

describe('AltarComponent', () => {
  let component: AltarComponent;
  let fixture: ComponentFixture<AltarComponent>;

  beforeEach(async () => {
    tuiNotificationServiceMock.open.mockReset().mockReturnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [AltarComponent, TranslocoTestingMock],
      providers: [
        AltarPageFacade,
        { provide: CandlesService, useValue: candlesServiceMock },
        { provide: TuiNotificationService, useValue: tuiNotificationServiceMock },
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
