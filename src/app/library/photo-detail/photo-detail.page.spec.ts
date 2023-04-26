import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoDetailPage } from './photo-detail.page';

describe('PhotoDetailPage', () => {
  let component: PhotoDetailPage;
  let fixture: ComponentFixture<PhotoDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PhotoDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
