import type { BranchJudgment } from '@features/sanctum/data/models/branch-judgment.model';
import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';
import { analyzeBranch } from '@features/sanctum/helpers/analyze-branch.helper';

export const branchJudgmentFixture = analyzeBranch(
  'feat/sanctum-branch-blessing',
  0,
  RitualIntent.MERGE,
  0
) satisfies BranchJudgment;
