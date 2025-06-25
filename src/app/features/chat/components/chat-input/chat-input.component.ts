import { Component, OnInit } from '@angular/core';
import { IMessageGroup } from '../../model/message';
import { Store } from '@ngrx/store';
import {
  clearUploadedFile,
  createMessage,
  updateEditMessage,
  updateIsRead,
  uploadFiles,
} from '../../../../core/store/message/message.actions';
import { selectUploadedFiles } from '../../../../core/store/message/message.selector';
import { selectGroupDetail } from '../../../../core/store/group/group.selector';
import { IGroup } from '../../../group/model/group';
import { MessageShareService } from '../../../../shared/service/message-share.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
})
export class ChatInputComponent implements OnInit {
  selectedFiles: File[] = [];
  messageInput: string = '';
  uploaded: { url?: string; originalname?: string; mimetype?: string } | null =
    null;
  replyToMessage: IMessageGroup | null = null;
  editToMessage: IMessageGroup | null = null;
  groupData: IGroup;

  constructor(
    private store: Store,
    private messageShareService: MessageShareService
  ) {}

  ngOnInit(): void {
    this.store.select(selectGroupDetail).subscribe((data) => {
      if (data) {
        this.groupData = data;
      }
    });

    this.messageShareService.replyMessage$.subscribe((msg) => {
      this.replyToMessage = msg;
    });

    this.messageShareService.editMessage$.subscribe((msg) => {
      this.messageInput = msg.content || '';
      this.editToMessage = msg;
    });

    this.store.select(selectUploadedFiles).subscribe((data) => {
      this.uploaded = data;
      console.log('Uploaded file:', this.uploaded);
    });
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
    if (this.editToMessage) {
      this.store.dispatch(
        updateEditMessage({
          messageId: this.editToMessage._id,
          data: { content: messageContent },
        })
      );
    } else {
      this.store.dispatch(
        createMessage({
          groupId: this.groupData._id,
          senderId,
          content: messageContent,
          senderName: username,
          replyToMessageId: this.replyToMessage?._id ?? null,
          replyToContent: this.replyToMessage?.content ?? null,
          replyToSenderName: this.replyToMessage?.senderName ?? null,
          replyToType: this.replyToMessage?.type ?? null,
          messageType,
          // isRead: this.replyToMessage.isRead
        })
      );

      // console.log({
      //   groupId: this.groupData._id,
      //     senderId,
      //     content: messageContent,
      //     senderName: username,
      //     replyToMessageId: this.replyToMessage?._id ?? null,
      //     replyToContent: this.replyToMessage?.content ?? null,
      //     replyToSenderName: this.replyToMessage?.senderName ?? null,
      //     replyToType: this.replyToMessage?.type ?? null,
      //     messageType,
      // })
    }
    // this.store.dispatch(updateIsRead({ groupId: this.groupData._id , userId: senderId }));
    this.editToMessage = null;
    this.messageInput = '';
    this.store.dispatch(clearUploadedFile());
    this.replyToMessage = null;
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

  handleChooseFileAndImage(event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
      this.store.dispatch(uploadFiles({ files: this.selectedFiles }));
    }
    input.value = '';
  }

  removeImage() {
    this.store.dispatch(clearUploadedFile());
  }

  handleReply(msg: IMessageGroup) {
    this.replyToMessage = msg;
  }

  handleCloseEdit() {
    this.editToMessage = null;
    this.messageInput = '';
  }
}
