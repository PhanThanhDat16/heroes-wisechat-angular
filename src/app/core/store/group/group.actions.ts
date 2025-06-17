import { createAction, props } from '@ngrx/store';
import {
  IGroup,
  IGroupCreate,
  IGroupMessage,
} from '../../../features/chat/model/group';

export const loadGroup = createAction('[Group] Load Group');
export const loadGroupSuccess = createAction(
  '[Group] Load Group Success',
  props<{ group: IGroupMessage[] | null }>()
);
export const loadGroupFailure = createAction(
  '[Group] Load Group Failure',
  props<{ error: any }>()
);

// export const loadGroupDetail = 

export const createGroup = createAction(
  '[Group] Create Group',
  props<{ group: IGroupCreate }>
);
export const createGroupSuccess = createAction(
  '[Group] Create Group Success',
  props<{ group: IGroupMessage }>()
);
export const createGroupFailure = createAction(
  '[Group] Create Group Failure',
  props<{ error: any }>()
);

export const updateGroup = createAction(
  '[Group] Update Group',
  props<{ groupId: string; data: { name: string } }>()
);
export const updateGroupSuccess = createAction(
  '[Group] Update Group Success',
  props<{ group: IGroup }>()
);
export const updateGroupFailure = createAction(
  '[Group] Update Group Failure',
  props<{ error: any }>()
);
