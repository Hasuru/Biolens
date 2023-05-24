import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import exifr from 'exifr';
import { DatabaseService } from './database.service';
import { DatePipe } from '@angular/common';
import { TensorflowService } from './tensorflow.service';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public photoStorage: PhotoInfo[] = [];
  private platform: Platform;

  constructor(
    platform: Platform,
    private router: Router,
    //private databaseService: DatabaseService,
    private tensorflowService: TensorflowService,
  ) {
    console.log("Storage Constructor started");
    this.platform = platform;
    this.tensorflowService.initialize();
    console.log("Storage constructor done");
  }

  public async addToStorage(photo: Photo) {
    console.log("ADDING TO FILESYSTEM");

    var date = new Date();
    var datePipe = new DatePipe('en-US');
    const fileName = date.getTime() + '.jpeg';
    const savedPhoto = await this.saveImage(photo, fileName);
    const geolocation = await Geolocation.getCurrentPosition();
    const dateString = datePipe.transform(date, 'dd-MM-yyyy');

    const photoData : PhotoInfo = ({
      fileId: date.getTime(),
      filePath: savedPhoto.filepath!,
      fileWebPath: savedPhoto.webviewPath!,
      date: dateString!,
      latitude: geolocation.coords.latitude,
      longitude: geolocation.coords.longitude,
      notes:'You can write your own notes here!'
    });

    //this.databaseService.insert(photoData);
    this.photoStorage.unshift(photoData);

    // add data to database
  }

  public async saveImage(photo: Photo, fileName: string) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);
    //console.log(base64Data);

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    try {
      let {latitude, longitude} = await exifr.gps(Directory.Data + '/' + fileName);
      console.log(latitude, longitude);
    } catch (e) {
      console.log("Error on reading lat and lon");
    }

    if (this.platform.is('hybrid')) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    }
    else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  private async readAsBase64(photo: Photo) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is('hybrid')) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: photo.path!,
      });

      return file.data;
    }
    else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  public async loadPhotos() {
    // get photos from db
    //this.photoStorage = this.databaseService.getImages();

    // for web purposes
    if (!this.platform.is('hybrid')) {
      for (let image of this.photoStorage) {
        const readPhoto = await Filesystem.readFile({
          path: image.filePath,
          directory: Directory.Data,
        });

        image.fileWebPath = `data:image/jpeg;base64,${readPhoto.data}`;
      }
    }
  }

  // for debug purposes
  public async deleteAllImages() {
    //console.log("DELETING ALL FILES IN FILESYSTEM");
    var index = 0;
    for (var photo of this.photoStorage) {
      this.photoStorage.splice(index, 1);

      // delete from the filesystem
      const fileName = photo.filePath.substring(photo.filePath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Data,
      });

      //this.databaseService.delete(photo);
      index++;
    }

    // delete from database
  }

  public async deletePhotoFromStorage(toDeletePhoto: PhotoInfo) {
    let index = 0;
    for (var photo of this.photoStorage) {
      if (photo.fileId == toDeletePhoto.fileId) {
        this.photoStorage.splice(index, 1);
      }
      index++;
    }
    // delete from the filesystem
    const fileName = toDeletePhoto.filePath.substring(toDeletePhoto.filePath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: fileName,
      directory: Directory.Data,
    });

    // delete from database
    //this.databaseService.delete(toDeletePhoto);

    console.log("IMAGE DELETED FROM FILESYSTEM")
    this.router.navigate(['/library']);
  }

  public getPhotoById(fileId: number) {
    for (var photo of this.photoStorage) {
      if (photo.fileId == fileId) {
        return photo;
      }
    }
    return;
  }
}

export interface PhotoInfo {
  fileId: number;
  filePath: string;
  fileWebPath: string;
  date: string;
  latitude: number;
  longitude: number;
  notes:string;
}
