import { computed, DestroyRef, effect, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BLESSING_LEVEL_STEP } from '@core/services/candles/constants/blessing-level-step';
import { CANDLE_EXTINGUISH_TIME_IN_MS } from '@core/services/candles/constants/candle-extinguish-time';
import { CANDLE_TYPES_CONFIG } from '@core/services/candles/constants/candle-types.config';
import { type CandleCounts } from '@core/services/candles/models/candle-counts.model';
import type { CandleId } from '@core/services/candles/models/candle-id.model';
import type { LitCandle } from '@core/services/candles/models/lit-candle.model';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { firestore } from '@env/environment';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { timer } from 'rxjs';
import type { CandleType } from '@core/services/candles/models/candle-type.model';
import { createEmptyCandleCounts } from '@core/services/candles/helpers/create-empty-candle-counts.helper';

@Service()
export class CandlesService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly userProfileService = inject(UserProfileService);
  private readonly _candleCounts = signal<CandleCounts>(createEmptyCandleCounts());
  private readonly _litCandleList = signal<LitCandle[]>([]);
  private readonly _error = signal<unknown | null>(null);
  public readonly candleTypes = CANDLE_TYPES_CONFIG;
  public readonly litCandleList = this._litCandleList.asReadonly();
  public readonly candleCounts = this._candleCounts.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly totalOfferings = computed(() => {
    const counts = this._candleCounts();

    return Object.values(counts).reduce((total, count) => total + count, 0);
  });
  public readonly blessingLevel = computed(() => {
    return Math.min(100, this.totalOfferings() * BLESSING_LEVEL_STEP);
  });
  public readonly isSpiritPleased = computed(() => {
    return this.totalOfferings() > 10;
  });

  public constructor() {
    effect(() => {
      const profile = this.userProfileService.user();

      if (!profile) {
        this._candleCounts.set(createEmptyCandleCounts());
        this._litCandleList.set([]);
        this._error.set(null);

        return;
      }

      void this.loadCandleCounts(profile.uid);
    });
  }

  public offerCandle(candle: CandleType): void {
    this._error.set(null);

    const litCandle: LitCandle = {
      ...candle,
      instanceId: crypto.randomUUID(),
      isLit: true,
    };

    this._litCandleList.update((list) => [...list, litCandle]);

    timer(CANDLE_EXTINGUISH_TIME_IN_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.completeOffering(litCandle.instanceId, candle.id);
      });
  }

  private async completeOffering(instanceId: string, candleId: CandleId): Promise<void> {
    this._litCandleList.update((list) => list.filter((candle) => candle.instanceId !== instanceId));

    const previousCounts = this._candleCounts();
    const nextCounts = {
      ...previousCounts,
      [candleId]: previousCounts[candleId] + 1,
    };

    this._candleCounts.set(nextCounts);

    const profile = this.userProfileService.user();

    if (!profile) {
      return;
    }

    const totalCandles = Object.values(nextCounts).reduce((total, count) => total + count, 0);

    try {
      await this.saveCandleCounts(profile.uid, nextCounts, totalCandles);
      this._error.set(null);
    } catch (error) {
      this._candleCounts.set(previousCounts);
      this._error.set(error);
    }
  }

  private async loadCandleCounts(uid: string): Promise<void> {
    try {
      const userSnapshot = await getDoc(this.getUserReference(uid));

      if (!userSnapshot.exists()) {
        this._candleCounts.set(createEmptyCandleCounts());
        this._error.set(null);

        return;
      }

      const data = userSnapshot.data();

      this._candleCounts.set(this.parseCandleCounts(data['candleCounts']));
      this._error.set(null);
    } catch (error) {
      this._candleCounts.set(createEmptyCandleCounts());
      this._error.set(error);
    }
  }

  private async saveCandleCounts(uid: string, candleCounts: CandleCounts, totalCandles: number): Promise<void> {
    await setDoc(
      this.getUserReference(uid),
      {
        candleCounts,
        candles: totalCandles,
      },
      { merge: true }
    );
  }

  private getUserReference(uid: string) {
    return doc(firestore, 'users', uid);
  }

  private parseCandleCounts(value: unknown): CandleCounts {
    const emptyCounts = createEmptyCandleCounts();

    if (typeof value !== 'object' || value === null) {
      return emptyCounts;
    }

    const counts = value as Record<string, unknown>;

    return CANDLE_TYPES_CONFIG.reduce<CandleCounts>((parsedCounts, candle) => {
      parsedCounts[candle.id] = this.getNumber(counts[candle.id]);

      return parsedCounts;
    }, emptyCounts);
  }

  private getNumber(value: unknown): number {
    return typeof value === 'number' ? value : 0;
  }
}
