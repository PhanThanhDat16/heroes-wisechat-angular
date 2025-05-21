import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IRegister, IUser } from '../model/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<IUser>({
    username: '',
    email: '',
    tags: [],
  });

  public user$: Observable<IUser> = this.userSubject.asObservable();

  private URL = 'http://localhost:3001/api/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  registerService(user: IRegister) {
    return this.http.post<any>(`${this.URL}/register`, user);
  }

  updateProfile(userId: string, data: IUser) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .put<any>(`${this.URL}/${userId}`, data, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      .pipe(
        map((res) => {
          this.userSubject.next(res.data);
          return res.data;
        })
      );
  }

  getProfile(): Observable<IUser> {
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .get<any>(`${this.URL}/profile`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      .pipe(
        map((res) => {
          this.userSubject.next(res.data);
          return res.data;
        })
      );
  }

  getUserDetail(id: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .get<any>(`${this.URL}/${id}`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      .pipe(map((res) => res.data));
  }
}
