import { TestBed } from '@angular/core/testing';

import { firebaseAuthMock, resetFirebaseAuthMock } from '@core/services/auth/mocks/firebase-auth.mock';
import { userProfileFixture } from '@core/fixtures/user-profile.fixture';
import { initialUiState } from '@core/store/constants/initial-ui-state';
import { Theme } from '@core/models/theme.model';
import { Languages } from '@core/models/languages.model';

import { UserProfileService } from './user-profile.service';

describe('UserProfileService', () => {
  let service: UserProfileService;

  beforeEach(() => {
    resetFirebaseAuthMock();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [UserProfileService],
    });
    service = TestBed.inject(UserProfileService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Загрузка профиля', () => {
    it('должен вернуть null и сбросить сигнал, если документ не найден', async () => {
      firebaseAuthMock.getDoc.mockResolvedValue({ exists: () => false });

      const profile = await service.loadProfile(userProfileFixture.uid);

      expect(profile).toBeNull();
      expect(service.user()).toBeNull();
    });

    it('должен загрузить профиль из Firestore', async () => {
      firebaseAuthMock.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email: userProfileFixture.email,
          displayName: userProfileFixture.displayName,
          dateOfBirth: null,
          createdAt: userProfileFixture.createdAt,
          candles: 3,
          sins: 2,
          uiState: initialUiState,
        }),
      });

      const profile = await service.loadProfile(userProfileFixture.uid);

      expect(profile).toEqual({
        uid: userProfileFixture.uid,
        email: userProfileFixture.email,
        displayName: userProfileFixture.displayName,
        dateOfBirth: null,
        createdAt: userProfileFixture.createdAt,
        candles: 3,
        sins: 2,
        uiState: initialUiState,
      });
      expect(service.user()).toEqual(profile);
    });

    it('должен подставить значения по умолчанию для некорректных данных', async () => {
      firebaseAuthMock.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email: 123,
          displayName: null,
          candles: 'invalid',
          sins: undefined,
          uiState: 'invalid',
        }),
      });

      const profile = await service.loadProfile(userProfileFixture.uid);

      expect(profile).toEqual({
        uid: userProfileFixture.uid,
        email: null,
        displayName: null,
        dateOfBirth: null,
        createdAt: null,
        candles: 0,
        sins: 0,
        uiState: initialUiState,
      });
    });

    it('должен распознать светлую тему и английский язык', async () => {
      firebaseAuthMock.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          uiState: { theme: Theme.LIGHT, language: Languages.EN },
        }),
      });

      const profile = await service.loadProfile(userProfileFixture.uid);

      expect(profile?.uiState).toEqual({ theme: Theme.LIGHT, language: Languages.EN });
    });
  });

  describe('Создание профиля', () => {
    it('должен сохранить новый профиль в Firestore', async () => {
      const dateOfBirth = new Date(2000, 0, 1);

      await service.createProfile(userProfileFixture.uid, userProfileFixture.email, 'Dev User', dateOfBirth);

      expect(firebaseAuthMock.setDoc).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          email: userProfileFixture.email,
          displayName: 'Dev User',
          dateOfBirth,
          candles: 0,
          sins: 0,
          uiState: initialUiState,
          createdAt: firebaseAuthMock.serverTimestampFixture,
        })
      );
    });
  });

  describe('Профиль OAuth-провайдера', () => {
    it('должен обновить существующий профиль через merge', async () => {
      firebaseAuthMock.getDoc.mockResolvedValue({ exists: () => true });

      await service.ensureProviderProfile(userProfileFixture.uid, userProfileFixture.email, 'OAuth User');

      expect(firebaseAuthMock.setDoc).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        { displayName: 'OAuth User', email: userProfileFixture.email },
        { merge: true }
      );
    });

    it('должен создать новый профиль, если документ отсутствует', async () => {
      firebaseAuthMock.getDoc.mockResolvedValue({ exists: () => false });

      await service.ensureProviderProfile(userProfileFixture.uid, userProfileFixture.email, 'OAuth User');

      expect(firebaseAuthMock.setDoc).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          email: userProfileFixture.email,
          displayName: 'OAuth User',
          dateOfBirth: null,
          candles: 0,
          sins: 0,
        })
      );
    });
  });

  describe('Обновление UI-состояния', () => {
    it('должен сохранить uiState в Firestore', async () => {
      const uiState = { theme: Theme.LIGHT, language: Languages.EN };

      await service.updateUiState(userProfileFixture.uid, uiState);

      expect(firebaseAuthMock.setDoc).toHaveBeenNthCalledWith(1, expect.anything(), { uiState }, { merge: true });
    });

    it('должен обновить локальный сигнал для текущего пользователя', async () => {
      firebaseAuthMock.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email: userProfileFixture.email,
          displayName: userProfileFixture.displayName,
          uiState: initialUiState,
        }),
      });
      await service.loadProfile(userProfileFixture.uid);

      const nextUiState = { theme: Theme.LIGHT, language: Languages.EN };

      await service.updateUiState(userProfileFixture.uid, nextUiState);

      expect(service.user()?.uiState).toEqual(nextUiState);
    });
  });

  describe('Очистка профиля', () => {
    it('должен сбросить сигнал пользователя', async () => {
      firebaseAuthMock.getDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({ email: userProfileFixture.email }),
      });
      await service.loadProfile(userProfileFixture.uid);

      service.clearProfile();

      expect(service.user()).toBeNull();
    });
  });
});
