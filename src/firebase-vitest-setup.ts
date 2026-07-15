import { beforeEach, vi } from 'vitest';
import type { User } from 'firebase/auth';

import { resetFirebaseAuthMock } from './app/core/services/auth/mocks/firebase-auth-hoisted.mock';

const firebaseAuthMock = vi.hoisted(() => {
  const appInstance = {};
  const authInstance: { currentUser: User | null } = { currentUser: null };
  const firestoreInstance = {};
  const serverTimestampFixture = 'server-timestamp';

  function GithubAuthProviderMock(this: { providerId: string }): void {
    this.providerId = 'github.com';
  }

  function GoogleAuthProviderMock(this: { providerId: string }): void {
    this.providerId = 'google.com';
  }

  return {
    addDoc: vi.fn(),
    appInstance,
    authInstance,
    collection: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    deleteDoc: vi.fn(),
    doc: vi.fn(),
    firestoreInstance,
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    query: vi.fn(),
    updateDoc: vi.fn(),
    where: vi.fn(),
    GithubAuthProvider: vi.fn(GithubAuthProviderMock),
    getAuth: vi.fn(() => authInstance),
    getApps: vi.fn(() => [appInstance]),
    getFirestore: vi.fn(() => firestoreInstance),
    GoogleAuthProvider: vi.fn(GoogleAuthProviderMock),
    initializeApp: vi.fn(() => appInstance),
    onAuthStateChanged: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    serverTimestampFixture,
    serverTimestamp: vi.fn(() => serverTimestampFixture),
    setDoc: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
  };
});

vi.mock('firebase/app', () => firebaseAuthMock);
vi.mock('firebase/auth', () => firebaseAuthMock);
vi.mock('firebase/firestore', () => firebaseAuthMock);

interface FirebaseAuthMockGlobal {
  __firebaseAuthMock__?: typeof firebaseAuthMock;
}

(globalThis as unknown as FirebaseAuthMockGlobal).__firebaseAuthMock__ = firebaseAuthMock;

beforeEach(() => {
  resetFirebaseAuthMock();
});
