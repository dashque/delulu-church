import { InjectionToken } from '@angular/core';

export const TAROT_URL = new InjectionToken('TarotUrl', {
  factory: () => '/api/reading',
});
