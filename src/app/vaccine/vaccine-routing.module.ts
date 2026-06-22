import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccinePage } from './vaccine.page';
import { DetailVaccineComponent } from './detail-vaccine/detail-vaccine.component';

const routes: Routes = [
  {
    path: '',
    component: VaccinePage,
  },
  {
    path: ':vaccineId',
    component: DetailVaccineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccinePageRoutingModule {}
