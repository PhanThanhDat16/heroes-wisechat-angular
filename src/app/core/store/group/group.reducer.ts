import { createReducer, on } from '@ngrx/store';
import { initialState } from './group.state';
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
  on(loadUsersByGroupSuccess, (state, { groupId, users }) => ({
    ...state,
    usersInGroup: {
      ...state.usersInGroup,
      [groupId]: users,
    },
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
          {
            ...group,
            readUsers: [],
            tag: null,
            lastMessage: (group as any).lastMessage ?? 'New Group',
          } as IGroupMessage,
          ...state.groups,
        ]
      : state.groups,
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
    groups: state.groups.map((g) =>
      g._id === group._id ? { ...g, ...group } : g
    ),
    groupDetail: group,
    loading: false,
  })),
  on(updateGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(addTagForGroup, (state) => ({ ...state })),
  on(addTagForGroupSuccess, (state, { groupMember }) => ({
    ...state,
    groups: state.groups.map((g) =>
      g._id === groupMember.groupId ? { ...g, tag: groupMember.tag } : g
    ),
  })),
  on(addTagForGroupFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(updateThemeGroup, (state) => ({
    ...state,
    loading: true,
  })),
  on(updateThemeGroupSuccess, (state, { group }) => ({
    ...state,
    groups: state.groups.map((g) =>
      g._id === group._id ? { ...g, ...group } : g
    ),
    groupDetail: group,
    loading: false,
  })),
  on(updateThemeGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(deleteGroup, (state) => ({ ...state })),
  on(deleteGroupSuccess, (state, { groupId }) => ({
    ...state,
    groups: state.groups.filter((g) => g._id !== groupId),
  })),
  on(deleteGroupFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
