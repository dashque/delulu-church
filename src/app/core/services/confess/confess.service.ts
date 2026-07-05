import { inject, Service, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '@env/environment';
import type { Severity, Sin, Status } from '@features/shrift/models/sin.model';
import { SINS_SUBCOLLECTION, STATUSES, USERS_COLLECTION } from '@core/services/confess/models/confess.model';

@Service()
export class ConfessService {
  private readonly authService = inject(AuthService);

  private readonly _sins = signal<Sin[] | null>(null);
  private readonly _isLoading = signal(false);
  public readonly sins = this._sins.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();

  public async loadSins(): Promise<void> {
    this.startLoading();

    try {
      const uid = this.requireUid();

      const sinsReference = collection(firestore, USERS_COLLECTION, uid, SINS_SUBCOLLECTION);
      const snapshot = await getDocs(sinsReference);

      const sins = snapshot.docs.map((document) => {
        const data = document.data();

        return {
          uid: document.id,
          text: data['text'] as string,
          severity: data['severity'] as Severity,
          status: data['status'] as Status,
        } satisfies Sin;
      });

      this._sins.set(sins);
    } catch (error) {
      this.handleFirebaseError(error);
    } finally {
      this.stopLoading();
    }
  }

  public async addSin(text: string, severity: Severity): Promise<void> {
    this.startLoading();

    try {
      const uid = this.requireUid();
      const status = this.getRandomStatus();

      const sinsReference = collection(firestore, USERS_COLLECTION, uid, SINS_SUBCOLLECTION);
      const documentReference = await addDoc(sinsReference, { text, severity, status });

      const newSin: Sin = { uid: documentReference.id, text, severity, status };

      this._sins.update((sins) => (sins ? [...sins, newSin] : [newSin]));

      await this.updateSinsCount(uid, await this.getSinsCount(uid));
    } catch (error) {
      this.handleFirebaseError(error);
    } finally {
      this.stopLoading();
    }
  }

  public async deleteSin(sinUid: string): Promise<void> {
    this.startLoading();
    try {
      const uid = this.requireUid();

      const sinReference = doc(firestore, USERS_COLLECTION, uid, SINS_SUBCOLLECTION, sinUid);

      await deleteDoc(sinReference);

      this._sins.update((sins) => sins?.filter((sin) => sin.uid !== sinUid) ?? null);
      await this.updateSinsCount(uid, await this.getSinsCount(uid));
    } catch (error) {
      this.handleFirebaseError(error);
    } finally {
      this.stopLoading();
    }
  }

  public async getSinsCount(uid: string): Promise<number> {
    const sinsReference = collection(firestore, USERS_COLLECTION, uid, SINS_SUBCOLLECTION);
    const snapshot = await getDocs(sinsReference);

    return snapshot.size;
  }

  public async updateSinsCount(uid: string, count: number): Promise<void> {
    try {
      const userReference = doc(firestore, USERS_COLLECTION, uid);

      await updateDoc(userReference, { sins: count });
    } catch (error) {
      this.handleFirebaseError(error);
    }
  }

  private requireUid(): string {
    const uid = this.authService.user()?.uid;

    if (!uid) {
      throw new Error('User is not authenticated');
    }

    return uid;
  }

  private getRandomStatus(): Status {
    const index = Math.floor(Math.random() * STATUSES.length);

    return STATUSES[index];
  }

  private startLoading() {
    this._isLoading.set(true);
  }

  private stopLoading() {
    this._isLoading.set(false);
  }

  private handleFirebaseError(error: unknown): never {
    if (error instanceof Error) {
      throw new Error(error.message, { cause: error });
    }

    throw new Error('Unknown error');
  }
}
