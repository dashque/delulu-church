import type { TarotCardPosition } from '@features/main/data/api/models/card-position.model';

export interface TarotCardApi {
  position: TarotCardPosition;
  position_label: string;
  /** Название аркана, например "The Tower" */
  name: string;
  /** Перевёрнута ли карта */
  reversed: boolean;
  /** Текст предсказания/пояснения */
  narrative: string;
}
