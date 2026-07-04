import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';

import { SanctumPageFacade } from './sanctum-page.facade';
import { CandlesService } from '@core/services/candles/candles.service';
import { candlesServiceMock } from '@core/services/candles/candles.service.mock';
import { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';
import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';
import { branchJudgmentFixture } from '@features/sanctum/fixtures/branch-judgment.fixture';
import { SanctumFormService } from '@features/sanctum/services/sanctum-form.service';
import { sanctumRitualServiceMock } from '@features/sanctum/services/sanctum-ritual.service.mock';
import { SanctumRitualService } from '@features/sanctum/services/sanctum-ritual.service';
import { sanctumSoundServiceMock } from '@features/sanctum/services/sanctum-sound.service.mock';
import { SanctumSoundService } from '@features/sanctum/services/sanctum-sound.service';
import { priestQuotesServiceMock } from '@features/sanctum/services/priest-quotes.service.mock';
import { PriestQuotesService } from '@features/sanctum/services/priest-quotes.service';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { tuiNotificationServiceMock } from '@shared/mocks/tui-notification/tui-notification.service.mock';
import { TuiNotificationService } from '@taiga-ui/core';

describe('SanctumPageFacade', () => {
  let facade: SanctumPageFacade;
  const quotesErrorSignal = signal<unknown>(null);

  beforeEach(() => {
    quotesErrorSignal.set(null);
    sanctumRitualServiceMock.isJudging.set(false);
    sanctumRitualServiceMock.judgment.set(null);
    sanctumRitualServiceMock.litanyLines.set([]);
    tuiNotificationServiceMock.open.mockReset().mockReturnValue(of(undefined));

    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [
        SanctumPageFacade,
        SanctumFormService,
        { provide: CandlesService, useValue: candlesServiceMock },
        { provide: SanctumRitualService, useValue: sanctumRitualServiceMock },
        { provide: SanctumSoundService, useValue: sanctumSoundServiceMock },
        {
          provide: PriestQuotesService,
          useValue: {
            ...priestQuotesServiceMock,
            quotesByPool: { error: quotesErrorSignal.asReadonly() },
          },
        },
        { provide: TuiNotificationService, useValue: tuiNotificationServiceMock },
      ],
    });

    facade = TestBed.inject(SanctumPageFacade);
  });

  it('должен инициализироваться', () => {
    expect(facade).toBeTruthy();
  });

  it('должен показать уведомление при ошибке загрузки реплик', () => {
    quotesErrorSignal.set(new Error('Firestore error'));
    TestBed.flushEffects();

    expect(tuiNotificationServiceMock.open).toHaveBeenCalledTimes(1);
  });

  describe('Вердикт запрошен', () => {
    beforeEach(() => {
      facade.sanctumForm.setValue({
        branch: branchJudgmentFixture.branchName,
        ritualIntent: RitualIntent.MERGE,
      });
    });

    it('должен запустить ритуал с данными формы', () => {
      facade.invokeJudgment();

      expect(sanctumSoundServiceMock.prime).toHaveBeenCalledTimes(1);
      expect(sanctumRitualServiceMock.startRitual).toHaveBeenNthCalledWith(
        1,
        branchJudgmentFixture.branchName,
        RitualIntent.MERGE,
        0
      );
    });
  });

  describe('Вердикт получен', () => {
    it('должен отображать состояние судебного ритуала', () => {
      sanctumRitualServiceMock.isJudging.set(true);

      expect(facade.isJudging()).toBe(true);
    });

    it('должен отображать литанию', () => {
      sanctumRitualServiceMock.litanyLines.set(branchJudgmentFixture.litany);

      expect(facade.litanyLines()).toEqual(branchJudgmentFixture.litany);
    });

    it('должен отображать вердикт', () => {
      sanctumRitualServiceMock.judgment.set(branchJudgmentFixture);

      expect(facade.judgment()?.branchName).toBe(branchJudgmentFixture.branchName);
      expect(facade.judgment()?.sanctity).toBe(BranchSanctity.SACRED);
      expect(facade.judgment()?.omens).toHaveLength(3);
    });
  });
});
