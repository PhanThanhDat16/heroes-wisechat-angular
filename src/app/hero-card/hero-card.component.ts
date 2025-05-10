import { Component, Input } from '@angular/core';
import { IHero } from '../types/heroes';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss'
})
export class HeroCardComponent {
  @Input() hero: IHero;
}
