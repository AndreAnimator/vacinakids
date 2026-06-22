import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChildVaccinesPage } from './child-vaccines.page';

const routes: Routes = [
  {
    path: '',
    component: ChildVaccinesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChildVaccinesPageRoutingModule {}
