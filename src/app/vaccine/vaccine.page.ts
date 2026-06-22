import { Component, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Vaccine } from './vaccine.model';
import { IonFab, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { VaccineService } from './vaccine';

@Component({
  selector: 'app-vaccine',
  templateUrl: 'vaccine.page.html',
  styleUrls: ['vaccine.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    IonicModule,
    ExploreContainerComponentModule,
  ],
})
export class VaccinePage {
  private readonly vaccineService = inject(VaccineService);
  readonly vaccineList$: Observable<Vaccine[]> = this.vaccineService.getVaccineList();
}
