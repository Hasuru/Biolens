import { Injectable } from '@angular/core';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteObject } from '@ionic-native/sqlite';
import { PhotoInfo } from './storage.service';
import { AlertController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  imageList: any = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
  ) {
    this.platform.ready().then(() => {
      this.sqlite
        .create({
          name: 'Biolens.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.getPhotoTable();
        });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchImages(): Observable<PhotoInfo[]> {
    return this.imageList.asObservable();
  }

  public getPhotoTable() {
    this.httpClient
      .get('assets/dump.sql', {responseType: 'text'})
      .subscribe((data) => {
        this.sqlPorter
          .importSqlToDb(this.database, data)
          .then((_) => {
            this.getImages();
            this.isDbReady.next(true);
          })
          .catch((error) => console.log(error));
    });
  }

  /************** GET FUNCTIONS **************/
  public getImages() {
    return this.database
      .executeSql('SELECT * FROM PHOTOTABLE', [])
      .then((res) => {
        let items: PhotoInfo[] = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push({
              fileId: res.rows.item(i).FileId,
              filePath: res.rows.item(i).FilePath,
              webviewPath: res.rows.item(i).WebviewPath,
              date: res.rows.item(i).Date,
              latitude: res.rows.item(i).Latitude,
              longitude: res.rows.item(i).Longitude,
              species: res.rows.item(i).Species,
              species_prob: res.rows.item(i).Species_prob,
              notes: res.rows.item(i).Notes,
            });
          }
        }
        this.imageList.next(items);
      });
  }

  public getImage(fileId: number) {
    return this.database
      .executeSql('SELECT * FROM PHOTOTABLE WHERE FileId = ?', [fileId])
      .then((res) => {
        return {
          fileId: res.rows.item(0).FileId,
          filePath: res.rows.item(0).FilePath,
          webviewPath: res.rows.item(0).WebviewPath,
          date: res.rows.item(0).Date,
          latitude: res.rows.item(0).Latitude,
          longitude: res.rows.item(0).Longitude,
          species: res.rows.item(0).Species!,
          species_prob: res.rows.item(0).Species_Prob!,
          notes: res.rows.item(0).Notes,
        }
      });
  }

  /************** INSERT FUNCTIONS **************/
  public insert(image: PhotoInfo) {
    let values = [
      image.fileId,
      image.filePath,
      image.webviewPath,
      image.date,
      image.latitude,
      image.longitude,
      image.notes,
    ];

    return this.database
      .executeSql(
        `INSERT INTO PHOTOTABLE
        (FileId, FilePath, WebviewPath, Date, Latitude, Longitude, Species, Species_Prob, Notes)
        VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?)`, values
      )
      .then((res) => {
        this.getImages();
      });
  }

  /************** UPDATE FUNCTIONS **************/
  public update(image: PhotoInfo) {
    let data = [image.latitude, image.longitude, image.notes];

    return this.database
      .executeSql(
        `UPDATE PHOTOTABLE SET
        Latitude = ?,
        Longitude = ?,
        Notes = ?
        WHERE FileId = ${image.fileId}`, data
      )
      .then((res) => {
        this.getImages();
      });
  }

  public updateSpecies(pred_info: {label: string, prob: number}, fileId: number) {
    let values = [
      pred_info.label,
      pred_info.prob,
      fileId,
    ];

    return this.database
      .executeSql(
        `UPDATE PHOTOTABLE SET Species = ?, Species_Prob = ? WHERE FileId = ?`, values
      )
      .then((res) => {
        this.getImages();
      });
  }

  /************** DELETE FUNCTIONS **************/
  public async delete(fileId: number) {
    return this.database
      .executeSql('DELETE FROM PHOTOTABLE WHERE FileId = ?', [fileId])
      .then((res) => {
        this.getImages();
      });
  }
}
