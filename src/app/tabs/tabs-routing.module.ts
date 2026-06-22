import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { authenticationPage } from '../authentication/authentication.page';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo('/tabs/authentication/login');

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'authentication',
        loadChildren: () => import('../authentication/authentication.module').then(m => m.authenticationPageModule)
      },
      {
        path: 'vaccine',
        loadChildren: () => import('../vaccine/vaccine.module').then(m => m.VaccinePageModule),
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectUnauthorizedToLogin },
      },
      {
        path: 'child-vaccines',
        loadChildren: () => import('../child-vaccines/child-vaccines.module').then(m => m.ChildVaccinesPageModule)
      },
      {
        path: '',
        redirectTo: 'vaccine',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/authentication',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
