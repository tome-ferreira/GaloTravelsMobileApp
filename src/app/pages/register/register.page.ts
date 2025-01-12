import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordsMatchValidator } // Add the custom validator here
    );
  }

  // Custom validator to check if passwords match
  passwordsMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      await this.register(this.registerForm);
    } else {
      console.log('Form is invalid');
    }
  }

  async register(form: FormGroup) {
    const credentials = form.value;

    const loading = await this.functions.showLoading();

    this.authService.register(credentials).subscribe({
      next: async (response) => {
        await this.authService.setToken(response.token);
        console.log('Login bem sucedido ', response);
        await this.authService.setRememberUser(true);
        loading.dismiss();
        this.router.navigate(['/home']);
      },
      error: async (err) => {
        loading.dismiss();
        console.log('Registration error:', err);
      },
    });
  }
}
