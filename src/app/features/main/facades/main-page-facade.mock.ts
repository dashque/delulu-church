import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import type { MainPageFacade } from '@features/main/facades/main-page.facade';
import { signal } from '@angular/core';
import { tarotResponseApiFixture } from '@features/main/data/api/fixtures/tarot-response-api.fixture';
import { TarotRole } from '@features/main/data/api/models/role.model';
import { TarotIntent } from '@features/main/data/api/models/intent.model';

export const mainPageFacadeMock = {
  result: signal(tarotResponseApiFixture),
  isLoading: signal(false).asReadonly(),
  error: signal<unknown | null>(null).asReadonly(),
  loadTarot: vi.fn(),
  role: signal(TarotRole.DEVOPS),
  intent: signal(TarotIntent.FULL_RELEASE),
} as const satisfies MockedObject<Partial<MainPageFacade>>;
