import { ActionReducerMap } from '@ngrx/store';
import { IHeroesState } from './hero/hero.state';
import { heroReducer } from './hero/hero.reducer';
import { IGroupState } from './group/group.state';
import { groupReducer } from './group/group.reducer';
import { messageReducer } from './message/message.reducer';
import { IMessageState } from './message/message.state';
import { INotiState } from './notification/notification.state';
import { notiReducer } from './notification/notification.reducer';
interface IAppState {
  heroes: IHeroesState;
  group: IGroupState;
  message: IMessageState;
  notification: INotiState;
}

export const reducer: ActionReducerMap<IAppState> = {
  heroes: heroReducer,
  group: groupReducer,
  message: messageReducer,
  notification: notiReducer,

};
