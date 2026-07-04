import { TestBed } from '@angular/core/testing';

import { firebaseAuthMock, resetFirebaseAuthMock } from '@core/services/auth/mocks/firebase-auth.mock';
import { AuthService } from '@core/services/auth/auth.service';
import { authServiceMock, resetAuthServiceMock } from '@core/services/auth/auth.service.mock';
import { userFixture } from '@core/fixtures/user.fixture';
import type { User } from 'firebase/auth';
import type { Mock } from 'vitest';
import { vi } from 'vitest';

import { ConfessService } from './confess.service';
import { confessServiceMock, resetConfessServiceMock } from './confess.service.mock';
import { FIRESTORE_OPERATION_TIMEOUT_MS } from '@shared/constants/firestore-operation-timeout';

describe('ConfessService', () => {
  let service: ConfessService;

  beforeEach(() => {
    resetFirebaseAuthMock();
    resetAuthServiceMock();
    (authServiceMock.user as unknown as Mock).mockReturnValue(userFixture as unknown as User);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [ConfessService, { provide: AuthService, useValue: authServiceMock }],
    });
    service = TestBed.inject(ConfessService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('должен инициализироваться', () => {
    expect(service).toBeTruthy();
  });

  describe('Mock для потребителей', () => {
    beforeEach(() => {
      resetConfessServiceMock();
    });

    it('должен предоставлять API для фасадов и компонентов', () => {
      expect(confessServiceMock.loadSins).toBeDefined();
      expect(confessServiceMock.addSin).toBeDefined();
      expect(confessServiceMock.deleteSin).toBeDefined();
      expect(confessServiceMock.sins).toBeDefined();
      expect(confessServiceMock.isLoading).toBeDefined();
    });
  });

  describe('Загрузка грехов', () => {
    it('должен загрузить список грехов из Firestore', async () => {
      firebaseAuthMock.getDocs.mockImplementation(async () => ({
        docs: [
          {
            id: 'sin-1',
            data: () => ({ text: 'Skipped tests', severity: 'critical', status: 'full' }),
          },
        ],
        size: 1,
      }));

      await service.loadSins();

      expect(firebaseAuthMock.getDocs).toHaveBeenCalledTimes(1);
      expect(service.sins()).toEqual([{ uid: 'sin-1', text: 'Skipped tests', severity: 'critical', status: 'full' }]);
      expect(service.isLoading()).toBe(false);
    });

    it('должен выбросить ошибку, если пользователь не авторизован', async () => {
      (authServiceMock.user as unknown as Mock).mockReturnValue(null);

      await expect(service.loadSins()).rejects.toThrow('User is not authenticated');
      expect(service.isLoading()).toBe(false);
      expect(firebaseAuthMock.getDocs).not.toHaveBeenCalled();
    });

    it('должен прервать загрузку по таймауту Firestore', async () => {
      vi.useFakeTimers();
      firebaseAuthMock.getDocs.mockImplementation(() => new Promise(() => undefined));

      const loadPromise = service.loadSins();

      await vi.advanceTimersByTimeAsync(FIRESTORE_OPERATION_TIMEOUT_MS);

      await expect(loadPromise).rejects.toThrow('Request timed out');
      expect(service.isLoading()).toBe(false);
      expect(service.error()).toEqual(expect.any(Error));

      vi.useRealTimers();
    });
  });

  describe('Добавление греха', () => {
    it('должен добавить грех и обновить счётчик', async () => {
      firebaseAuthMock.addDoc.mockImplementation(async () => ({ id: 'new-sin-id' }));
      firebaseAuthMock.getDocs.mockImplementation(async () => ({ docs: [], size: 1 }));

      await service.addSin('Forgot to commit', 'medium');

      expect(firebaseAuthMock.addDoc).toHaveBeenCalledTimes(1);
      expect(service.sins()).toEqual([
        expect.objectContaining({
          uid: 'new-sin-id',
          text: 'Forgot to commit',
          severity: 'medium',
        }),
      ]);
      expect(firebaseAuthMock.updateDoc).toHaveBeenCalledWith(expect.anything(), { sins: 1 });
    });
  });

  describe('Удаление греха', () => {
    it('должен удалить грех из Firestore и локального списка', async () => {
      service['_sins'].set([{ uid: 'sin-1', text: 'Old sin', severity: 'low', status: 'none' }]);
      firebaseAuthMock.getDocs.mockImplementation(async () => ({ docs: [], size: 0 }));

      await service.deleteSin('sin-1');

      expect(firebaseAuthMock.deleteDoc).toHaveBeenCalledTimes(1);
      expect(service.sins()).toEqual([]);
      expect(firebaseAuthMock.updateDoc).toHaveBeenCalledWith(expect.anything(), { sins: 0 });
    });
  });

  describe('Счётчик грехов', () => {
    it('должен вернуть количество документов в подколлекции', async () => {
      firebaseAuthMock.getDocs.mockImplementation(async () => ({
        docs: [{ id: '1' }, { id: '2' }],
        size: 2,
      }));

      await expect(service.getSinsCount(userFixture.uid)).resolves.toBe(2);
    });

    it('должен обновить поле sins в профиле пользователя', async () => {
      await service.updateSinsCount(userFixture.uid, 5);

      expect(firebaseAuthMock.updateDoc).toHaveBeenNthCalledWith(1, expect.anything(), { sins: 5 });
    });
  });
});
