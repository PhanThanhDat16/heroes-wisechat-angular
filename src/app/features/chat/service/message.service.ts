import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private URL = 'http://localhost:3002/api';
  constructor(private http: HttpClient, private authService: AuthService) {}

  createMessageByGroupService(
    groupId: string,
    senderId: string,
    content: string,
    senderName: string,
    replyToMessageId: string | null,
    replyToContent: string | null,
    replyToSenderName: string | null,
    replyToType: string | null,
    type = 'text',
    isRead = []
  ) {
    return this.http
      .post<any>(
        `${this.URL}/groups/${groupId}/messages`,
        {
          senderId,
          content,
          senderName,
          replyToMessageId,
          replyToContent,
          replyToSenderName,
          replyToType,
          type,
          isRead
        },
        {
          headers: {
            authorization: `Bearer ${this.authService.getAccessToken()}`,
          },
        }
      )
      .pipe(map((res) => res.data));
  }

  getMessageByGroupService(groupId: string, page: number, limit: number) {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http
      .get<any>(`${this.URL}/groups/${groupId}/messages`, {
        params,
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  updateEditMEssage(messageId: string, data: { content: string }) {
    return this.http
      .put<any>(`${this.URL}/groups/messages/${messageId}`, data, {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  deleteMessageForEveryone(messageId: string) {
    return this.http
      .delete<any>(`${this.URL}/groups/message/${messageId}`, {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  deleteMessageForMe(messageId: string, userId: string) {
    return this.http
      .put<any>(`${this.URL}/groups/users/${userId}/message/${messageId}`, {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      })
      .pipe(map((res) => res.data));
  }

  updateIsReadMessage(groupId: string, userId: string) {
    return this.http.put<any>(
      `${this.URL}/groups/${groupId}/users/${userId}/message/read`,
      {
        headers: {
          authorization: `Bearer ${this.authService.getAccessToken()}`,
        },
      }
    ).pipe(map((res) => res.data));
  }

  uploadFiles(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('content', file);
    });

    return this.http
      .post<any>(`${this.URL}/upload`, formData)
      .pipe(map((res) => res.data));
  }
}
