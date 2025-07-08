import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotiService {
  private URL = 'http://localhost:3002/api/notification';
  constructor(private http: HttpClient, private authService: AuthService) {}

  // router.put('/:id/user/:userId/read', notificationController.updateReadNotification)

  getNotiByUser(userId: string) {
    return this.http
      .get<any>(`${this.URL}/user/${userId}`, {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  deleteAllNotiByUser(userId: string) {
    return this.http.delete(`${this.URL}/user/${userId}`, {
      headers: {
        authorization: `Bearer ${this.authService.getAccessToken()}`,
      },
    });
  }

  updateReadNoti(notiId: string, userId: string) {
    return this.http
      .put<any>(`${this.URL}/${notiId}/user/${userId}/read`, {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }
  
  updateReadAllNoti(userId: string) {
    return this.http
      .put<any>(`${this.URL}/user/${userId}/read-all`, {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }
}
