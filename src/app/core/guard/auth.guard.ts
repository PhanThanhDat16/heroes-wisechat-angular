import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const accessToken = authService.getAccessToken();
  
  if(accessToken){
     authService.verifyAccessToken(accessToken).subscribe({
      next: (data) => {
        console.log(data)
        return true
      },
      error: (error) => {
        console.log(error)
        return router.parseUrl('/login')
      }
     })
  }else{
    return router.parseUrl('/login')
  }
  return true
};



