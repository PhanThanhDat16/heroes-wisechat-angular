import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const accessToken = authService.getAccessToken();

  if (accessToken) {
    authService.verifyAccessToken(accessToken).subscribe({
      next: (data) => {
        console.log(data);
        return true;
      },
      error: (error) => {
        console.log(error);
        window.location.href = '/login';
        return false;
      },
    });
  } else {
    window.location.href = '/login';
    return false;
  }
  return true;
};
