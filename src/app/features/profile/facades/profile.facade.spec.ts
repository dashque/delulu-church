import { TestBed } from '@angular/core/testing';

import { ProfileFacade } from './profile.facade';
import { expect, vi } from 'vitest';
import { of } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { TuiNotificationService } from '@taiga-ui/core';

describe('ProfileFacade', () => {
  let facade: ProfileFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileFacade,
        {
          provide: TranslocoService,
          useValue: {
            translate: vi.fn().mockReturnValue('translated'),
          },
        },

        {
          provide: TuiNotificationService,
          useValue: {
            open: vi.fn().mockReturnValue(of(null)),
          },
        },
      ],
    });
    facade = TestBed.inject(ProfileFacade);
  });

  it('должен инициализироваться', () => {
    expect(facade).toBeTruthy();
  });
});
