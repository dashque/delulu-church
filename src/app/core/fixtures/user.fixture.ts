import type { User } from 'firebase/auth';

export const userFixture = {
  displayName: 'abob',
  email: 'dev@example.com',
  emailVerified: false,
  isAnonymous: false,
  metadata: {
    creationTime: '2026-06-07T08:43:02.651Z',
    lastSignInTime: '2026-06-07T08:50:29.901Z',
  },
  phoneNumber: null,
  photoURL: null,
  providerData: [
    {
      displayName: 'abob',
      email: 'abob@abob.aa',
      phoneNumber: null,
      photoURL: null,
      providerId: 'password',
      uid: 'abob@abob.aa',
    },
  ],
  providerId: 'firebase',
  refreshToken: 'firebase-refresh-token',
  tenantId: null,
  uid: 'jV1w8fUKGfWX9HZh83sMJe66QT63',
} as const satisfies Partial<User>;
