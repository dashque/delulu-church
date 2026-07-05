import type { TarotResponseApi } from '@features/main/data/api/models/deploy-tarot-response-api.model';
import { tarotResponseApiFixture } from '@features/main/data/api/fixtures/tarot-response-api.fixture';

export const translatedTarotResponseApiFixture = {
  ...tarotResponseApiFixture,
  verdict_text: 'Отправляй.',
  cards: [
    {
      ...tarotResponseApiFixture.cards[0],
      name: 'Пайплайн',
      narrative: 'Сборка зелёная.',
    },
  ],
} as const satisfies TarotResponseApi;
