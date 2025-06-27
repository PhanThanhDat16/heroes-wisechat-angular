import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { IEditGroup } from '../model/socket';
import { IGroup } from '../../features/group/model/group';
import { IMessageGroup } from '../../features/chat/model/message';

@Injectable({
  providedIn: 'root',
})
export class SocketIOService {
  private socket: Socket;
  private URL_SOCKET = 'http://localhost:3002';
  private onlineUsersSubject = new BehaviorSubject<string[]>([]);
  public onlineUser$ = this.onlineUsersSubject.asObservable();

  constructor() {
    this.initSocket();
  }

  initSocket() {
    this.socket = io(this.URL_SOCKET);

    this.socket.on('updateOnlineUsers', (users: string[]) => {
      this.onlineUsersSubject.next(users);
    });
  }

  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
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
    this.socket.emit('userOnline', { userId });
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
    _id: string,
    senderId: string,
    senderName: string,
    message: string,
    groupId: string,
    replyToMessageId: string | null,
    replyToContent: string | null,
    replyToSenderName: string | null,
    replyToType: string | null,
    type: string,
    isRead = []
  ) {
    this.socket.emit('sendMessage', {
      _id,
      senderId,
      senderName,
      content: message,
      groupId,
      replyToMessageId,
      replyToContent,
      replyToSenderName,
      replyToType,
      type,
      isRead,
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

  deleteMessage(data) {
    this.socket.emit('deleteMessage', data);
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

  deleteMessageForMe(data) {
    this.socket.emit('deleteMessageForMe', data);
  }

  receiveDeleteMessageForMe(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('deleteMessageForMe', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.off('deleteMessageForMe');
      };
    });
  }

  editMessage(data: IMessageGroup) {
    this.socket.emit('editMessage', data);
  }

  receiveEditMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('editMessage', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.off('editMessage');
      };
    });
  }

  disconnectSocket() {
    this.socket.disconnect();
  }
}
