import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VaccinePage } from './vaccine.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { VaccinePageRoutingModule } from './vaccine-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    VaccinePageRoutingModule
  ],
  declarations: [VaccinePage]
})
export class VaccinePageModule {}
