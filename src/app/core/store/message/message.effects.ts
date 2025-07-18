import { Injectable } from '@angular/core';
import { MessageAPIService } from '../../../features/chat/service/messageAPI.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
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
import { GroupServiceAPI } from '../../../features/group/service/groupAPI.service';

@Injectable()
export class messageEffects {
  constructor(
    private action$: Actions,
    private messageAPI: MessageAPIService,
    private socketService: SocketIOService,
    private groupServiceAPI: GroupServiceAPI
  ) {}

  loadMessage$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadMessage),
      switchMap(({ groupId, page, limit, search }) =>
        this.messageAPI
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
          this.messageAPI
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
        this.messageAPI.deleteMessageForEveryone(messageId).pipe(
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
        this.messageAPI.deleteMessageForMe(messageId, userId).pipe(
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
        this.messageAPI.updateEditMEssage(messageId, data).pipe(
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
        this.messageAPI.updateIsReadMessage(groupId, userId).pipe(
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
        this.messageAPI.uploadFiles(files).pipe(
          map((uploadedFiles) => uploadFilesSuccess({ files: uploadedFiles })),
          catchError(({ error }) => of(uploadFilesFailure({ error })))
        )
      )
    )
  );

  addMemberInGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(addMemberInGroup),
      switchMap(({ group, users, userId }) =>
        this.groupServiceAPI.addMemberInGroup(group._id, {users, group}).pipe(
          map((newMember) => addMemberInGroupSuccess({ newMember: newMember.result })
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
        this.groupServiceAPI.deleteMemberInGroups(groupId, memberId).pipe(
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
        this.groupServiceAPI.leaveGroup(groupId, userId, data).pipe(
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
        this.messageAPI
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
