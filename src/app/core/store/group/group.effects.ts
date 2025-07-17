import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addTagForGroup,
  addTagForGroupFailure,
  addTagForGroupSuccess,
  createGroup,
  createGroupFailure,
  createGroupSuccess,
  deleteGroup,
  deleteGroupFailure,
  deleteGroupSuccess,
  loadGroup,
  loadGroupDetail,
  loadGroupDetailFailure,
  loadGroupDetailSuccess,
  loadGroupFailure,
  loadGroupSuccess,
  loadUsersByGroup,
  loadUsersByGroupFailure,
  loadUsersByGroupSuccess,
  updateGroup,
  updateGroupFailure,
  updateGroupSuccess,
  updateThemeGroup,
  updateThemeGroupFailure,
  updateThemeGroupSuccess,
} from './group.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { IGroup } from '../../../features/group/model/group';
import { GroupServiceAPI } from '../../../features/group/service/groupAPI.service';
import { SocketIOService } from '../../services/socket.service';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { listTheme } from '../../../features/chat/model/listTheme';

@Injectable()
export class GroupEffects {
  constructor(
    private action$: Actions,
    private groupServiceAPI: GroupServiceAPI,
    private socketService: SocketIOService,
    private router: Router,
    private toastService: ToastService
  ) {}

  loadGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadGroup),
      switchMap(({ userId }) =>
        this.groupServiceAPI.getGroupsByUser(userId).pipe(
          map((groups) => loadGroupSuccess({ groups })),
          catchError((error) => of(loadGroupFailure({ error })))
        )
      )
    )
  );

  loadGroupDetail$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadGroupDetail),
      switchMap(({ groupId }) =>
        this.groupServiceAPI.getGroupDetail(groupId).pipe(
          map((group) => loadGroupDetailSuccess({ group })),
          catchError((error) => {
            return of(loadGroupDetailFailure({ error }));
          })
        )
      )
    )
  );

  loadUsersByGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadUsersByGroup),
      mergeMap(({ groupId, search }) =>
        this.groupServiceAPI.getListUserByGroup(groupId, search).pipe(
          map((users) => loadUsersByGroupSuccess({ groupId, users })),
          catchError((error) => of(loadUsersByGroupFailure({ error })))
        )
      )
    )
  );

  createGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(createGroup),
      mergeMap(({ data }) =>
        this.groupServiceAPI.createGroup(data).pipe(
          tap((group: IGroup) => {
            this.socketService.sendNewGroup({
              ...group,
              members: data.members,
            });
          }),
          map((group: IGroup) => createGroupSuccess({ group })),
          catchError((error) => of(createGroupFailure({ error })))
        )
      )
    )
  );

  updateGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(updateGroup),
      mergeMap(({ groupId, name }) => {
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        return this.groupServiceAPI.updateGroup(groupId, name).pipe(
          tap((data) => {
            this.socketService.sendUpdateEditGroup({
              senderId: userId,
              senderName: username,
              groupId: data.result._id,
              name: data.result.name,
            });

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
          map((group) => updateGroupSuccess({ group: group.result })),
          catchError((error) => of(updateGroupFailure({ error })))
        );
      })
    )
  );

  addTagForGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(addTagForGroup),
      switchMap(({ userId, groupId, tag }) =>
        this.groupServiceAPI.addTagGroup(groupId, userId, tag).pipe(
          map((groupMember) => addTagForGroupSuccess({ groupMember })),
          catchError((error) => of(addTagForGroupFailure({ error })))
        )
      )
    )
  );

  updateThemeGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(updateThemeGroup),
      mergeMap(({ groupId, theme }) => {
        const senderId = localStorage.getItem('userId');
        const senderName = localStorage.getItem('username');

        return this.groupServiceAPI.updateThemeGroup(groupId, theme).pipe(
          tap((data) => {
            this.socketService.changeTheme({
              senderId,
              senderName,
              groupId: data.result._id,
              theme: listTheme.find((t) => t.name === data.result.theme),
            });

            if (data.message) {
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
            }
          }),
          map((data) => updateThemeGroupSuccess({ group: data.result })),
          catchError((error) => of(updateThemeGroupFailure({ error })))
        );
      })
    )
  );

  deleteGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(deleteGroup),
      switchMap(({ groupId }) =>
        this.groupServiceAPI.deleteGroup(groupId).pipe(
          map((groupId) => deleteGroupSuccess({ groupId })),
          catchError((error) => of(deleteGroupFailure({ error })))
        )
      )
    )
  );
}
