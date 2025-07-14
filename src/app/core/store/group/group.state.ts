import { IUser } from '../../../features/auth/model/user';
import { IGroup, IGroupMessage } from '../../../features/group/model/group';

export interface IGroupState {
  groups: IGroupMessage[] | [];
  groupDetail: IGroup | null;
  usersInGroup: Record<string, IUser[]>;
  loading: boolean;
  error: any;
}

export const initialState: IGroupState = {
  groups: [],
  groupDetail: null,
  usersInGroup: {},
  loading: false,
  error: null,
};
