import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateTravel } from '../models/create-travel.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Travel } from '../models/travel.model';

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) { }

  private API_URL = 'https://localhost:7274/api/';
  //private API_URL = 'https://api.gatekeeper.xiscard.eu/api/';


  async postTravel(travel: CreateTravel) {
    return this.authService.getToken().then((token: string) => {
      if (!token) {
        this.router.navigate(['/pages/login']); 
        return Promise.reject('No token available. Redirecting to login...');
      }
  
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
      });
  
      //console.log("token no service: ", token)
  
      return this.http
        .post<CreateTravel>(
          `${this.API_URL}Travels/PostTravel`,
          travel, 
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



  async putTravel(id: string, travel: CreateTravel){
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
      .put<CreateTravel>(
        `${this.API_URL}Travels/PutTravel/${id}`, 
        travel, 
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


  async deleteTravel(id: string){
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
      .delete<string>(
        `${this.API_URL}Travels/DeleteTravel/${id}`, 
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

  async getTravels(){
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
        .get<Travel[]>(
          `${this.API_URL}Travels/GetTravels`, 
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
