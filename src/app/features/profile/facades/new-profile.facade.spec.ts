import { TestBed } from '@angular/core/testing';

import { NewProfileFacade } from './new-profile.facade';
import { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';
import { profileFormServiceMock } from '@features/profile/services/profile-form/profile-form.service.mock';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import { userProfileServiceMock } from '@core/services/user-profile/user-profile.service.mock';

describe('NewProfileFacade', () => {
  let service: NewProfileFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NewProfileFacade,
        { provide: ProfileFormService, useValue: profileFormServiceMock },
        { provide: UserProfileService, useValue: userProfileServiceMock },
      ],
    });
    service = TestBed.inject(NewProfileFacade);
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });
});
