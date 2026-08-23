import { TestBed } from '@angular/core/testing';

import { NewProfileFacade } from './new-profile.facade';
import { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';
import { profileFormServiceMock } from '@features/profile/services/profile-form/profile-form.service.mock';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { userProfileServiceMock } from '@core/services/user-profile/user-profile.service.mock';
import { AuthService } from '@core/services/auth/auth.service';
import { authServiceMock } from '@core/services/auth/auth.service.mock';
import { HotToastService } from '@ngxpert/hot-toast';
import { hotToastServiceMock } from '@shared/mocks/hot-toast/hot-toast.service.mock';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';

describe('NewProfileFacade', () => {
  let service: NewProfileFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslocoTestingMock],
      providers: [
        NewProfileFacade,
        { provide: ProfileFormService, useValue: profileFormServiceMock },
        { provide: UserProfileService, useValue: userProfileServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: HotToastService, useValue: hotToastServiceMock },
      ],
    });
    service = TestBed.inject(NewProfileFacade);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });
});
