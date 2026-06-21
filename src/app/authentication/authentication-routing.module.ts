import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticationPage } from './authentication.page';

const routes: Routes = [
  {
    path: '',
    component: authenticationPage,
    children: [
      {
        path: 'login',
        component: authenticationPage,
      },
      {
        path: 'signup',
        component: authenticationPage,
      },
      {
        path: 'reset',
        component: authenticationPage,
      },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class authenticationPageRoutingModule {}
