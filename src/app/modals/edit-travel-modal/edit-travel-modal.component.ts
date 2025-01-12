import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Travel } from 'src/app/models/travel.model';
import { FunctionsService } from 'src/app/services/functions.service';
import { TravelService } from 'src/app/services/travel.service';
import { AddTravelLocationModalComponent } from '../add-travel-location-modal/add-travel-location-modal.component';

@Component({
  selector: 'app-edit-travel-modal',
  templateUrl: './edit-travel-modal.component.html',
  styleUrls: ['./edit-travel-modal.component.scss'],
})
export class EditTravelModalComponent  implements OnInit {

  @Input() travel!: Travel; 
  travelForm!: FormGroup;
  Locs: any;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private functions: FunctionsService,
    private travelService: TravelService,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    
    this.travelForm = this.fb.group(
      {
        name: [this.travel.name, Validators.required],
        description: [this.travel.description, Validators.required],
        startDate: [this.travel.startDate, Validators.required],
        endDate: [this.travel.endDate ? this.travel.endDate : null],
        startLocation: [this.travel.startLocation, Validators.required],
        endLocation: [this.travel.endLocation, Validators.required],
        peopleN: [this.travel.peopleN, [Validators.required, Validators.min(1)]],
        totalBudget: [this.travel.totalBudget, [Validators.required, Validators.min(0)]],
      },
      { validators: this.futureDateValidation }
    );

    await this.getTravelLocs();
  }

  
  futureDateValidation(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    if (startDate && startDate <= today) {
      return { startNotFuture: true };
    }

    if (endDate && endDate <= today) {
      return { endNotFuture: true };
    }

    if (startDate && endDate && startDate > endDate) {
      return { startAfterEnd: true };
    }

    return null;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async getTravelLocs(){
    try{
      this.Locs = await this.travelService.getTravelsTravelLocations(this.travel.id);
    }catch(error){
      await this.functions.presentToast(`Erro ao carregar Localizações`, `danger`);
    }
  }

  async submit() {
    if (this.travelForm.valid) {
      

      await this.putTravel(this.travelForm);

      this.modalCtrl.dismiss(this.travelForm, 'save');
    } else {
      console.log('Form is invalid');
    }
  }


  async putTravel(form: FormGroup) {
    var values = form.value;
    const loading = await this.functions.showLoading();

    try{
      await this.travelService.putTravel(this.travel.id, values);
      loading.dismiss();
    }catch (error){
      console.log("erro: ", error);
      loading.dismiss();
      this.functions.presentToast('Erro ao atualizar viagem', 'danger');
    }
  }



  async delete() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja apagar esta viagem? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          },
        },
        {
          text: 'Apagar',
          handler: async () => {
            try {
              const loading = await this.functions.showLoading();
              await this.deleteTravel(this.travel.id);
              loading.dismiss();
              this.modalCtrl.dismiss(null, 'save');
            } catch (error: any) {
              await this.functions.presentToast(error.error, 'danger');
            }
          },
        },
      ],
    });
  
    await alert.present();
  }


  async deleteTravel(id: string){
    try{
      await this.travelService.deleteTravel(id);
    }catch (error){
      await this.functions.presentToast(`Erro ao apagar justificação`, `danger`);
    }
  }


  async openAddTravelLocationModal(Travel: Travel){
    const id = Travel.id;

    const modal = await this.modalCtrl.create({
      component: AddTravelLocationModalComponent,
      componentProps: { id },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'save') {
      const loading = await this.functions.showLoading();
      await this.getTravelLocs();
      loading.dismiss();
    }
  }


















  async deleteTravelLocation(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: 'Tem certeza de que deseja apagar este local de interesse? Esta ação não pode ser desfeita.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          },
        },
        {
          text: 'Apagar',
          handler: async () => {
            try {
              const loading = await this.functions.showLoading();
              await this.deleteTravelLocationService(id);
              await this.getTravelLocs();
              loading.dismiss();
            } catch (error: any) {
              await this.functions.presentToast(error.error, 'danger');
            }
          },
        },
      ],
    });
  
    await alert.present();
  }


  async deleteTravelLocationService(id: string){
    try{
      await this.travelService.deleteTravelLocation(id);
    }catch (error){
      await this.functions.presentToast(`Erro ao apagar justificação`, `danger`);
    }
  }

}






