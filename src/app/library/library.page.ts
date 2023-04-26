import { Component } from '@angular/core';
import { CameraService } from '../services/camera.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: 'library.page.html',
  styleUrls: ['library.page.scss']
})
export class LibraryPage {

  constructor(private router: Router,
              public cameraService:CameraService,
              public storageService:StorageService) {}

  public goToDetailPage(photoId: string) {
    const path: string = "/library/" + photoId;
    this.router.navigate([path]);
  }
}
