import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhotoDetailPageRoutingModule } from './photo-detail-routing.module';

import { PhotoDetailPage } from './photo-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhotoDetailPageRoutingModule
  ],
  declarations: [PhotoDetailPage]
})
export class PhotoDetailPageModule {}
