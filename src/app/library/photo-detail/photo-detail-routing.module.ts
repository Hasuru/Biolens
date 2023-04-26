import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhotoDetailPage } from './photo-detail.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhotoDetailPageRoutingModule {}
