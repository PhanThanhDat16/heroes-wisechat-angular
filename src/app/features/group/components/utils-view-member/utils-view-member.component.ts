import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IUser, IUserGet } from '../../../auth/model/user';
import { SocketIOService } from '../../../../core/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, Subscription, take } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { GroupServiceAPI } from '../../service/groupAPI.service';
import { IGroup } from '../../model/group';
import { Store } from '@ngrx/store';
import {
  selectMembersGroup,
  selectMessage,
} from '../../../../core/store/message/message.selector';

import { ModalUtilsChatComponent } from '../../../../shared/components/modal-utils-chat/modal-utils-chat.component';
import { Actions, ofType } from '@ngrx/effects';
import { ToastService } from 'angular-toastify';
import { deleteMemberInGroupSuccess } from '../../../../core/store/message/message.actions';
import { GroupService } from '../../service/groupService.service';
import { notiService } from '../../../../core/services/noti.service';

@Component({
  selector: 'app-utils-view-member',
  templateUrl: './utils-view-member.component.html',
  styleUrl: './utils-view-member.component.scss',
})
export class UtilsViewMemberComponent implements OnInit, OnDestroy {
  groupData: IGroup;
  step: 'VIEW_MEMBER' | 'VIEW_DETAIL' = 'VIEW_MEMBER';
  userId = localStorage.getItem('userId');
  listUserByGroup: IUser[] = [];
  userOnlineGroup: string[] = [];
  nameUser = new FormControl('');
  user: IUserGet;
  isDeleting = false;
  nameUserSub: Subscription;
  private subscriptions = new Subscription();
  @ViewChild(ModalUtilsChatComponent) modalComponent!: ModalUtilsChatComponent;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private groupServiceAPI: GroupServiceAPI,
    private userService: UserService,
    private socketService: SocketIOService,
    private action$: Actions,
    private toastService: ToastService,
    private groupService: GroupService,
    private notiService: notiService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = params['id'];

      const selectMemberGroupSub = this.store
        .select(selectMembersGroup)
        .subscribe((members) => {
          if (members) {
            this.listUserByGroup = members;
            this.socketService.onlineUser$.subscribe((userIds) => {
              this.userOnlineGroup = this.listUserByGroup
                .filter((u) => userIds.includes(u._id))
                .map((u) => u._id);
            });
          }
        });
      this.subscriptions.add(selectMemberGroupSub);

      this.store.select(selectMessage).subscribe((message) => {
        if (message) {
          this.groupData = message.group;
        }
      });

      if (this.nameUserSub) {
        this.nameUserSub.unsubscribe();
      }
      this.nameUserSub = this.nameUser.valueChanges
        .pipe(debounceTime(300))
        .subscribe((search) => {
          const query = search.trim() || '';
          this.groupServiceAPI.getListUserByGroup(groupId, query).subscribe({
            next: (data: IUser[]) => {
              this.listUserByGroup = data;
            },
            error: () => {
              this.listUserByGroup = [];
            },
          });
        });
    });

    const receiveKick = this.socketService
      .receiveKickedFromGroup()
      .subscribe(({ groupId, userId }) => {
        this.listUserByGroup = this.listUserByGroup.filter(
          (u) => u?._id !== userId
        );
      });
    this.subscriptions.add(receiveKick);
  }

  onResetStep(dataStep: 'VIEW_MEMBER' | 'VIEW_DETAIL') {
    this.step = dataStep;
  }

  handleViewProfile(id: string) {
    this.step = 'VIEW_DETAIL';
    this.userService.getUserDetail(id).subscribe({
      next: (data) => {
        this.user = data;
      },
    });
  }

  handleBackView() {
    this.step = 'VIEW_MEMBER';
  }

  handleDeletUserInGroup(user: IUser) {
    this.groupService.deleteMemberInGroup(this.groupData._id, user._id);
    this.action$
      .pipe(ofType(deleteMemberInGroupSuccess), take(1))
      .subscribe(() => {
        this.notiService.loadNoti(this.userId);
        this.toastService.success('Delete member successful!');
        this.modalComponent?.closeModal();
      });
  }

  ngOnDestroy(): void {
    this.nameUserSub.unsubscribe();
  }
}
