import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import {
  resetUserProfileServiceMock,
  userProfileServiceMock,
} from '@core/services/user-profile/user-profile.service.mock';
import { ProfileComponent } from './profile.component';
import { ProfileFacade } from './facades/profile.facade';
import { vi } from 'vitest';
import { signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { computed } from '@angular/core';
import type { StatCard } from './data/models/stats-card.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  const profileFacadeMock: Partial<ProfileFacade> = {
    profileForm: new FormGroup({
      name: new FormControl(''),
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      newPasswordConfirmation: new FormControl(''),
    }) as ProfileFacade['profileForm'],

    isLoading: signal(false),

    statCards: computed<StatCard[]>(() => [
      {
        id: 'confessions',
        icon: '@tui.book-heart',
        value: 3,
        label: 'Confessions',
      },
      {
        id: 'candles',
        icon: '@tui.flame',
        value: 10,
        label: 'Candles',
      },
    ]),

    achievementInfo: computed(() => ({
      total: 7,
      unlocked: 0,
      achievements: [],
    })),

    submit: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    resetUserProfileServiceMock();

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, TranslocoTestingMock, ReactiveFormsModule],
      providers: [
        { provide: UserProfileService, useValue: userProfileServiceMock },
        { provide: ProfileFacade, useValue: profileFacadeMock },
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
