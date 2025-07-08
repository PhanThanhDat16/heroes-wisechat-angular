import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectGroupDetail } from '../../../../core/store/group/group.selector';
import { IGroup, IGroupMember } from '../../../group/model/group';
import {
  selectMembersGroup,
  selectMessage,
} from '../../../../core/store/message/message.selector';
import { IUser } from '../../../auth/model/user';
import { SocketIOService } from '../../../../core/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  addMemberInGroupSuccess,
  deleteMemberInGroupSuccess,
} from '../../../../core/store/message/message.actions';
import {
  addTagForGroup,
  addTagForGroupSuccess,
} from '../../../../core/store/group/group.actions';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

const listTheme = [
  '/assets/public/img/Theme-cloud.webp',
  '/assets/public/img/Theme-family.webp',
  '/assets/public/img/Theme-flower.webp',
  '/assets/public/img/Theme-green.webp',
  '/assets/public/img/Theme-halloween.webp',
];
export const listTag = [
  {
    tag: 'Family',
    background: '#ffd6e8',
    color: '#a01854',
  },
  {
    tag: 'Friendly',
    background: '#bae6ff',
    color: '#06579d',
  },
  {
    tag: 'Class',
    background: '#e8daff',
    color: '#6929c4',
  },
  {
    tag: 'Company',
    background: '#9ef0f0',
    color: '#066262',
  },
  {
    tag: 'Travel',
    background: '#d0e2ff',
    color: '#0043ce',
  },
  {
    tag: 'Customer',
    background: '#ffe0b2',
    color: '#e65100',
  },
];

@Component({
  selector: 'app-group-detail-bar',
  templateUrl: './group-detail-bar.component.html',
  styleUrl: './group-detail-bar.component.scss',
})
export class GroupDetailBarComponent implements OnInit, OnDestroy {
  step: 'SEARCH_MESSAGE' | 'GROUP_BAR' = 'GROUP_BAR';
  tagForm: FormGroup;
  listTheme = listTheme;
  listTagGroup = listTag;
  notification: Record<string, boolean> = {};
  notificationOn: boolean;
  userOnlineGroup: string[];
  groupData: IGroup;
  listUserByGroup: IUser[] = [];
  userId = localStorage.getItem('userId');
  quantityImgAndFile: {
    image: number;
    file: number;
  } = {
    image: 0,
    file: 0,
  };
  private subscriptions = new Subscription();
  // notiTagMap: Record<string, boolean> = {};

  constructor(
    private store: Store,
    private socketService: SocketIOService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const controls = {};
    const savedTagMap = JSON.parse(localStorage.getItem('tagMap') || '{}');
    for (const tag of this.listTagGroup) {
      controls[tag.tag] = new FormControl(savedTagMap[tag.tag] ?? false);
    }
    this.tagForm = this.fb.group(controls);

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
          this.listUserByGroup = members;
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
          this.store.dispatch(
            deleteMemberInGroupSuccess({
              user: { userId: userId } as IGroupMember,
            })
          );
        }
      });
    this.subscriptions.add(receiveKickSub);

    const receiveAddMemberSub = this.socketService
      .receiveAddMemberFromGroup()
      .subscribe(({ group, listUser, userId }) => {
        if (this.userId !== userId && this.groupData._id === group._id) {
          // this.listUserByGroup = [...listUser, ...this.listUserByGroup]
          this.store.dispatch(addMemberInGroupSuccess({ newMember: listUser }));
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

  // CHECK
  handleTagChange(tag: string) {
    this.store.dispatch(
      addTagForGroup({
        groupId: this.groupData._id,
        userId: this.userId,
        tag: tag.toLocaleLowerCase(),
      })
    );
    localStorage.setItem('tagMap', JSON.stringify(this.tagForm.value));
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
