import { ActionReducerMap } from '@ngrx/store';
import { IHeroesState } from './hero/hero.state';
import { heroReducer } from './hero/hero.reducer';
import { IGroupState } from './group/group.state';
import { groupReducer } from './group/group.reducer';
import { messageReducer } from './message/message.reducer';
import { IMessageState } from './message/message.state';
interface IAppState {
  heroes: IHeroesState;
  group: IGroupState,
  message: IMessageState
}

export const reducer: ActionReducerMap<IAppState> = {
  heroes: heroReducer,
  group: groupReducer,
  message: messageReducer
};
