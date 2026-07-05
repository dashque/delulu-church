import { TestBed } from '@angular/core/testing';

import { firebaseAuthMock, resetFirebaseAuthMock } from '@core/services/auth/mocks/firebase-auth.mock';
import { describe, vi } from 'vitest';

import { AuthService } from './auth.service';
import { userFixture } from '@core/fixtures/user.fixture';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import {
  resetUserProfileServiceMock,
  userProfileServiceMock,
} from '@core/services/user-profile/user-profile.service.mock';
import type { User } from 'firebase/auth';

describe('AuthService', () => {
  const passwordFixture = 'password';
  let service: AuthService;

  beforeEach(() => {
    resetFirebaseAuthMock();
    resetUserProfileServiceMock();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [AuthService, { provide: UserProfileService, useValue: userProfileServiceMock }],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Инициализация сессии', () => {
    it('должен подписаться на изменение Firebase-сессии', async () => {
      firebaseAuthMock.onAuthStateChanged.mockImplementation((_auth, onNext) => {
        onNext(userFixture);

        return vi.fn();
      });

      await service.initialize();

      expect(firebaseAuthMock.onAuthStateChanged).toHaveBeenCalledTimes(1);
    });

    it('должен сохранить пользователя из Firebase-сессии', async () => {
      firebaseAuthMock.onAuthStateChanged.mockImplementation((_auth, onNext) => {
        onNext(userFixture);

        return vi.fn();
      });

      await service.initialize();

      expect(service.user()).toEqual(userFixture);
      expect(userProfileServiceMock.loadProfile).toHaveBeenNthCalledWith(1, userFixture.uid);
    });

    it('должен загрузить профиль текущего Firebase-пользователя', async () => {
      firebaseAuthMock.authInstance.currentUser = userFixture as unknown as User;

      await service.loadUser();

      expect(service.user()).toEqual(userFixture);
      expect(userProfileServiceMock.loadProfile).toHaveBeenNthCalledWith(1, userFixture.uid);
    });
  });

  describe('Вход по email и паролю', () => {
    beforeEach(() => {
      firebaseAuthMock.signInWithEmailAndPassword.mockResolvedValue({ user: userFixture });
    });

    it('должен начать загрузку', async () => {
      const isLoadingSetSpy = vi.spyOn(service['_isLoading'], 'set');

      await service.login(userFixture.email, passwordFixture);

      expect(isLoadingSetSpy).toHaveBeenNthCalledWith(1, true);
    });

    it('должен вызвать Firebase login с email и паролем', async () => {
      await service.login(userFixture.email, passwordFixture);

      expect(firebaseAuthMock.signInWithEmailAndPassword).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        userFixture.email,
        passwordFixture
      );
    });

    it('должен сохранить пользователя после успешного входа', async () => {
      await service.login(userFixture.email, passwordFixture);

      expect(service.user()).toEqual(userFixture);
      expect(userProfileServiceMock.loadProfile).toHaveBeenNthCalledWith(1, userFixture.uid);
    });

    it('должен сохранить ошибку входа и пробросить ее дальше', async () => {
      const error = new Error('Firebase login failed');

      firebaseAuthMock.signInWithEmailAndPassword.mockRejectedValue(error);

      await expect(service.login(userFixture.email, passwordFixture)).rejects.toThrow('Firebase login failed');
      expect(service.error()).toBe(error);
    });

    it('должен завершить загрузку', async () => {
      const isLoadingSetSpy = vi.spyOn(service['_isLoading'], 'set');

      await service.login(userFixture.email, passwordFixture);

      expect(isLoadingSetSpy).toHaveBeenNthCalledWith(2, false);
    });
  });

  describe('Регистрация по email и паролю', () => {
    const signupDataFixture = { full_name: 'Dev User', date_of_birth: new Date(2000, 0, 1) } as const;

    beforeEach(() => {
      firebaseAuthMock.createUserWithEmailAndPassword.mockResolvedValue({ user: userFixture });
    });

    it('должен начать загрузку', async () => {
      const isLoadingSetSpy = vi.spyOn(service['_isLoading'], 'set');

      await service.signup(userFixture.email, passwordFixture);

      expect(isLoadingSetSpy).toHaveBeenNthCalledWith(1, true);
    });

    it('должен создать пользователя в Firebase', async () => {
      await service.signup(userFixture.email, passwordFixture, signupDataFixture);

      expect(firebaseAuthMock.createUserWithEmailAndPassword).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        userFixture.email,
        passwordFixture
      );
    });

    it('должен сохранить профиль пользователя в Firestore', async () => {
      await service.signup(userFixture.email, passwordFixture, signupDataFixture);

      expect(userProfileServiceMock.createProfile).toHaveBeenNthCalledWith(
        1,
        userFixture.uid,
        userFixture.email,
        signupDataFixture.full_name,
        signupDataFixture.date_of_birth
      );
    });

    it('должен сохранить Firebase-пользователя после успешной регистрации', async () => {
      await service.signup(userFixture.email, passwordFixture);

      expect(service.user()).toEqual(userFixture);
      expect(userProfileServiceMock.loadProfile).toHaveBeenNthCalledWith(1, userFixture.uid);
    });

    it('должен сохранить ошибку регистрации и пробросить ее дальше', async () => {
      const error = new Error('Firebase signup failed');

      firebaseAuthMock.createUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(service.signup(userFixture.email, passwordFixture)).rejects.toThrow('Firebase signup failed');
      expect(service.error()).toBe(error);
    });

    it('должен завершить загрузку', async () => {
      const isLoadingSetSpy = vi.spyOn(service['_isLoading'], 'set');

      await service.signup(userFixture.email, passwordFixture);

      expect(isLoadingSetSpy).toHaveBeenNthCalledWith(2, false);
    });
  });

  describe('Выход из аккаунта', () => {
    beforeEach(() => {
      firebaseAuthMock.signInWithEmailAndPassword.mockResolvedValue({ user: userFixture });
    });

    it('должен начать загрузку', async () => {
      const isLoadingSetSpy = vi.spyOn(service['_isLoading'], 'set');

      await service.login(userFixture.email, passwordFixture);
      await service.logout();

      expect(isLoadingSetSpy).toHaveBeenNthCalledWith(1, true);
    });

    it('должен вызвать Firebase signOut', async () => {
      await service.login(userFixture.email, passwordFixture);

      await service.logout();

      expect(firebaseAuthMock.signOut).toHaveBeenCalledTimes(1);
    });

    it('должен сбросить пользователя после выхода', async () => {
      await service.login(userFixture.email, passwordFixture);

      await service.logout();

      expect(service.user()).toBeNull();
      expect(userProfileServiceMock.clearProfile).toHaveBeenCalledTimes(1);
    });

    it('должен завершить загрузку', async () => {
      const isLoadingSetSpy = vi.spyOn(service['_isLoading'], 'set');

      await service.login(userFixture.email, passwordFixture);
      await service.logout();

      expect(isLoadingSetSpy).toHaveBeenNthCalledWith(2, false);
    });
  });

  describe('Восстановление пароля', () => {
    it('должен отправить письмо восстановления пароля через Firebase', async () => {
      await service.requestPasswordRecovery(userFixture.email);

      expect(firebaseAuthMock.sendPasswordResetEmail).toHaveBeenNthCalledWith(1, expect.anything(), userFixture.email);
    });
  });

  describe('OAuth-вход', () => {
    beforeEach(() => {
      firebaseAuthMock.signInWithPopup.mockResolvedValue({ user: userFixture });
    });

    it('должен войти через GitHub provider', async () => {
      await service.loginWithGithub();

      expect(firebaseAuthMock.GithubAuthProvider).toHaveBeenCalledTimes(1);
      expect(firebaseAuthMock.signInWithPopup).toHaveBeenCalledTimes(1);
    });

    it('должен войти через Google provider', async () => {
      await service.loginWithGoogle();

      expect(firebaseAuthMock.GoogleAuthProvider).toHaveBeenCalledTimes(1);
      expect(firebaseAuthMock.signInWithPopup).toHaveBeenCalledTimes(1);
    });

    it('должен сохранить Firebase-пользователя после provider login', async () => {
      await service.loginWithGoogle();

      expect(service.user()).toEqual(userFixture);
      expect(userProfileServiceMock.loadProfile).toHaveBeenNthCalledWith(1, userFixture.uid);
    });

    it('должен создать Firestore profile при первом provider login', async () => {
      await service.loginWithGoogle();

      expect(userProfileServiceMock.ensureProviderProfile).toHaveBeenNthCalledWith(
        1,
        userFixture.uid,
        userFixture.email,
        userFixture.displayName
      );
    });

    it('не должен сбрасывать статистику при повторном provider login', async () => {
      await service.loginWithGoogle();

      expect(userProfileServiceMock.ensureProviderProfile).toHaveBeenNthCalledWith(
        1,
        userFixture.uid,
        userFixture.email,
        userFixture.displayName
      );
    });
  });
});
