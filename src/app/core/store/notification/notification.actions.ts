import { createAction, props } from '@ngrx/store';
import { INotification } from '../../model/notification';

export const loadNoti = createAction(
  '[Notification] Load notification',
  props<{ userId: string }>()
);
export const loadNotiSuccess = createAction(
  '[Notification] Load notification Success',
  props<{ listNotiByUser: INotification[] }>()
);
export const loadNotiFailure = createAction(
  '[Notification] Load notification Failure',
  props<{ error: any }>()
);

export const updateReadNoti = createAction(
  '[Notification] Update read notification',
  props<{ notiId: string }>()
);
export const updateReadNotiSuccess = createAction(
  '[Notification] Update read notification success',
  props<{ notiByUser: INotification }>()
);
export const updateReadNotiFailure = createAction(
  '[Notification] Update read notification failure',
  props<{ error: any }>()
);

export const readAllNoti = createAction(
  '[Notification] Read all notification',
  props<{ userId: string }>()
);
export const readAllNotiSuccess = createAction(
  '[Notification] Read all notification success'
);
export const readAllNotiFailure = createAction(
  '[Notification] Read all notification failure',
  props<{ error: any }>()
);

export const deleteAllNoti = createAction(
  '[Notification] Delete all notification',
  props<{ userId: string }>()
);
export const deleteAllNotiSuccess = createAction(
  '[Notification] Delete all notification success'
);
export const deleteAllNotiFailure = createAction(
  '[Notification] Delete all notification failure',
  props<{ error: any }>()
);
