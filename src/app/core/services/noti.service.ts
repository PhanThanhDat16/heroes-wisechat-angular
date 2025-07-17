import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  deleteAllNoti,
  loadNoti,
  readAllNoti,
  updateReadNoti,
} from '../store/notification/notification.actions';

@Injectable({
  providedIn: 'root',
})
export class notiService {
  constructor(private store: Store) {}

  loadNoti(userId) {
    this.store.dispatch(loadNoti({ userId }));
  }

  readAllNoti(userId) {
    this.store.dispatch(readAllNoti({ userId }));
  }

  deleteAllNoti(userId) {
    this.store.dispatch(deleteAllNoti({ userId }));
  }

  updateReadNoti(notiId) {
    this.store.dispatch(updateReadNoti({ notiId }));
  }
}
