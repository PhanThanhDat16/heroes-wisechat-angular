import { Component, Input, OnInit } from '@angular/core';
import { IMessageGroup } from '../../model/message';
import { SocketIOService } from '../../../../core/services/socket.service';
import { MessageShareService } from '../../../../shared/service/message-share.service';
import { Store } from '@ngrx/store';
import {
  reactToMessage,
  reactToMessageSuccess,
} from '../../../../core/store/message/message.actions';

const listEmoji = [
  {
    icon: '❤️',
    type: 'heart',
  },
  {
    icon: '😂',
    type: 'laugh',
  },
  {
    icon: '😍',
    type: 'kiss-heart',
  },
  {
    icon: '😭',
    type: 'cry',
  },
  {
    icon: '😌',
    type: 'smile',
  },
];

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent implements OnInit {
  @Input() messagesGroup: IMessageGroup[] = [];
  userId = localStorage.getItem('userId');
  onlineUserIds: string[] = [];
  selectedImageUrl: string | null = null;
  listEmoji = listEmoji;

  constructor(
    private socketService: SocketIOService,
    private messageShareService: MessageShareService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.socketService.onlineUser$.subscribe((userIds) => {
      this.onlineUserIds = userIds;
    });

    this.socketService.receiveEditMessage().subscribe((data) => {
      this.messagesGroup = this.messagesGroup.map((msg) => {
        if (msg._id === data._id) {
          return data;
        }
        return msg;
      });
    });

    this.socketService.reactMessage().subscribe((data) => {
      if (data.userId !== this.userId) {
        this.store.dispatch(
          reactToMessageSuccess({
            messageId: data.messageId,
            reactions: data.reactions,
            quantityReact: data.quantityReact,
          })
        );
      }
    });
  }

  getDateAndTimeStamp(currentMsg: IMessageGroup, index: number): string | null {
    if (index === 0) return currentMsg.createdAt;
    const currentTime = new Date(currentMsg.createdAt).getTime();
    const previousTime = new Date(
      this.messagesGroup[index - 1].createdAt
    ).getTime();
    const TIME_DIFF = 20 * 60 * 1000;

    if (currentTime - previousTime > TIME_DIFF) {
      return currentMsg.createdAt;
    }
    return null;
  }

  handleReply(msg) {
    this.messageShareService.sendReplyMessage(msg);
  }

  handleEdit(msg) {
    this.messageShareService.sendEditMessage(msg);
  }

  extractFileName(url: string): string {
    return url.split('/').pop() || 'file';
  }

  getEmojiIcon(type: string): string {
    const found = this.listEmoji.find((e) => e.type === type);
    return found ? found.icon : '';
  }

  getReactions(
    msg: IMessageGroup
  ): { type: string; count: number; users: string[] }[] {
    const reactions = (msg as any).reactions || {};
    return Object.keys(reactions).map((key) => ({
      type: key,
      count: reactions[key].count,
      users: reactions[key].users,
    }));
  }

  isUserReacted(emoji: { users: string[] }): boolean {
    return emoji.users.includes(this.userId);
  }

  checkDeleteForMe(msg: IMessageGroup): boolean {
    if (!Array.isArray(msg.deleteForUser)) return false;
    return msg.deleteForUser.includes(this.userId);
  }

  handleEmoji(messageId, types, groupId) {
    this.store.dispatch(
      reactToMessage({ messageId, userId: this.userId, types, groupId })
    );
  }
}
