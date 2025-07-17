import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IAuth } from '../../features/auth/model/auth';
import { logout } from '../store/hero/hero.actions';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:3001/api/auth';

  constructor(private http: HttpClient, private store: Store) {}

  loginService(auth: IAuth) {
    return this.http
      .post<any>(`${this.URL}/login`, auth)
      .pipe(map((data) => data.data));
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken;
  }

  getRefreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken;
  }

  verifyAccessToken(accessToken: string) {
    return this.http.post<any>(`${this.URL}/access-token`, { accessToken });
  }

  refreshToken(refreshToken: string) {
    return this.http
      .post<any>(`${this.URL}/refresh-token`, { refreshToken })
      .pipe(map((data) => data.data));
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    localStorage.clear();
    return this.http.post<any>(`${this.URL}/logout`, { refreshToken });
  }

  logoutStore() {
    this.store.dispatch(logout());
  }
}
