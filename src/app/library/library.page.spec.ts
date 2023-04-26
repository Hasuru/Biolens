import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { LibraryPage } from './library.page';

describe('LibraryPage', () => {
  let component: LibraryPage;
  let fixture: ComponentFixture<LibraryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LibraryPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LibraryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
