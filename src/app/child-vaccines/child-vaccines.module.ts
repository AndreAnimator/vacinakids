import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChildVaccinesPage } from './child-vaccines.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { ChildVaccinesPageRoutingModule } from './child-vaccines-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    ChildVaccinesPageRoutingModule
  ],
  // declarations: [ChildVaccinesPage]
})
export class ChildVaccinesPageModule {}
