import { Injectable, inject } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDoc, getDocs, orderBy, query } from '@angular/fire/firestore';
import { AuthenticationService } from '../authentication/authentication';
import { map, Observable } from 'rxjs';
import { Vaccine } from './vaccine.model';

@Injectable({
  providedIn: 'root',
})
  export class VaccineService {
      private firestore = inject(Firestore);

  getVaccineList(): Observable<Vaccine[]> {
    const vaccinesCollection = collection(this.firestore, 'vaccines');
    // this method returns a stream of documents mapped to their payload and id
    return collectionData(vaccinesCollection, {idField: 'id'})
    .pipe(
      map(vaccines => vaccines as Vaccine[])
    );
  }

  // Get single vaccine by ID
  async getVaccine(id: string): Promise<Vaccine | null> {
    try {
      const vaccineDoc = doc(this.firestore, `vaccines/${id}`);
      const snapshot = await getDoc(vaccineDoc);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as Vaccine;
      }
      return null;
    } catch (error) {
      console.error('Error fetching vaccine:', error);
      return null;
    }
  }
}
