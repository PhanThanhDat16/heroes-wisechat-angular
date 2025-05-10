import { Component } from '@angular/core';
import { IHero } from '../types/heroes';
import { test } from '../list-hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent {
  heroes: IHero[] = test;
}
