export interface IMessageGroup {
  _id?: string;
  content: string;
  createdAt: string;
  groupId: string;
  quantityReact: number;
  senderId: string;
  senderName: string;
  updatedAt: string;
  isEdited: boolean,
  replyToMessageId: string | null;
  replyToContent: string | null;
  replyToSenderName: string | null;
  replyToType: string | null;
  type: string;
}