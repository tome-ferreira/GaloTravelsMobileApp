import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-usage-terms-modal',
  templateUrl: './usage-terms-modal.component.html',
  styleUrls: ['./usage-terms-modal.component.scss'],
})
export class UsageTermsModalComponent  implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
