import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibraryPage } from './library.page';

const routes: Routes = [
  {
    path: '',
    component: LibraryPage,
  },
  {
    path: ':photoId',
    loadChildren: () => import('./photo-detail/photo-detail.module').then( m => m.PhotoDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryPageRoutingModule {}
