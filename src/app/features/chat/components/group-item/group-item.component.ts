import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SocketIOService } from '../../../../core/services/socket.service';
import { IGroupMessage } from '../../../group/model/group';
import { Store } from '@ngrx/store';
import {
  loadGroup,
  loadGroupDetail,
  loadUsersByGroup,
} from '../../../../core/store/group/group.actions';
import { selectUsersByGroup } from '../../../../core/store/group/group.selector';
import { updateIsRead } from '../../../../core/store/message/message.actions';
import { selectMessage } from '../../../../core/store/message/message.selector';
import { combineLatest, Subscription } from 'rxjs';
import { listTag } from '../group-detail-bar/group-detail-bar.component';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.scss',
})
export class GroupItemComponent implements OnInit, OnDestroy {
  @Input() itemGroup: IGroupMessage;
  @Input() currentGroupId: string;
  userId = localStorage.getItem('userId');
  userOnlineGroup: string[] = [];
  isRead = false;
  wasReadManually = false;
  wasReadGroupId = '';
  private subscriptions = new Subscription();

  constructor(private store: Store, private socketService: SocketIOService) {}

  ngOnInit(): void {
    this.isRead = this.itemGroup.readUsers.includes(this.userId || '') || false;
    this.store.dispatch(loadUsersByGroup({ groupId: this.itemGroup._id }));
    // this.store.select(selectGroupDetail).subscribe((data) => {
    // })

    const onlineSub = combineLatest([
      this.store.select(selectUsersByGroup),
      this.socketService.onlineUser$,
    ]).subscribe(([usersInGroup, onlineUserIds]) => {
      const users = usersInGroup?.[this.itemGroup._id] || [];
      this.userOnlineGroup = users
        .filter((m) => onlineUserIds.includes(m._id))
        .map((u) => u._id);
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
          this.store.dispatch(loadGroupDetail({ groupId }));
          this.userOnlineGroup = this.userOnlineGroup.filter(
            (uId) => uId !== userId
          );
        }
      });

    this.store.select(selectMessage).subscribe((message) => {
      if (message && message.group._id === this.itemGroup._id) {
        const userId = localStorage.getItem('userId');

        const visibleMessages = message.senderId.filter(
          (msg) => !msg.deleteForUser?.includes(userId)
        );

        const lastVisibleMessage = visibleMessages[visibleMessages.length - 1];

        if (lastVisibleMessage) {
          this.itemGroup = {
            ...this.itemGroup,
            lastMessage: {
              content: lastVisibleMessage.content,
              senderId: lastVisibleMessage.senderId,
              senderName: lastVisibleMessage.senderName,
              createdAt: lastVisibleMessage.createdAt,
            },
          };
        } else {
          this.itemGroup = {
            ...this.itemGroup,
            lastMessage: null,
          };
        }

        if (message.group._id === this.wasReadGroupId && this.wasReadManually) {
          this.isRead = true;
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

      if (message.senderId !== this.userId) {
        if (this.currentGroupId === this.itemGroup._id) {
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
  }

  // checkIsRead() {
  //   this.isRead =
  //     this.itemGroup?.readUsers?.includes(this.userId || '') || false;
  // }

  handleReadMessage(groupId: string) {
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

// ngOnInit(): void {
//   this.checkIsRead();
//   this.store.dispatch(loadUsersByGroup({ groupId: this.itemGroup._id }));

//   const onlineSub = combineLatest([
//     this.store.select(selectUsersByGroup),
//     this.socketService.onlineUser$,
//   ]).subscribe(([usersInGroup, onlineUserIds]) => {
//     const users = usersInGroup?.[this.itemGroup._id] || [];
//     this.userOnlineGroup = users
//       .filter((m) => onlineUserIds.includes(m._id))
//       .map((u) => u._id);
//   });
//   this.subscriptions.add(onlineSub);

//   this.socketService.receiveEditGroup().subscribe((data) => {
//     if (this.itemGroup._id === data.groupId) {
//       this.itemGroup = {
//         ...this.itemGroup,
//         name: data.name,
//       };
//     }
//   });

//   this.store.select(selectMessage).subscribe((message) => {
//     if (message && message.senderId.length > 0) {
//       const lastMessage = message.senderId[message.senderId.length - 1];
//       if (message.group._id !== this.currentGroupId) {
//         if (lastMessage.senderId !== this.userId) {
//           this.isRead = false;
//         } else {
//           if (
//             this.wasReadManually &&
//             message.group._id === this.currentGroupId
//           ) {
//             this.wasReadManually = false;
//             this.isRead = true;
//             return;
//           }
//         }
//       } else if (message.group._id === this.currentGroupId) {
//         if (lastMessage.senderId !== this.userId) {
//           this.isRead = true;
//         } else {
//           if (
//             this.wasReadManually &&
//             message.group._id === this.currentGroupId
//           ) {
//             this.wasReadManually = false;
//             this.isRead = true;
//             return;
//           }
//         }
//       }
//     }
//   });

//   this.socketService.receiveMessage().subscribe((message) => {
//     if (message.groupId === this.itemGroup._id) {
//       this.itemGroup = {
//         ...this.itemGroup,
//         lastMessage: {
//           content: message.content,
//           senderId: message.senderId,
//           senderName: message.senderName,
//           createdAt: message.createdAt,
//         },
//       };
//     }
//     if (
//       this.userId !== message.senderId &&
//       message.groupId === this.itemGroup._id
//     ) {
//       const isCurrentGroup = this.currentGroupId === message.groupId;
//       const isNotSender = message.senderId !== this.userId;
//       const hasNotRead = !message.isRead.includes(this.userId || '');
//       if (isCurrentGroup && isNotSender && hasNotRead) {
//         this.store.dispatch(
//           updateIsRead({ groupId: this.itemGroup._id, userId: this.userId })
//         );
//         this.itemGroup.isRead = [...this.itemGroup.isRead, this.userId || ''];
//         this.isRead = true;
//       } else if (!isCurrentGroup && isNotSender && hasNotRead) {
//         this.isRead = false;
//       }
//     }
//   });

//   // this.store.select(selectMessage).subscribe((message) => {
//   //   if (!message || !message.group) return;

//   //   const isCurrentGroup = message.group._id === this.itemGroup._id;
//   //   const isSelectedGroup = this.itemGroup._id === this.currentGroupId;

//   //   // if (message.senderId.length === 0) {
//   //   //   // Group chưa có tin nhắn
//   //   //   this.isRead = isSelectedGroup && message.group.ownerId === this.userId;
//   //   //   return;
//   //   // }
//   //   console.log(message)
//   //   const lastMessage = message.senderId[message.senderId.length - 1];
//   //   const isNotSender = lastMessage.senderId !== this.userId;
//   //   const hasNotRead = !lastMessage.isRead.includes(this.userId);

//   //   if (isCurrentGroup && isSelectedGroup && isNotSender && hasNotRead) {
//   //     if (this.wasReadManually) {
//   //       this.wasReadManually = false;
//   //       this.isRead = true;
//   //     } else {
//   //       this.isRead = true;
//   //     }
//   //   } else {
//   //     this.isRead = false;
//   //   }
//   // });

//   // this.socketService.receiveMessage().subscribe((message) => {
//   //   if (message.groupId !== this.itemGroup._id) return;

//   //   this.itemGroup = {
//   //     ...this.itemGroup,
//   //     lastMessage: {
//   //       content: message.content,
//   //       senderId: message.senderId,
//   //       senderName: message.senderName,
//   //       createdAt: message.createdAt,
//   //     },
//   //   };

//   //   const isCurrentGroup = this.currentGroupId === message.groupId;
//   //   const isNotSender = message.senderId !== this.userId;
//   //   const hasNotRead = !message.isRead.includes(this.userId || '');

//   //   if (isNotSender && hasNotRead) {
//   //     if (isCurrentGroup) {
//   //       this.store.dispatch(
//   //         updateIsRead({ groupId: this.itemGroup._id, userId: this.userId })
//   //       );
//   //       this.itemGroup.isRead = [...this.itemGroup.isRead, this.userId || ''];
//   //       this.isRead = true;
//   //     } else {
//   //       this.isRead = false;
//   //     }
//   //   }

//   //   // Group mới tạo, gửi tin nhắn đầu tiên (mặc định currentUser là người gửi)
//   //   if (message.senderId === this.userId) {
//   //     this.isRead = true;
//   //     if (!this.itemGroup.isRead.includes(this.userId || '')) {
//   //       this.itemGroup.isRead = [...this.itemGroup.isRead, this.userId || ''];
//   //     }
//   //   }
//   // });

//   this.socketService
//     .receiveKickedFromGroup()
//     .subscribe(({ groupId, userId }) => {
//       if (this.itemGroup._id === groupId) {
//         this.userOnlineGroup = this.userOnlineGroup.filter(
//           (uId) => uId !== userId
//         );
//       }
//     });
// }
