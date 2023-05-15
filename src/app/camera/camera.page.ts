import { Component } from '@angular/core';
import { CameraService } from '../services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: 'camera.page.html',
  styleUrls: ['camera.page.scss']
})
export class CameraPage {

  constructor(private cameraService:CameraService) {}

  ngOnInit() {
    this.cameraService.addNewImage("camera");
  }

  public addNewPhoto() {
    this.cameraService.addNewImage("prompt");
  }

}
