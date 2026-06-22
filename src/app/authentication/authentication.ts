import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable, switchMap } from 'rxjs';
import { Child } from './child.model';
import { collection, doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly auth = inject(Auth);
    private readonly firestore = inject(Firestore);

  getUser(): Observable<User | null> {
    return user(this.auth);
  }

  login(email: string, password: string): Observable<UserCredential> {
    console.log("Logou?")
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  signup(email: string, password: string, name: string, children: Child[]): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async (userCredential) => {
        const user = userCredential.user;
        console.log("Quais crianças vieram com o cadastro?")
        console.log(children)
        await this.createUserProfile(user.uid, {
          email: user.email,
          name: name,
          createdAt: new Date().toISOString(),
          children: children || []
        });

        if (children && children.length > 0) {
          await this.saveChildrenData(user.uid, children);
          console.log("não ta criando criança?")
        }

        return userCredential;
      })
    );
  }

  private async createUserProfile(uid: string, userData: any): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userDocRef, {
        ...userData,
        uid: uid,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  private async saveChildrenData(uid: string, children: Child[]): Promise<void> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userDocRef, {
        childrenIds: children.map(child => child.id)
      });

    } catch (error) {
      console.error('Error saving children data:', error);
      throw error;
    }
  }

  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  async getUserProfile(uid: string): Promise<any> {
    try {
      const userDocRef = doc(this.firestore, `users/${uid}`);
      const userDoc = await getDoc(userDocRef);
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async getUserChildren(uid: string): Promise<Child[]> {
    try {
      const childrenCollectionRef = collection(this.firestore, `users/${uid}/children`);
      // You'll need to implement a proper query here
      // For now, returning an empty array
      return [];
    } catch (error) {
      console.error('Error getting user children:', error);
      return [];
    }
  }
}
