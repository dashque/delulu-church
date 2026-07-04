import { computed, DestroyRef, effect, inject, Service, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CANDLE_EXTINGUISH_TIME_IN_MS } from '@core/services/candles/constants/candle-extinguish-time';
import { CANDLE_TYPES_CONFIG } from '@core/services/candles/constants/candle-types.config';
import {
  SPIRIT_PLEASED_THRESHOLD,
  SPIRIT_SATISFACTION_DECAY_INTERVAL_MS,
} from '@core/services/candles/constants/spirit-satisfaction.config';
import { createEmptyCandleCounts } from '@core/services/candles/helpers/create-empty-candle-counts.helper';
import {
  createEmptySpiritSatisfaction,
  decreaseSpiritSatisfaction,
  increaseSpiritSatisfaction,
  parseSpiritSatisfaction,
  resolveSpiritSatisfaction,
} from '@core/services/candles/helpers/spirit-satisfaction.helper';
import type { CandleCounts } from '@core/services/candles/models/candle-counts.model';
import type { CandleId } from '@core/services/candles/models/candle-id.model';
import type { CandleType } from '@core/services/candles/models/candle-type.model';
import type { LitCandle } from '@core/services/candles/models/lit-candle.model';
import type { SpiritSatisfaction } from '@core/services/candles/models/spirit-satisfaction.model';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { firestore } from '@env/environment';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { timer } from 'rxjs';
import { withTimeout } from '@shared/helpers/with-timeout.helper';
import { FIRESTORE_OPERATION_TIMEOUT_MS } from '@shared/constants/firestore-operation-timeout';
import type { UserCandleState } from '@core/services/candles/models/user-candle-state.model';

@Service()
export class CandlesService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly userProfileService = inject(UserProfileService);
  private readonly _candleCounts = signal<CandleCounts>(createEmptyCandleCounts());
  private readonly _litCandleList = signal<LitCandle[]>([]);
  private readonly _spiritSatisfaction = signal<SpiritSatisfaction>(createEmptySpiritSatisfaction());
  private readonly _error = signal<unknown | null>(null);

  public readonly candleTypes = CANDLE_TYPES_CONFIG;
  public readonly litCandleList = this._litCandleList.asReadonly();
  public readonly candleCounts = this._candleCounts.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly totalOfferings = computed(() => {
    return Object.values(this._candleCounts()).reduce((total, count) => total + count, 0);
  });
  public readonly blessingLevel = computed(() => this._spiritSatisfaction().level);
  public readonly isSpiritPleased = computed(() => {
    return this._spiritSatisfaction().level >= SPIRIT_PLEASED_THRESHOLD;
  });

  public constructor() {
    effect(() => {
      const profile = this.userProfileService.user();

      if (!profile) {
        this.resetState();

        return;
      }

      void this.loadState(profile.uid);
    });

    effect((onCleanup) => {
      if (this._spiritSatisfaction().level <= 0) {
        return;
      }

      const subscription = timer(SPIRIT_SATISFACTION_DECAY_INTERVAL_MS).subscribe(() => {
        void this.updateSpiritSatisfaction(decreaseSpiritSatisfaction);
      });

      onCleanup(() => {
        subscription.unsubscribe();
      });
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
    const previousSpiritSatisfaction = this._spiritSatisfaction();
    const nextCounts = {
      ...previousCounts,
      [candleId]: previousCounts[candleId] + 1,
    };

    this._candleCounts.set(nextCounts);

    const profile = this.userProfileService.user();

    if (!profile) {
      this._spiritSatisfaction.update(increaseSpiritSatisfaction);

      return;
    }

    const nextSpiritSatisfaction = increaseSpiritSatisfaction(previousSpiritSatisfaction);

    try {
      await this.persistState(profile.uid, {
        candleCounts: nextCounts,
        candles: this.getTotalCandles(nextCounts),
        spiritSatisfaction: nextSpiritSatisfaction,
      });
      this._spiritSatisfaction.set(nextSpiritSatisfaction);
      this._error.set(null);
    } catch (error) {
      this._candleCounts.set(previousCounts);
      this._spiritSatisfaction.set(previousSpiritSatisfaction);
      this._error.set(error);
    }
  }

  private async loadState(uid: string): Promise<void> {
    try {
      const userSnapshot = await this.runFirestoreOp(getDoc(this.getUserReference(uid)));

      if (!userSnapshot.exists()) {
        this.resetState();
        this._error.set(null);

        return;
      }

      const data = userSnapshot.data();
      const candleCounts = this.parseCandleCounts(data['candleCounts']);
      const storedSpiritSatisfaction = parseSpiritSatisfaction(data);
      const spiritSatisfaction = resolveSpiritSatisfaction(storedSpiritSatisfaction, candleCounts);

      this._candleCounts.set(candleCounts);
      this._spiritSatisfaction.set(spiritSatisfaction);
      this._error.set(null);

      if (
        !storedSpiritSatisfaction ||
        spiritSatisfaction.level !== storedSpiritSatisfaction.level ||
        spiritSatisfaction.updatedAt !== storedSpiritSatisfaction.updatedAt
      ) {
        await this.persistState(uid, {
          candleCounts,
          candles: this.getTotalCandles(candleCounts),
          spiritSatisfaction,
        });
      }
    } catch (error) {
      this.resetState();
      this._error.set(error);
    }
  }

  private async updateSpiritSatisfaction(
    transform: (spiritSatisfaction: SpiritSatisfaction) => SpiritSatisfaction,
    persist = true
  ): Promise<void> {
    const previousSpiritSatisfaction = this._spiritSatisfaction();
    const nextSpiritSatisfaction = transform(previousSpiritSatisfaction);

    this._spiritSatisfaction.set(nextSpiritSatisfaction);

    if (!persist) {
      return;
    }

    const profile = this.userProfileService.user();

    if (!profile) {
      return;
    }

    try {
      await this.persistState(profile.uid, { spiritSatisfaction: nextSpiritSatisfaction });
      this._error.set(null);
    } catch (error) {
      this._spiritSatisfaction.set(previousSpiritSatisfaction);
      this._error.set(error);
    }
  }

  private async persistState(uid: string, state: Partial<UserCandleState>): Promise<void> {
    const payload: Record<string, unknown> = {};

    if (state.candleCounts) {
      payload['candleCounts'] = state.candleCounts;
    }

    if (typeof state.candles === 'number') {
      payload['candles'] = state.candles;
    }

    if (state.spiritSatisfaction) {
      payload['spiritSatisfaction'] = state.spiritSatisfaction.level;
      payload['spiritSatisfactionUpdatedAt'] = state.spiritSatisfaction.updatedAt;
    }

    await this.runFirestoreOp(setDoc(this.getUserReference(uid), payload, { merge: true }));
  }

  private runFirestoreOp<T>(operation: Promise<T>): Promise<T> {
    return withTimeout(operation, FIRESTORE_OPERATION_TIMEOUT_MS);
  }

  private resetState(): void {
    this._candleCounts.set(createEmptyCandleCounts());
    this._litCandleList.set([]);
    this._spiritSatisfaction.set(createEmptySpiritSatisfaction());
    this._error.set(null);
  }

  private getUserReference(uid: string) {
    return doc(firestore, 'users', uid);
  }

  private getTotalCandles(candleCounts: CandleCounts): number {
    return Object.values(candleCounts).reduce((total, count) => total + count, 0);
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
