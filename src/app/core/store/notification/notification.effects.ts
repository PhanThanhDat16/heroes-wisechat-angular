import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SocketIOService } from '../../services/socket.service';
import { NotiService } from '../../services/noti.service';
import {
  deleteAllNoti,
  deleteAllNotiFailure,
  deleteAllNotiSuccess,
  loadNoti,
  loadNotiFailure,
  loadNotiSuccess,
  readAllNoti,
  readAllNotiFailure,
  readAllNotiSuccess,
  updateReadNoti,
  updateReadNotiFailure,
  updateReadNotiSuccess,
} from './notification.actions';
import { catchError, map, of, switchMap } from 'rxjs';

@Injectable()
export class NotiEffects {
  constructor(
    private action$: Actions,
    private socketService: SocketIOService,
    private notiSerivce: NotiService
  ) {}

  loadNoti$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadNoti),
      switchMap(({ userId }) =>
        this.notiSerivce.getNotiByUser(userId).pipe(
          map((listNotiByUser) => loadNotiSuccess({ listNotiByUser })),
          catchError(({ error }) => of(loadNotiFailure({ error })))
        )
      )
    )
  );

  updateReadNoti$ = createEffect(() =>
    this.action$.pipe(
      ofType(updateReadNoti),
      switchMap(({ notiId }) =>
        this.notiSerivce.updateReadNoti(notiId).pipe(
          map((notiByUser) => updateReadNotiSuccess({ notiByUser })),
          catchError(({ error }) => of(updateReadNotiFailure({ error })))
        )
      )
    )
  );

  readAllNoti$ = createEffect(() =>
    this.action$.pipe(
      ofType(readAllNoti),
      switchMap(({ userId }) =>
        this.notiSerivce.updateReadAllNoti(userId).pipe(
          map(() => readAllNotiSuccess()),
          catchError(({ error }) => of(readAllNotiFailure({ error })))
        )
      )
    )
  );

  deleteAllNoti$ = createEffect(() =>
    this.action$.pipe(
      ofType(deleteAllNoti),
      switchMap(({ userId }) =>
        this.notiSerivce.deleteAllNotiByUser(userId).pipe(
          map(() => deleteAllNotiSuccess()),
          catchError(({ error }) => of(deleteAllNotiFailure({ error })))
        )
      )
    )
  );
}
