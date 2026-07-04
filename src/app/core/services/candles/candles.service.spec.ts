import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { firebaseAuthMock, resetFirebaseAuthMock } from '@core/services/auth/mocks/firebase-auth.mock';
import { userProfileFixture } from '@core/fixtures/user-profile.fixture';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import {
  resetUserProfileServiceMock,
  userProfileServiceMock,
} from '@core/services/user-profile/user-profile.service.mock';
import { CANDLE_EXTINGUISH_TIME_IN_MS } from '@core/services/candles/constants/candle-extinguish-time';
import { CANDLE_TYPES_CONFIG } from '@core/services/candles/constants/candle-types.config';
import { createEmptyCandleCounts } from '@core/services/candles/helpers/create-empty-candle-counts.helper';
import { CandleId } from '@core/services/candles/models/candle-id.model';

import { CandlesService } from './candles.service';

describe('CandlesService', () => {
  let service: CandlesService;

  beforeEach(() => {
    resetFirebaseAuthMock();
    resetUserProfileServiceMock();
    (userProfileServiceMock.user as unknown as Mock).mockReturnValue(userProfileFixture);
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('00000000-0000-4000-8000-000000000001');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CandlesService, { provide: UserProfileService, useValue: userProfileServiceMock }],
    });
    service = TestBed.inject(CandlesService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Подношение свечи', () => {
    it('должен добавить зажжённую свечу в список', () => {
      const candleType = CANDLE_TYPES_CONFIG[0];

      service.offerCandle(candleType);

      expect(service.litCandleList()).toEqual([
        expect.objectContaining({
          instanceId: '00000000-0000-4000-8000-000000000001',
          id: candleType.id,
          isLit: true,
        }),
      ]);
    });

    it('должен увеличить счётчик после затухания без профиля', async () => {
      vi.useFakeTimers();
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue(null);
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [CandlesService, { provide: UserProfileService, useValue: userProfileServiceMock }],
      });
      service = TestBed.inject(CandlesService);

      const candleType = CANDLE_TYPES_CONFIG.find((candle) => candle.id === CandleId.DEPLOY)!;

      service.offerCandle(candleType);
      expect(service.litCandleList()).toHaveLength(1);

      await vi.advanceTimersByTimeAsync(CANDLE_EXTINGUISH_TIME_IN_MS);

      expect(service.litCandleList()).toHaveLength(0);
      expect(service.candleCounts()[CandleId.DEPLOY]).toBe(1);
      expect(service.totalOfferings()).toBe(1);
    });

    it('должен сохранить состояние в Firestore после затухания', async () => {
      vi.useFakeTimers();
      firebaseAuthMock.getDoc.mockImplementation(async () => ({
        exists: () => true,
        data: () => ({
          candleCounts: createEmptyCandleCounts(),
          spiritSatisfaction: 0,
          spiritSatisfactionUpdatedAt: Date.now(),
        }),
      }));

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [CandlesService, { provide: UserProfileService, useValue: userProfileServiceMock }],
      });
      service = TestBed.inject(CandlesService);

      await vi.waitFor(() => firebaseAuthMock.getDoc.mock.calls.length > 0);
      await firebaseAuthMock.getDoc.mock.results.at(-1)?.value;

      const candleType = CANDLE_TYPES_CONFIG.find((candle) => candle.id === CandleId.BUG)!;

      service.offerCandle(candleType);
      await vi.advanceTimersByTimeAsync(CANDLE_EXTINGUISH_TIME_IN_MS);
      await vi.waitFor(() => firebaseAuthMock.setDoc.mock.calls.length > 0);
      await firebaseAuthMock.setDoc.mock.results.at(-1)?.value;

      expect(firebaseAuthMock.setDoc).toHaveBeenCalled();
      expect(service.candleCounts()[CandleId.BUG]).toBe(1);
      expect(service.error()).toBeNull();
    });

    it('должен откатить счётчик при ошибке сохранения', async () => {
      vi.useFakeTimers();
      firebaseAuthMock.getDoc.mockImplementation(async () => ({
        exists: () => true,
        data: () => ({
          candleCounts: createEmptyCandleCounts(),
          spiritSatisfaction: 0,
          spiritSatisfactionUpdatedAt: Date.now(),
        }),
      }));
      firebaseAuthMock.setDoc.mockImplementation(async () => {
        throw new Error('Firestore error');
      });

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [CandlesService, { provide: UserProfileService, useValue: userProfileServiceMock }],
      });
      service = TestBed.inject(CandlesService);

      await vi.waitFor(() => firebaseAuthMock.getDoc.mock.calls.length > 0);
      await firebaseAuthMock.getDoc.mock.results.at(-1)?.value;

      const candleType = CANDLE_TYPES_CONFIG.find((candle) => candle.id === CandleId.REVIEW)!;

      service.offerCandle(candleType);
      await vi.advanceTimersByTimeAsync(CANDLE_EXTINGUISH_TIME_IN_MS);
      await vi.waitFor(() => firebaseAuthMock.setDoc.mock.calls.length > 0);

      expect(service.candleCounts()[CandleId.REVIEW]).toBe(0);
      expect(service.error()).toBeInstanceOf(Error);
    });
  });

  describe('Загрузка состояния', () => {
    it('должен сбросить состояние, если пользователь не авторизован', () => {
      (userProfileServiceMock.user as unknown as Mock).mockReturnValue(null);

      expect(service.candleCounts()).toEqual(createEmptyCandleCounts());
      expect(service.litCandleList()).toEqual([]);
    });
  });
});
