import { INotification } from "../../model/notification";

export interface INotiState {
  listNoti: INotification[] | null;
  loading: boolean;
  error: any;
}

export const initialState: INotiState = {
  listNoti: null,
  loading: false,
  error: null,
};