import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LibraryPage } from './library.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { LibraryPageRoutingModule } from './library-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    LibraryPageRoutingModule
  ],
  declarations: [LibraryPage]
})
export class LibraryPageModule {}
