import { BranchSanctity } from '@features/sanctum/data/models/branch-sanctity.model';

export const BRANCH_FORBIDDEN_PATTERNS = [/temp/i, /wip/i, /asdf/i, /test-?123/i, /^master$/i, /^main$/i, /fix-?fix/i];
export const BRANCH_SACRED_PREFIXES = ['feat/', 'fix/', 'chore/', 'refactor/', 'docs/', 'perf/'];
export const BRANCH_HERETICAL_PATTERNS = [/legacy/i, /hotfix/i, /urgent/i, /_\d{8,}/];
export const BRANCH_KEBAB_CASE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const BRANCH_SCORE_BASE = 50;
export const BRANCH_SPIRIT_LEVEL_WEIGHT = 0.2;
export const BRANCH_SHORT_NAME_THRESHOLD = 4;
export const BRANCH_SHORT_NAME_PENALTY = 35;
export const BRANCH_LONG_NAME_THRESHOLD = 48;
export const BRANCH_LONG_NAME_PENALTY = 20;
export const BRANCH_SACRED_PREFIX_BONUS = 25;
export const BRANCH_FORBIDDEN_PENALTY = 45;
export const BRANCH_HERETICAL_PENALTY = 15;
export const BRANCH_KEBAB_CASE_BONUS = 10;
export const BRANCH_SCORE_MIN = 0;
export const BRANCH_SCORE_MAX = 100;

export const BRANCH_SANCTITY_SACRED_THRESHOLD = 70;
export const BRANCH_SANCTITY_HERETICAL_THRESHOLD = 40;

export const MERGE_FATE_FORBIDDEN_SCORE_THRESHOLD = 35;
export const MERGE_FATE_DEPLOY_SCORE_THRESHOLD = 65;
export const MERGE_FATE_GREEN_SCORE_THRESHOLD = 75;
export const MERGE_FATE_AMBER_SCORE_THRESHOLD = 50;

export const RITUAL_INTENT_DEPLOY_SCORE_MODIFIER = -8;
export const RITUAL_INTENT_PENANCE_FIX_BONUS = 12;
export const RITUAL_INTENT_PENANCE_DEFAULT_PENALTY = -5;

export const BRANCH_OMEN_HIGH_SPIRIT_THRESHOLD = 70;
export const BRANCH_OMEN_LOW_SPIRIT_THRESHOLD = 30;
export const BRANCH_OMEN_COUNT = 3;

export const RITUAL_LITANY_LINE_DELAY_MS = 420;
export const RITUAL_VERDICT_REVEAL_DELAY_MS = 680;

export const BRANCH_PROPHECY_KEYS = {
  [BranchSanctity.SACRED]: [
    'sanctum.prophecies.sacred.0',
    'sanctum.prophecies.sacred.1',
    'sanctum.prophecies.sacred.2',
  ],
  [BranchSanctity.HERETICAL]: [
    'sanctum.prophecies.heretical.0',
    'sanctum.prophecies.heretical.1',
    'sanctum.prophecies.heretical.2',
  ],
  [BranchSanctity.FORBIDDEN]: [
    'sanctum.prophecies.forbidden.0',
    'sanctum.prophecies.forbidden.1',
    'sanctum.prophecies.forbidden.2',
  ],
} as const satisfies Record<BranchSanctity, readonly string[]>;
