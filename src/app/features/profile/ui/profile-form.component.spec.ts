import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { ProfileFormComponent } from './profile-form.component';
import { ProfileFacade } from '@features/profile/facades/profile.facade';
import { ReactiveFormsModule } from '@angular/forms';
import { vi } from 'vitest';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslocoTestingMock } from '@shared/mocks/transloco-testing/transloco-testing.mock';
import { FormControl, FormGroup } from '@angular/forms';
import { signal } from '@angular/core';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;

  const submitMock = vi.fn();

  const profileFacadeMock = {
    isLoading: signal(false),
    profileForm: new FormGroup({
      name: new FormControl(''),
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      newPasswordConfirmation: new FormControl(''),
    }),
    submit: submitMock,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFormComponent, ReactiveFormsModule, TranslocoTestingMock],
      providers: [{ provide: ProfileFacade, useValue: profileFacadeMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен инициализироваться', () => {
    expect(component).toBeTruthy();
  });

  it('берёт форму из фасада', () => {
    expect((component as unknown as { form: unknown }).form).toBe(profileFacadeMock.profileForm);
  });

  it('вызывает submit фасада при отправке формы', () => {
    const event = new Event('submit') as SubmitEvent;

    (component as unknown as { onSubmit: (event_: SubmitEvent) => void }).onSubmit(event);

    expect(submitMock).toHaveBeenCalledTimes(1);
  });

  it('предотвращает дефолтное поведение формы', () => {
    const event = new Event('submit');
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

    (component as unknown as { onSubmit: (event_: SubmitEvent) => void }).onSubmit(event as SubmitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
