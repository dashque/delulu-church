import { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';
import type { BranchJudgment } from '@features/sanctum/data/models/branch-judgment.model';
import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';

export function resolvePriestMood(isJudging: boolean, judgment: BranchJudgment | null): DigitalPriestMood {
  if (isJudging) {
    return DigitalPriestMood.PREACHING;
  }

  if (!judgment) {
    return DigitalPriestMood.IDLE;
  }

  if (judgment.sanctity === BranchSanctity.SACRED) {
    return DigitalPriestMood.BLESSING;
  }

  if (judgment.sanctity === BranchSanctity.FORBIDDEN) {
    return DigitalPriestMood.DAMNING;
  }

  return DigitalPriestMood.PREACHING;
}
