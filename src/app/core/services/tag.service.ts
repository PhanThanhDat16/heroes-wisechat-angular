import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { ITag } from '../model/tag';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private URL = 'http://localhost:3001/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTagsByUser(userId: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .get<any>(`${this.URL}/${userId}/tag`, {
        headers: { authorization: `Bearer ${accessToken}` },
      })
      .pipe(map((res) => res.data));
  }

  createTagByUser(userId: string, tag: string) {
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .post<any>(
        `${this.URL}/${userId}/tag`,
        { tag },
        {
          headers: { authorization: `Bearer ${accessToken}` },
        }
      )
      .pipe(map((res) => res.data));
  }

  deleteTageByUser(userId: string, tagId: string) {
    return this.http
      .delete<any>(`${this.URL}/${userId}/tag/${tagId}`, {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  deleteAllTagByUser(userId: string) {
    return this.http
      .delete<any>(`${this.URL}/${userId}/tags`, {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  addTagsToMultipleHeroes(heroIds: string[], userId: string , tags: ITag[]) {
    return this.http.put(`${this.URL}/${userId}/heroes/tags`, { heroIds, tags });
  }

  deleteTagsToMultipleHeroes(heroIds: string[], userId: string , tags: ITag[]) {
    return this.http.delete(`${this.URL}/${userId}/heroes/tags`, {
      body: { heroIds, tags },
      headers: {
        Authorization: `Bearer ${this.authService.getAccessToken()}`,
      },
    });
  }
}
