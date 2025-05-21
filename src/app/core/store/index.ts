import { ActionReducerMap } from '@ngrx/store';
import { IHeroesState } from './hero/hero.state';
import { heroReducer } from './hero/hero.reducer';
interface IAppState {
  heroes: IHeroesState;
}

export const reducer: ActionReducerMap<IAppState> = {
  heroes: heroReducer,
};
