import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaccinePage } from './vaccine.page';

const routes: Routes = [
  {
    path: '',
    component: VaccinePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VaccinePageRoutingModule {}
