import type { TarotResponseApi } from '@features/main/data/api/models/deploy-tarot-response-api.model';
import { TarotVerdict } from '@features/main/data/api/models/verdict.model';
import { TarotCardPosition } from '@features/main/data/api/models/card-position.model';

export const tarotResponseApiFixture = {
  verdict: TarotVerdict.PROCEED,
  verdict_label: 'Proceed',
  verdict_text: 'Ship it.',
  role: 'devops',
  intent: 'full-release',
  share_url: 'https://example.com/reading',
  cards: [
    {
      position: TarotCardPosition.FOUNDATION,
      position_label: 'Foundation',
      name: 'The Pipeline',
      reversed: false,
      narrative: 'The build is green.',
    },
  ],
} as const satisfies TarotResponseApi;
