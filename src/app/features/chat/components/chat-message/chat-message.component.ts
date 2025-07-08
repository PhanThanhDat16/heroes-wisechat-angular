import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnInit,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import { IMessageGroup } from '../../model/message';
import { IGroup } from '../../../group/model/group';
import { IUser } from '../../../auth/model/user';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectGroupDetail,
  selectGroupLoading,
} from '../../../../core/store/group/group.selector';
import {
  selectMessage,
  selectUploadedFiles,
} from '../../../../core/store/message/message.selector';
import { SocketIOService } from '../../../../core/services/socket.service';
import { MessageService } from '../../service/message.service';
import {
  createMessageSuccess,
  deleteMessageEveryoneSuccess,
  deleteMessageForMeSuccess,
} from '../../../../core/store/message/message.actions';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent implements AfterViewInit, OnInit, AfterViewChecked, OnDestroy {
  checkMessageGroup = true;
  @ViewChild('scrollableChatRef') scrollableChatRef: ElementRef;
  groupData: IGroup;
  messagesGroup: IMessageGroup[] = [];
  user: IUser;
  userId = localStorage.getItem('userId');
  currentPage = 1;
  hasMoreMessages = true;
  isLoadingMessages = false;
  shouldScrollToBottom = false;
  uploaded: { url?: string; originalname?: string; mimetype?: string } | null =
    null;

  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private socketService: SocketIOService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const groupSub = this.store
      .select(selectGroupDetail)
      .subscribe((groupDetail) => {
        this.checkMessageGroup = true;
        if (groupDetail) {
          this.groupData = groupDetail;
          this.user = groupDetail.user as IUser;
          this.messagesGroup = [];
          this.currentPage = 1;
          this.hasMoreMessages = true;
          this.isLoadingMessages = false;
        }
      });
    this.subscriptions.add(groupSub);

    const loadingSub = this.store.select(selectGroupLoading).subscribe((loading) => {
      this.isLoadingMessages = loading;
    });
    this.subscriptions.add(loadingSub);

    const selectMessageSub = this.store.select(selectMessage).subscribe((message) => {
      if (message) {
        this.messagesGroup = message.senderId;
        this.shouldScrollToBottom = true;
        this.checkMessageGroup = false;
      }
    });
    this.subscriptions.add(selectMessageSub);

    const selectFileSub = this.store.select(selectUploadedFiles).subscribe((data) => {
      this.uploaded = data;
    });
    this.subscriptions.add(selectFileSub)

    // if (this.messageSub) {
    //   this.messageSub.unsubscribe();
    // }
    const socketMessageSub = this.socketService
      .receiveMessage()
      .subscribe((message) => {
        if (
          this.userId !== message.senderId &&
          this.groupData?._id === message.groupId
        ) {
          this.store.dispatch(createMessageSuccess({ message }));
        }
        this.shouldScrollToBottom = true;
      });
    this.subscriptions.add(socketMessageSub);

    const receiveDeleteMeSub = this.socketService.receiveDeleteMessage().subscribe((data) => {
      this.store.dispatch(deleteMessageEveryoneSuccess({ messages: data }));
      this.currentPage = 1;
      this.hasMoreMessages = true;
      this.isLoadingMessages = false;
      this.shouldScrollToBottom = true;
    });
    this.subscriptions.add(receiveDeleteMeSub)

    const receiveDeleteForMeSub = this.socketService.receiveDeleteMessageForMe().subscribe((data) => {
      this.store.dispatch(deleteMessageForMeSuccess({ message: data }));
      this.currentPage = 1;
      this.hasMoreMessages = true;
      this.isLoadingMessages = false;
      this.shouldScrollToBottom = true;
    });
    this.subscriptions.add(receiveDeleteForMeSub)
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

    if (this.messagesGroup.length < 10) {
      this.isLoadingMessages = false;
      return;
    }

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
