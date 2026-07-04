import { describe, expect, it } from 'vitest';

import { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';
import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';
import { DigitalPriestMood } from '@features/sanctum/data/models/digital-priest-mood.model';
import { analyzeBranch } from '@features/sanctum/helpers/analyze-branch.helper';
import { resolvePriestMood } from '@features/sanctum/helpers/resolve-priest-mood.helper';

describe('resolvePriestMood', () => {
  it('должен возвращать preaching во время ритуала', () => {
    expect(resolvePriestMood(true, null)).toBe(DigitalPriestMood.PREACHING);
  });

  it('должен возвращать blessing для sacred-вердикта', () => {
    const judgment = analyzeBranch('feat/sanctum-branch-blessing', 0, RitualIntent.MERGE, 0);

    expect(resolvePriestMood(false, judgment)).toBe(DigitalPriestMood.BLESSING);
    expect(judgment.sanctity).toBe(BranchSanctity.SACRED);
  });
});
