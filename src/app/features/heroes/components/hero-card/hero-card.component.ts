import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { IHero } from '../../model/heroes';

@Component({
  selector: 'app-hero-card',
  templateUrl: './hero-card.component.html',
  styleUrl: './hero-card.component.scss',
})
export class HeroCardComponent implements OnInit {
  owner: string = '';
  isLoading: boolean = false;
  @Input() hero!: IHero;
  @Input() checked: boolean = false;
  @Input() showCheckbox: boolean;
  @Input() navigateDetail: boolean;
  @Output() checkboxChange = new EventEmitter<{
    id: string;
    checked: boolean;
  }>();

  constructor(private userService: UserService) {}

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.checkboxChange.emit({ id: this.hero._id!, checked: checkbox.checked });
  }

  ngOnInit(): void {
    this.owner = this.hero.userInfo?.username as string;
  }
}
