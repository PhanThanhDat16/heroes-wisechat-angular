import { IUser } from '../../auth/model/user';
import { ITheme } from '../../chat/model/theme';

export interface IGroupMessage {
  _id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  readUsers: string[];
  tag: string;
  lastMessage: {
    createdAt: string;
    content: string;
    senderId: string;
    senderName: string;
  } | null;
}

export interface IGroupCreate {
  name: string;
  ownerId: string;
  members: string[];
}

export interface IGroup {
  _id?: string;
  name?: string;
  ownerId: string;
  user?: IUser;
  theme?: string
  tag?: string | null
  members?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IGroupMember {
  _id: string;
  userId: string;
  groupId: string;
  role: string;
  tag: string;
}
