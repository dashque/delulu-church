import { vi } from 'vitest';

import type { SanctumSoundPhase } from '@features/sanctum/data/models/sanctum-sound-phase.model';
import type { SanctumSoundService } from '@features/sanctum/services/sanctum-sound.service';

export const sanctumSoundServiceMock = {
  prime: vi.fn(),
  play: vi.fn(),
} as const satisfies Pick<SanctumSoundService, 'play' | 'prime'>;

sanctumSoundServiceMock.play.mockImplementation((phase: SanctumSoundPhase) => {
  void phase;
});
