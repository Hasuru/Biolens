import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public imageList: PhotoInfo[] = []

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
  ) {
    this.imageList = this.databaseService.fetchImages();
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
      species: undefined,
      species_prob: undefined,
      notes:'You can write your own notes here!'
    });

    //update list
    this.databaseService.insert(photoData);
    this.imageList = this.databaseService.fetchImages();
  }

  public async saveImage(photo: Photo, fileName: string) {
    const base64Data = await this.readAsBase64(photo);

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data!,
      directory: Directory.Data
    });

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

  public async deleteAllImages() {
    var index = 0;
    for (var photo of this.imageList) {
      this.imageList.splice(index, 1);

      const fileName = photo.filePath.substring(photo.filePath.lastIndexOf('/') + 1);
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Data,
      });

      this.databaseService.delete(photo.fileId);
      index++;
    }
    this.imageList = this.databaseService.fetchImages();
  }

  public async deletePhotoFromStorage(toDeletePhoto: PhotoInfo) {
    let index = 0;
    for (var photo of this.imageList) {
      if (photo.fileId == toDeletePhoto.fileId) {
        this.imageList.splice(index, 1);
      }
      index++;
    }
    const fileName = toDeletePhoto.filePath.substring(toDeletePhoto.filePath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: fileName,
      directory: Directory.Data,
    });

    // delete from database
    this.databaseService.delete(toDeletePhoto.fileId);
    this.imageList = this.databaseService.fetchImages();
    this.router.navigate(['/library']);
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
