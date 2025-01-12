import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TravelLocationCommentsModalComponent } from './travel-location-comments-modal.component';

describe('TravelLocationCommentsModalComponent', () => {
  let component: TravelLocationCommentsModalComponent;
  let fixture: ComponentFixture<TravelLocationCommentsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelLocationCommentsModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TravelLocationCommentsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
