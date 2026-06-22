// child.service.ts
import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable, from, map, switchMap, of, catchError } from 'rxjs';
import { Child, VaccineTaken } from '../authentication/child.model';
import { Vaccine } from '../vaccine/vaccine.model';
import { VaccineService } from '../vaccine/vaccine';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private firestore = inject(Firestore);
  private vaccineService = inject(VaccineService);

  // Buscar todas as crianças de um usuário
    getChildrenByUser(userId: string): Observable<Child[]> {
    console.log("Buscando crianças para o usuário:", userId);
    
    if (!userId) {
      console.error('UserId is required');
      return of([]); // Retorna array vazio se não houver userId
    }
    
    const childrenCollection = collection(this.firestore, `users/${userId}/children`);
    console.log("Coleção de crianças:", childrenCollection);
    
    return collectionData(childrenCollection, { idField: 'id' }).pipe(
      map((data: any[]) => {
        console.log("Dados recebidos do Firestore:", data);
        return data as Child[];
      }),
      catchError(error => {
        console.error('Error fetching children:', error);
        return of([]); // Retorna array vazio em caso de erro
      })
    );
  }

  // Buscar uma criança específica com detalhes das vacinas
  getChildWithVaccineDetails(childId: string, userId: string): Observable<Child> {
    const childDoc = doc(this.firestore, `users/${userId}/children/${childId}`);
    return from(getDoc(childDoc)).pipe(
      map(doc => {
        if (!doc.exists()) throw new Error('Child not found');
        return { id: doc.id, ...doc.data() } as Child;
      }),
      switchMap(async (child) => {
        // Buscar detalhes de cada vacina usando vaccineId
        const vaccinesTakenWithDetails = await Promise.all(
          child.vaccines_taken.map(async (vt: VaccineTaken) => {
            const vaccine = await this.vaccineService.getVaccine(vt.vaccineId);
            return { 
              ...vt, 
              vaccine: vaccine || undefined 
            };
          })
        );
        return { ...child, vaccines_taken: vaccinesTakenWithDetails };
      })
    );
  }

  // Adicionar vacina tomada pela criança
  async addVaccineTaken(childId: string, userId: string, vaccineTaken: VaccineTaken): Promise<void> {
    const childDoc = doc(this.firestore, `users/${userId}/children/${childId}`);
    const childRef = await getDoc(childDoc);
    
    if (!childRef.exists()) {
      throw new Error('Child not found');
    }

    const childData = childRef.data() as Child;
    const updatedVaccines = [...(childData.vaccines_taken || []), vaccineTaken];
    
    // Atualizar o documento da criança
    const childDocRef = doc(this.firestore, `users/${userId}/children/${childId}`);
    await updateDoc(childDocRef, {
      vaccines_taken: updatedVaccines
    });
  }
}