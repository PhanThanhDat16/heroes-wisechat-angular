import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { HeroServiceAPI } from '../../service/heroesAPI.service';
import { IHero } from '../../model/heroes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  heroes: IHero[] = [];
  trackSub: Subscription;
  isLoading = false;

  constructor(private heroServiceAPI: HeroServiceAPI) {}

  ngOnInit(): void {
    this.heroes = [];
    this.isLoading = true;
    this.trackSub = this.heroServiceAPI.getHeroesService().subscribe({
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
