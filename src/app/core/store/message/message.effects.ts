import { Injectable } from '@angular/core';
import { MessageService } from '../../../features/chat/service/message.service';
// import { ToastService } from 'angular-toastify';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import {
  addMemberInGroup,
  addMemberInGroupFailure,
  addMemberInGroupSuccess,
  createMessage,
  createMessageFailure,
  createMessageSuccess,
  deleteMemberInGroup,
  deleteMemberInGroupFailure,
  deleteMemberInGroupSuccess,
  deleteMessageEveryone,
  deleteMessageEveryoneFailure,
  deleteMessageEveryoneSuccess,
  deleteMessageForMe,
  deleteMessageForMeFailure,
  deleteMessageForMeSuccess,
  leaveGroup,
  leaveGroupFailure,
  leaveGroupSuccess,
  loadMessage,
  loadMessageFailure,
  loadMessageSuccess,
  reactToMessage,
  reactToMessageFailure,
  reactToMessageSuccess,
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
import { GroupService } from '../../../features/group/service/group.service';

@Injectable()
export class messageEffects {
  constructor(
    private action$: Actions,
    private messageService: MessageService,
    private socketService: SocketIOService,
    private groupService: GroupService
  ) {}

  loadMessage$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadMessage),
      switchMap(({ groupId, page, limit, search }) =>
        this.messageService
          .getMessageByGroupService(groupId, page, limit, search)
          .pipe(
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
          readUsers,
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
              messageType,
              readUsers
            )
            .pipe(
              tap((data) => {
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
                  messageType,
                  data.readUsers
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
          tap((data) => this.socketService.deleteMessage(data)),
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
            // console.log('Delete message for me:', data);
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

  addMemberInGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(addMemberInGroup),
      mergeMap(({ group, users, userId }) =>
        this.groupService.addMemberInGroup(group._id, users).pipe(
          tap((data) => {
            this.socketService.addMemberFromGroup(data.result, group, userId);
            this.socketService.sendMessage(
              data.message._id,
              data.message.senderId,
              data.message.senderName,
              data.message.content,
              data.message.groupId,
              data.message.replyToMessageId,
              data.message.replyToContent,
              data.message.replyToSenderName,
              data.message.replyToType,
              data.message.messageType,
              data.message.readUsers
            );
          }),
          map((newMember) =>
            addMemberInGroupSuccess({ newMember: newMember.result })
          ),
          catchError((error) => of(addMemberInGroupFailure({ error })))
        )
      )
    )
  );

  deleteMemberInGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(deleteMemberInGroup),
      switchMap(({ groupId, memberId }) =>
        this.groupService.deleteMemberInGroups(groupId, memberId).pipe(
          tap((data) => {
            const ownerId = localStorage.getItem('userId');
            if (ownerId) {
              this.socketService.kickedFromGroup(
                data.result.userId,
                data.result.groupId,
                ownerId
              );
            }
            this.socketService.sendMessage(
              data.message._id,
              data.message.senderId,
              data.message.senderName,
              data.message.content,
              data.message.groupId,
              data.message.replyToMessageId,
              data.message.replyToContent,
              data.message.replyToSenderName,
              data.message.replyToType,
              data.message.messageType,
              data.message.readUsers
            );
          }),
          map((user) => deleteMemberInGroupSuccess({ user })),
          catchError((error) => of(deleteMemberInGroupFailure({ error })))
        )
      )
    )
  );

  leaveGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(leaveGroup),
      switchMap(({ groupId, userId, data }) =>
        this.groupService.leaveGroup(groupId, userId, data).pipe(
          tap((data) => {
            const oldOwnerId = localStorage.getItem('userId');
            if (oldOwnerId) {
              this.socketService.kickedFromGroup(
                oldOwnerId,
                data.result.groupId,
                data.result.userId
              );
            }
            console.log(data)
            this.socketService.sendMessage(
              data.message._id,
              data.message.senderId,
              data.message.senderName,
              data.message.content,
              data.message.groupId,
              data.message.replyToMessageId,
              data.message.replyToContent,
              data.message.replyToSenderName,
              data.message.replyToType,
              data.message.messageType,
              data.message.readUsers
            );
          }),
          map((user) => leaveGroupSuccess({ user: user.result })),
          catchError((error) => of(leaveGroupFailure({ error })))
        )
      )
    )
  );

  reactToMessage$ = createEffect(() =>
    this.action$.pipe(
      ofType(reactToMessage),
      mergeMap(({ messageId, userId, types, groupId }) =>
        this.messageService
          .reactMessageEmoji(messageId, groupId, { userId, type: types })
          .pipe(
            map((res) =>
              reactToMessageSuccess({
                messageId,
                reactions: res.reactions,
                quantityReact: res.quantityReact,
              })
            ),
            catchError((error) => of(reactToMessageFailure({ error })))
          )
      )
    )
  );
}
