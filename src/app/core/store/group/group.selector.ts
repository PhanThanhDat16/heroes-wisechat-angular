import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IGroupState } from './group.state';

export const selectGroupState = createFeatureSelector<IGroupState>('group');

export const selectGroups = createSelector(
  selectGroupState,
  (state) => state.groups
);

export const selectGroupDetail = createSelector(
  selectGroupState,
  (state) => state.groupDetail
);

export const selectUsersByGroup = createSelector(
  selectGroupState,
  (state) => state.usersInGroup
);

export const selectGroupLoading = createSelector(
  selectGroupState,
  (state) => state.loading
);

export const selectGroupError = createSelector(
  selectGroupState,
  (state) => state.error
);
