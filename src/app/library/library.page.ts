import { Component } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { PhotoInfo, StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss']
})
export class LibraryPage {
  public imageList: PhotoInfo[] = [];
  public test: PhotoInfo;

  constructor(private router: Router,
              public cameraService:CameraService,
              public storageService:StorageService,
              public databaseService: DatabaseService,
              private alertCtrl: AlertController) {}

  ngOnInit() {
    this.imageList = this.databaseService.fetchImages();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.imageList = this.databaseService.fetchImages();
      event.target.complete();
    }, 2000);
    this.alertCtrl.create({
      header: 'fetch images',
      message: '' + this.imageList[0].fileId,
      buttons: ["Yup"],
    }).then((res) => {res.present();});
  }

  public goToDetailPage(photoId: number) {
    const path: string = "/library/" + photoId;
    this.router.navigate([path]);
  }

  public uploadNewImage() {
    this.cameraService.addNewImage("photos");
  }

  public deleteStorage() {
    this.storageService.deleteAllImages();
  }
}
