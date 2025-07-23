import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { IGroup } from '../../features/group/model/group';
import { IUser } from '../../features/auth/model/user';
import { IThemeSocket } from '../../features/chat/model/theme';
import { ENameEvent } from '../model/nameEventSocket';

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
    this.socket.on(ENameEvent.UPDATE_ONLINE_USER, (users: string[]) => {
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
      this.socket.emit(ENameEvent.JOIN_GROUP, { groupId });
    });
  }

  listenNewGroup() {
    return new Observable<IGroup>((observer) => {
      this.socket.on(ENameEvent.RECEIVE_NEW_GROUP, (group: IGroup) => {
        observer.next(group);
      });
    });
  }

  sendUserOnline(userId: string) {
    this.socket.emit(ENameEvent.USER_ONLINE, { userId });
  }

  receiveEditGroup(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(ENameEvent.RECEIVE_EDIT_GROUP, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off('editGroup');
      };
    });
  }

  receiveMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(ENameEvent.RECEIVE_MESSAGE, (data) => {
        observer.next(data);
      });
    });
  }

  receiveDeleteMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(ENameEvent.RECEIVE_DELETE_MESSAGE, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(ENameEvent.RECEIVE_DELETE_MESSAGE);
      };
    });
  }

  receiveDeleteMessageForMe(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(ENameEvent.RECEIVE_DELETE_MESSAGE_ME, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.off(ENameEvent.RECEIVE_DELETE_MESSAGE_ME);
      };
    });
  }

  receiveEditMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(ENameEvent.RECEIVE_EDIT_MESSAGE, (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.off(ENameEvent.RECEIVE_EDIT_MESSAGE);
      };
    });
  }

  leaveGroup(groupId: string) {
    this.socket.emit(ENameEvent.LEAVE_GROUP, { groupId });
  }

  receiveKickedFromGroup(): Observable<{
    groupId: string;
    userId: string;
    ownerId: string;
  }> {
    return new Observable((observer) => {
      this.socket.on(
        ENameEvent.RECEIVE_KICK_USER,
        (data: { groupId: string; userId: string; ownerId: string }) => {
          observer.next(data);
        }
      );
    });
  }

  receiveAddMemberFromGroup(): Observable<{
    group: IGroup;
    listUser: IUser[];
    userId: string;
    listMemberOnline?: string[];
  }> {
    return new Observable((observer) => {
      this.socket.on(
        ENameEvent.RECEIVE_ADD_MEMBER,
        (data: {
          group: IGroup;
          listUser: IUser[];
          userId: string;
          listMemberOnline?: string[];
        }) => {
          observer.next(data);
        }
      );
    });
  }

  receiveNotification(): Observable<{ content: string; groupId: string }> {
    return new Observable((observer) => {
      this.socket.on(ENameEvent.RECEIVE_NEW_NOTIFICATION, (data) => {
        observer.next(data);
      });
    });
  }

  reactMessage(): Observable<{
    reactions: Record<string, { count: number; users: string[] }>;
    messageId: string;
    userId: string;
    quantityReact: number;
  }> {
    return new Observable((observer) => {
      this.socket.on(ENameEvent.RECEIVE_REACT_MESSAGE, (data) => {
        observer.next(data);
      });
    });
  }

  receiveChangeTheme(): Observable<IThemeSocket> {
    return new Observable((observer) => {
      this.socket.on(ENameEvent.RECEIVE_CHANGE_THEME, (data: IThemeSocket) => {
        observer.next(data);
      });
    });
  }

  disconnectSocket() {
    this.socket.disconnect();
  }
}
