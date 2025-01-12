import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PassTravelLocationComment } from 'src/app/models/pass-travel-location.model';
import { TravelLocation } from 'src/app/models/travel-location.model';
import { CommentsService } from 'src/app/services/comments.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { TravelService } from 'src/app/services/travel.service';

@Component({
  selector: 'app-travel-location-comments-modal',
  templateUrl: './travel-location-comments-modal.component.html',
  styleUrls: ['./travel-location-comments-modal.component.scss'],
})
export class TravelLocationCommentsModalComponent  implements OnInit {
  @Input() travelLocation!: any;
  Comments: any;
  commentText: string = '';


  constructor(
    private modalCtrl: ModalController, 
    private travelService: TravelService,
    private functions: FunctionsService,
    private commentService: CommentsService
  ) { }

  async ngOnInit() {
    

    const loading = await this.functions.showLoading();
    console.log(this.travelLocation)
    await this.getTravelComments();
    this.sortComments();
    loading.dismiss();
  }

  sortComments() {
    this.Comments.sort((a: { madeAt: string | number | Date; }, b: { madeAt: string | number | Date; }) => new Date(b.madeAt).getTime() - new Date(a.madeAt).getTime());
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

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }


  async getTravelComments(){
    try{
      console.log("id: ", this.travelLocation.Id)
      this.Comments = await this.commentService.getTravelLocationComments(this.travelLocation.id);
    }catch(error){
      await this.functions.presentToast(`Erro ao carregar comentários`, `danger`);
    }
  }


  async postComment(comment: PassTravelLocationComment){
      try{
        await this.commentService.postTravelLocationComment(comment);
      }catch(error){
        await this.functions.presentToast(`Erro ao postar comentário`, `danger`);
      }
    }
  
    
  
    async post(){
      if (!this.commentText.trim()) {
        await this.functions.presentToast('O comentário não pode estar vazio.', 'danger');
        return;
      }

      const comment: PassTravelLocationComment = {
        travelLocationId: this.travelLocation.id, 
        content: this.commentText 
      };
  
      const loading = await this.functions.showLoading();
      await this.postComment(comment);
      await this.getTravelComments();
      this.commentText = "";
      loading.dismiss();
    }

  
}
