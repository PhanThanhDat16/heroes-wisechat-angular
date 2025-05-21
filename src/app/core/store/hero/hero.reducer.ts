import { createReducer, on } from '@ngrx/store';
import { initialState } from './hero.state';
import {
  createHero,
  createHeroFailure,
  createHeroSuccess,
  deleteHero,
  deleteHeroFailure,
  deleteHeroSuccess,
  loadHeroes,
  loadHeroesFailure,
  loadHeroesSuccess,
  logout,
  updateHero,
  updateHeroFailure,
  updateHeroSuccess,
} from './hero.actions';

export const heroReducer = createReducer(
  initialState,

  on(loadHeroes, (state) => ({ ...state, loading: true })),
  on(loadHeroesSuccess, (state, { heroes }) => ({
    ...state,
    heroes,
    loading: false,
    error: null,
  })),
  on(loadHeroesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(createHero, (state) => ({ ...state, loading: true })),
  on(createHeroSuccess, (state, { hero }) => ({
    ...state,
    heroes: [...state.heroes, hero],
    loading: false,
    error: null,
  })),
  on(createHeroFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(updateHero, (state) => ({ ...state, loading: true })),
  on(updateHeroSuccess, (state, { heroes }) => ({
    ...state,
    heroes,
    loading: false,
    error: null,
  })),
  on(updateHeroFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(deleteHero, (state) => ({ ...state, loading: true })),
  on(deleteHeroSuccess, (state, { heroes }) => ({
    ...state,
    heroes,
    loading: false,
    error: null,
  })),
  on(deleteHeroFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(logout, () => initialState)
);
