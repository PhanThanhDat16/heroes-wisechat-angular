export interface ITheme {
  name: string;
  image: string;
  selfBg: string;
  selfText: string;
  otherBg: string;
  otherText: string;
  groupId?: string;
  username?: string;
  header?: string
}

export interface IThemeSocket {
  senderId: string;
  senderName: string;
  groupId: string;
  theme: ITheme;
}
