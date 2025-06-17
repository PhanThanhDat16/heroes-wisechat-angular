import { IUser } from "../../auth/model/user";

export interface IGroupMessage {
  _id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  lastMessage: {
    createdAt: string
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
  user?: IUser
  createdAt: string;
  updatedAt: string;
}
