import { createReducer, on } from '@ngrx/store';
import { initialState } from './message.state';
import {
  addMemberInGroup,
  addMemberInGroupFailure,
  addMemberInGroupSuccess,
  clearUploadedFile,
  createMessage,
  createMessageFailure,
  createMessageSuccess,
  deleteMemberInGroup,
  deleteMemberInGroupFailure,
  deleteMemberInGroupSuccess,
  deleteMessageEveryone,
  deleteMessageEveryoneFailure,
  deleteMessageEveryoneSuccess,
  deleteMessageForMe,
  deleteMessageForMeFailure,
  deleteMessageForMeSuccess,
  leaveGroup,
  leaveGroupFailure,
  leaveGroupSuccess,
  loadMessage,
  loadMessageFailure,
  loadMessageSuccess,
  reactToMessage,
  reactToMessageFailure,
  reactToMessageSuccess,
  updateEditMessage,
  updateEditMessageFailure,
  updateEditMessageSuccess,
  updateIsRead,
  updateIsReadFailure,
  updateIsReadSuccess,
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
    const isImage = message.type === 'image';
    const isFile = message.type === 'excel' || message.type === 'word';

    return {
      ...state,
      loading: false,
      messageDetail: {
        ...state.messageDetail,
        senderId: [...state.messageDetail.senderId, message],
        mediaImageCount: isImage
          ? (state.messageDetail.mediaImageCount || 0) + 1
          : state.messageDetail.mediaImageCount || 0,
        mediaFileCount: isFile
          ? (state.messageDetail.mediaFileCount || 0) + 1
          : state.messageDetail.mediaFileCount || 0,
      },
    };
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
  on(deleteMessageEveryoneSuccess, (state, { messages }) => {
    const isImage = messages.type === 'image';
    const isFile = messages.type === 'excel' || messages.type === 'word';

    return {
      ...state,
      loading: false,
      messageDetail: state.messageDetail
        ? {
            ...state.messageDetail,
            senderId: state.messageDetail.senderId
              .filter((m) => m._id !== messages._id)
              .map((m) =>
                m.replyToMessageId === messages._id
                  ? {
                      ...m,
                      replyToContent: 'Deleted',
                      replyToType: 'delete',
                      replyToSenderName: null,
                    }
                  : m
              ),
            mediaImageCount: isImage
              ? Math.max((state.messageDetail.mediaImageCount || 1) - 1, 0)
              : state.messageDetail.mediaImageCount || 0,
            mediaFileCount: isFile
              ? Math.max((state.messageDetail.mediaFileCount || 1) - 1, 0)
              : state.messageDetail.mediaFileCount || 0,
          }
        : state.messageDetail,
    };
  }),

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
  on(deleteMessageForMeSuccess, (state, { message }) => {
  const isImage = message.type === 'image';
    const isFile = message.type === 'excel' || message.type === 'word';
    return ({
    ...state,
    loading: false,
    messageDetail: state.messageDetail
      ? {
          ...state.messageDetail,
          senderId: state.messageDetail.senderId.map((m) =>
            m._id === message._id ? message : m
          ),
        mediaImageCount: isImage
          ? Math.max((state.messageDetail.mediaImageCount || 1) - 1, 0)
          : state.messageDetail.mediaImageCount || 0,
        mediaFileCount: isFile
          ? Math.max((state.messageDetail.mediaFileCount || 1) - 1, 0)
          : state.messageDetail.mediaFileCount || 0,
        }
      : state.messageDetail,
  })
  }),
  on(deleteMessageForMeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updateEditMessage, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(updateEditMessageSuccess, (state, { message }) => ({
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
  on(updateEditMessageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updateIsRead, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(updateIsReadSuccess, (state, { message }) => {
    return {
      ...state,
      loading: false,
      messageDetail: state.messageDetail
        ? {
            ...state.messageDetail,
            senderId: state.messageDetail.senderId.map((m) =>
              m._id === message?._id ? message : m
            ),
          }
        : state.messageDetail,
    };
  }),
  on(updateIsReadFailure, (state, { error }) => ({
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
    uploadedFiles: null,
  })),

  on(addMemberInGroup, (state) => ({
    ...state,
    loading: true,
  })),
  on(addMemberInGroupSuccess, (state, { newMember }) => ({
    ...state,
    loading: false,
    messageDetail: state.messageDetail
      ? {
          ...state.messageDetail,
          members: [...newMember, ...state.messageDetail.members],
        }
      : state.messageDetail,
  })),
  on(addMemberInGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(deleteMemberInGroup, (state) => ({
    ...state,
    loading: true,
  })),
  on(deleteMemberInGroupSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    messageDetail: state.messageDetail
      ? {
          ...state.messageDetail,
          members: state.messageDetail.members.filter(
            (u) => u._id !== user.userId
          ),
        }
      : state.messageDetail,
  })),
  on(deleteMemberInGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(leaveGroup, (state) => ({
    ...state,
    loading: true,
  })),
  on(leaveGroupSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    messageDetail: state.messageDetail
      ? {
          ...state.messageDetail,
          members: state.messageDetail.members.filter(
            (u) => u._id !== user.userId
          ),
        }
      : state.messageDetail,
  })),
  on(leaveGroupFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(reactToMessage, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    reactToMessageSuccess,
    (state, { messageId, reactions, quantityReact }) => {
      const updatedMessages = state.messageDetail?.senderId.map((msg) =>
        msg._id === messageId ? { ...msg, reactions, quantityReact } : msg
      );

      return {
        ...state,
        messageDetail: {
          ...state.messageDetail!,
          senderId: updatedMessages!,
        },
      };
    }
  ),
  on(reactToMessageFailure, (state, { error }) => {
    return {
      ...state,
      loading: false,
      error,
    };
  })
);
