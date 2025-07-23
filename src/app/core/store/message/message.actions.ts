import { createAction, props } from '@ngrx/store';
import {
  IMessageGroup,
  IMessageGroupDetail,
  IUploadedFile,
} from '../../../features/chat/model/message';
import { IUser } from '../../../features/auth/model/user';
import { IGroup, IGroupMember } from '../../../features/group/model/group';

export const loadMessage = createAction(
  '[Message] Load Message',
  props<{ groupId: string; page: number; limit: number; search?: string }>()
);
export const loadMessageSuccess = createAction(
  '[Message] Load Message Success',
  props<{ message: IMessageGroupDetail }>()
);
export const loadMessageFailure = createAction(
  '[Message] Load Message Failure',
  props<{ error: any }>()
);

export const createMessage = createAction(
  '[Message] Create Message',
  props<{
    groupId: string;
    senderId: string;
    content: string;
    senderName: string;
    replyToMessageId: string | null;
    messageType: string;
    readUsers: string[]
  }>()
);
export const createMessageSuccess = createAction(
  '[Message] Create Message Success',
  props<{ message: IMessageGroup }>()
);
export const createMessageFailure = createAction(
  '[Message] Create Message Failure',
  props<{ error: any }>()
);

export const deleteMessageEveryone = createAction(
  '[Message] Delete Message',
  props<{messageId: string}>()
)
export const deleteMessageEveryoneSuccess = createAction(
  '[Message] Delete Message Success',
  props<{messages: IMessageGroup}>()
)
export const deleteMessageEveryoneFailure = createAction(
  '[Message] Delete Message Failure',
  props<{error: any}>()
)

export const deleteMessageForMe = createAction(
  '[Message] Delete Message For Me',
  props<{messageId: string, userId: string}>()
)
export const deleteMessageForMeSuccess = createAction(
  '[Message] Delete Message For Me Success',
  props<{message: IMessageGroup}>()
)
export const deleteMessageForMeFailure = createAction(
  '[Message] Delete Message For Me Failure',
  props<{error: any}>()
)

export const updateIsRead = createAction(
  '[Message] Update Is Read',
  props<{ groupId: string; userId: string }>()
)
export const updateIsReadSuccess = createAction(
  '[Message] Update Is Read Success',
  props<{ message: IMessageGroup }>()
)
export const updateIsReadFailure = createAction(
  '[Message] Update Is Read Failure',
  props<{ error: any }>()
);

export const updateEditMessage = createAction(
  '[Message] Update Edit Message',
  props<{ messageId: string; data: { content: string } }>()
)
export const updateEditMessageSuccess = createAction(
  '[Message] Update Group Message Success',
  props<{ message: IMessageGroup }>()
)
export const updateEditMessageFailure = createAction(
  '[Message] Update Group Message Failure',
  props<{ error: any }>()
);

export const uploadFiles = createAction(
  '[Message] Upload Files',
  props<{ files: File[] }>()
);
export const uploadFilesSuccess = createAction(
  '[Message] Upload Files Success',
  props<{ files: IUploadedFile }>()
);
export const uploadFilesFailure = createAction(
  '[Message] Upload Files Failure',
  props<{ error: any }>()
);
export const clearUploadedFile = createAction('[Message] Clear Uploaded File');


export const addMemberInGroup = createAction(
  '[Message] Add Member In Group',
  props<{ group: IGroup; users: string[], userId: string }>()
);
export const addMemberInGroupSuccess = createAction(
  '[Message] Add Member In Group Success',
  props<{ newMember: IUser[] }>()
);
export const addMemberInGroupFailure = createAction(
  '[Message] Add Member In Group Failure',
  props<{ error: any }>()
);

export const deleteMemberInGroup = createAction(
  '[Message] Delete Member In Group',
  props<{ groupId: string; memberId: string }>()
);
export const deleteMemberInGroupSuccess = createAction(
  '[Message] Delete Member In Group Success',
  props<{ user: IGroupMember }>()
);
export const deleteMemberInGroupFailure = createAction(
  '[Message] Delete Member In Group Failure',
  props<{ error: any }>()
);

export const leaveGroup = createAction(
  '[Message] Leave Group',
  props<{ groupId: string; userId: string, data: { ownerId: string | null } }>()
)
export const leaveGroupSuccess = createAction(
  '[Message] Leave Group Success',
  props<{ user: IGroupMember }>()
)
export const leaveGroupFailure = createAction(
  '[Message] Leave Group Failure',
  props<{ error: any }>()
)

export const reactToMessage = createAction(
  '[Message] React To Message',
  props<{ messageId: string; userId: string; types: string; groupId: string }>()
);

export const reactToMessageSuccess = createAction(
  '[Message] React To Message Success',
  props<{ messageId: string; reactions: any, quantityReact: number }>()
);

export const reactToMessageFailure = createAction(
  '[Message] React To Message Failure',
  props<{ error: any }>()
);