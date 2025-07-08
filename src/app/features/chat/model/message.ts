import { IUser } from '../../auth/model/user';
import { IGroup } from '../../group/model/group';

export interface IMessageGroup {
  _id?: string;
  content: string;
  createdAt: string;
  groupId: string;
  quantityReact: number;
  senderId: string;
  senderName: string;
  updatedAt: string;
  isEdited: boolean;
  replyToMessageId: string | null;
  replyToContent: string | null;
  replyToSenderName: string | null;
  replyToType: string | null;
  type: string;
  readUsers: string[];
  deleteForUser: string[];
  status: string;
  reactions?: Record<string, {
      count: number;
      users: string[];
    }>;
}

export interface IMessageCreate {
  groupId: string;
  senderId: string;
  content: string;
  senderName: string;
  replyToMessageId: string | null;
  replyToContent: string | null;
  replyToSenderName: string | null;
  replyToType: string | null;
  type: string;
}

export interface IUploadedFile {
  url: string;
  originalname: string;
  mimetype: string;
}

export interface IMessageGroupDetail {
  group: IGroup;
  limit: number;
  members: IUser[];
  page: number;
  senderId: IMessageGroup[];
  total: number;
  totalPages: number;
  mediaImageCount?: number;
  mediaFileCount?: number;
}
