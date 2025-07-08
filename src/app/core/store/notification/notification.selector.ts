
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { INotiState } from "./notification.state";

const selectNotiState = createFeatureSelector<INotiState>('notification')

export const selectNoti = createSelector(
  selectNotiState,
  (state) => state.listNoti
);

export const selectMessageLoading = createSelector(
  selectNotiState,
  (state) => state.loading
);
