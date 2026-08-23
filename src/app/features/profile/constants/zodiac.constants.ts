import type { Zodiac } from '@features/profile/models/zodiac.model';

export const ZODIACS = {
  aries: {
    icon: '@tui.zodiac-aries',
    title: 'profile.sign.title.aries',
    description: 'profile.sign.description.aries',
  },
  taurus: {
    icon: '@tui.zodiac-taurus',
    title: 'profile.sign.title.taurus',
    description: 'profile.sign.description.taurus',
  },
  gemini: {
    icon: '@tui.zodiac-gemini',
    title: 'profile.sign.title.gemini',
    description: 'profile.sign.description.gemini',
  },
  cancer: {
    icon: '@tui.zodiac-cancer',
    title: 'profile.sign.title.cancer',
    description: 'profile.sign.description.cancer',
  },
  leo: {
    icon: '@tui.zodiac-leo',
    title: 'profile.sign.title.leo',
    description: 'profile.sign.description.leo',
  },
  virgo: {
    icon: '@tui.zodiac-virgo',
    title: 'profile.sign.title.virgo',
    description: 'profile.sign.description.virgo',
  },
  libra: {
    icon: '@tui.zodiac-libra',
    title: 'profile.sign.title.libra',
    description: 'profile.sign.description.libra',
  },
  scorpio: {
    icon: '@tui.zodiac-scorpio',
    title: 'profile.sign.title.scorpio',
    description: 'profile.sign.description.scorpio',
  },
  sagittarius: {
    icon: '@tui.zodiac-sagittarius',
    title: 'profile.sign.title.sagittarius',
    description: 'profile.sign.description.sagittarius',
  },
  capricorn: {
    icon: '@tui.zodiac-capricorn',
    title: 'profile.sign.title.capricorn',
    description: 'profile.sign.description.capricorn',
  },
  aquarius: {
    icon: 'assets/aquarius.svg',
    title: 'profile.sign.title.aquarius',
    description: 'profile.sign.description.aquarius',
  },
  pisces: {
    icon: '@tui.zodiac-pisces',
    title: 'profile.sign.title.pisces',
    description: 'profile.sign.description.pisces',
  },
  unknown: {
    icon: '@tui.star',
    title: 'profile.sign.title.unknown',
    description: 'profile.sign.description.unknown',
  },
} satisfies Record<string, Zodiac>;
