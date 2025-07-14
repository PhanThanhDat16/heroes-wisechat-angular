import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { SocketIOService } from '../../../../core/services/socket.service';
import { IGroupMessage } from '../../../group/model/group';
import { Store } from '@ngrx/store';
import {
  loadGroup,
  loadUsersByGroup,
} from '../../../../core/store/group/group.actions';
import { selectUsersByGroup } from '../../../../core/store/group/group.selector';
import { updateIsRead } from '../../../../core/store/message/message.actions';
import { selectMessage } from '../../../../core/store/message/message.selector';
import { combineLatest, Subscription } from 'rxjs';
import { listTag } from '../../model/listTag';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.scss',
})
export class GroupItemComponent implements OnInit, OnDestroy {
  @Input() itemGroup: IGroupMessage;
  @Input() currentGroupId: string;
  @Input() checkGroupIdRead;
  @Output() emitcheckGroupIdRead = new EventEmitter<string>();
  userId = localStorage.getItem('userId');
  userOnlineGroup: string[] = [];
  isRead = false;
  wasReadManually = false;
  wasReadGroupId = '';
  membersOfGroup: string[] = [];
  private subscriptions = new Subscription();
  constructor(private store: Store, private socketService: SocketIOService) {}

  ngOnInit(): void {
    this.isRead = this.itemGroup.readUsers.includes(this.userId || '') || false;
    this.store.dispatch(loadUsersByGroup({ groupId: this.itemGroup._id }));

    const onlineSub = combineLatest([
      this.store.select(selectUsersByGroup),
      this.socketService.onlineUser$,
    ]).subscribe(([usersInGroup, onlineUserIds]) => {
      const users = usersInGroup?.[this.itemGroup._id] || [];
      this.userOnlineGroup = users
        .filter((m) => onlineUserIds.includes(m._id))
        .map((u) => u._id);
      this.membersOfGroup = users.map((u) => u._id);
    });
    this.subscriptions.add(onlineSub);

    this.socketService.receiveEditGroup().subscribe((data) => {
      if (
        this.itemGroup._id === data.groupId &&
        data.senderId !== this.userId
      ) {
        this.itemGroup = {
          ...this.itemGroup,
          name: data.name,
        };
      }
    });

    this.socketService
      .receiveKickedFromGroup()
      .subscribe(({ groupId, userId }) => {
        if (this.itemGroup._id === groupId) {
          this.store.dispatch(loadGroup({ userId: this.userId }));
          this.userOnlineGroup = this.userOnlineGroup.filter(
            (uId) => uId !== userId
          );
          if (userId === this.userId) {
            this.itemGroup.readUsers = this.itemGroup.readUsers.filter(
              (id) => id !== this.userId
            );
            this.membersOfGroup = this.membersOfGroup.filter(
              (id) => id !== this.userId
            );
            this.isRead = false;
          }
        }
      });

    this.store.select(selectMessage).subscribe((message) => {
      if (message && message.group._id === this.itemGroup._id) {
        const userId = this.userId;
        const visibleMessages = message.senderId.filter(
          (msg) => !msg.deleteForUser?.includes(userId)
        );
        const lastVisibleMessage = visibleMessages[visibleMessages.length - 1];
        this.itemGroup = {
          ...this.itemGroup,
          lastMessage: lastVisibleMessage
            ? {
                content: lastVisibleMessage.content,
                senderId: lastVisibleMessage.senderId,
                senderName: lastVisibleMessage.senderName,
                createdAt: lastVisibleMessage.createdAt,
              }
            : null,
        };

        if (
          message.group._id === this.checkGroupIdRead &&
          this.wasReadGroupId &&
          this.membersOfGroup.includes(this.userId || '')
        ) {
          this.isRead = true;
          this.wasReadGroupId = '';
        }
      }
    });

    const msgSub = this.socketService.receiveMessage().subscribe((message) => {
      if (message.groupId !== this.itemGroup._id) return;
      this.itemGroup = {
        ...this.itemGroup,
        lastMessage: {
          content: message.content,
          senderId: message.senderId,
          senderName: message.senderName,
          createdAt: message.createdAt,
        },
      };
      const isStillInGroup = this.membersOfGroup.includes(this.userId || '');
      if (!isStillInGroup) {
        this.isRead = false;
        return;
      }

      if (message.senderId !== this.userId) {
        if (this.currentGroupId === message.groupId) {
          this.store.dispatch(
            updateIsRead({
              groupId: this.itemGroup._id,
              userId: this.userId,
            })
          );
          if (!this.itemGroup.readUsers.includes(this.userId || '')) {
            this.itemGroup.readUsers = [
              ...this.itemGroup.readUsers,
              this.userId || '',
            ];
          }
          this.isRead = true;
        } else {
          this.isRead = false;
        }
      } else {
        if (!this.itemGroup.readUsers.includes(this.userId || '')) {
          this.store.dispatch(
            updateIsRead({
              groupId: this.itemGroup._id,
              userId: this.userId,
            })
          );
          this.itemGroup.readUsers = [
            ...this.itemGroup.readUsers,
            this.userId || '',
          ];
        }
        this.isRead = true;
      }
    });
    this.subscriptions.add(msgSub);

    const addMemberGroupSub = this.socketService
      .receiveAddMemberFromGroup()
      .subscribe(({ group, listUser, userId, listMemberOnline }) => {
        if (this.itemGroup._id === group._id && userId === this.userId) {
          this.userOnlineGroup = [...this.userOnlineGroup, ...listMemberOnline];
          this.membersOfGroup = [...this.membersOfGroup, ...listMemberOnline];
        }
      });
    this.subscriptions.add(addMemberGroupSub);

    this.socketService.receiveDeleteMessage().subscribe((data) => {
      if (
        data.senderId !== this.userId &&
        this.currentGroupId !== data.groupId
      ) {
        this.store.dispatch(loadGroup({ userId: this.userId }));
      }
    });
  }

  handleReadMessage(groupId: string) {
    this.emitcheckGroupIdRead.emit(groupId);
    this.wasReadGroupId = groupId;
    if (!this.itemGroup.readUsers.includes(this.userId || '')) {
      this.store.dispatch(updateIsRead({ groupId, userId: this.userId }));
    }
  }

  getTagStyle(tagName: string) {
    const found = listTag.find(
      (t) => t.tag.toLowerCase() === tagName?.toLowerCase()
    );
    return found
      ? {
          'background-color': found.background,
          color: found.color,
          padding: '2px 8px',
          'border-radius': '12px',
          'font-size': '12px',
        }
      : {};
  }

  isURL(content: string): boolean {
    try {
      new URL(content);
      return true;
    } catch {
      return false;
    }
  }
  isImage(content: string): boolean {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(content);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

// const onlineSub = combineLatest([
//   this.store.select(selectUsersByGroup),
//   this.socketService.onlineUser$,
// ]).subscribe(([usersInGroup, onlineUserIds]) => {
//   const users = usersInGroup?.[this.itemGroup._id] || [];
//   this.userOnlineGroup = users
//     .filter((m) => onlineUserIds.includes(m._id))
//     .map((u) => u._id);
// });
// this.subscriptions.add(onlineSub);

// this.socketService
//   .receiveKickedFromGroup()
//   .subscribe(({ groupId, userId }) => {
//     if (this.itemGroup._id === groupId) {
//       this.store.dispatch(loadGroup({ userId: this.userId }));

//       this.userOnlineGroup = this.userOnlineGroup.filter(
//         (uId) => uId !== userId
//       );
//       if (userId === this.userId) {
//         this.itemGroup.readUsers = this.itemGroup.readUsers.filter(
//           (id) => id !== this.userId
//         );
//       }
//     }
//   });

// this.store.select(selectMessage).subscribe((message) => {
//   if (message && message.group._id === this.itemGroup._id) {
//     const userId = localStorage.getItem('userId');
//     const visibleMessages = message.senderId.filter(
//       (msg) => !msg.deleteForUser?.includes(userId)
//     );
//     const lastVisibleMessage = visibleMessages[visibleMessages.length - 1];
//     if (lastVisibleMessage) {
//       this.itemGroup = {
//         ...this.itemGroup,
//         lastMessage: {
//           content: lastVisibleMessage.content,
//           senderId: lastVisibleMessage.senderId,
//           senderName: lastVisibleMessage.senderName,
//           createdAt: lastVisibleMessage.createdAt,
//         },
//       };
//     } else {
//       this.itemGroup = {
//         ...this.itemGroup,
//         lastMessage: null,
//       };
//     }
//     if (
//       message.group._id === this.checkGroupIdRead && this.wasReadGroupId
//     ) {
//       this.isRead = true;
//       this.wasReadGroupId = '';
//     }
//   }
// });

// const msgSub = this.socketService.receiveMessage().subscribe((message) => {
//   if (message.groupId !== this.itemGroup._id) return;
//   this.itemGroup = {
//     ...this.itemGroup,
//     lastMessage: {
//       content: message.content,
//       senderId: message.senderId,
//       senderName: message.senderName,
//       createdAt: message.createdAt,
//     },
//   };

//   if (message.senderId !== this.userId) {
//     console.log(this.itemGroup)
//     console.log(message)
//     console.log(this.currentGroupId)
//     if (this.itemGroup._id === message.groupId && this.currentGroupId === message.groupId ) {
//       this.store.dispatch(
//         updateIsRead({
//           groupId: this.itemGroup._id,
//           userId: this.userId,
//         })
//       );
//       if (!this.itemGroup.readUsers.includes(this.userId || '')) {
//         this.itemGroup.readUsers = [
//           ...this.itemGroup.readUsers,
//           this.userId || '',
//         ];
//       }
//       this.isRead = true;
//     }  else if(this.itemGroup._id === message.groupId) {
//       this.isRead = false;
//     }
//   } else {
//     console.log(this.itemGroup)

//     if (!this.itemGroup.readUsers.includes(this.userId || '')) {

//       console.log('aaaaaaa')

//       this.store.dispatch(
//         updateIsRead({
//           groupId: this.itemGroup._id,
//           userId: this.userId,
//         })
//       );
//       this.itemGroup.readUsers = [
//         ...this.itemGroup.readUsers,
//         this.userId || '',
//       ];
//       this.isRead = true;
//     }
//   }
// });
// this.subscriptions.add(msgSub);

// const addMemberGroupSub = this.socketService
//   .receiveAddMemberFromGroup()
//   .subscribe(({ group, listUser, userId, listMemberOnline }) => {
//     if (this.itemGroup._id === group._id && userId === this.userId) {
//       this.userOnlineGroup = [...this.userOnlineGroup, ...listMemberOnline];
//     }
//   });
// this.subscriptions.add(addMemberGroupSub);
