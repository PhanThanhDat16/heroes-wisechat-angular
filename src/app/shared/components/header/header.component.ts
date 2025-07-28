import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../../core/services/user.service';
import { SocketIOService } from '../../../core/services/socket.service';
import { Subscription, take } from 'rxjs';
import { selectNoti } from '../../../core/store/notification/notification.selector';
import {
  deleteAllNotiSuccess,
  updateReadNotiSuccess,
} from '../../../core/store/notification/notification.actions';
import { INotification } from '../../../core/model/notification';
import { Actions, ofType } from '@ngrx/effects';
import { notiService } from '../../../core/services/noti.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  username = 'login';
  isBellDropdownOpen = false;
  listNoti: INotification[] = [];
  totalUnread = 0;
  userId: string = localStorage.getItem('userId');
  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
    private userService: UserService,
    private socketService: SocketIOService,
    private action$: Actions,
    private notiService: notiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      this.notiService.loadNoti(this.userId);
      this.socketService.receiveNotification().subscribe((data) => {
        const notiStorage = localStorage.getItem('notification');
        const groupNotiMap = notiStorage ? JSON.parse(notiStorage) : {};
        const isEnabled = groupNotiMap[data.groupId] ?? true;
        if (this.userId && isEnabled) {
          this.notiService.loadNoti(this.userId);
        }
      });
    }

    this.userService.getProfile().subscribe();
    const userSub = this.userService.user$.subscribe({
      next: (data) => {
        this.username = data.username;
      },
    });
    this.subscriptions.add(userSub);

    const notiSub = this.store.select(selectNoti).subscribe((data) => {
      this.listNoti = data;
      if (data && data.length > 0) {
        this.listNoti = data ?? [];
        this.totalUnread = this.listNoti.reduce(
          (acc: number, noti: INotification) => acc + (noti.isRead ? 0 : 1),
          0
        );
      }
    });
    this.subscriptions.add(notiSub);
  }

  handleReadAll() {
    if (this.listNoti.length > 0) {
      this.notiService.readAllNoti(this.userId);
    }
  }

  handleClearAll() {
    if (this.listNoti.length > 0) {
      this.notiService.deleteAllNoti(this.userId);
      this.action$.pipe(ofType(deleteAllNotiSuccess), take(1)).subscribe(() => {
        this.totalUnread = 0;
      });
    }
  }

  handleReadNoti(noti: INotification) {
    if (!noti.isRead) {
      this.notiService.updateReadNoti(noti._id);
      this.action$
        .pipe(ofType(updateReadNotiSuccess), take(1))
        .subscribe(() => {
          this.router.navigate(['/messages', noti.groupId]);
        });
    }
  }

  handleLogout() {
    this.socketService.disconnectSocket();
    this.authService.logoutStore();
    this.router.navigate(['/login']);
  }

  handleNavigateProfile() {
    this.router.navigate(['/profile']);
  }

  handleNavigateTag() {
    this.router.navigate(['/tag']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
