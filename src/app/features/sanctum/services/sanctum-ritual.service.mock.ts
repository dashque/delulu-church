import { signal, type WritableSignal } from '@angular/core';
import type { MockInstance } from 'vitest';
import { vi } from 'vitest';

import type { BranchJudgment } from '@features/sanctum/data/models/branch-judgment.model';
import type { BranchLitanyLine } from '@features/sanctum/data/models/branch-judgment.model';
import type { SanctumRitualService } from '@features/sanctum/services/sanctum-ritual.service';

interface SanctumRitualServiceMock {
  isJudging: WritableSignal<boolean>;
  judgment: WritableSignal<BranchJudgment | null>;
  litanyLines: WritableSignal<BranchLitanyLine[]>;
  startRitual: MockInstance<SanctumRitualService['startRitual']>;
}

export const sanctumRitualServiceMock = {
  isJudging: signal(false),
  judgment: signal<BranchJudgment | null>(null),
  litanyLines: signal<BranchLitanyLine[]>([]),
  startRitual: vi.fn(),
} satisfies SanctumRitualServiceMock;
