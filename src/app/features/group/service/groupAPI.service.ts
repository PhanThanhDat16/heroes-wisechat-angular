import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { map } from 'rxjs';
import { IUser } from '../../auth/model/user';
import { IGroup, IGroupCreate, IGroupMessage } from '../model/group';

@Injectable({
  providedIn: 'root',
})
export class GroupServiceAPI {
  private URL = 'http://localhost:3002/api';
  constructor(private http: HttpClient, private authService: AuthService) {}

  createGroup(data: IGroupCreate) {
    return this.http
      .post<{ message: string; data: any }>(`${this.URL}/groups`, data, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  getGroupsByUser(userId: string) {
    return this.http
      .get<{ message: string; data: IGroupMessage[] }>(
        `${this.URL}/group/user/${userId}`,
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

  updateGroup(groupId, data: { name: string, senderId: string, senderName: string}) {
    return this.http
      .put<{ message: string; data: any }>(
        `${this.URL}/groups/${groupId}`,
        data ,
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

  leaveGroup(groupId, userId, data: { ownerId: string | null }) {
    const oldOwnerId = localStorage.getItem('userId');
    return this.http
      .delete<{ message: string; data: any }>(
        `${this.URL}/groups/${groupId}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
          body: {...data, oldOwnerId},
        }
      )
      .pipe(map((res) => res.data));
  }

  addMemberInGroup(groupId: string, data: {users: string[], group: IGroup}) {
    return this.http
      .put<{ message: string; data: any }>(
        `${this.URL}/groups/${groupId}/users`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  deleteMemberInGroups(groupId: string, memberId: string) {
    const ownerId = localStorage.getItem('userId');
    return this.http
      .delete<{ message: string; data: any }>(
        `${this.URL}/groups/${groupId}/members/${memberId}`,
        {
          body: {ownerId},
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  addTagGroup(groupId: string, userId: string, tag: string) {
    return this.http
      .put<{ message: string; data: any }>(
        `${this.URL}/groups/${groupId}/user/${userId}/tag`,
        { tag },
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  getManyGroup(search?: string) {
    let params = new HttpParams();
    if (search && search.trim() !== '') {
      params = params.set('search', search);
    }
    return this.http
      .get<{ message: string; data: any }>(`${this.URL}/user/groups`, {
        params,
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  updateThemeGroup(groupId: string, data: {theme: string, senderId: string, senderName: string}) {
    return this.http
      .put<{ message: string; data: any }>(
        `${this.URL}/group/${groupId}/theme`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  verifyGroupDetail(groupId: string) {
    return this.http
      .get<{ message: string; data: any }>(`${this.URL}/group/${groupId}`, {
        headers: {
          Authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  deleteGroup(groupId: string) {
    return this.http.delete<{ message: string; data: any }>(`${this.URL}/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`,
      },
    }).pipe(map((res) => res.data));
  }
}
