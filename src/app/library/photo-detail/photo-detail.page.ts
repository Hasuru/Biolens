import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PhotoInfo, StorageService } from 'src/app/services/storage.service';
import * as Leaflet from 'leaflet';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { TensorflowService } from 'src/app/services/tensorflow.service';
import { DatabaseService } from 'src/app/services/database.service';
import { Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.page.html',
  styleUrls: ['./photo-detail.page.scss'],
})
export class PhotoDetailPage implements OnInit {
  public DIRPATH = Directory.Data;

  @ViewChild('imgEl') imgEl: ElementRef = {} as ElementRef;
  private photoId: string = '';
  public selectedPhoto: PhotoInfo;
  public probPercent: number;
  private map?: Leaflet.Map;

  // this is stupid but dont have much more time
  public green: boolean = false;
  public orange: boolean = false;
  public red: boolean = false;

  constructor(
    private actionsheetCtrl: ActionSheetController,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private tensorflowService: TensorflowService,
    private databaseService: DatabaseService,
    private router: Router,
    private alertCtrl: AlertController,
    ) {
      this.photoId = this.activatedRoute.snapshot.paramMap.get('photoId')!;
      this.databaseService.getImage(+this.photoId)
        .then(image => {
          this.selectedPhoto = image;
          if (this.selectedPhoto.species_prob) {
            this.probPercent = Math.floor(this.selectedPhoto.species_prob*100);
            if (this.selectedPhoto.species_prob > 0.65) this.green = true;
            else if (this.selectedPhoto.species_prob > 0.45 && this.selectedPhoto.species_prob <= 0.65) this.orange = true;
            else this.red = true;
          }
        });
    }

  ngOnInit() {
    this.selectedPhoto = {
      fileId: 0,
      filePath: '',
      webviewPath: '',
      date: '',
      latitude: 0,
      longitude: 0,
      species: undefined,
      species_prob: undefined,
      notes: '',
    };
  }

  handleRefresh(event:any) {
    setTimeout(async () => {
      this.databaseService.getImage(+this.photoId)
      .then(image => {
        this.selectedPhoto = image;
        if (this.selectedPhoto.species_prob) {
          this.probPercent = Math.floor(this.selectedPhoto.species_prob*100);
        }
      });
      event.target.complete();
    }, 2000);
  }

  public async deleteSheet() {
    const deleteSheet = await this.actionsheetCtrl.create({
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

    await deleteSheet.present();
  }

  public createMap() {
    this.map = Leaflet.map('mapId').setView([
      this.selectedPhoto.latitude,
      this.selectedPhoto.longitude,
    ], 15);

    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Location Taken',
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

  makePrediction() {
    const img = this.imgEl.nativeElement;
    this.tensorflowService.model.classify(img).then((pred:any) => {
      let length = +JSON.stringify(pred.length);
      let label: string = '';
      let prob: number = 0;

      for (let i = 0; i < length; i++) {
        if (+JSON.stringify(pred[i].prob) > prob) {
          prob = +JSON.stringify(pred[i].prob);
          label = pred[i].label;
        }
      }

      if (prob >= 0.2) {
        this.databaseService.updateSpecies({prob, label}, +this.photoId)
          .then(_ => {
            this.router.navigate(['/library']);
          });
      } else {
        this.alertCtrl.create({
          header: "Image Evaluation",
          message: "Model could not evaluate species in question",
          buttons: ['Ok'],
        }).then(res => res.present());
      }
    });
  }
}
