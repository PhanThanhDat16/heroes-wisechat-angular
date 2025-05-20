import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IAuth } from '../../types/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:3001/api/auth';

  constructor(private http: HttpClient) {}

  loginService(auth: IAuth) {
    return this.http
      .post<any>(`${this.URL}/login`, auth)
      .pipe(map((data) => data.data));
  }

  getAccessToken() {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken;
  }

  refreshToken(resfreshToken: string) {
    return this.http
      .post<any>(`${this.URL}/refresh-token`, { resfreshToken })
      .pipe(map((data) => data.data));
  }
}
