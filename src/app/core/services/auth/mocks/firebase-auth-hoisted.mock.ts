import { vi } from 'vitest';

interface FirebaseAuthMock {
  addDoc: ReturnType<typeof vi.fn>;
  appInstance: object;
  authInstance: { currentUser: unknown };
  collection: ReturnType<typeof vi.fn>;
  createUserWithEmailAndPassword: ReturnType<typeof vi.fn>;
  deleteDoc: ReturnType<typeof vi.fn>;
  doc: ReturnType<typeof vi.fn>;
  firestoreInstance: object;
  getDoc: ReturnType<typeof vi.fn>;
  getDocs: ReturnType<typeof vi.fn>;
  query: ReturnType<typeof vi.fn>;
  updateDoc: ReturnType<typeof vi.fn>;
  where: ReturnType<typeof vi.fn>;
  GithubAuthProvider: ReturnType<typeof vi.fn>;
  getAuth: ReturnType<typeof vi.fn>;
  getApps: ReturnType<typeof vi.fn>;
  getFirestore: ReturnType<typeof vi.fn>;
  GoogleAuthProvider: ReturnType<typeof vi.fn>;
  initializeApp: ReturnType<typeof vi.fn>;
  onAuthStateChanged: ReturnType<typeof vi.fn>;
  sendPasswordResetEmail: ReturnType<typeof vi.fn>;
  serverTimestampFixture: string;
  serverTimestamp: ReturnType<typeof vi.fn>;
  setDoc: ReturnType<typeof vi.fn>;
  signInWithEmailAndPassword: ReturnType<typeof vi.fn>;
  signInWithPopup: ReturnType<typeof vi.fn>;
  signOut: ReturnType<typeof vi.fn>;
}

interface FirebaseAuthMockGlobal {
  __firebaseAuthMock__?: FirebaseAuthMock;
}

const getFirebaseAuthMock = (): FirebaseAuthMock => {
  const mock = (globalThis as unknown as FirebaseAuthMockGlobal).__firebaseAuthMock__;

  if (!mock) {
    throw new Error('Firebase test mock is not initialized. Ensure firebase-vitest-setup.ts is loaded.');
  }

  return mock;
};

export const firebaseAuthMock = new Proxy({} as FirebaseAuthMock, {
  get(_target, property) {
    return Reflect.get(getFirebaseAuthMock(), property);
  },
  set(_target, property, value) {
    return Reflect.set(getFirebaseAuthMock(), property, value);
  },
});

export const resetFirebaseAuthMock = (): void => {
  const mock = getFirebaseAuthMock();

  mock.addDoc.mockReset();
  mock.collection.mockReset();
  mock.createUserWithEmailAndPassword.mockReset();
  mock.deleteDoc.mockReset();
  mock.doc.mockReset();
  mock.getDoc.mockReset();
  mock.getDocs.mockReset();
  mock.query.mockReset();
  mock.updateDoc.mockReset();
  mock.where.mockReset();
  mock.GithubAuthProvider.mockReset();
  mock.getAuth.mockReset();
  mock.getApps.mockReset();
  mock.getFirestore.mockReset();
  mock.GoogleAuthProvider.mockReset();
  mock.initializeApp.mockReset();
  mock.onAuthStateChanged.mockReset();
  mock.sendPasswordResetEmail.mockReset();
  mock.serverTimestamp.mockReset();
  mock.setDoc.mockReset();
  mock.signInWithEmailAndPassword.mockReset();
  mock.signInWithPopup.mockReset();
  mock.signOut.mockReset();
  mock.authInstance.currentUser = null;
  mock.addDoc.mockResolvedValue({ id: 'new-sin-id' });
  mock.collection.mockReturnValue({ path: 'users/firebase-user-1/sins' });
  mock.doc.mockReturnValue({ path: 'users/firebase-user-1' });
  mock.getDoc.mockResolvedValue({ exists: () => false });
  mock.getDocs.mockResolvedValue({ docs: [], size: 0 });
  mock.query.mockImplementation((_collection, ...constraints) => ({ constraints }));
  mock.updateDoc.mockResolvedValue(undefined);
  mock.deleteDoc.mockResolvedValue(undefined);
  mock.where.mockReturnValue({ field: 'lang', op: '==', value: 'ru' });
  mock.getAuth.mockReturnValue(mock.authInstance);
  mock.getApps.mockReturnValue([mock.appInstance]);
  mock.getFirestore.mockReturnValue(mock.firestoreInstance);
  mock.initializeApp.mockReturnValue(mock.appInstance);
  mock.onAuthStateChanged.mockImplementation((_auth, onNext) => {
    onNext(null);

    return vi.fn();
  });
  mock.sendPasswordResetEmail.mockResolvedValue(undefined);
  mock.serverTimestamp.mockReturnValue(mock.serverTimestampFixture);
  mock.setDoc.mockResolvedValue(undefined);
  mock.signOut.mockResolvedValue(undefined);
};
