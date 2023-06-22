import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { DatePipe } from '@angular/common';
import { TensorflowService } from './tensorflow.service';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public photoStorage: PhotoInfo[] = [];

  constructor(
    private platform: Platform,
    private router: Router,
    private databaseService: DatabaseService,
    private tensorflowService: TensorflowService,
  ) {
    this.platform = platform;
  }

  public async addToStorage(photo: Photo) {
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

    this.databaseService.insert(photoData);
    this.photoStorage.unshift(photoData);
  }

  public async saveImage(photo: Photo, fileName: string) {
    const base64Data = await this.readAsBase64(photo);

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data!,
      directory: Directory.Data
    });

    // mobile only
    return {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
    };
  }

  private async readAsBase64(photo: Photo) {
    const file = await Filesystem.readFile({
      path: photo.path!,
    });
    return file.data;
  }

  public async loadPhotos() {
    this.photoStorage = this.databaseService.getImages();
  }

  public async deleteAllImages() {
    var index = 0;
    for (var photo of this.photoStorage) {
      this.photoStorage.splice(index, 1);

      const fileName = photo.filePath.substring(photo.filePath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Data,
      });

      this.databaseService.delete(photo);
      index++;
    }
  }

  public async deletePhotoFromStorage(toDeletePhoto: PhotoInfo) {
    let index = 0;
    for (var photo of this.photoStorage) {
      if (photo.fileId == toDeletePhoto.fileId) {
        this.photoStorage.splice(index, 1);
      }
      index++;
    }
    const fileName = toDeletePhoto.filePath.substring(toDeletePhoto.filePath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: fileName,
      directory: Directory.Data,
    });

    // delete from database
    this.databaseService.delete(toDeletePhoto);
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
  species?: string;
  species_prob?: number;
  notes:string;
}
