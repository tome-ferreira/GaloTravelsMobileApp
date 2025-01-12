import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private functions: FunctionsService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {}

  async onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form Submitted:', this.loginForm.value);
      await this.login(this.loginForm);
    } else {
      console.log('Form Invalid');
    }
  }

  async login(form: FormGroup) {
    var credentials = form.value;
    const loading = await this.functions.showLoading();
    
    this.authService.login(credentials).subscribe({
      next: async (response) => {

        await this.authService.setToken(response.token);
        console.log('Login bem sucedido ', response);
        await this.authService.setRememberUser(true);
        loading.dismiss();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        loading.dismiss();
        this.functions.presentToast('Tentativa de login inválida!', 'dnager');
      },
    });
  }

  async goToRegister(){
    this.router.navigate(['/register']);
  }

}
