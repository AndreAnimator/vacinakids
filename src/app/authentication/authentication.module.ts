import { IonButton, IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { authenticationPage } from './authentication.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { authenticationPageRoutingModule } from './authentication-routing.module';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { IonRouterOutlet } from '@ionic/angular/common';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    authenticationPageRoutingModule,
    AuthFormComponent,
    authenticationPage,
  ],
  //declarations: [authenticationPage]
})
export class authenticationPageModule {}
