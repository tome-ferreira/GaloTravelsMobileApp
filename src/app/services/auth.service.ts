import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginInfo } from '../models/login-info.model';
import { LoginResponse } from '../models/login-response.model';
import { RegisterInfo } from '../models/register-info.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private TOKEN_KEY = 'jwt-token';
  private REMEMBER_KEY = 'remember-user';
  private COMPANY_KEY = 'company-info';

  constructor(private storage: Storage, private http: HttpClient, private router: Router) {
    this.init();
  }
 
  
  private API_URL = environment.apiUrl;

  async init() {
    await this.storage.create();
  }

  // Token methods
  async setToken(token: string) {
    await this.storage.set(this.TOKEN_KEY, token);
  }

  public async getToken() {
    return await this.storage.get(this.TOKEN_KEY);
  }

  async clearToken() {
    await this.storage.remove(this.TOKEN_KEY);
  }

  // Preference methods
  async setRememberUser(remember: boolean) {
    await this.storage.set(this.REMEMBER_KEY, remember);
  }

  async getRememberUser() {
    return await this.storage.get(this.REMEMBER_KEY);
  }

  async clearPreferences() {
    await this.storage.remove(this.REMEMBER_KEY);
  }

  login(credentials: LoginInfo) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var response = this.http.post<LoginResponse>(`${this.API_URL}Account/Login`, credentials, { headers });
    return response;
  }

  register(credentials: RegisterInfo) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    var response = this.http.post<LoginResponse>(`${this.API_URL}Account/Register`, credentials, { headers });
    return response;
  }

  async isTokenValid(): Promise<boolean> {
    const token = await this.getToken();
  
    if (!token) {
      return false; // Não há token para validar
    }
  
    try {
      //  chamada à API para validar o token
      const response = await fetch(`${this.API_URL}Account/validate-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
        },
      });
  
      if (response.ok) {
        return true; // O token é válido
      } else {
        return false; // O token foi rejeitado
      }
    } catch (error) {
      return false;
    }
  }


  async getUsers(travelId: string){
    return this.getToken().then((token: string) => {
              if (!token) {
                this.router.navigate(['/pages/login']); 
                return Promise.reject('No token available. Redirecting to login...');
              }
          
              const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json',
              });
          
              
          
              return this.http
                .get<string[]>(
                  `${this.API_URL}Account/GetUsers/${travelId}`, 
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
