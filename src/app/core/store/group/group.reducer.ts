import { createReducer, on } from '@ngrx/store';
import { initialState } from './group.state';
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
import { IGroupMessage } from '../../../features/group/model/group';

export const groupReducer = createReducer(
  initialState,

  on(loadGroup, (state) => ({ ...state, loading: true })),
  on(loadGroupSuccess, (state, { groups }) => ({
    ...state,
    groups,
    loading: false,
  })),
  on(loadGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(loadGroupDetail, (state) => ({ ...state, loading: true })),
  on(loadGroupDetailSuccess, (state, { group }) => ({
    ...state,
    groupDetail: group,
    loading: false,
  })),
  on(loadGroupDetailFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(loadUsersByGroup, (state) => ({ ...state, loading: true })),
  on(loadUsersByGroupSuccess, (state, { users }) => ({
    ...state,
    usersInGroup: users,
    loading: false,
  })),
  on(loadUsersByGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(createGroup, (state) => ({ ...state, loading: true })),
  on(createGroupSuccess, (state, { group }) => ({
    ...state,
    groups: state.groups
      ? [
          ...state.groups,
          {
            ...group,
            isRead: [],
            lastMessage: (group as any).lastMessage ?? 'New Group',
          } as IGroupMessage,
        ]
      : [
          {
            ...group,
            isRead: [],
            lastMessage: (group as any).lastMessage ?? 'New Group',
          } as IGroupMessage,
        ],
    loading: false,
  })),
  on(createGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(updateGroup, (state) => ({ ...state, loading: true })),
  on(updateGroupSuccess, (state, { group }) => ({
    ...state,
    groupDetail: group,
    loading: false,
  })),
  on(updateGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
