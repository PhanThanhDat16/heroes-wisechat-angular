import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMessageGroup } from '../../model/message';
import { SocketIOService } from '../../../../core/services/socket.service';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent implements OnInit {
  @Input() messagesGroup: IMessageGroup[] = [];
  userId = localStorage.getItem('userId');
  onlineUserIds: string[] = [];
  selectedImageUrl: string | null = null;
  @Output() replyEmitter = new EventEmitter<IMessageGroup>();

  constructor(private socketService: SocketIOService) {}

  ngOnInit(): void {
    this.socketService.onlineUser$.subscribe((userIds) => {
      this.onlineUserIds = userIds;
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
    this.replyEmitter.emit(msg);
  }

  extractFileName(url: string): string {
    return url.split('/').pop() || 'file';
  }
}
