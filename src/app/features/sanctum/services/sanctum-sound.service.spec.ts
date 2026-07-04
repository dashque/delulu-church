import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { SanctumSoundPhase } from '@features/sanctum/data/models/sanctum-sound-phase.model';
import { SanctumSoundService } from '@features/sanctum/services/sanctum-sound.service';

describe('SanctumSoundService', () => {
  const audioContextCtor = vi.fn();

  beforeEach(() => {
    audioContextCtor.mockReset();

    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false }))
    );
    vi.stubGlobal('AudioContext', audioContextCtor);

    TestBed.configureTestingModule({
      providers: [SanctumSoundService],
    });
  });

  it('не должен создавать AudioContext при prefers-reduced-motion', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }))
    );

    const service = TestBed.inject(SanctumSoundService);

    expect(() => service.play(SanctumSoundPhase.LITANY_TICK)).not.toThrow();
    expect(audioContextCtor).not.toHaveBeenCalled();
  });

  it('не должен падать, если Web Audio API недоступен', () => {
    vi.stubGlobal('AudioContext', undefined);

    const service = TestBed.inject(SanctumSoundService);

    expect(() => service.prime()).not.toThrow();
    expect(() => service.play(SanctumSoundPhase.RITUAL_START)).not.toThrow();
  });

  it('должен создавать AudioContext при prime', () => {
    const resume = vi.fn().mockResolvedValue(undefined);
    const connect = vi.fn();
    const createBuffer = vi.fn(() => ({
      numberOfChannels: 2,
      getChannelData: vi.fn(() => new Float32Array(8)),
    }));

    audioContextCtor.mockImplementation(function MockAudioContext(this: {
      state: string;
      resume: typeof resume;
      sampleRate: number;
      createGain: ReturnType<typeof vi.fn>;
      createConvolver: ReturnType<typeof vi.fn>;
      createBuffer: typeof createBuffer;
      createBiquadFilter: ReturnType<typeof vi.fn>;
      destination: object;
    }) {
      this.state = 'suspended';
      this.resume = resume;
      this.sampleRate = 44_100;
      this.destination = {};
      this.createGain = vi.fn(() => ({
        gain: { value: 0 },
        connect,
      }));
      this.createConvolver = vi.fn(() => ({
        buffer: null,
        connect,
      }));
      this.createBuffer = createBuffer;
      this.createBiquadFilter = vi.fn(() => ({
        type: 'lowpass',
        frequency: { value: 0 },
        Q: { value: 0 },
        connect,
      }));
    });

    const service = TestBed.inject(SanctumSoundService);

    service.prime();

    expect(audioContextCtor).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(1);
  });
});
