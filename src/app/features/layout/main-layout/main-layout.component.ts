import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadHeroesSuccess } from '../../../core/store/hero/hero.actions';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnDestroy {

  constructor(
    private store: Store,
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(loadHeroesSuccess({ heroes: [] }));
  }
}
