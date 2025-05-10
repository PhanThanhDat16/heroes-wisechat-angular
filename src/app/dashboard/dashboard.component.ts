import { Component, OnInit } from '@angular/core';
import { IHero } from '../types/heroes';
import { test } from '../list-hero';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  heroes: IHero[] = [];

  ngOnInit(): void {
    this.heroes = test.slice(0, 4);
  }
}
