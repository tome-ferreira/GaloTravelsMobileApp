import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Travel } from 'src/app/models/travel.model';

@Component({
  selector: 'app-detail-travel-modal',
  templateUrl: './detail-travel-modal.component.html',
  styleUrls: ['./detail-travel-modal.component.scss'],
})
export class DetailTravelModalComponent implements OnInit {
  @Input() travel!: Travel;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
