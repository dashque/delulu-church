import {
  RITUAL_LITANY_LINE_DELAY_MS,
  RITUAL_VERDICT_REVEAL_DELAY_MS,
} from '@features/sanctum/constants/branch-judgment.config';
import type { RitualRequest } from '@features/sanctum/data/models/ritual-request.model';
import type { RitualSessionState } from '@features/sanctum/data/models/ritual-session-state.model';
import { analyzeBranch } from '@features/sanctum/helpers/analyze-branch.helper';
import { map, merge, type Observable, timer } from 'rxjs';

export function createRitualTimelineStream(request: RitualRequest): Observable<RitualSessionState> {
  const judgment = analyzeBranch(request.branch, request.spiritLevel, request.ritualIntent);
  const lineEvents = judgment.litany.map((line, index) => {
    return timer((index + 1) * RITUAL_LITANY_LINE_DELAY_MS).pipe(
      map(() => ({
        litanyLines: judgment.litany.slice(0, index + 1),
        judgment: null,
      }))
    );
  });
  const verdictEvent = timer(
    judgment.litany.length * RITUAL_LITANY_LINE_DELAY_MS + RITUAL_VERDICT_REVEAL_DELAY_MS
  ).pipe(
    map(() => ({
      litanyLines: judgment.litany,
      judgment,
    }))
  );

  return merge(...lineEvents, verdictEvent);
}
