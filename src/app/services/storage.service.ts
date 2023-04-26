import { Injectable } from '@angular/core';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { Photo } from '@capacitor/camera';
import { Position } from '@capacitor/geolocation'
import { SQLiteObject } from '@ionic-native/sqlite';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public photoStorage: PhotoInfo[] = [];
  //private storage?: SQLiteObject;
  //photoList = new BehaviorSubject([]);
  //private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    /*private platform:Platform,
    private sqlite:SQLite,
    private sqlPorter:SQLitePorter,
    private httpClient: HttpClient*/
  ) {
    /*this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'biolens_db.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.storage = db;
      });
    });*/
  }

  // SQLITE TUTORIAL FUNCTIONS
  /*
  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchPhotos() : Observable<PhotoInfo[]> {
    return this.photoList.asObservable()
  }

  getFakeData() {
    this.httpClient.get(
      'assets/dump.sql',
      {responseType: 'text'}
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data).then(_ => {
        this.getPhotos();
        this.isDbReady.next(true);
      }).catch(error => console.log(error));
    });
  }

  getPhotos() {
    return this.storage?.executeSql('SELECT * FROM phototable, []').then(res => {
      let items: PhotoInfo[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push(); //push photo (to be done)
        }
      }
      this.photoList.next(items);
    });
  }*/

  // TEST FUNCTIONS
  public PushNewPhoto(photo:PhotoInfo) {
    this.photoStorage.push(photo);
  }

  public getPhotoById(photoId: string) {
    for (var photo of this.photoStorage) {
      if (photo.photoId == photoId) {
        return photo;
      }
    }
    return;
  }
}

export interface PhotoInfo {
  photoId: string;
  photoPath: string;
  dateTime: number;
  day: number;
  month: number;
  year: number;
  latitude: number;
  longitude: number;
  notes:string;
}
