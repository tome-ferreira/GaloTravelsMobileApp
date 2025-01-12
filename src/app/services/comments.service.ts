import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { RecieveTravelComment } from '../models/recieve-travel-comment.model';
import { PassTravelComment } from '../models/pass-travel-comment.model';
import { RecieveTravelLocationComment } from '../models/recive-travel-location-comment.model';
import { PassTravelLocationComment } from '../models/pass-travel-location.model';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(
      private http: HttpClient, 
      private authService: AuthService,
      private router: Router
    ) { }
  
    private API_URL = 'https://localhost:7274/api/';
    //private API_URL = 'https://api.gatekeeper.xiscard.eu/api/';


    async getTravelsComments(id: string){
        return this.authService.getToken().then((token: string) => {
          if (!token) {
            this.router.navigate(['/pages/login']); 
            return Promise.reject('No token available. Redirecting to login...');
          }
      
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          });
      
          
      
          return this.http
            .get<RecieveTravelComment[]>(
              `${this.API_URL}Comments/GetTravelComments/${id}`, 
              { headers } 
            )
            .toPromise()
            .catch((error) => {
              if (error.status === 401) {
                // Redirect to login on unauthorized error
                this.router.navigate(['/pages/login']);
                console.error('Unauthorized. Redirecting to login...');
              }
              throw error; // Re-throw the error for further handling
            });
        });
      }


      async postTravelComment(comment: PassTravelComment){
        return this.authService.getToken().then((token: string) => {
          if (!token) {
            this.router.navigate(['/pages/login']); 
            return Promise.reject('No token available. Redirecting to login...');
          }
      
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          });
      
          
      
          return this.http
            .post<PassTravelComment>(
              `${this.API_URL}Comments/PostTravelComment/`, 
              comment,
              { headers } 
            )
            .toPromise()
            .catch((error) => {
              if (error.status === 401) {
                // Redirect to login on unauthorized error
                this.router.navigate(['/pages/login']);
                console.error('Unauthorized. Redirecting to login...');
              }
              throw error; // Re-throw the error for further handling
            });
        });
      }


      async getTravelLocationComments(id: string){
        return this.authService.getToken().then((token: string) => {
          if (!token) {
            this.router.navigate(['/pages/login']); 
            return Promise.reject('No token available. Redirecting to login...');
          }
      
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          });
      
          
      
          return this.http
            .get<RecieveTravelLocationComment[]>(
              `${this.API_URL}Comments/GetLocationTravelComments/${id}`, 
              { headers } 
            )
            .toPromise()
            .catch((error) => {
              if (error.status === 401) {
                // Redirect to login on unauthorized error
                this.router.navigate(['/pages/login']);
                console.error('Unauthorized. Redirecting to login...');
              }
              throw error; // Re-throw the error for further handling
            });
        });
      }




      async postTravelLocationComment(comment: PassTravelLocationComment){
        return this.authService.getToken().then((token: string) => {
          if (!token) {
            this.router.navigate(['/pages/login']); 
            return Promise.reject('No token available. Redirecting to login...');
          }
      
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`, 
            'Content-Type': 'application/json',
          });
      
          console.log("Chegou ao service", comment)
          
          return this.http
            .post<PassTravelLocationComment>(
              `${this.API_URL}Comments/PostTravelLocationComment/`, 
              comment,
              { headers } 
            )
            .toPromise()
            .catch((error) => {
              if (error.status === 401) {
                // Redirect to login on unauthorized error
                this.router.navigate(['/pages/login']);
                console.error('Unauthorized. Redirecting to login...');
              }
              throw error; // Re-throw the error for further handling
            });
        });
      }



}
