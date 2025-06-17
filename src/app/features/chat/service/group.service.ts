import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { IGroup, IGroupCreate, IGroupMessage } from '../model/group';
import { map } from 'rxjs';
import { IUser } from '../../auth/model/user';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private URL = 'http://localhost:3002/api';
  constructor(private http: HttpClient, private authService: AuthService) {}

  createGroup(data: IGroupCreate) {
    return this.http.post(`${this.URL}/groups`, data, {
      headers: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`,
      },
    });
  }

  getGroupsByUser(userId: string) {
    return this.http
      .get<{ message: string; data: IGroupMessage[] }>(
        `${this.URL}/groups/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  getGroupDetail(groupId: string) {
    return this.http
      .get<{ message: string; data: IGroup }>(`${this.URL}/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  getListUserByGroup(groupId: string, search?: string) {
    let params = new HttpParams();
    if (search && search.trim() !== '') {
      params = params.set('search', search);
    }
    return this.http
      .get<{ message: string; data: IUser[] }>(
        `${this.URL}/groups/${groupId}/users`,
        {
          params,
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  updateGroup(groupId, data: { name: string }) {
    return this.http
      .put<{ message: string; data: any }>(
        `${this.URL}/groups/${groupId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  updateLeaveGroup(groupId, userId, data: { ownerId: string }) {
    return this.http
      .put<{ message: string; data: any }>(
        `${this.URL}/groups/${groupId}/users/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  updateRoleGroup(groupId, userId) {
    return this.http
      .put<{ message: string; data: any }>(
        `${this.URL}/groups/${groupId}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }
}
