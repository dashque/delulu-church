import {
  BRANCH_FORBIDDEN_PATTERNS,
  BRANCH_FORBIDDEN_PENALTY,
  BRANCH_HERETICAL_PATTERNS,
  BRANCH_HERETICAL_PENALTY,
  BRANCH_KEBAB_CASE_BONUS,
  BRANCH_KEBAB_CASE_PATTERN,
  BRANCH_LONG_NAME_PENALTY,
  BRANCH_LONG_NAME_THRESHOLD,
  BRANCH_OMEN_COUNT,
  BRANCH_OMEN_HIGH_SPIRIT_THRESHOLD,
  BRANCH_OMEN_LOW_SPIRIT_THRESHOLD,
  BRANCH_PROPHECY_KEYS,
  BRANCH_SACRED_PREFIX_BONUS,
  BRANCH_SACRED_PREFIXES,
  BRANCH_SANCTITY_HERETICAL_THRESHOLD,
  BRANCH_SANCTITY_SACRED_THRESHOLD,
  BRANCH_SCORE_BASE,
  BRANCH_SCORE_MAX,
  BRANCH_SCORE_MIN,
  BRANCH_SHORT_NAME_PENALTY,
  BRANCH_SHORT_NAME_THRESHOLD,
  BRANCH_SPIRIT_LEVEL_WEIGHT,
  MERGE_FATE_AMBER_SCORE_THRESHOLD,
  MERGE_FATE_DEPLOY_SCORE_THRESHOLD,
  MERGE_FATE_FORBIDDEN_SCORE_THRESHOLD,
  MERGE_FATE_GREEN_SCORE_THRESHOLD,
  RITUAL_INTENT_DEPLOY_SCORE_MODIFIER,
  RITUAL_INTENT_PENANCE_DEFAULT_PENALTY,
  RITUAL_INTENT_PENANCE_FIX_BONUS,
} from '@features/sanctum/constants/branch-judgment.config';
import type { BranchJudgment, BranchLitanyLine, BranchOmen } from '@features/sanctum/data/models/branch-judgment.model';
import { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';
import { MergeFate } from '@features/sanctum/data/models/merge-fate.model';
import { RitualIntent } from '@features/sanctum/data/models/ritual-intent.model';
import { marker } from '@jsverse/transloco-keys-manager/marker';

interface BranchInspection {
  normalizedBranch: string;
  branchSlug: string;
  hasSacredPrefix: boolean;
  forbiddenMatch?: RegExp;
  hereticalMatch?: RegExp;
  isKebabCase: boolean;
  isLongBranch: boolean;
}

export function analyzeBranch(
  branchName: string,
  spiritLevel: number,
  intent: RitualIntent = RitualIntent.MERGE,
  randomValue = Math.random()
): BranchJudgment {
  const inspection = inspectBranch(branchName);
  const score = clampScore(calculateScore(inspection, spiritLevel, intent));
  const sanctity = resolveSanctity(score);
  const mergeFate = resolveMergeFate(score, intent, Boolean(inspection.forbiddenMatch));

  return {
    branchName: inspection.normalizedBranch,
    sanctity,
    score,
    prophecyKey: pickProphecyKey(sanctity, randomValue),
    intent,
    mergeFate,
    omens: buildOmens(inspection, spiritLevel, sanctity, intent),
    litany: buildLitany(inspection, spiritLevel, intent),
  };
}

function inspectBranch(branchName: string): BranchInspection {
  const normalizedBranch = branchName.trim();
  const branchSlug = extractBranchSlug(normalizedBranch);

  return {
    normalizedBranch,
    branchSlug,
    hasSacredPrefix: BRANCH_SACRED_PREFIXES.some((prefix) => normalizedBranch.startsWith(prefix)),
    forbiddenMatch: BRANCH_FORBIDDEN_PATTERNS.find((pattern) => pattern.test(normalizedBranch)),
    hereticalMatch: BRANCH_HERETICAL_PATTERNS.find((pattern) => pattern.test(normalizedBranch)),
    isKebabCase: BRANCH_KEBAB_CASE_PATTERN.test(branchSlug),
    isLongBranch: normalizedBranch.length > BRANCH_LONG_NAME_THRESHOLD,
  };
}

function extractBranchSlug(branchName: string): string {
  const sacredPrefix = BRANCH_SACRED_PREFIXES.find((prefix) => branchName.startsWith(prefix));

  if (!sacredPrefix) {
    return branchName;
  }

  return branchName.slice(sacredPrefix.length);
}

function calculateScore(inspection: BranchInspection, spiritLevel: number, intent: RitualIntent): number {
  let score = BRANCH_SCORE_BASE + Math.round(spiritLevel * BRANCH_SPIRIT_LEVEL_WEIGHT);

  if (inspection.normalizedBranch.length < BRANCH_SHORT_NAME_THRESHOLD) {
    score -= BRANCH_SHORT_NAME_PENALTY;
  }

  if (inspection.isLongBranch) {
    score -= BRANCH_LONG_NAME_PENALTY;
  }

  if (inspection.hasSacredPrefix) {
    score += BRANCH_SACRED_PREFIX_BONUS;
  }

  if (inspection.forbiddenMatch) {
    score -= BRANCH_FORBIDDEN_PENALTY;
  }

  if (inspection.hereticalMatch) {
    score -= BRANCH_HERETICAL_PENALTY;
  }

  if (inspection.isKebabCase) {
    score += BRANCH_KEBAB_CASE_BONUS;
  }

  score += resolveIntentModifier(intent, inspection.normalizedBranch);

  return score;
}

function resolveIntentModifier(intent: RitualIntent, branchName: string): number {
  switch (intent) {
    case RitualIntent.DEPLOY:
      return RITUAL_INTENT_DEPLOY_SCORE_MODIFIER;

    case RitualIntent.PENANCE:
      return branchName.startsWith('fix/') ? RITUAL_INTENT_PENANCE_FIX_BONUS : RITUAL_INTENT_PENANCE_DEFAULT_PENALTY;

    default:
      return 0;
  }
}

function clampScore(score: number): number {
  return Math.min(BRANCH_SCORE_MAX, Math.max(BRANCH_SCORE_MIN, score));
}

function resolveSanctity(score: number): BranchSanctity {
  if (score >= BRANCH_SANCTITY_SACRED_THRESHOLD) {
    return BranchSanctity.SACRED;
  }

  if (score >= BRANCH_SANCTITY_HERETICAL_THRESHOLD) {
    return BranchSanctity.HERETICAL;
  }

  return BranchSanctity.FORBIDDEN;
}

function resolveMergeFate(score: number, intent: RitualIntent, hasForbidden: boolean): MergeFate {
  if (hasForbidden || score < MERGE_FATE_FORBIDDEN_SCORE_THRESHOLD) {
    return MergeFate.RED;
  }

  if (intent === RitualIntent.DEPLOY && score < MERGE_FATE_DEPLOY_SCORE_THRESHOLD) {
    return MergeFate.RED;
  }

  if (score >= MERGE_FATE_GREEN_SCORE_THRESHOLD) {
    return MergeFate.GREEN;
  }

  if (score >= MERGE_FATE_AMBER_SCORE_THRESHOLD) {
    return MergeFate.AMBER;
  }

  return MergeFate.RED;
}

function pickProphecyKey(sanctity: BranchSanctity, randomValue: number): string {
  const prophecyKeys = BRANCH_PROPHECY_KEYS[sanctity];
  const prophecyIndex = Math.floor(randomValue * prophecyKeys.length);

  return prophecyKeys[prophecyIndex];
}

function buildLitany(inspection: BranchInspection, spiritLevel: number, intent: RitualIntent): BranchLitanyLine[] {
  const lines: BranchLitanyLine[] = [
    { key: marker('sanctum.litany.boot') },
    { key: marker('sanctum.litany.target'), params: { branch: inspection.normalizedBranch } },
    { key: marker('sanctum.litany.intent'), params: { intent } },
    { key: marker('sanctum.litany.spirit'), params: { level: spiritLevel } },
    {
      key: marker(inspection.hasSacredPrefix ? 'sanctum.litany.convention_found' : 'sanctum.litany.convention_missing'),
    },
  ];

  if (inspection.forbiddenMatch) {
    lines.push({
      key: marker('sanctum.litany.forbidden'),
      params: { pattern: inspection.forbiddenMatch.source },
    });
  }

  if (inspection.hereticalMatch) {
    lines.push({
      key: marker('sanctum.litany.heresy'),
      params: { pattern: inspection.hereticalMatch.source },
    });
  }

  if (inspection.isKebabCase) {
    lines.push({ key: marker('sanctum.litany.kebab') });
  }

  if (inspection.isLongBranch) {
    lines.push({ key: marker('sanctum.litany.length_warn') });
  }

  lines.push({ key: marker('sanctum.litany.verdict_pending') });

  return lines;
}

function buildOmens(
  inspection: BranchInspection,
  spiritLevel: number,
  sanctity: BranchSanctity,
  intent: RitualIntent
): BranchOmen[] {
  const omens: BranchOmen[] = [];

  if (inspection.hasSacredPrefix) {
    omens.push({
      icon: '@tui.sparkles',
      sanctity: BranchSanctity.SACRED,
      messageKey: marker('sanctum.omens.sacred_prefix'),
    });
  }

  if (spiritLevel >= BRANCH_OMEN_HIGH_SPIRIT_THRESHOLD) {
    omens.push({
      icon: '@tui.flame',
      sanctity: BranchSanctity.SACRED,
      messageKey: marker('sanctum.omens.spirit_high'),
    });
  } else if (spiritLevel < BRANCH_OMEN_LOW_SPIRIT_THRESHOLD) {
    omens.push({
      icon: '@tui.cloud-off',
      sanctity: BranchSanctity.FORBIDDEN,
      messageKey: marker('sanctum.omens.spirit_low'),
    });
  }

  if (inspection.forbiddenMatch) {
    omens.push({
      icon: '@tui.ban',
      sanctity: BranchSanctity.FORBIDDEN,
      messageKey: marker('sanctum.omens.forbidden_mark'),
    });
  }

  if (inspection.hereticalMatch) {
    omens.push({
      icon: '@tui.alert-triangle',
      sanctity: BranchSanctity.HERETICAL,
      messageKey: marker('sanctum.omens.heretical_trace'),
    });
  }

  if (inspection.isKebabCase) {
    omens.push({
      icon: '@tui.check',
      sanctity: BranchSanctity.SACRED,
      messageKey: marker('sanctum.omens.kebab_aligned'),
    });
  }

  if (intent === RitualIntent.PENANCE) {
    omens.push({
      icon: '@tui.heart-handshake',
      sanctity,
      messageKey: marker('sanctum.omens.penance_rite'),
    });
  }

  if (omens.length < BRANCH_OMEN_COUNT) {
    omens.push({
      icon: '@tui.git-branch',
      sanctity,
      messageKey: marker(`sanctum.omens.fallback.${sanctity}`),
    });
  }

  return omens.slice(0, BRANCH_OMEN_COUNT);
}
