import { createAction, props } from '@ngrx/store';
import {
  IMessageGroup,
  IMessageGroupDetail,
  IUploadedFile,
} from '../../../features/chat/model/message';

export const loadMessage = createAction(
  '[Message] Load Message',
  props<{ groupId: string; page: number; limit: number }>()
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
    replyToContent: string | null;
    replyToSenderName: string | null;
    replyToType: string | null;
    messageType: string;
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
export const updateGroupMessageSuccess = createAction(
  '[Message] Update Group Message Success',
  props<{ message: IMessageGroup }>()
)
export const updateGroupMessageFailure = createAction(
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
