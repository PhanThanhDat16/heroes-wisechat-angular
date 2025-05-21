import { IHero } from "../../model/heroes";

export interface IHeroesState {
  heroes: IHero[];
  loading: boolean;
  error: any;
}

export const initialState: IHeroesState = {
  heroes: [],
  loading: false,
  error: null,
};
