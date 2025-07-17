import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addTagForGroup,
  createGroup,
  deleteGroup,
  deleteGroupSuccess,
  loadGroup,
  loadGroupDetail,
  loadUsersByGroup,
  updateGroup,
  updateThemeGroup,
} from '../../../core/store/group/group.actions';
import {
  addMemberInGroup,
  addMemberInGroupSuccess,
  deleteMemberInGroup,
  deleteMemberInGroupSuccess,
  leaveGroup,
} from '../../../core/store/message/message.actions';
import { IGroupMember } from '../model/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private store: Store) {}

  loadGroup(userId) {
    this.store.dispatch(loadGroup({ userId }));
  }

  loadGroupDetail(groupId) {
    this.store.dispatch(loadGroupDetail({ groupId }));
  }

  loadUserByGroup(groupId) {
    this.store.dispatch(loadUsersByGroup({ groupId }));
  }

  createGroup(data) {
    this.store.dispatch(createGroup({ data }));
  }

  addMemberInGroup(group, users, userId) {
    this.store.dispatch(
      addMemberInGroup({
        group,
        users,
        userId,
      })
    );
  }

  addMemberInGroupSuccess(newMember) {
    this.store.dispatch(addMemberInGroupSuccess({ newMember }));
  }

  addTagInGroup(groupId, userId, tag = '') {
    this.store.dispatch(
      addTagForGroup({
        groupId,
        userId,
        tag,
      })
    );
  }

  deleteMemberInGroup(groupId, memberId) {
    this.store.dispatch(
      deleteMemberInGroup({
        groupId,
        memberId,
      })
    );
  }

  deleteMemberInGroupSuccess(userId) {
    this.store.dispatch(
      deleteMemberInGroupSuccess({
        user: { userId } as IGroupMember,
      })
    );
  }

  leaveGroup(groupId, userId, ownerId) {
    this.store.dispatch(
      leaveGroup({
        groupId,
        userId,
        data: {
          ownerId,
        },
      })
    );
  }

  updateThemeGroup(groupId, theme) {
    this.store.dispatch(updateThemeGroup({ groupId, theme }));
  }

  updateGroup(groupId, name) {
    this.store.dispatch(updateGroup({ groupId, name }));
  }

  deleteGroup(groupId) {
    this.store.dispatch(deleteGroup({ groupId }));
  }
}
