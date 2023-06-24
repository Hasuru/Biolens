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
  public imageList: any = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    private alertCtrl: AlertController,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'biolens-images.db',
        location: 'default',
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.getPhotoTable();
      });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchImages() : PhotoInfo[] {
    /*this.alertCtrl.create({
      header: 'fetch images',
      message: '' + JSON.stringify(this.imageList),
      buttons: ["Yup"],
    }).then((res) => {res.present();});*/
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
          .catch(async (e) => {
            const alert = await this.alertCtrl.create({
              header: 'DB Alert',
              message: 'Error importing data from dump.sql:\n' + JSON.stringify(e),
              buttons: ['OK'],
            });
            await alert.present();
        });
    });
  }

  /************** GET FUNCTIONS **************/
  public async getImages() {
    const res = await this.database
      .executeSql('SELECT * FROM PHOTOTABLE', []);
    let items: PhotoInfo[] = [];
    if (res.rows.length > 0) {
      for (var i = 0; i < res.rows.length; i++) {
        items.push({
          fileId: res.rows.item(i).PhotoId,
          filePath: res.rows.item(i).FilePath,
          fileWebPath: res.rows.item(i).WebPath,
          date: res.rows.item(i).Date,
          latitude: res.rows.item(i).Latitude,
          longitude: res.rows.item(i).Longitude,
          species: res.rows.item(i).species,
          species_prob: res.rows.item(i).species_prob,
          notes: res.rows.item(i).Notes,
        });
      }
    }
    this.imageList.next(items);
  }

  public async getImage(fileId: number) {
    const response = await this.database
      .executeSql('SELECT * FROM PHOTOTABLE WHERE PhotoId = ?', [fileId]);

    const image:PhotoInfo = {
      fileId: response.rows.item(0).PhotoId,
      filePath: response.rows.item(0).FilePath,
      fileWebPath: response.rows.item(0).WebPath,
      date: response.rows.item(0).Date,
      latitude: response.rows.item(0).Latitude,
      longitude: response.rows.item(0).Longitude,
      species: response.rows.item(0).species,
      species_prob: response.rows.item(0).species_prob,
      notes: response.rows.item(0).Notes,
    };

    return image;
  }

  /************** INSERT FUNCTIONS **************/
  public async insert(image: PhotoInfo) {
    const values = [
      image.fileId,
      image.filePath,
      image.fileWebPath,
      image.date,
      image.latitude,
      image.longitude,
      image.notes,
    ];

    const res = await this.database
      .executeSql(
        `INSERT INTO PHOTOTABLE
        (PhotoId, FilePath, WebPath, Date, Latitude, Longitude, Species, Species_Prob, Notes)
        VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, ?)`, values
      );
    this.getImages();
  }

  /************** UPDATE FUNCTIONS **************/
  public async update(image: PhotoInfo) {
    const data = [image.latitude, image.longitude, image.notes];

    const data_1 = await this.database
      .executeSql(
        `UPDATE PHOTOTABLE SET
        Latitude = ?,
        Longitude = ?,
        Notes = ?
        WHERE PhotoId = ${image.fileId}`, data
      );
    this.getImages();
  }

  public async updateSpecies(pred_info: any, fileId: number) {
    const values = [
      pred_info.label,
      pred_info.prob,
      fileId,
    ];

    const res = await this.database
      .executeSql(
        `UPDATE PHOTOTABLE SET Species = ?, Species_Prob = ? WHERE PhotoId = ?`, values
      );
    this.getImages();
  }

  /************** DELETE FUNCTIONS **************/
  public async delete(fileId: number) {
    const _ = await this.database
      .executeSql('DELETE FROM PHOTOTABLE WHERE PhotoId = ?', [fileId]);
    this.getImages();
  }
}
