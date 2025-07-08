import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { IEditGroup } from '../model/socket';
import { IGroup } from '../../features/group/model/group';
import { IMessageGroup } from '../../features/chat/model/message';
import { IUser } from '../../features/auth/model/user';

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
    // this.store.dispatch(loadNoti({ userId: this.userId }));
  }

  initSocket() {
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
    readUsers = []
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
      readUsers,
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

  leaveGroup(groupId: string) {
    this.socket.emit('leaveGroup', { groupId });
  }

  kickedFromGroup(userId, groupId, ownerId) {
    this.socket.emit('kickUserFromGroup', { userId, groupId, ownerId });
  }

  receiveKickedFromGroup(): Observable<{
    groupId: string;
    userId: string;
    ownerId: string;
  }> {
    return new Observable((observer) => {
      this.socket.on(
        'kickUserFromGroup',
        (data: { groupId: string; userId: string; ownerId: string }) => {
          observer.next(data);
        }
      );
      // return () => {
      //   this.socket.off('kickUserFromGroup');
      // };
    });
  }

  addMemberFromGroup(listUser, group, userId) {
    this.socket.emit('addMemberFromGroup', { listUser, group, userId });
  }

  receiveAddMemberFromGroup(): Observable<{
    group: IGroup;
    listUser: IUser[];
    userId: string;
  }> {
    return new Observable((observer) => {
      this.socket.on(
        'addMemberFromGroup',
        (data: { group: IGroup; listUser: IUser[]; userId: string }) => {
          observer.next(data);
        }
      );

      // return () => {
      // this.socket.off('addMemberFromGroup');
      // };
    });
  }

  receiveNotification(): Observable<{ content: string; groupId: string }> {
    return new Observable((observer) => {
      this.socket.on('newNotification', (data) => {
        observer.next(data);
      });
    });
  }

  reactMessage(): Observable<{
    reactions: Record<string, { count: number; users: string[] }>;
    messageId: string;
    userId: string;
    quantityReact: number
  }> {
    return new Observable((observer) => {
      this.socket.on('reactMessage', (data) => {
        observer.next(data);
      });
    });
  }

  disconnectSocket() {
    this.socket.disconnect();
  }
}
