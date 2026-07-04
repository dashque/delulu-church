import { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';
import { SanctumSoundPhase } from '@features/sanctum/data/models/sanctum-sound-phase.model';

export function resolveVerdictSoundPhase(sanctity: BranchSanctity): SanctumSoundPhase {
  switch (sanctity) {
    case BranchSanctity.SACRED:
      return SanctumSoundPhase.VERDICT_SACRED;

    case BranchSanctity.HERETICAL:
      return SanctumSoundPhase.VERDICT_HERETICAL;

    default:
      return SanctumSoundPhase.VERDICT_FORBIDDEN;
  }
}
