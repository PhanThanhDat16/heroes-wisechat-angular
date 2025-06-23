import { createReducer, on } from '@ngrx/store';
import { initialState } from './message.state';
import {
  clearUploadedFile,
  createMessage,
  createMessageFailure,
  createMessageSuccess,
  deleteMessageEveryone,
  deleteMessageEveryoneFailure,
  deleteMessageEveryoneSuccess,
  deleteMessageForMe,
  deleteMessageForMeFailure,
  deleteMessageForMeSuccess,
  loadMessage,
  loadMessageFailure,
  loadMessageSuccess,
  uploadFiles,
  uploadFilesFailure,
  uploadFilesSuccess,
} from './message.actions';

export const messageReducer = createReducer(
  initialState,

  on(loadMessage, (state) => ({ ...state, loading: true })),
  on(loadMessageSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    messageDetail: message,
  })),
  on(loadMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(createMessage, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(createMessageSuccess, (state, { message }) => {
    console.log("🚀 message.reducer.ts:45 - message:", message);

    return ({
    ...state,
    loading: false,
    messageDetail: state.messageDetail
      ? {
          ...state.messageDetail,
          senderId: [...state.messageDetail.senderId, message],
        }
      : state.messageDetail,
  })
  }),
  on(createMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteMessageEveryone, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(deleteMessageEveryoneSuccess, (state, { messages }) => ({
    ...state,
    loading: false,
    messageDetail: state.messageDetail
      ? {
          ...state.messageDetail,
          senderId: state.messageDetail.senderId.filter(
            (m) => m._id !== messages?._id
          ),
        }
      : state.messageDetail,
  })),
  on(deleteMessageEveryoneFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteMessageForMe, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(deleteMessageForMeSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    messageDetail: state.messageDetail
      ? {
          ...state.messageDetail,
          senderId: state.messageDetail.senderId.map((m) =>
            m._id === message._id ? message : m
          ),
        }
      : state.messageDetail,
  })),
  on(deleteMessageForMeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteMessageForMe, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(deleteMessageForMeSuccess, (state, { message }) => ({
    ...state,
    loading: false,
    messageDetail: state.messageDetail
      ? {
          ...state.messageDetail,
          senderId: state.messageDetail.senderId.map((m) =>
            m._id === message._id ? message : m
          ),
        }
      : state.messageDetail,
  })),
  on(deleteMessageForMeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(uploadFiles, (state) => ({
    ...state,
    loading: true,
    uploading: true,
    error: null,
  })),
  on(uploadFilesSuccess, (state, { files }) => ({
    ...state,
    loading: false,
    uploading: false,
    uploadedFiles: files,
  })),
  on(uploadFilesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    uploading: false,
    error,
  })),
  on(clearUploadedFile, (state) => ({
    ...state,
    uploadedFiles: null
  }))
);
