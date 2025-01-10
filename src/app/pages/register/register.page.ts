import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private functions: FunctionsService) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      //console.log('Form Submitted:', this.registerForm.value);
      await this.register(this.registerForm);
    } else {
      console.log('Form is invalid');
    }
  }

  async register(form: FormGroup) {
    var credentials = form.value;
    const loading = await this.functions.showLoading();
    
    this.authService.register(credentials).subscribe({
      next: async (response) => {

        await this.authService.setToken(response.token);
        console.log('Login bem sucedido ', response);
        await this.authService.setRememberUser(false);
        loading.dismiss();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        loading.dismiss();
        this.functions.presentToast('Erro ao criar conta!', 'dnager');
      },
    });
  }
}
