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
    private socketService: SocketIOService
  ) // private toastService: ToastService,
  {}

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
                this.socketService.sendMessage(
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
          map((data) => deleteMessageForMeSuccess({ message: data })),
          catchError(({ error }) => of(deleteMessageForMeFailure({ error })))
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
