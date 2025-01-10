import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn =async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isValid = await authService.isTokenValid();

  if (isValid) {
    return true;
  } else {
    console.log('Access denied. Redirecting to login...');
    router.navigate(['/login']);
    return false;
  }
};
