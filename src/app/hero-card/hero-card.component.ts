import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IHero } from '../types/heroes';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent {
  @Input() hero!: IHero;
  @Input() checked: boolean = false;
  @Input() showCheckbox: boolean;
  @Output() checkboxChange = new EventEmitter<{
    id: string;
    checked: boolean;
  }>();

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.checkboxChange.emit({ id: this.hero._id!, checked: checkbox.checked });
  }
}
