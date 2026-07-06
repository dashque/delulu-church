import type { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';
import type { MergeFate } from '@features/sanctum/data/models/merge-fate.model';
import type { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';

export interface BranchLitanyLine {
  key: string;
  params?: Record<string, string | number>;
}

export interface BranchOmen {
  icon: string;
  sanctity: BranchSanctity;
  messageKey: string;
}

export interface BranchJudgment {
  branchName: string;
  sanctity: BranchSanctity;
  score: number;
  prophecyKey: string;
  intent: RitualIntent;
  mergeFate: MergeFate;
  omens: BranchOmen[];
  litany: BranchLitanyLine[];
}
