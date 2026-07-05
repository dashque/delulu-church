import { vi } from 'vitest';
import type { User } from 'firebase/auth';

export const firebaseAuthMock = vi.hoisted(() => {
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
    appInstance,
    authInstance,
    createUserWithEmailAndPassword: vi.fn(),
    doc: vi.fn(),
    firestoreInstance,
    getDoc: vi.fn(),
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

export const resetFirebaseAuthMock = (): void => {
  firebaseAuthMock.createUserWithEmailAndPassword.mockReset();
  firebaseAuthMock.doc.mockReset();
  firebaseAuthMock.getDoc.mockReset();
  firebaseAuthMock.GithubAuthProvider.mockReset();
  firebaseAuthMock.getAuth.mockReset();
  firebaseAuthMock.getApps.mockReset();
  firebaseAuthMock.getFirestore.mockReset();
  firebaseAuthMock.GoogleAuthProvider.mockReset();
  firebaseAuthMock.initializeApp.mockReset();
  firebaseAuthMock.onAuthStateChanged.mockReset();
  firebaseAuthMock.sendPasswordResetEmail.mockReset();
  firebaseAuthMock.serverTimestamp.mockReset();
  firebaseAuthMock.setDoc.mockReset();
  firebaseAuthMock.signInWithEmailAndPassword.mockReset();
  firebaseAuthMock.signInWithPopup.mockReset();
  firebaseAuthMock.signOut.mockReset();
  firebaseAuthMock.authInstance.currentUser = null;
  firebaseAuthMock.doc.mockReturnValue({ path: 'users/firebase-user-1' });
  firebaseAuthMock.getDoc.mockResolvedValue({ exists: () => false });
  firebaseAuthMock.getAuth.mockReturnValue(firebaseAuthMock.authInstance);
  firebaseAuthMock.getApps.mockReturnValue([firebaseAuthMock.appInstance]);
  firebaseAuthMock.getFirestore.mockReturnValue(firebaseAuthMock.firestoreInstance);
  firebaseAuthMock.initializeApp.mockReturnValue(firebaseAuthMock.appInstance);
  firebaseAuthMock.onAuthStateChanged.mockImplementation((_auth, onNext) => {
    onNext(null);

    return vi.fn();
  });
  firebaseAuthMock.sendPasswordResetEmail.mockResolvedValue(undefined);
  firebaseAuthMock.serverTimestamp.mockReturnValue(firebaseAuthMock.serverTimestampFixture);
  firebaseAuthMock.setDoc.mockResolvedValue(undefined);
  firebaseAuthMock.signOut.mockResolvedValue(undefined);
};
