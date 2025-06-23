import { Component, OnInit } from '@angular/core';
import { IMessageGroup } from '../../model/message';
import { Store } from '@ngrx/store';
import {
  clearUploadedFile,
  createMessage,
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
  groupData: IGroup;

  constructor(private store: Store, private messageShareService: MessageShareService) {}

  ngOnInit(): void {
    this.store.select(selectGroupDetail).subscribe((data) => {
      if (data) {
        this.groupData = data;
      }
    });

    this.messageShareService.replyMessage$.subscribe((msg) => {
      this.replyToMessage = msg;
    })
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
      this.store.dispatch(
        createMessage({
          groupId: this.groupData._id,
          senderId,
          content: messageContent,
          senderName: username,
          replyToMessageId: null,
          replyToContent: null,
          replyToSenderName: null,
          replyToType: null,
          messageType,
        })
      );
    } else {
      this.store.dispatch(
        createMessage({
          groupId: this.groupData._id,
          senderId,
          content: messageContent,
          senderName: username,
          replyToMessageId: this.replyToMessage._id,
          replyToContent: this.replyToMessage.content,
          replyToSenderName: this.replyToMessage.senderName,
          replyToType: this.replyToMessage.type,
          messageType,
        })
      );
    }

    this.messageInput = '';
    this.uploaded = null;
    this.replyToMessage = null;
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

  handleChooseFileAndImage(event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
      this.store.dispatch(uploadFiles({ files: this.selectedFiles }));
      this.store.select(selectUploadedFiles).subscribe((data) => {
        this.uploaded = data;
      });
    }
  }

  removeImage() {
    this.uploaded = null;
    this.store.dispatch(clearUploadedFile())
  }

  handleReply(msg: IMessageGroup) {
    this.replyToMessage = msg;
  }
}

//   this.messageService
//     .createMessageByGroupService(
//       this.groupData._id as string,
//       senderId,
//       messageContent,
//       username,
//       null,
//       null,
//       null,
//       null,
//       messageType
//     )
//     .subscribe({
//       next: (data) => {
//         // console.log(data)
//         this.socketService.sendMessage(
//           this.groupData._id as string,
//           senderId,
//           username,
//           data.content,
//           null,
//           null,
//           null,
//           null,
//           messageType
//         );
//       },
//       error: (err) => {
//         console.error('Send message failed', err);
//       },
//     });

//   this.messageService
//     .createMessageByGroupService(
//       this.groupData._id as string,
//       senderId,
//       messageContent,
//       username,
//       this.replyToMessage._id,
//       this.replyToMessage.content,
//       this.replyToMessage.senderName,
//       this.replyToMessage.type,
//       messageType
//     )
//     .subscribe({
//       next: (data) => {
//         this.socketService.sendMessage(
//           senderId,
//           username,
//           data.content,
//           this.groupData._id as string,
//           this.replyToMessage._id,
//           this.replyToMessage.content,
//           this.replyToMessage.senderName,
//           this.replyToMessage.type,
//           messageType
//         );
//         this.replyToMessage = null;
//       },
//       error: (err) => {
//         console.error('Send message failed', err);
//       },
//     });
