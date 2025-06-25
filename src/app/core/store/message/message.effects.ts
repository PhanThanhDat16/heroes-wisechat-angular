import { Injectable } from '@angular/core';
import { MessageService } from '../../../features/chat/service/message.service';
// import { ToastService } from 'angular-toastify';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import {
  createMessage,
  createMessageFailure,
  createMessageSuccess,
  deleteMessageEveryone,
  deleteMessageEveryoneFailure,
  deleteMessageEveryoneSuccess,
  deleteMessageForMe,
  deleteMessageForMeFailure,
  deleteMessageForMeSuccess,
  loadMessage,
  loadMessageFailure,
  loadMessageSuccess,
  updateEditMessage,
  updateEditMessageFailure,
  updateEditMessageSuccess,
  updateIsRead,
  updateIsReadFailure,
  updateIsReadSuccess,
  uploadFiles,
  uploadFilesFailure,
  uploadFilesSuccess,
} from './message.actions';
import { SocketIOService } from '../../services/socket.service';

@Injectable()
export class messageEffects {
  constructor(
    private action$: Actions,
    private messageService: MessageService,
    private socketService: SocketIOService // private toastService: ToastService,
  ) {}

  loadMessage$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadMessage),
      switchMap(({ groupId, page, limit }) =>
        this.messageService.getMessageByGroupService(groupId, page, limit).pipe(
          map((messageDetail) =>
            loadMessageSuccess({ message: messageDetail })
          ),
          catchError(({ error }) => of(loadMessageFailure({ error })))
        )
      )
    )
  );

  createMessage$ = createEffect(() =>
    this.action$.pipe(
      ofType(createMessage),
      switchMap(
        ({
          groupId,
          senderId,
          content,
          senderName,
          replyToMessageId,
          replyToContent,
          replyToSenderName,
          replyToType,
          messageType,
        }) =>
          this.messageService
            .createMessageByGroupService(
              groupId,
              senderId,
              content,
              senderName,
              replyToMessageId,
              replyToContent,
              replyToSenderName,
              replyToType,
              messageType
            )
            .pipe(
              tap((data) => {
                // console.log('Message created:', data);
                this.socketService.sendMessage(
                  data._id,
                  senderId,
                  senderName,
                  data.content,
                  groupId,
                  replyToMessageId,
                  replyToContent,
                  replyToSenderName,
                  replyToType,
                  messageType
                );
              }),
              map((message) => createMessageSuccess({ message })),
              catchError(({ error }) => of(createMessageFailure({ error })))
            )
      )
    )
  );

  deleteMessageEveryone$ = createEffect(() =>
    this.action$.pipe(
      ofType(deleteMessageEveryone),
      mergeMap(({ messageId }) =>
        this.messageService.deleteMessageForEveryone(messageId).pipe(
          tap((data) =>
            this.socketService.deleteMessage(data)
          ),
          map((data) => deleteMessageEveryoneSuccess({ messages: data })),
          catchError(({ error }) => of(deleteMessageEveryoneFailure({ error })))
        )
      )
    )
  );

  deleteMessageForMe$ = createEffect(() =>
    this.action$.pipe(
      ofType(deleteMessageForMe),
      switchMap(({ messageId, userId }) =>
        this.messageService.deleteMessageForMe(messageId, userId).pipe(
          tap((data) => {
            console.log('Delete message for me:', data);
            this.socketService.deleteMessageForMe(data);
          }),
          map((data) => deleteMessageForMeSuccess({ message: data })),
          catchError(({ error }) => of(deleteMessageForMeFailure({ error })))
        )
      )
    )
  );

  updateEditMessage$ = createEffect(() =>
    this.action$.pipe(
      ofType(updateEditMessage),
      mergeMap(({ messageId, data }) =>
        this.messageService.updateEditMEssage(messageId, data).pipe(
          tap((message) => {
            this.socketService.editMessage(message);
          }),
          map((message) => updateEditMessageSuccess({ message })),
          catchError(({ error }) => of(updateEditMessageFailure({ error })))
        )
      )
    )
  );

  updateIsRead$ = createEffect(() =>
    this.action$.pipe(
      ofType(updateIsRead),
      switchMap(({ groupId, userId }) =>
        this.messageService.updateIsReadMessage(groupId, userId).pipe(
          map((message) => updateIsReadSuccess({ message })),
          catchError(({ error }) => of(updateIsReadFailure({ error })))
        )
      )
    )
  );

  uploadFiles$ = createEffect(() =>
    this.action$.pipe(
      ofType(uploadFiles),
      switchMap(({ files }) =>
        this.messageService.uploadFiles(files).pipe(
          map((uploadedFiles) => uploadFilesSuccess({ files: uploadedFiles })),
          catchError(({ error }) => of(uploadFilesFailure({ error })))
        )
      )
    )
  );
}
