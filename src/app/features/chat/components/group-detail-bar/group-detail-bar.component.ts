import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGroupDetail } from '../../../../core/store/group/group.selector';
import { IGroup } from '../../../group/model/group';
import {
  selectMembersGroup,
  selectMessage,
} from '../../../../core/store/message/message.selector';
import { IUser } from '../../../auth/model/user';
import { SocketIOService } from '../../../../core/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ITheme } from '../../model/theme';
import { listTheme } from '../../model/listTheme';
import { listTag } from '../../model/listTag';
import { MessageService } from '../../service/message.service';
import { GroupService } from '../../../group/service/groupService.service';

@Component({
  selector: 'app-group-detail-bar',
  templateUrl: './group-detail-bar.component.html',
  styleUrl: './group-detail-bar.component.scss',
})
export class GroupDetailBarComponent implements OnInit, OnDestroy {
  step: 'SEARCH_MESSAGE' | 'GROUP_BAR' = 'GROUP_BAR';
  listTheme = listTheme;
  notification: Record<string, boolean> = {};
  notificationOn: boolean;
  userOnlineGroup: string[];
  groupData: IGroup;
  listUserByGroup: IUser[] = [];
  listUserByGroupLeave: IUser[] = [];
  userId = localStorage.getItem('userId');
  isLoadingMembers = true;
  quantityImgAndFile: {
    image: number;
    file: number;
  } = {
    image: 0,
    file: 0,
  };
  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private socketService: SocketIOService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private groupSerivce: GroupService
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.params.subscribe((params) => {
      this.quantityImgAndFile.file = 0;
      this.quantityImgAndFile.image = 0;
    });
    this.subscriptions.add(routeSub);

    const groupSub = this.store
      .select(selectGroupDetail)
      .subscribe((groupDetail) => {
        this.groupData = groupDetail;
        if (this.groupData) {
          const stored = localStorage.getItem('notification');
          try {
            const parsed = JSON.parse(stored || '{}');
            this.notification =
              typeof parsed === 'object' && !Array.isArray(parsed)
                ? parsed
                : {};
          } catch (err) {
            this.notification = {};
          }
          this.notificationOn = this.notification[this.groupData._id] ?? true;
        }
      });
    this.subscriptions.add(groupSub);

    const selectMemberSub = this.store
      .select(selectMembersGroup)
      .subscribe((members) => {
        if (members) {
          this.isLoadingMembers = false;
          this.listUserByGroup = members;
          this.listUserByGroupLeave = members.filter(
            (member) => member._id !== this.userId
          );
          this.socketService.onlineUser$.subscribe((userIds) => {
            this.userOnlineGroup = this.listUserByGroup
              .filter((u) => userIds.includes(u._id))
              .map((u) => u._id);
          });
        }
      });
    this.subscriptions.add(selectMemberSub);

    const receiveKickSub = this.socketService
      .receiveKickedFromGroup()
      .subscribe(({ groupId, userId }) => {
        if (this.listUserByGroup) {
          this.listUserByGroup = this.listUserByGroup.filter(
            (u) => u?._id !== userId
          );
          this.groupSerivce.deleteMemberInGroupSuccess(userId);
        }
      });
    this.subscriptions.add(receiveKickSub);

    const receiveAddMemberSub = this.socketService
      .receiveAddMemberFromGroup()
      .subscribe(({ group, listUser, userId }) => {
        if (this.userId !== userId && this.groupData._id === group._id) {
          // this.listUserByGroup = [...listUser, ...this.listUserByGroup]
          this.groupSerivce.addMemberInGroupSuccess(listUser);
        }
      });
    this.subscriptions.add(receiveAddMemberSub);

    const selectMessageSub = this.store
      .select(selectMessage)
      .subscribe((message) => {
        if (message) {
          if (message) {
            // this.quantityImgAndFile = { image: 0, file: 0 };
            this.quantityImgAndFile.image = message.mediaImageCount;
            this.quantityImgAndFile.file = message.mediaFileCount;
          }
        }
      });
    this.subscriptions.add(selectMessageSub);

    const editGroupSub = this.socketService
      .receiveEditGroup()
      .subscribe((data) => {
        if (data.senderId !== this.userId) {
          this.groupData = { ...this.groupData, name: data.name };
        }
      });
    this.subscriptions.add(editGroupSub);
  }

  handleNotificationChange(value: boolean) {
    if (!this.groupData?._id) return;
    this.notification[this.groupData._id] = value;
    this.notificationOn = value;
    localStorage.setItem('notification', JSON.stringify(this.notification));
  }

  onChangeTheme(theme: ITheme) {
    if (theme.name !== this.groupData.theme) {
      Swal.fire({
        text: 'Do you want to change this theme?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#00D601',
        cancelButtonColor: '#ccc',
        confirmButtonText: 'Choose',
      }).then((result) => {
        if (result.isConfirmed) {
          this.groupSerivce.updateThemeGroup(this.groupData._id, theme.name);
          this.messageService.updateIsReadMessage(
            this.groupData._id,
            this.userId
          );
        }
      });
    }
  }

  handleSearchMessageGroup() {
    this.step = 'SEARCH_MESSAGE';
  }

  handleStep(value: 'SEARCH_MESSAGE' | 'GROUP_BAR') {
    this.step = value;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
