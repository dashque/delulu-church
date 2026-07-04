import { SanctumSoundPhase } from '@features/sanctum/data/models/sanctum-sound-phase.model';

type ChurchVoice = 'organ' | 'bell' | 'clang';

interface PartialSpec {
  ratio: number;
  gain: number;
}

interface ChurchNote {
  frequency: number;
  duration: number;
  delay?: number;
  gain?: number;
  voice?: ChurchVoice;
}

const MASTER_GAIN = 0.26;

const ORGAN_PARTIALS: readonly PartialSpec[] = [
  { ratio: 1, gain: 1 },
  { ratio: 2, gain: 0.45 },
  { ratio: 3, gain: 0.24 },
  { ratio: 4, gain: 0.11 },
];

const BELL_PARTIALS: readonly PartialSpec[] = [
  { ratio: 1, gain: 1 },
  { ratio: 2.35, gain: 0.52 },
  { ratio: 3.7, gain: 0.26 },
  { ratio: 5.1, gain: 0.12 },
];

const CLANG_PARTIALS: readonly PartialSpec[] = [
  { ratio: 1, gain: 1 },
  { ratio: 1.5, gain: 0.35 },
  { ratio: 2.8, gain: 0.18 },
];

const PHASE_NOTES = {
  [SanctumSoundPhase.RITUAL_START]: [
    { frequency: 65.41, duration: 2.2, gain: 0.2, voice: 'organ' },
    { frequency: 98, duration: 2, gain: 0.13, delay: 0.16, voice: 'organ' },
    { frequency: 130.81, duration: 1.6, gain: 0.07, delay: 0.32, voice: 'organ' },
  ],
  [SanctumSoundPhase.LITANY_TICK]: [{ frequency: 783.99, duration: 0.62, gain: 0.18, voice: 'bell' }],
  [SanctumSoundPhase.VERDICT_SACRED]: [
    { frequency: 261.63, duration: 1.7, gain: 0.13, voice: 'organ' },
    { frequency: 329.63, duration: 1.55, gain: 0.11, delay: 0.18, voice: 'organ' },
    { frequency: 392, duration: 1.45, gain: 0.1, delay: 0.36, voice: 'organ' },
    { frequency: 523.25, duration: 2, gain: 0.12, delay: 0.54, voice: 'organ' },
  ],
  [SanctumSoundPhase.VERDICT_HERETICAL]: [
    { frequency: 220, duration: 1.05, gain: 0.11, voice: 'organ' },
    { frequency: 261.63, duration: 0.95, gain: 0.09, delay: 0.14, voice: 'organ' },
    { frequency: 311.13, duration: 0.85, gain: 0.075, delay: 0.28, voice: 'organ' },
  ],
  [SanctumSoundPhase.VERDICT_FORBIDDEN]: [
    { frequency: 65.41, duration: 2.1, gain: 0.18, voice: 'organ' },
    { frequency: 61.74, duration: 1.85, gain: 0.14, delay: 0.22, voice: 'organ' },
    { frequency: 49, duration: 1.5, gain: 0.11, delay: 0.08, voice: 'clang' },
  ],
  [SanctumSoundPhase.PRIEST_RAGE]: [
    { frequency: 196, duration: 0.28, gain: 0.14, voice: 'clang' },
    { frequency: 130.81, duration: 0.32, gain: 0.11, delay: 0.07, voice: 'clang' },
  ],
} as const satisfies Record<SanctumSoundPhase, readonly ChurchNote[]>;

export function playSanctumSound(context: AudioContext, destination: AudioNode, phase: SanctumSoundPhase): void {
  const startTime = context.currentTime;

  for (const note of PHASE_NOTES[phase]) {
    scheduleChurchNote(context, destination, note, startTime);
  }
}

export function createSanctumAudioBus(context: AudioContext): AudioNode {
  const input = context.createGain();
  const master = context.createGain();

  master.gain.value = 0.95;

  const dry = context.createGain();

  dry.gain.value = 0.62;

  const wet = context.createGain();

  wet.gain.value = 0.38;

  const convolver = context.createConvolver();

  convolver.buffer = createCathedralImpulse(context);

  const hallTone = context.createBiquadFilter();

  hallTone.type = 'lowpass';
  hallTone.frequency.value = 3800;
  hallTone.Q.value = 0.65;

  input.connect(dry);
  input.connect(convolver);
  convolver.connect(wet);
  wet.connect(hallTone);
  dry.connect(master);
  hallTone.connect(master);
  master.connect(context.destination);

  return input;
}

function scheduleChurchNote(context: AudioContext, destination: AudioNode, note: ChurchNote, startTime: number): void {
  const voice = note.voice ?? 'organ';
  const partials = resolvePartials(voice);
  const noteStart = startTime + (note.delay ?? 0);
  const noteGain = (note.gain ?? 0.06) * MASTER_GAIN;
  const { attack, release } = resolveEnvelope(voice, note.duration);

  for (const partial of partials) {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const partialGain = noteGain * partial.gain;
    const toneEnd = noteStart + note.duration;

    oscillator.type = voice === 'clang' ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(note.frequency * partial.ratio, noteStart);
    gainNode.gain.setValueAtTime(0.0001, noteStart);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(partialGain, 0.0002), noteStart + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, toneEnd + release);
    oscillator.connect(gainNode);
    gainNode.connect(destination);
    oscillator.start(noteStart);
    oscillator.stop(toneEnd + release + 0.05);
  }
}

function resolvePartials(voice: ChurchVoice): readonly PartialSpec[] {
  switch (voice) {
    case 'bell':
      return BELL_PARTIALS;

    case 'clang':
      return CLANG_PARTIALS;

    default:
      return ORGAN_PARTIALS;
  }
}

function resolveEnvelope(voice: ChurchVoice, duration: number): { attack: number; release: number } {
  switch (voice) {
    case 'bell':
      return { attack: 0.004, release: Math.min(duration * 0.45, 0.35) };

    case 'clang':
      return { attack: 0.003, release: Math.min(duration * 0.35, 0.18) };

    default:
      return { attack: Math.min(duration * 0.22, 0.38), release: Math.min(duration * 0.35, 0.55) };
  }
}

function createCathedralImpulse(context: AudioContext): AudioBuffer {
  const durationSec = 2.4;
  const decay = 2.8;
  const sampleRate = context.sampleRate;
  const length = Math.floor(sampleRate * durationSec);
  const impulse = context.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < impulse.numberOfChannels; channel++) {
    const channelData = impulse.getChannelData(channel);

    for (let index = 0; index < length; index++) {
      const envelope = Math.pow(1 - index / length, decay);

      channelData[index] = (Math.random() * 2 - 1) * envelope;
    }
  }

  return impulse;
}
