import type { BranchJudgment, BranchLitanyLine } from '@features/sanctum/data/models/branch-judgment.model';

export interface RitualSessionState {
  litanyLines: BranchLitanyLine[];
  judgment: BranchJudgment | null;
}
