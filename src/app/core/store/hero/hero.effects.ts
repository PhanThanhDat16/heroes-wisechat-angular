import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  createHero,
  createHeroFailure,
  deleteHero,
  deleteHeroFailure,
  // deleteHeroSuccess,
  loadHeroes,
  loadHeroesFailure,
  loadHeroesSuccess,
  updateHero,
  updateHeroFailure,
  // updateHeroSuccess,
} from './hero.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { ToastService } from 'angular-toastify';
import { HeroService } from '../../../features/heroes/service/heroes.service';
import { IHeroUpdate } from '../../../features/heroes/model/heroes';

@Injectable()
export class HeroEffects {
  constructor(
    private action$: Actions,
    private heroService: HeroService,
    private toastService: ToastService
  ) {}

  loadHeroes$ = createEffect(() =>
    this.action$.pipe(
      ofType(loadHeroes),
      switchMap(() =>
        this.heroService.getHeroesByUserIdService().pipe(
          map((heroes) => loadHeroesSuccess({ heroes })),
          catchError(({ error }) => {
            this.toastService.error(error.message);
            return of(loadHeroesFailure({ error }));
          })
        )
      )
    )
  );

  createHero$ = createEffect(() =>
    this.action$.pipe(
      ofType(createHero),
      switchMap(({ hero }) =>
        this.heroService.createHeroService(hero as IHeroUpdate).pipe(
          map(() => {
            this.toastService.success('Create successfully');
            return loadHeroes();
          }),
          catchError(({ error }) => {
            this.toastService.error(error.message);
            return of(createHeroFailure({ error }));
          })
        )
      )
    )
  );

  updateHero$ = createEffect(() =>
    this.action$.pipe(
      ofType(updateHero),
      switchMap(({ id, hero }) =>
        this.heroService.updateHeroService(id, hero as IHeroUpdate).pipe(
          map(() => {
            this.toastService.success('Update Successfully');
            return loadHeroes();
          }),
          catchError(({ error }) => {
            this.toastService.error(error.message);
            return of(updateHeroFailure({ error }));
          })
        )
      )
    )
  );

  deleteHero$ = createEffect(() =>
    this.action$.pipe(
      ofType(deleteHero),
      switchMap(({ id }) =>
        this.heroService.deleteHeroService(id).pipe(
          map(() => {
            this.toastService.success('Delete Successfully');
            return loadHeroes();
          }),
          catchError(({ error }) => {
            this.toastService.error(error.message);
            return of(deleteHeroFailure({ error }));
          })
        )
      )
    )
  );
}
