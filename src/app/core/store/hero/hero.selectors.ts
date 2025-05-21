import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IHeroesState } from './hero.state';

export const selectHeroesState = createFeatureSelector<IHeroesState>('heroes');

export const selectAllHeroes = createSelector(
  selectHeroesState,
  (state) => state 
);

export const selectHeroError = createSelector(
  selectHeroesState,
  (state) => state.error
);

export const selectHeroLoading = createSelector(
  selectHeroesState,
  (state) => {
    console.log(state.loading)
    return state.loading
  }
);