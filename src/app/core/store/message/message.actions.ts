import { createAction, props } from '@ngrx/store';
import { IMessageGroup } from '../../../features/chat/model/message';

export const loadMessage = createAction('[Message] Load Message');
export const loadMessageSuccess = createAction(
  '[Message] Load Message Success',
  props<{ groupId: string; page: number; limit: number }>()
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
// export const createMessageSuccess = createAction(
//   '[Message] Create Message Success',
//   props<{  }>()
// );
// export const createMessageFailure = createAction(
//   '[Message] Create Message Failure',
//   props<{ error: any }>()
// );
