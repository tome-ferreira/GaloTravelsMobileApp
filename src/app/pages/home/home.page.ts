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
  momentDateTime: Date;
  today: Date;
  travelToday: any;

  constructor(
    private modalCtrl: ModalController, 
    private travelService: TravelService,
    private functions: FunctionsService
  ) {
    this.momentDateTime = new Date();
    this.today = new Date();
  }

  async ngOnInit(){
    const loading = await this.functions.showLoading();

    try {
      await Promise.all([
        this.loadTravels(),
        this.loadTravelsToday()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      loading.dismiss();
    }
  }

  async loadTravelsToday(){
    try{
      this.travelToday = await this.travelService.getTravelsToday(this.momentDateTime);
    }catch(error){
      await this.functions.presentToast(`Erro ao carregar turnos`, `danger`);
    }
  }


  async Next() {
    const loading = await this.functions.showLoading();
    this.momentDateTime = new Date(this.momentDateTime.setDate(this.momentDateTime.getDate() + 1));
    await this.loadTravelsToday();
    loading.dismiss();
  }
  
  async Previous() {
    const loading = await this.functions.showLoading();
    this.momentDateTime = new Date(this.momentDateTime.setDate(this.momentDateTime.getDate() - 1));
    await this.loadTravelsToday();
    loading.dismiss();
  }

  getDateLabel(): string {
    const current = new Date(this.momentDateTime);
    const today = new Date(this.today);
    const tomorrow = new Date(this.today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(this.today);
    yesterday.setDate(today.getDate() - 1);
  
    // Compare the dates (ignoring time)
    if (
      current.getDate() === today.getDate() &&
      current.getMonth() === today.getMonth() &&
      current.getFullYear() === today.getFullYear()
    ) {
      return 'Hoje'; // Today
    } else if (
      current.getDate() === tomorrow.getDate() &&
      current.getMonth() === tomorrow.getMonth() &&
      current.getFullYear() === tomorrow.getFullYear()
    ) {
      return 'Amanhã'; // Tomorrow
    } else if (
      current.getDate() === yesterday.getDate() &&
      current.getMonth() === yesterday.getMonth() &&
      current.getFullYear() === yesterday.getFullYear()
    ) {
      return 'Ontem'; // Yesterday
    } else {
      // Fallback to formatted date if none match
      return current.toLocaleDateString('pt-PT');
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





