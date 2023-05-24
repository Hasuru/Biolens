import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private router:Router,
              public storageService: StorageService) { }

  public async addNewImage(type: string) {
    let cameraType: CameraSource = CameraSource.Camera;

    switch(type) {
      case "camera": {
        cameraType = CameraSource.Camera;
        break;
      }
      case "prompt": {
        cameraType = CameraSource.Prompt;
        break;
      }
      case "photos": {
        cameraType = CameraSource.Photos;
      }
    }

    //console.log("in addNewImage");
    // get photo file
    await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: cameraType,
    }).then((photo) => {
      this.storageService.addToStorage(photo!);
      this.router.navigate(['library']);
    }).catch((e) => {
      console.log("Capacitor Camera closed:");
    });

    //console.log(photo);
  }
}
