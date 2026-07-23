import { Pipe } from '@angular/core';
import type { PipeTransform } from '@angular/core';

import type { Zodiac } from '@features/profile/data/models/zodiac.model';
import { ZODIACS } from '@features/profile/data/constants/zodiac.constants';
import { ZODIAC_DATES } from '@features/profile/data/constants/zodiac-date.constants';

@Pipe({
  name: 'zodiac',
})
export class ZodiacPipe implements PipeTransform {
  transform(date: string | null | undefined): Zodiac {
    if (!date) {
      return ZODIACS.unknown;
    }

    const birthday = new Date(date);
    const month = birthday.getMonth() + 1;
    const day = birthday.getDate();

    const zodiac = ZODIAC_DATES.find(
      ({ from, to }) =>
        month >= from[0] && month <= to[0] && (month !== from[0] || day >= from[1]) && (month !== to[0] || day <= to[1])
    );

    return zodiac ? ZODIACS[zodiac.key] : ZODIACS.unknown;
  }
}
