import { createAction, props } from '@ngrx/store';
import { IHero } from '../../types/heroes';

export const loadHeroes = createAction(
  '[Hero] Load Heroes'
);
export const loadHeroesSuccess = createAction(
  '[Hero] Load Heroes Success',
  props<{ heroes: IHero[] }>()
);
export const loadHeroesFailure = createAction(
  '[Hero] Load Heroes Failure',
  props<{ error: any }>()
);

export const createHero = createAction(
  '[Hero] Create Hero',
  props<{ hero: Partial<IHero> }>()
);
export const createHeroSuccess = createAction(
  '[Hero] Create Hero Success',
  props<{ hero: IHero }>()
);
export const createHeroFailure = createAction(
  '[Hero] Create Hero Failure',
  props<{ error: any }>()
);

export const updateHero = createAction(
  '[Hero] Update Hero',
  props<{ id: string; hero: Partial<IHero> }>()
);
export const updateHeroSuccess = createAction(
  '[Hero] Update Hero Success',
  props<{ heroes: IHero[] }>()
);
export const updateHeroFailure = createAction(
  '[Hero] Update Hero Failure',
  props<{ error: any }>()
);

export const deleteHero = createAction(
  '[Hero] Delete Hero',
  props<{ id: string }>()
);
export const deleteHeroSuccess = createAction(
  '[Hero] Delete Hero Success',
  props<{ heroes: IHero[] }>()
);
export const deleteHeroFailure = createAction(
  '[Hero] Delete Hero Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');