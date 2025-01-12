import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateTravelModalComponent } from 'src/app/modals/create-travel-modal/create-travel-modal.component';
import { DetailTravelModalComponent } from 'src/app/modals/detail-travel-modal/detail-travel-modal.component';
import { EditTravelModalComponent } from 'src/app/modals/edit-travel-modal/edit-travel-modal.component';
import { Travel } from 'src/app/models/travel.model';
import { FunctionsService } from 'src/app/services/functions.service';
import { TravelService } from 'src/app/services/travel.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  TravlesList: any;

  constructor(
    private modalCtrl: ModalController, 
    private travelService: TravelService,
    private functions: FunctionsService
  ) {}

  async ngOnInit(){
    const loading = await this.functions.showLoading();

    try {
      await Promise.all([
        this.loadTravels(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      loading.dismiss();
    }
  }

  async loadTravels(){
    try{
      this.TravlesList = await this.travelService.getTravels();
      console.log(this.TravlesList);
    }catch(error){
      await this.functions.presentToast(`Erro ao carregar viagens`, `danger`);
    }
  }

  async openCreateTravelModal(){
    const modal = await this.modalCtrl.create({
      component: CreateTravelModalComponent,
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save') {
      const loading = await this.functions.showLoading();
      await this.loadTravels();
      loading.dismiss();
    }
  }

  async openTravelDetail(travel: Travel) {
    const modal = await this.modalCtrl.create({
      component: DetailTravelModalComponent,
      componentProps: { travel },
    });
    await modal.present();
  }

  async openEditTravelModal(travel: Travel) {
    console.log("open ativo");
    console.log(travel);

    const modal = await this.modalCtrl.create({
      component: EditTravelModalComponent,
      componentProps: { travel },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save') {
      const loading = await this.functions.showLoading();
      await this.loadTravels();
      loading.dismiss();
    }
  }
}





