import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IRegister, IUser } from '../types/user';
import { BehaviorSubject, map, Observable } from 'rxjs';
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

  getTagsByUser(userId: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .get<any>(`${this.URL}/${userId}/tags`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      .pipe(map((res) => res.data));
  }

  createTagByUser(userId: string, tag: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .put<any>(
        `${this.URL}/${userId}/tags`,
        { tag },
        {
          headers: { authorization: `Bearer ${accessToken}` },
        }
      )
      .pipe(map((res) => res.data));
  }

  deleteTageByUser(userId: string, tag: string) {
    return this.http
      .delete<any>(`${this.URL}/${userId}/tag`, {
        body: { tag },
        headers: { authorization: `Bearer ${this.authService.getAccessToken()}` },
      })
      .pipe(map((res) => res.data));
  }

  deleteAllTagByUser(userId: string, tags: string[]) {
    return this.http
      .delete<any>(`${this.URL}/${userId}/tags`, {
        body: { tags },
        headers: { authorization: `Bearer ${this.authService.getAccessToken()}` },
      })
      .pipe(map((res) => res.data));
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
}
