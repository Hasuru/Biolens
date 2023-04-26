import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor(private platform:Platform,
              private router:Router,
              public storageService: StorageService) { }

  public async addNewPhotoToStorage() {
    // get photo file
    const photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
    });


    // get file date information
    const date = new Date();

    // get file name based on date
    const photoId = date.getTime() + '.jpeg';

    // get current geolocation position
    const geolocation = await Geolocation.getCurrentPosition();

    this.storageService.PushNewPhoto({
      photoId: photoId,
      photoPath: photo.dataUrl!,
      dateTime: date.getTime(),
      day: date.getDay(),
      month: date.getMonth(),
      year: date.getFullYear(),
      latitude: geolocation.coords.latitude,
      longitude: geolocation.coords.longitude,
      notes:'You can write your own notes here!'
    })
    console.log(this.storageService.photoStorage);

    this.router.navigate(['library']);
  }
}
