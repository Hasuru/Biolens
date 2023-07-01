import { Component, Pipe, PipeTransform } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss']
})
export class LibraryPage {
  public Data: any[] = [];

  constructor(
    private databaseService: DatabaseService,
    private cameraService: CameraService,
    private alertCtrl: AlertController,
    private router: Router) {}

  async ngOnInit() {
    this.databaseService.dbState().subscribe((state) => {
      if(state) {
        this.databaseService.fetchImages().subscribe(item => {
          this.Data = item;
        })
      }
    });
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.databaseService.dbState().subscribe((state) => {
        if(state) {
          this.databaseService.fetchImages().subscribe(item => {
            this.Data = item;
          })
        }
      });
      event.target.complete();
    }, 2000);

    this.alertCtrl.create({
      header: 'library items (outside)',
      message: '' + this.Data[1].fileId,
      buttons: ["ok"],
    }).then((res) => {res.present();});
  }

  public goToDetailPage(photoId: number) {
    const path: string = "/library/" + photoId;
    this.router.navigate([path]);
  }

  public addNewPhotoToStorage() {
    this.cameraService.addNewImage("prompt");
  }
}

@Pipe({name: 'between'})
export class BetweenPipe implements PipeTransform {
  transform(value: number, start: number, end: number): boolean{
    return value > start && value <= end;
  }
}
