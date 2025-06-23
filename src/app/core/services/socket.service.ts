import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { IEditGroup } from '../model/socket';
import { IGroup } from '../../features/group/model/group';

@Injectable({
  providedIn: 'root',
})
export class SocketIOService {
  private socket: Socket;
  private URL_SOCKET = 'http://localhost:3002';
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  public onlineUser$ = this.onlineUsersSubject.asObservable();

  constructor() {
    this.socket = io(this.URL_SOCKET);

    // this.socket.on('connect', () => {
    //   const userId = localStorage.getItem('userId');
    //   if (userId) {
    //     this.sendUserOnline(userId);
    //   }
    // });

    this.socket.on('updateOnlineUsers', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    });
  }

  joinGroup(listGroupId: string[]) {
    listGroupId.map((groupId) => {
      this.socket.emit('joinGroup', { groupId });
    });
  }

  sendNewGroup(group: IGroup) {
    this.socket.emit('newGroup', group);
  }

  listenNewGroup() {
    return new Observable<IGroup>((observer) => {
      this.socket.on('newGroup', (group: IGroup) => {
        observer.next(group);
      });
    });
  }

  sendUserOnline(userId: string) {
    this.socket.emit('userOnline', userId);
  }

  sendUpdateEditGroup({ senderId, senderName, name, groupId }: IEditGroup) {
    this.socket.emit('editGroup', { senderId, senderName, name, groupId });
  }

  receiveEditGroup(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('editGroup', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('editGroup');
      };
    });
  }

  sendMessage(
    senderId: string,
    senderName: string,
    message: string,
    groupId: string,
    replyToMessageId: string | null,
    replyToContent: string | null,
    replyToSenderName: string | null,
    replyToType: string | null,
    type: string
  ) {
    this.socket.emit('sendMessage', {
      senderId,
      senderName,
      content: message,
      groupId,
      replyToMessageId,
      replyToContent,
      replyToSenderName,
      replyToType,
      type,
    });
  }

  receiveMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('receiveMessage');
      };
    });
  }


  deleteMessage(messageId: string, groupId: string) {
    this.socket.emit('deleteMessage', { messageId, groupId });
  }

 receiveDeleteMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('deleteMessage', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('deleteMessage');
      };
    });
  }

  

  disconnectSocket() {
    this.socket.disconnect();
  }
}
