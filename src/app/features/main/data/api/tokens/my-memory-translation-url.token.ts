import { InjectionToken } from '@angular/core';

export const MY_MEMORY_TRANSLATION_URL = new InjectionToken('MyMemoryTranslationUrl', {
  factory: () => 'https://api.mymemory.translated.net/get',
});
