import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addTagForGroup,
  addTagForGroupFailure,
  addTagForGroupSuccess,
  createGroup,
  createGroupFailure,
  createGroupSuccess,
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
} from './group.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { IGroup } from '../../../features/group/model/group';
import { GroupService } from '../../../features/group/service/group.service';
import { SocketIOService } from '../../services/socket.service';
import { addMemberInGroupSuccess } from '../message/message.actions';
import { Router } from '@angular/router';

@Injectable()
export class GroupEffects {
  constructor(
    private action$: Actions,
    private groupService: GroupService,
    private socketService: SocketIOService,
    private router: Router
  ) {}

  loadGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadGroup),
      switchMap(({ userId }) =>
        this.groupService.getGroupsByUser(userId).pipe(
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
        this.groupService.getGroupDetail(groupId).pipe(
          map((group) => loadGroupDetailSuccess({ group })),
          catchError((error) => {
            this.router.navigate(['/messages'])
            return of(loadGroupDetailFailure({ error }))
          })
        )
      )
    )
  );

  loadUsersByGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadUsersByGroup),
      mergeMap(({ groupId, search }) =>
        this.groupService.getListUserByGroup(groupId, search).pipe(
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
        this.groupService.createGroup(data).pipe(
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
        return this.groupService.updateGroup(groupId, name).pipe(
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
        this.groupService.addTagGroup(groupId, userId, tag).pipe(
          map((groupMember) => addTagForGroupSuccess({ groupMember })),
          catchError((error) => of(addTagForGroupFailure({ error })))
        )
      )
    )
  );
}
