import { Component, OnDestroy, OnInit } from '@angular/core';
import { IHero } from '../types/heroes';
import { HeroService } from '../service/heroes.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { loadHeroes } from '../store/hero/hero.actions';
import { selectAllHeroes } from '../store/hero/hero.selectors';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent implements OnInit, OnDestroy {
  heroes: IHero[] = [];
  trackSub: Subscription;
  selectedHeroIds: string[] = [];
  selectAll: boolean = false;

  constructor(private heroService: HeroService, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadHeroes());
    this.trackSub = this.store.select(selectAllHeroes).subscribe({
      next: (data) => (this.heroes = data.heroes),
    });
    // this.heroService.loadHeroesService();
    // this.trackSub = this.heroService.getHeroesService().subscribe({
    //   next: (data) => (this.heroes = data),
    // });
  }

  toggleSelectAll(event: any) {
    this.selectAll = event.target.checked;
    if (event.target.checked) {
      this.selectedHeroIds = this.heroes.map((h) => h._id!);
    } else {
      this.selectedHeroIds = [];
    }
  }

  handleSelectHero(heroId: string, checked: boolean) {
    if (checked) {
      this.selectedHeroIds.push(heroId);
    } else {
      this.selectedHeroIds = this.selectedHeroIds.filter((id) => id !== heroId);
    }
    this.updateSelectAllState();
  }

  updateSelectAllState() {
    this.selectAll = this.selectedHeroIds.length === this.heroes.length;
  }

  handleDeleteSelected() {
    if (this.selectedHeroIds.length === 0) return;

    this.heroService.deleteManyHeroesService(this.selectedHeroIds).subscribe({
      next: () => {
        this.heroes = this.heroes.filter(
          (h) => !this.selectedHeroIds.includes(h._id!)
        );
        this.selectedHeroIds = [];
        this.selectAll = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.trackSub.unsubscribe();
  }
}
