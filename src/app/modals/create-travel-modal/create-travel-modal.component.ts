import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunctionsService } from 'src/app/services/functions.service';
import { TravelService } from 'src/app/services/travel.service';

@Component({
  selector: 'app-create-travel-modal',
  templateUrl: './create-travel-modal.component.html',
  styleUrls: ['./create-travel-modal.component.scss'],
})
export class CreateTravelModalComponent implements OnInit {
  travelForm: any;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private functions: FunctionsService,
    private travelService: TravelService
  ) {}

  ngOnInit() {
    this.travelForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: [''],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required],
      peopleN: ['', [Validators.required, Validators.min(1)]],
      totalBudget: ['', [Validators.required, Validators.min(0)]],
    },
    { validators: this.futureDateValidation }
    );
  }
  // Valida que as datas não são impossiveis 
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

  async submit() {
    if (this.travelForm.valid) {
      const travelDTO = this.travelForm.value;

      console.log(travelDTO);

      await this.postTravel(this.travelForm);

      this.modalCtrl.dismiss(travelDTO, 'save');
    } else {
      console.log('Form is invalid');
    }
  }



  async postTravel(form: FormGroup) {
    var values = form.value;
    const loading = await this.functions.showLoading();

    try{
      await this.travelService.postTravel(values);
      loading.dismiss();
    }catch (error){
      console.log("erro: ", error);
      loading.dismiss();
      this.functions.presentToast('Erro ao criar viagem', 'dnager');
    }
  }
}










