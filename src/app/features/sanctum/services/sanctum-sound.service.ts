import { Service } from '@angular/core';
import type { SanctumSoundPhase } from '@features/sanctum/data/models/sanctum-sound-phase.model';
import { createSanctumAudioBus, playSanctumSound } from '@features/sanctum/helpers/play-sanctum-sound.helper';
import { isPrefersReducedMotion } from '@shared/helpers/is-prefers-reduced-motion.helper';

@Service({
  autoProvided: false,
})
export class SanctumSoundService {
  private context: AudioContext | null = null;
  private destination: AudioNode | null = null;

  public prime(): void {
    if (isPrefersReducedMotion()) {
      return;
    }

    const context = this.ensureContext();

    if (context?.state === 'suspended') {
      void context.resume().catch(() => undefined);
    }
  }

  public play(phase: SanctumSoundPhase): void {
    if (isPrefersReducedMotion()) {
      return;
    }

    void this.playPhase(phase).catch(() => undefined);
  }

  private async playPhase(phase: SanctumSoundPhase): Promise<void> {
    const context = this.ensureContext();

    if (!context || !this.destination) {
      return;
    }

    if (context.state === 'suspended') {
      await context.resume();
    }

    playSanctumSound(context, this.destination, phase);
  }

  private ensureContext(): AudioContext | null {
    const AudioContextCtor = resolveAudioContextCtor();

    if (!AudioContextCtor) {
      return null;
    }

    if (!this.context) {
      this.context = new AudioContextCtor();
      this.destination = createSanctumAudioBus(this.context);
    }

    return this.context;
  }
}

function resolveAudioContextCtor(): typeof AudioContext | undefined {
  if (globalThis.AudioContext !== undefined) {
    return globalThis.AudioContext;
  }

  return (globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}
