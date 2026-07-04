import { signal } from '@angular/core';
import type { MockedObject } from 'vitest';
import { vi } from 'vitest';

import { RITUAL_INTENT_OPTIONS } from '@features/sanctum/constants/ritual-intent-options.config';
import { sanctumFormFixture } from '@features/sanctum/fixtures/sanctum-form.fixture';
import type { BranchJudgment } from '@features/sanctum/data/models/branch-judgment.model';
import type { BranchLitanyLine } from '@features/sanctum/data/models/branch-judgment.model';
import type { SanctumPageFacade } from '@features/sanctum/facades/sanctum-page.facade';
import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';

export const sanctumPageFacadeMock = {
  sanctumForm: sanctumFormFixture,
  isJudging: signal(false),
  judgment: signal<BranchJudgment | null>(null),
  litanyLines: signal<BranchLitanyLine[]>([]),
  blessingLevel: signal(0),
  ritualIntentOptions: RITUAL_INTENT_OPTIONS,
  priestMood: signal(DigitalPriestMood.IDLE),
  invokeJudgment: vi.fn(),
  onPriestRaged: vi.fn(),
} as const satisfies MockedObject<Partial<SanctumPageFacade>>;
