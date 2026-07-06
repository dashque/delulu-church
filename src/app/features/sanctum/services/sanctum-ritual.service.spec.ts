import { TestBed } from '@angular/core/testing';

import { SanctumRitualService } from './sanctum-ritual.service';
import { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';
import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';
import { branchJudgmentFixture } from '@features/sanctum/fixtures/branch-judgment.fixture';
import { sanctumSoundServiceMock } from '@features/sanctum/services/sanctum-sound.service.mock';
import { SanctumSoundPhase } from '@features/sanctum/data/models/sanctum-sound-phase.model';
import { SanctumSoundService } from '@features/sanctum/services/sanctum-sound.service';

describe('SanctumRitualService', () => {
  let service: SanctumRitualService;

  beforeEach(() => {
    sanctumSoundServiceMock.play.mockClear();
    sanctumSoundServiceMock.prime.mockClear();

    TestBed.configureTestingModule({
      providers: [SanctumRitualService, { provide: SanctumSoundService, useValue: sanctumSoundServiceMock }],
    });

    service = TestBed.inject(SanctumRitualService);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Ритуал запущен', () => {
    it('должен переводить ritualSession в loading', () => {
      service.startRitual(branchJudgmentFixture.branchName, RitualIntent.MERGE, 0);
      TestBed.tick();

      expect(service.ritualSession.status()).toBe('loading');
      expect(service.isJudging()).toBe(true);
      expect(service.litanyLines()).toHaveLength(0);
      expect(service.judgment()).toBeNull();
    });

    it('должен проигрывать звук старта ритуала', () => {
      service.startRitual(branchJudgmentFixture.branchName, RitualIntent.MERGE, 0);
      TestBed.tick();

      expect(sanctumSoundServiceMock.play).toHaveBeenCalledWith(SanctumSoundPhase.RITUAL_START);
    });
  });

  describe('Вердикт получен', () => {
    it('должен отражать вердикт из ritualSession', () => {
      service.ritualSession.set({
        litanyLines: branchJudgmentFixture.litany,
        judgment: branchJudgmentFixture,
      });

      expect(service.isJudging()).toBe(false);
      expect(service.litanyLines()).toEqual(branchJudgmentFixture.litany);
      expect(service.judgment()?.branchName).toBe(branchJudgmentFixture.branchName);
      expect(service.judgment()?.sanctity).toBe(BranchSanctity.SACRED);
      expect(service.judgment()?.omens).toHaveLength(3);
    });
  });
});
