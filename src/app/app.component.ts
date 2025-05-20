import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserService } from './api/user.service';
import { loadHeroesSuccess } from './store/hero/hero.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  username: string = 'login';

  constructor(
    private store: Store,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe();
    this.userService.user$.subscribe({
      next: (data) => {
        this.username = data.username;
      },
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(loadHeroesSuccess({ heroes: [] }));
  }
}
