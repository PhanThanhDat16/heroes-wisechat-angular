import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const accessToken = this.authService.getAccessToken();
    if (accessToken) {
      return true;
    } else {
      return this.router.parseUrl('/login');
    }
  }
}
