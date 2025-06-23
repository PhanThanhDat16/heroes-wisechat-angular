import { createAction, props } from '@ngrx/store';
import {
  IGroup,
  IGroupCreate,
  IGroupMessage,
} from '../../../features/group/model/group';
import { IUser } from '../../../features/auth/model/user';

export const loadGroup = createAction(
  '[Group] Load Group',
  props<{ userId: string }>()
);
export const loadGroupSuccess = createAction(
  '[Group] Load Group Success',
  props<{ groups: IGroupMessage[] | [] }>()
);
export const loadGroupFailure = createAction(
  '[Group] Load Group Failure',
  props<{ error: any }>()
);

export const loadGroupDetail = createAction(
  '[Group] Load Group Detail',
  props<{ groupId: string }>()
);
export const loadGroupDetailSuccess = createAction(
  '[Group] Load Group Detail Success',
  props<{ group: IGroup }>()
);
export const loadGroupDetailFailure = createAction(
  '[Group] Load Group Detail Failure',
  props<{ error: any }>()
);

export const loadUsersByGroup = createAction(
  '[Group] Load Users By Group',
  props<{ groupId: string; search?: string }>()
);
export const loadUsersByGroupSuccess = createAction(
  '[Group] Load Users By Group Success',
  props<{ users: IUser[] }>()
);
export const loadUsersByGroupFailure = createAction(
  '[Group] Load Users By Group Failure',
  props<{ error: any }>()
);

export const createGroup = createAction(
  '[Group] Create Group',
  props<{ data: IGroupCreate }>()
);
export const createGroupSuccess = createAction(
  '[Group] Create Group Success',
  props<{ group: IGroup }>()
);
export const createGroupFailure = createAction(
  '[Group] Create Group Failure',
  props<{ error: any }>()
);

export const updateGroup = createAction(
  '[Group] Update Group',
  props<{ groupId: string; name: string }>()
);
export const updateGroupSuccess = createAction(
  '[Group] Update Group Success',
  props<{ group: IGroup }>()
);
export const updateGroupFailure = createAction(
  '[Group] Update Group Failure',
  props<{ error: any }>()
);
