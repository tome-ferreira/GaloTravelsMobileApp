import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Travel } from 'src/app/models/travel.model';
import { FunctionsService } from 'src/app/services/functions.service';
import { TravelService } from 'src/app/services/travel.service';

@Component({
  selector: 'app-add-travel-location-modal',
  templateUrl: './add-travel-location-modal.component.html',
  styleUrls: ['./add-travel-location-modal.component.scss'],
})
export class AddTravelLocationModalComponent implements OnInit {
  @Input() id!: string; 
  Locs: any;
  inputText: string = '';

  constructor(
    private modalCtrl: ModalController,
    private travelService: TravelService,
    private functions: FunctionsService
  ) {}

  async ngOnInit() {
    await this.getTravelLocs();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async getTravelLocs() {
    try {
      this.Locs = await this.travelService.getTravelLocations();
    } catch (error) {
      await this.functions.presentToast(`Erro ao carregar Localizações`, `danger`);
    }
  }

  selectLocation(location: string) {
    this.inputText = location;
  }

  async saveLoc(){
    try {
      await this.travelService.addTravelLocation(this.id, this.inputText);
    } catch (error) {
      await this.functions.presentToast(`Erro ao adicionar localização`, `danger`);
    }
  }

  async save() {
    if (this.inputText.trim()) {
      const loading = await this.functions.showLoading();
      
      await this.saveLoc();

      loading.dismiss();
      return this.modalCtrl.dismiss(this.inputText, 'save');

      
    }else{
      return null;
    }
  }
}
