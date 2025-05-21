import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IHero } from '../../../../core/model/heroes';
import { UserService } from '../../../../core/services/user.service';

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
    this.isLoading = true;
    this.userService.getUserDetail(this.hero.userId as string).subscribe({
      next: (data) => {
        this.owner = data.username;
        this.isLoading = false;
      },
    });
  }
}
