import { Component } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private cameraService: CameraService) {}

  public addNewPhoto() {
    this.cameraService.addNewImage();
  }

}
