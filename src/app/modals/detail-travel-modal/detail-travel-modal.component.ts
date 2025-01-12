import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassTravelComment } from 'src/app/models/pass-travel-comment.model';
import { TravelLocation } from 'src/app/models/travel-location.model';
import { Travel } from 'src/app/models/travel.model';
import { CommentsService } from 'src/app/services/comments.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { TravelService } from 'src/app/services/travel.service';
import { TravelLocationCommentsModalComponent } from '../travel-location-comments-modal/travel-location-comments-modal.component';

@Component({
  selector: 'app-detail-travel-modal',
  templateUrl: './detail-travel-modal.component.html',
  styleUrls: ['./detail-travel-modal.component.scss'],
})
export class DetailTravelModalComponent implements OnInit {
  @Input() travel!: Travel;

  Locs: any;
  Comments: any;
  commentText: string = '';

  constructor(
    private modalCtrl: ModalController, 
    private travelService: TravelService,
    private functions: FunctionsService,
    private commentService: CommentsService
  ) {}

  async ngOnInit() {
    const loading = await this.functions.showLoading();
    await this.getTravelLocs();
    await this.getTravelComments();
    this.sortComments();
    loading.dismiss();
  }

  sortComments() {
    this.Comments.sort((a: { madeAt: string | number | Date; }, b: { madeAt: string | number | Date; }) => new Date(b.madeAt).getTime() - new Date(a.madeAt).getTime());
  }

  async getTravelLocs(){
    try{
      this.Locs = await this.travelService.getTravelsTravelLocations(this.travel.id);
    }catch(error){
      await this.functions.presentToast(`Erro ao carregar Localizações`, `danger`);
    }
  }

  async getTravelComments(){
    try{
      this.Comments = await this.commentService.getTravelsComments(this.travel.id);
    }catch(error){
      await this.functions.presentToast(`Erro ao carregar comentários`, `danger`);
    }
  }

  async postComment(comment: PassTravelComment){
    try{
      await this.commentService.postTravelComment(comment);
    }catch(error){
      await this.functions.presentToast(`Erro ao postar comentário`, `danger`);
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async post(){
    if (!this.commentText.trim()) {
      await this.functions.presentToast('O comentário não pode estar vazio.', 'danger');
      return;
    }

    const comment: PassTravelComment = {
      travelId: this.travel.id, 
      content: this.commentText 
    };

    const loading = await this.functions.showLoading();
    await this.postComment(comment);
    await this.getTravelComments();
    this.commentText = "";
    loading.dismiss();
  }

  getTimeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (seconds < 60) {
      return `${seconds} segundos atrás`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} minuto${minutes > 1 ? 's' : ''} arás`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else {
      const days = Math.floor(seconds / 86400);
      return `${days} dia${days > 1 ? 's' : ''} atrás`;
    }
  }

  async openTravelLocationCommentsModal(travelLocation: TravelLocation){
    const modal = await this.modalCtrl.create({
          component: TravelLocationCommentsModalComponent,
          componentProps: { travelLocation },
        });
        await modal.present();
    
        const { data, role } = await modal.onWillDismiss();
    
        if (role === 'save') {
          
        }
  }
}
