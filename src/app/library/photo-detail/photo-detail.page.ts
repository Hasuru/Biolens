import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PhotoInfo, StorageService } from 'src/app/services/storage.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.page.html',
  styleUrls: ['./photo-detail.page.scss'],
})
export class PhotoDetailPage implements OnInit {
  public selectedPhoto: PhotoInfo = {
    photoId: 0,
    photoUrl: '',
    fileName: '',
    day: 0,
    month: 0,
    year: 0,
    latitude: 0,
    longitude: 0,
    notes:'',
  };

  public map?: Leaflet.Map;

  constructor(public activatedRoute: ActivatedRoute,
              public storageService: StorageService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('photoId')) {
        return;
      }

      const photoId = paramMap.get('photoId');
      this.selectedPhoto = this.storageService.getPhotoById(Number(photoId!))!;
      console.log(this.selectedPhoto);
    })
  }

  ionViewDidEnter() { this.leafletMap(); }

  leafletMap() {
    this.map = Leaflet.map('mapId').setView([this.selectedPhoto.latitude, this.selectedPhoto.longitude], 10);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'edupala.com © Angular LeafLet',
    }).addTo(this.map);

    //const markPoint = Leaflet.marker([this.selectedPhoto.latitude, this.selectedPhoto.longitude]).addTo(this.map);
    //this.map.addLayer(markPoint);
  }

  ionViewWillLeave() {
    this.map?.remove();
  }
}
