import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'camera',
        loadChildren: () => import('../camera/camera.module').then(m => m.CameraPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'library',
        loadChildren: () => import('../library/library.module').then(m => m.LibraryPageModule)
      },
      {
        path: '',
        redirectTo: 'camera',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'camera',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
