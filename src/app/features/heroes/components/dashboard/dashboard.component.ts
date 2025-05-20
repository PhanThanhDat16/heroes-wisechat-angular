import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { IHero } from '../../../../types/heroes';
import { HeroService } from '../../../../api/heroes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  heroes: IHero[] = [];
  trackSub: Subscription;
  isLoading = false;

  constructor(private heroService: HeroService, private store: Store) {}

  ngOnInit(): void {
    this.heroes = [];
    this.isLoading = true;
    this.trackSub = this.heroService.getHeroesService().subscribe({
      next: (data) => {
         this.isLoading = false;
         this.heroes = data
      },
    });
  }

  ngOnDestroy(): void {
    this.heroes = [];
    this.trackSub.unsubscribe();
  }
}
