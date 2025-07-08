import { createReducer, on } from '@ngrx/store';
import { initialState } from './notification.state';
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

export const notiReducer = createReducer(
  initialState,
  on(loadNoti, (state) => ({ ...state, loading: true })),
  on(loadNotiSuccess, (state, { listNotiByUser }) => ({
    ...state,
    listNoti: listNotiByUser,
    loading: false,
  })),
  on(loadNotiFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updateReadNoti, (state) => ({
    ...state,
    loading: true,
  })),
  on(updateReadNotiSuccess, (state, { notiByUser }) => ({
    ...state,
    loading: false,
    listNoti: state.listNoti
      ? state.listNoti.map((n) => (n._id === notiByUser._id ? notiByUser : n))
      : state.listNoti,
  })),
  on(updateReadNotiFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(readAllNoti, (state) => ({
    ...state,
    loading: true,
  })),
  on(readAllNotiSuccess, (state) => ({
    ...state,
    loading: false,
    listNoti: state.listNoti?.map((n) => ({ ...n, isRead: true })) ?? [],
  })),
  on(readAllNotiFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteAllNoti, (state) => ({
    ...state,
    loading: true,
  })),
  on(deleteAllNotiSuccess, (state) => ({
    ...state,
    loading: false,
    listNoti: null,
  })),
  on(deleteAllNotiFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
