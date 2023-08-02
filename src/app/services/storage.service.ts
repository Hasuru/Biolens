import { Injectable } from '@angular/core';
import { Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { DatePipe } from '@angular/common';
import { AlertController } from '@ionic/angular';

const DIRPATH = Directory.Data;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    private alertCtrl: AlertController,
  ) { }

  public async addToStorage(photo: Photo) {
    var date = new Date();
    var datePipe = new DatePipe('en-US');
    const fileId = date.getTime();
    const geolocation = await Geolocation.getCurrentPosition();
    const dateString = datePipe.transform(date, 'dd-MM-yyyy');

    const savedImageFile = await this.saveImage(photo, fileId);

    const photoData : PhotoInfo = ({
      fileId: fileId, // usar filename
      filePath: savedImageFile.filepath,
      webviewPath: savedImageFile.webviewPath,
      date: dateString!,
      latitude: geolocation.coords.latitude,
      longitude: geolocation.coords.longitude,
      species: undefined,
      species_prob: undefined,
      notes:'You can write your own notes here!'
    });

    this.databaseService.insert(photoData);
  }

  public async saveImage(photo: Photo, fileId: number) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = fileId + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: DIRPATH
    });

    return {
      filepath: savedFile.uri,
      webviewPath: Capacitor.convertFileSrc(savedFile.uri),
    };
  }

  public async readAsBase64(photo: Photo) {
    const file = await Filesystem.readFile({
      path: photo.path!
    });

    return file.data;
  }

  public async deletePhotoFromStorage(toDeletePhoto: PhotoInfo) {
    const fileName = toDeletePhoto.fileId + '.jpeg';
    await Filesystem.deleteFile({
      path: fileName,
      directory: Directory.Data,
    });
    this.databaseService.delete(toDeletePhoto.fileId);
    this.router.navigate(['/library']);
  }
}

export interface PhotoInfo {
  fileId: number,
  filePath: string,
  webviewPath?: string,
  date: string;
  latitude: number;
  longitude: number;
  species?: string;
  species_prob?: number;
  notes:string;
}
