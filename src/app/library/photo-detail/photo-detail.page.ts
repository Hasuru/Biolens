import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoInfo, StorageService } from 'src/app/services/storage.service';
import * as Leaflet from 'leaflet';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.page.html',
  styleUrls: ['./photo-detail.page.scss'],
})
export class PhotoDetailPage implements OnInit {
  public selectedPhoto: PhotoInfo = {
    fileId: 0,
    filePath: '',
    fileWebPath: '',
    date: '',
    latitude: 0,
    longitude: 0,
    notes:'',
  };

  public map?: Leaflet.Map;

  constructor(public actionsheetCtrl: ActionSheetController,
              public activatedRoute: ActivatedRoute,
              public storageService: StorageService,) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('photoId')) {
        return;
      }

      const photoId = paramMap.get('photoId');
      this.selectedPhoto = this.storageService.getPhotoById(Number(photoId!))!;
    })
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

  ionViewDidEnter() { this.createMap(); }
  ionViewWillLeave() { this.map?.remove(); }
}
