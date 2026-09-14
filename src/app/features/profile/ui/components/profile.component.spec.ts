import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import {
  resetUserProfileServiceMock,
  userProfileServiceMock,
} from '@core/services/user-profile/user-profile.service.mock';
import { ProfileComponent } from './profile.component';
import { vi } from 'vitest';
import { ReactiveFormsModule } from '@angular/forms';
import { donutServiceMock } from '@features/profile/services/donut/donut.service.mock';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { DonutService } from '@features/profile/services/donut/donut.service';
import { ProfileFormService } from '@features/profile/services/profile-form/profile-form.service';
import { profileFormServiceMock } from '@features/profile/services/profile-form/profile-form.service.mock';
import { NewProfileFacade } from '@features/profile/facades/new-profile.facade';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    resetUserProfileServiceMock();

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, TranslocoTestingMock, ReactiveFormsModule],
      providers: [
        ProfileFacade,
        NewProfileFacade,
        { provide: UserProfileService, useValue: userProfileServiceMock },
        { provide: DonutService, useValue: donutServiceMock },
        { provide: ProfileFormService, useValue: profileFormServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });
});
