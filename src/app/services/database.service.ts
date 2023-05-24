import { Injectable } from '@angular/core';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLiteObject } from '@ionic-native/sqlite';
import { PhotoInfo } from './storage.service';
import { AlertController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  public database?: SQLiteObject;

  // constructor creates db if it does not exists, else use the one already there
  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    private alertCtrl: AlertController,
  ) {
    this.platform.ready().then(() => {
      return this.sqlite.create({
        name: 'biolens-images.db',
        location: 'default',
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.getPhotoTable();
      }).catch(async (e) => {
        const alert = await this.alertCtrl.create({
          header: 'DB Alert',
          message: 'Error Creating DB: ' + JSON.stringify(e),
          buttons: ['OK'],
        });
        await alert.present();
      });
    });
  }

  public getPhotoTable() {
    this.httpClient.get(
      'assets/dump.sql',
      {responseType: 'text'}
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.database, data).catch(async (e) => {
        const alert = await this.alertCtrl.create({
          header: 'DB Alert',
          message: 'Error importing data from dump.sql:\n' + JSON.stringify(e),
          buttons: ['OK'],
        });
        await alert.present();
      });
    });
  }

  public insert(image: PhotoInfo) {
    const values = [
      image.fileId,
      image.filePath,
      image.fileWebPath,
      image.date,
      image.latitude,
      image.longitude,
      image.notes,
    ];

    this.database!.executeSql(
      `INSERT INTO PHOTOTABLE
      (PhotoId, FilePath, WebPath, Date, Latitude, Longitude, Notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      values
    ).then(async () => {
      const alert = await this.alertCtrl.create({
        header: 'DB Alert',
        message: 'New Data added to DB',
        buttons: ['OK'],
      });
      await alert.present();
    }).catch(async (e) => {
      const alert = await this.alertCtrl.create({
        header: 'DB Alert',
        message: 'Error adding new data to DB: ' + JSON.stringify(e),
        buttons: ['OK'],
      });
      await alert.present();
    })
  }

  public delete(image:PhotoInfo) {
    this.database!.executeSql(
      'DELETE FROM PHOTOTABLE WHERE PhotoId = ?', [image.fileId]
    ).then(_ => {
      this.getImages();
    }).catch(async (e) => {
      const alert = await this.alertCtrl.create({
        header: 'DB Alert',
        message: 'Error deleting data to DB: ' + JSON.stringify(e),
        buttons: ['OK'],
      });
      await alert.present();
    });
  }

  public getImages() {
    var imageList: PhotoInfo[] = [];

    this.database!.executeSql(
      'SELECT * FROM PHOTOTABLE', []
    ).then( response => {
      if (response.rows.length > 0) {
        for (var i  = 0; i < response.rows.length; i++) {
          imageList.push({
            fileId: response.rows.item(i).PhotoId,
            filePath: response.rows.item(i).FilePath,
            fileWebPath: response.rows.item(i).WebPath,
            date: response.rows.item(i).Date,
            latitude: response.rows.item(i).Latitude,
            longitude: response.rows.item(i).Longitude,
            notes: response.rows.item(i).Notes,
          });
        }
      }
    }).catch(async (e) => {
      const alert = await this.alertCtrl.create({
        header: 'DB Alert',
        message: 'Error on getting Images List: ' + JSON.stringify(e),
        buttons: ['OK'],
      });
      await alert.present();
    });

    return imageList;
  }

  public update(image: PhotoInfo) {
    const data = [image.latitude, image.longitude, image.notes];

    this.database!.executeSql(
      `UPDATE PHOTOTABLE SET
      Latitude = ?,
      Longitude = ?,
      Notes = ?
      WHERE PhotoId = ${image.fileId}`, data
    ).then(_ => {
      this.getImages();
    }).catch (async (e) => {
      const alert = await this.alertCtrl.create({
        header: 'DB Alert',
        message: 'Error on updating image: ' + JSON.stringify(e),
        buttons: ['OK'],
      });
      await alert.present();
    });
  }
}
