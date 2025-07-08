import { IMessageGroupDetail, IUploadedFile } from '../../../features/chat/model/message';

export interface IMessageState {
  messageDetail: IMessageGroupDetail | null;
  loading: boolean;
  error: any;
  uploadedFiles: IUploadedFile | null
  uploading: boolean;
}


export const initialState: IMessageState = {
  messageDetail: null,
  loading: false,
  error: null,
  uploading: false,
  uploadedFiles: null,
};