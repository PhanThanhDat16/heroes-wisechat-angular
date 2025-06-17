import {
  AfterViewChecked,
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { IGroup } from '../../model/group';
import { MessageService } from '../../service/message.service';
import { SocketIOService } from '../../../../core/services/socket.service';
import { GroupService } from '../../service/group.service';
import { fromEvent, Subscription } from 'rxjs';
import { IMessageGroup } from '../../model/message';
import { IUser } from '../../../auth/model/user';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent
  implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy
{
  selectedFiles: File[] = [];
  groupData: IGroup;
  user: IUser;
  userId = localStorage.getItem('userId');
  messageInput: string = '';
  messagesGroup: IMessageGroup[] = [];
  checkMessageGroup: boolean = false;
  userOnlineGroup: string[] = [];
  messageSub: Subscription;
  currentPage = 1;
  hasMoreMessages = true;
  isLoadingMessages = false;
  uploaded: { url?: string; originalname?: string; mimetype?: string } | null =
    null;
  @ViewChild('scrollableChatRef') scrollableChatRef: ElementRef;
  shouldScrollToBottom = false;
  replyToMessage: IMessageGroup | null = null;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private messageService: MessageService,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = params['id'];

      if (groupId) {
        this.checkMessageGroup = false;
        this.groupService.getGroupDetail(groupId).subscribe({
          next: (groupDetail) => {
            this.user = groupDetail.user as IUser;
            this.groupData = groupDetail;
            this.messagesGroup = [];
            this.currentPage = 1;
            this.hasMoreMessages = true;
            this.isLoadingMessages = false;

            this.messageService
              .getMessageByGroupService(groupId, 1, 10)
              .subscribe({
                next: (message) => {
                  console.log(message);
                  this.socketService.onlineUser$.subscribe((userIds) => {
                    this.userOnlineGroup = message.members.filter((m) =>
                      userIds.includes(m._id)
                    );
                  });

                  this.messagesGroup = message.senderId;
                  this.checkMessageGroup = true;
                  this.shouldScrollToBottom = true;
                },
              });
          },
        });
        this.checkMessageGroup = false;
      }
    });

    this.socketService.receiveEditGroup().subscribe((data) => {
      if (this.groupData._id === data.groupId) {
        this.groupData.name = data.name;
      }
    });

    if (this.messageSub) this.messageSub.unsubscribe();
    this.messageSub = this.socketService
      .receiveMessage()
      .subscribe((message) => {
        this.messagesGroup.push(message);
        this.shouldScrollToBottom = true;
      });
  }

  ngAfterViewInit(): void {
    const scrollElement = this.scrollableChatRef?.nativeElement;
    if (!scrollElement) return;
    fromEvent(scrollElement, 'scroll')
      .pipe(debounceTime(300))
      .subscribe(() => this.onScroll());
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  onScroll(): void {
    if (this.isLoadingMessages || !this.hasMoreMessages) return;
    const scrollElement = this.scrollableChatRef?.nativeElement;
    if (scrollElement && scrollElement.scrollTop === 0) {
      this.loadMoreMessages();
    }
  }

  loadMoreMessages(): void {
    if (!this.groupData?._id) return;
    const scrollElement = this.scrollableChatRef?.nativeElement;
    if (!scrollElement) return;
    const prevScrollHeight = scrollElement.scrollHeight;
    this.isLoadingMessages = true;
    this.messageService
      .getMessageByGroupService(this.groupData._id, this.currentPage + 1, 10)
      .subscribe({
        next: (data) => {
          if (!data.senderId || data.senderId.length === 0) {
            this.hasMoreMessages = false;
            this.isLoadingMessages = false;
            return;
          }

          this.messagesGroup = [...data.senderId, ...this.messagesGroup];
          this.currentPage++;

          setTimeout(() => {
            const newScrollHeight = scrollElement.scrollHeight;
            scrollElement.scrollTop = newScrollHeight - prevScrollHeight;
            this.isLoadingMessages = false;
          }, 0);
        },
        error: () => {
          this.isLoadingMessages = false;
        },
      });
  }

  scrollToBottom(): void {
    const scrollElement = this.scrollableChatRef?.nativeElement;
    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }

  getFileType(mimetype: string): 'image' | 'excel' | 'word' | 'other' {
    if (mimetype.startsWith('image/')) {
      return 'image';
    }
    if (
      mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mimetype === 'application/vnd.ms-excel'
    ) {
      return 'excel';
    }
    if (
      mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimetype === 'application/msword'
    ) {
      return 'word';
    }
    return 'other';
  }

  handleSendMessage() {
    const senderId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const content = this.messageInput.trim();
    const file = this.uploaded;

    if (!content && !file?.url) return;

    let messageType: 'text' | 'image' | 'excel' | 'word' | 'other' = 'text';
    let messageContent = content;

    if (file?.url) {
      messageType = this.getFileType(file.mimetype || '');
      messageContent = file.url;
    }

    if (!this.replyToMessage) {
      this.messageService
        .createMessageByGroupService(
          this.groupData._id as string,
          senderId,
          messageContent,
          username,
          null,
          null,
          null,
          null,
          messageType
        )
        .subscribe({
          next: (data) => {
            this.socketService.sendMessage(
              senderId,
              username,
              data.content,
              this.groupData._id as string,
              null,
              null,
              null,
              null,
              messageType
            );
          },
          error: (err) => {
            console.error('Send message failed', err);
          },
        });
    } else {
      this.messageService
        .createMessageByGroupService(
          this.groupData._id as string,
          senderId,
          messageContent,
          username,
          this.replyToMessage._id,
          this.replyToMessage.content,
          this.replyToMessage.senderName,
          this.replyToMessage.type,
          messageType
        )
        .subscribe({
          next: (data) => {
            this.socketService.sendMessage(
              senderId,
              username,
              data.content,
              this.groupData._id as string,
              this.replyToMessage._id,
              this.replyToMessage.content,
              this.replyToMessage.senderName,
              this.replyToMessage.type,
              messageType
            );
            this.replyToMessage = null;
          },
          error: (err) => {
            console.error('Send message failed', err);
          },
        });
    }

    this.messageInput = '';
    this.uploaded = null;
    // this.replyToMessage = null;
  }

  handleChooseFileAndImage(event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);

      this.messageService.uploadFiles(this.selectedFiles).subscribe({
        next: (data) => {
          this.uploaded = data;
          // this.messageInput = data.url;
        },
      });
    }
  }

  removeImage() {
    this.uploaded = null;
  }

  handleReply(msg: IMessageGroup) {
    this.replyToMessage = msg;
  }

  ngOnDestroy(): void {
    if (this.messageSub) this.messageSub.unsubscribe();
  }
}
