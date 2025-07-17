import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  createHero,
  deleteHero,
  loadHeroes,
  loadHeroesSuccess,
  updateHero,
} from '../../../core/store/hero/hero.actions';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  constructor(private store: Store) {}

  loadHero() {
    this.store.dispatch(loadHeroes());
  }

  loadHeroSuccess(heroes = []) {
    this.store.dispatch(loadHeroesSuccess({ heroes }));
  }

  createHero(hero) {
    this.store.dispatch(createHero({ hero }));
  }

  updateHero(id, hero) {
    this.store.dispatch(updateHero({ id, hero }));
  }

  deleteHero(id) {
    this.store.dispatch(deleteHero({ id }));
  }
}
