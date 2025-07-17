import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  clearUploadedFile,
  createMessage,
  createMessageSuccess,
  deleteMessageEveryone,
  deleteMessageEveryoneSuccess,
  deleteMessageForMe,
  deleteMessageForMeSuccess,
  loadMessage,
  reactToMessage,
  reactToMessageSuccess,
  updateEditMessage,
  updateIsRead,
} from '../../../core/store/message/message.actions';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private store: Store) {}

  loadMessage(groupId) {
    this.store.dispatch(loadMessage({ groupId, page: 1, limit: 10 }));
  }

  createMessage(
    groupId,
    senderId,
    content,
    senderName,
    replyToMessageId,
    replyToContent,
    replyToSenderName,
    replyToType,
    messageType,
    readUsers
  ) {
    this.store.dispatch(
      createMessage({
        groupId,
        senderId,
        content,
        senderName,
        replyToMessageId,
        replyToContent,
        replyToSenderName,
        replyToType,
        messageType,
        readUsers,
      })
    );
  }

  createMessageSuccess(message) {
    this.store.dispatch(createMessageSuccess({ message }));
  }

  updateIsReadMessage(groupId, userId) {
    this.store.dispatch(updateIsRead({ groupId, userId }));
  }

  updateEditMessage(messageId, data) {
    this.store.dispatch(
      updateEditMessage({
        messageId,
        data,
      })
    );
  }

  clearUploadedFile() {
    this.store.dispatch(clearUploadedFile());
  }

  deleteMessageEveryone(messageId) {
    this.store.dispatch(deleteMessageEveryone({ messageId }));
  }

  deleteMessageEveryoneSuccess(data) {
    this.store.dispatch(deleteMessageEveryoneSuccess({ messages: data }));
  }

  deleteMessageForMe(messageId, userId) {
    this.store.dispatch(
      deleteMessageForMe({
        messageId,
        userId,
      })
    );
  }

  deleteMessageForMeSuccess(data) {
    this.store.dispatch(deleteMessageForMeSuccess({ message: data }));
  }

  reactToMessage(messageId, userId, types, groupId) {
    this.store.dispatch(reactToMessage({ messageId, userId, types, groupId }));
  }

  reactToMessageSuccess(messageId, reactions, quantityReact) {
    this.store.dispatch(
      reactToMessageSuccess({
        messageId,
        reactions,
        quantityReact,
      })
    );
  }
}
