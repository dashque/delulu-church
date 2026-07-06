import { describe, expect, it } from 'vitest';

import { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';
import { MergeFate } from '@features/sanctum/data/models/merge-fate.model';
import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';
import { analyzeBranch } from '@features/sanctum/helpers/analyze-branch.helper';

describe('analyzeBranch', () => {
  it('должен считать conventional branch sacred', () => {
    const judgment = analyzeBranch('feat/sanctum-branch-blessing', 80, RitualIntent.MERGE, 0);

    expect(judgment.sanctity).toBe(BranchSanctity.SACRED);
    expect(judgment.score).toBeGreaterThanOrEqual(70);
    expect(judgment.mergeFate).toBe(MergeFate.GREEN);
    expect(judgment.omens.length).toBe(3);
    expect(judgment.litany.some((line) => line.key.includes('kebab'))).toBe(true);
  });

  it('должен считать wip branch forbidden', () => {
    const judgment = analyzeBranch('wip-temp-stuff', 10, RitualIntent.MERGE, 0);

    expect(judgment.sanctity).toBe(BranchSanctity.FORBIDDEN);
    expect(judgment.mergeFate).toBe(MergeFate.RED);
  });

  it('должен учитывать уровень духа в оценке', () => {
    const lowSpirit = analyzeBranch('refactor/module', 5, RitualIntent.MERGE, 0);
    const highSpirit = analyzeBranch('refactor/module', 95, RitualIntent.MERGE, 0);

    expect(highSpirit.score).toBeGreaterThan(lowSpirit.score);
  });

  it('должен учитывать намерение ритуала', () => {
    const penanceFix = analyzeBranch('fix/altar-scroll', 50, RitualIntent.PENANCE, 0);
    const deploy = analyzeBranch('fix/altar-scroll', 50, RitualIntent.DEPLOY, 0);

    expect(penanceFix.score).toBeGreaterThan(deploy.score);
  });
});
