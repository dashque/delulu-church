import { vi } from 'vitest';
import { of } from 'rxjs';
import { translatedTarotResponseApiFixture } from '@features/main/data/api/fixtures/translated-tarot-response-api.fixture';

export const myMemoryTranslationServiceMock = {
  translateReading: vi.fn().mockReturnValue(of(translatedTarotResponseApiFixture)),
};
