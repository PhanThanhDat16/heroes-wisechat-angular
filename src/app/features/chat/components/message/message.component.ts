import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMessageGroup } from '../../model/message';
import { SocketIOService } from '../../../../core/services/socket.service';
import { MessageShareService } from '../../../../shared/service/message-share.service';

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

  constructor(
    private socketService: SocketIOService,
    private messageShareService: MessageShareService
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
    })
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

  checkDeleteForMe(msg: IMessageGroup): boolean {
    if (!Array.isArray(msg.deleteForUser)) return false;
    return msg.deleteForUser.includes(this.userId);
  }
}
