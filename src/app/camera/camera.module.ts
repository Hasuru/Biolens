import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CameraPage } from './camera.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { CameraPageRoutingModule } from './camera-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    CameraPageRoutingModule
  ],
  declarations: [CameraPage]
})
export class CameraPageModule {}
