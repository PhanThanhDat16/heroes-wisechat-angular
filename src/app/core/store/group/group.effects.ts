import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
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

@Injectable()
export class GroupEffects {
  constructor(
    private action$: Actions,
    private groupService: GroupService,
    private socketService: SocketIOService
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
          catchError((error) => of(loadGroupDetailFailure({ error })))
        )
      )
    )
  );

  loadUsersByGroup$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadUsersByGroup),
      switchMap(({ groupId, search }) =>
        this.groupService.getListUserByGroup(groupId, search).pipe(
          map((users) => loadUsersByGroupSuccess({ users })),
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
          tap((group) => {
            this.socketService.sendUpdateEditGroup({
              senderId: userId,
              senderName: username,
              groupId: group._id,
              name: group.name,
            });
          }),
          map((group) => updateGroupSuccess({ group })),
          catchError((error) => of(updateGroupFailure({ error })))
        );
      })
    )
  );
}
