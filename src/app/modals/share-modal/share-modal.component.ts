import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { share } from 'rxjs';
import { PassShares } from 'src/app/models/pass-shares.model';
import { Travel } from 'src/app/models/travel.model';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { TravelService } from 'src/app/services/travel.service';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss'],
})
export class ShareModalComponent implements OnInit {
  @Input() travel!: Travel; 
  users: any;
  selectedUsers: string[] = []; // Array to store selected usernames

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private functions: FunctionsService,
    private travelService: TravelService
  ) {}

  async ngOnInit() {
    const loading = await this.functions.showLoading();
    await this.loadUsers();
    loading.dismiss();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async loadUsers() {
    try {
      this.users = await this.authService.getUsers(this.travel.id);
      console.log(this.users);
    } catch (error) {
      await this.functions.presentToast(`Erro ao carregar utilizadores`, `danger`);
    }
  }

  async processSelectedUsers() {
    const passShares: PassShares = {
      travelId: this.travel.id,  
      users: this.selectedUsers
    };

    await this.postShares(passShares);

    this.modalCtrl.dismiss(null, 'save');
  }

  async postShares(shares: PassShares){
    const loading = await this.functions.showLoading();
    try{
      await this.travelService.postShares(shares);
      loading.dismiss();
    }catch (error){
      console.log("erro: ", error);
      loading.dismiss();
      this.functions.presentToast('Erro ao atualizar viagem', 'danger');
    }
  }

  isChecked(username: string): boolean {
    return this.selectedUsers.includes(username);
  }

  toggleSelection(username: string) {
    if (this.selectedUsers.includes(username)) {
      this.selectedUsers = this.selectedUsers.filter((user) => user !== username);
    } else {
      this.selectedUsers.push(username);
    }
  }
}
