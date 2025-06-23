import { createFeatureSelector, createSelector } from "@ngrx/store";
import { IMessageState } from "./message.state";

const selectMessageState = createFeatureSelector<IMessageState>('message')

export const selectMessage = createSelector(
  selectMessageState,
  (state) => state.messageDetail
);

export const selectMembersGroup = createSelector(
  selectMessageState,
  (state) => state.messageDetail?.members
)

export const selectMessageLoading = createSelector(
  selectMessageState,
  (state) => state.loading
);

export const selectUploadedFiles = createSelector(
  selectMessageState,
  (state) => state.uploadedFiles
);

export const selectUploading = createSelector(
  selectMessageState,
  (state) => state.uploading
);