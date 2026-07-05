import { Service, signal } from '@angular/core';
import { firestore } from '@env/environment';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import type { UserProfile } from './models/user-profile.model';
import { initialUiState } from '@core/store/constants/initial-ui-state';
import type { UiState } from '@core/store/models/ui-state.model';
import { Theme } from '@core/models/theme.model';
import { Languages } from '@core/models/languages.model';

@Service()
export class UserProfileService {
  private readonly _user = signal<UserProfile | null>(null);
  public readonly user = this._user.asReadonly();

  public async loadProfile(uid: string): Promise<UserProfile | null> {
    const userSnapshot = await getDoc(this.getUserReference(uid));

    if (!userSnapshot.exists()) {
      this._user.set(null);

      return null;
    }

    const userProfile = this.getUserProfile(uid, userSnapshot.data());

    this._user.set(userProfile);

    return userProfile;
  }

  public async createProfile(uid: string, email: string | null, displayName: string | null, dateOfBirth: Date | null) {
    await setDoc(this.getUserReference(uid), {
      createdAt: serverTimestamp(),
      dateOfBirth: dateOfBirth,
      displayName: displayName,
      email: email,
      candles: 0,
      sins: 0,
      uiState: {
        ...initialUiState,
      },
    });
  }

  public async ensureProviderProfile(uid: string, email: string | null, displayName: string | null) {
    const userReference = this.getUserReference(uid);
    const userSnapshot = await getDoc(userReference);

    if (userSnapshot.exists()) {
      await setDoc(
        userReference,
        {
          displayName: displayName,
          email: email,
        },
        { merge: true }
      );

      return;
    }

    await setDoc(userReference, {
      createdAt: serverTimestamp(),
      dateOfBirth: null,
      displayName: displayName,
      email: email,
      candles: 0,
      sins: 0,
    });
  }

  public async updateUiState(uid: string, uiState: UiState) {
    await setDoc(this.getUserReference(uid), { uiState }, { merge: true });

    const currentUser = this._user();

    if (currentUser?.uid === uid) {
      this._user.set({ ...currentUser, uiState });
    }
  }

  public clearProfile() {
    this._user.set(null);
  }

  private getUserReference(uid: string) {
    return doc(firestore, 'users', uid);
  }

  private getUserProfile(uid: string, data: Record<string, unknown>): UserProfile {
    return {
      uid: uid,
      email: this.getNullableString(data['email']),
      displayName: this.getNullableString(data['displayName']),
      dateOfBirth: data['dateOfBirth'] ?? null,
      createdAt: data['createdAt'] ?? null,
      candles: this.getNumber(data['candles']),
      sins: this.getNumber(data['sins']),
      uiState: this.getUiState(data['uiState']),
    };
  }

  private getNullableString(value: unknown) {
    return typeof value === 'string' ? value : null;
  }

  private getNumber(value: unknown) {
    return typeof value === 'number' ? value : 0;
  }

  private getUiState(value: unknown): UiState {
    if (typeof value !== 'object' || value === null) {
      return { ...initialUiState };
    }
    const uiState = value as Record<string, unknown>;

    return {
      theme: uiState['theme'] === Theme.LIGHT ? Theme.LIGHT : Theme.DARK,
      language: uiState['language'] === Languages.EN ? Languages.EN : Languages.RU,
    };
  }
}
