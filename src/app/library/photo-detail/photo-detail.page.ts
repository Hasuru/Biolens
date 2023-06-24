import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoInfo, StorageService } from 'src/app/services/storage.service';
import * as Leaflet from 'leaflet';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { TensorflowService } from 'src/app/services/tensorflow.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.page.html',
  styleUrls: ['./photo-detail.page.scss'],
})
export class PhotoDetailPage implements OnInit {
  @ViewChild('imgEl') imgEl: ElementRef = {} as ElementRef;
  private photoId: string = '';
  public selectedPhoto: PhotoInfo;
  public map?: Leaflet.Map;

  constructor(public actionsheetCtrl: ActionSheetController,
              public activatedRoute: ActivatedRoute,
              public storageService: StorageService,
              public tensorflowService: TensorflowService,
              public databaseService: DatabaseService,
              public alertCtrl: AlertController,) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(async paramMap => {
      if (!paramMap.has('photoId')) {
        return;
      }

      this.photoId = paramMap.get('photoId')!;
      this.databaseService.getImage(+this.photoId)
      .then((res) => {
        this.selectedPhoto = res;
      });
    });
  }

  handleRefresh(event:any) {
    setTimeout(async () => {
      this.databaseService.getImage(+this.photoId)
      .then((res) => {
        this.selectedPhoto = res;
      });
      event.target.complete();
    }, 2000);
    this.alertCtrl.create({
      header: 'Image Evaluation Results',
      message: '' + this.selectedPhoto.species + ' / ' + this.selectedPhoto.species_prob,
      buttons: ['NICE'],
    }).then((res) => {res.present();});
  }

  public async actionSheet() {
    const actionSheet = await this.actionsheetCtrl.create({
      header: 'Photos',
      buttons:[{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.storageService.deletePhotoFromStorage(this.selectedPhoto);
        }
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {/* do nothing */}
      }]
    });

    await actionSheet.present();
  }

  public createMap() {
    this.map = Leaflet.map('mapId').setView([
      this.selectedPhoto.latitude,
      this.selectedPhoto.longitude,
    ], 15);

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Test Map',
    }).addTo(this.map);

    Leaflet.marker([
      this.selectedPhoto.latitude,
      this.selectedPhoto.longitude
    ]).addTo(this.map);
  }

  ionViewDidEnter() {
    if (navigator.onLine) {
      this.createMap();
    }
  }

  ionViewWillLeave() { this.map?.remove(); }

  async makePrediction() {
    const img = this.imgEl.nativeElement;
    const pred_info = await this.tensorflowService.getPrediction(img);

    this.alertCtrl.create({
      header: 'Image Evaluation Results',
      message: '' + pred_info.label + ' / ' + pred_info.prob,
      buttons: ['NICE'],
    }).then((res) => {res.present();});

    this.databaseService.updateSpecies(pred_info, this.selectedPhoto.fileId);
  }
}
