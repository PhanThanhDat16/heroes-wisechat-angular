import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMessageGroup } from '../../model/message';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { createMessageSuccess } from '../../../../core/store/message/message.actions';
import { selectUploadedFiles } from '../../../../core/store/message/message.selector';
import { selectGroupDetail } from '../../../../core/store/group/group.selector';
import { IGroup } from '../../../group/model/group';
import { MessageShareService } from '../../../../shared/service/message-share.service';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MessageAPIService } from '../../service/messageAPI.service';
import { MessageService } from '../../service/message.service';
import { GroupService } from '../../../group/service/groupService.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent implements OnInit, OnDestroy {
  selectedFiles: File[] = [];
  messageInput = '';
  uploaded: { url?: string; originalname?: string; mimetype?: string } | null =
    null;
  previewFile: { url: string; file: File; mimetype: string } | null = null;
  replyToMessage: IMessageGroup | null = null;
  editToMessage: IMessageGroup | null = null;
  groupData: IGroup;
  userId = localStorage.getItem('userId');

  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private messageShareService: MessageShareService,
    private messageAPIService: MessageAPIService,
    private action$: Actions,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.messageInput = '';
      this.replyToMessage = null;
    });

    const groupSub = this.store.select(selectGroupDetail).subscribe((data) => {
      if (data) {
        this.groupData = data;
      }
    });
    this.subscriptions.add(groupSub);

    const messageSub = this.messageShareService.replyMessage$.subscribe(
      (msg) => {
        this.replyToMessage = msg;
      }
    );
    this.subscriptions.add(messageSub);

    const messageShareSub = this.messageShareService.editMessage$.subscribe(
      (msg) => {
        this.messageInput = msg.content || '';
        this.editToMessage = msg;
      }
    );
    this.subscriptions.add(messageShareSub);

    const uploadSub = this.store
      .select(selectUploadedFiles)
      .subscribe((data) => {
        this.uploaded = data;
      });
    this.subscriptions.add(uploadSub);
  }

  getFileType(mimetype: string) {
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

  private dispatchCreateMessage(content: string, type: string) {
    const senderId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    this.messageService.createMessage(
      this.groupData._id,
      senderId,
      content,
      username,
      this.replyToMessage?._id ?? null,
      this.replyToMessage?.content ?? null,
      this.replyToMessage?.senderName ?? null,
      this.replyToMessage?.type ?? null,
      type as any,
      [senderId]
    );

    const isReadSub = this.action$
      .pipe(ofType(createMessageSuccess))
      .subscribe(() => {
        this.messageService.updateIsReadMessage(this.groupData._id, senderId);
      });
    this.subscriptions.add(isReadSub);

    this.editToMessage = null;
    this.messageInput = '';
    this.uploaded = null;
    this.selectedFiles = [];
    this.replyToMessage = null;
  }

  handleSendMessage() {
    const senderId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const content = this.messageInput.trim();
    const file = this.uploaded;
    if (!content && !file?.url) return;
    let messageType: 'text' | 'image' | 'excel' | 'word' | 'other' = 'text';
    let messageContent = content;

    if (this.selectedFiles.length > 0) {
      const fileToUpload = this.selectedFiles[0];
      messageType = this.getFileType(fileToUpload.type);

      this.messageAPIService.uploadFiles([fileToUpload]).subscribe((res) => {
        messageContent = res.url;
        this.dispatchCreateMessage(messageContent, messageType);
      });

      return;
    }

    if (this.editToMessage) {
      this.messageService.updateEditMessage(this.editToMessage._id, {
        content: messageContent,
      });
    } else {
      this.messageService.createMessage(
        this.groupData._id,
        senderId,
        messageContent,
        username,
        this.replyToMessage?._id ?? null,
        this.replyToMessage?.content ?? null,
        this.replyToMessage?.senderName ?? null,
        this.replyToMessage?.type ?? null,
        messageType,
        [senderId]
      );
    }
    const isReadSub = this.action$
      .pipe(ofType(createMessageSuccess))
      .subscribe(() => {
        this.messageService.updateIsReadMessage(this.groupData._id, senderId);
      });
    this.subscriptions.add(isReadSub);
    this.editToMessage = null;
    this.messageInput = '';
    this.messageService.clearUploadedFile();
    this.replyToMessage = null;
    this.action$.pipe(ofType(createMessageSuccess), take(1)).subscribe(() => {
      this.groupService.loadGroup(this.userId);
    });
  }

  handleChooseFileAndImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.selectedFiles = [file];

      const reader = new FileReader();
      reader.onload = () => {
        this.uploaded = {
          url: reader.result as string,
          originalname: file.name,
          mimetype: file.type,
        };
      };
      reader.readAsDataURL(file);
    }

    input.value = '';
  }

  removeImage() {
    this.messageService.clearUploadedFile();
    this.uploaded = null;
    this.selectedFiles = [];
  }

  handleReply(msg: IMessageGroup) {
    this.replyToMessage = msg;
  }

  handleCloseEdit() {
    this.editToMessage = null;
    this.messageInput = '';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
