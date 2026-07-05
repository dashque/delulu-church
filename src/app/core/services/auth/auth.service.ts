import { computed, DestroyRef, inject, Service, signal } from '@angular/core';
import { auth } from '@env/environment';
import { UserProfileService } from '@core/services/user-profile/user-profile.service';
import type { AuthProvider, User } from 'firebase/auth';
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

@Service()
export class AuthService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly userProfileService = inject(UserProfileService);
  private readonly _user = signal<User | null>(null);
  private readonly _error = signal<unknown | null>(null);
  private readonly _isLoading = signal(false);
  public readonly user = this._user.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly error = this._error.asReadonly();
  public readonly isAuthenticated = computed(() => this._user() !== null);

  public async initialize() {
    return new Promise<User | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        void this.setAuthUser(user).then(() => {
          resolve(user);
        });
      });

      this.destroyRef.onDestroy(unsubscribe);
    });
  }

  public async loadUser() {
    const user = auth.currentUser;

    await this.setAuthUser(user);

    return user;
  }

  public async login(email: string, password: string) {
    this.startLoading();
    this._error.set(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      await this.setAuthUser(userCredential.user);

      return userCredential.user;
    } catch (error) {
      this._error.set(error);

      throw error;
    } finally {
      this.stopLoading();
    }
  }

  public async signup(email: string, password: string, data?: Record<string, unknown>) {
    this.startLoading();
    this._error.set(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await this.userProfileService.createProfile(
        userCredential.user.uid,
        userCredential.user.email ?? email,
        this.getSignupDisplayName(data),
        this.getSignupDateOfBirth(data)
      );

      await this.setAuthUser(userCredential.user);

      return userCredential.user;
    } catch (error) {
      this._error.set(error);

      throw error;
    } finally {
      this.stopLoading();
    }
  }

  public async logout() {
    this.startLoading();
    this._error.set(null);

    try {
      await signOut(auth);
      await this.setAuthUser(null);
    } catch (error) {
      this._error.set(error);

      throw error;
    } finally {
      this.stopLoading();
    }
  }

  public loginWithGithub() {
    return this.loginWithProvider(new GithubAuthProvider());
  }

  public loginWithGoogle() {
    return this.loginWithProvider(new GoogleAuthProvider());
  }

  public async requestPasswordRecovery(email: string) {
    this._error.set(null);

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      this._error.set(error);

      throw error;
    }
  }

  private startLoading() {
    this._isLoading.set(true);
  }

  private stopLoading() {
    this._isLoading.set(false);
  }

  private async loginWithProvider(provider: AuthProvider) {
    this.startLoading();
    this._error.set(null);

    try {
      const userCredential = await signInWithPopup(auth, provider);

      await this.userProfileService.ensureProviderProfile(
        userCredential.user.uid,
        userCredential.user.email,
        userCredential.user.displayName
      );
      await this.setAuthUser(userCredential.user);

      return userCredential.user;
    } catch (error) {
      this._error.set(error);

      throw error;
    } finally {
      this.stopLoading();
    }
  }

  private getSignupDisplayName(data?: Record<string, unknown>): string | null {
    const fullName = data?.['full_name'];

    return typeof fullName === 'string' && fullName.trim() ? fullName.trim() : null;
  }

  private getSignupDateOfBirth(data?: Record<string, unknown>): Date | null {
    const dateOfBirth = data?.['date_of_birth'];

    return dateOfBirth instanceof Date ? dateOfBirth : null;
  }

  private async setAuthUser(user: User | null) {
    this._user.set(user);

    if (user === null) {
      this.userProfileService.clearProfile();

      return;
    }

    await this.userProfileService.loadProfile(user.uid);
  }
}
