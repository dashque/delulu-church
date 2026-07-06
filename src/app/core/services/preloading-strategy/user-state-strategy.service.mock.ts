import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { of } from 'rxjs';

import type { UserStateStrategy } from '@core/services/preloading-strategy/user-state-strategy.service';

export const userStateStrategyMock = {
  preload: vi.fn().mockReturnValue(of(null)),
} as const satisfies MockedObject<Partial<UserStateStrategy>>;

export const resetUserStateStrategyMock = (): void => {
  userStateStrategyMock.preload.mockReset().mockReturnValue(of(null));
};
