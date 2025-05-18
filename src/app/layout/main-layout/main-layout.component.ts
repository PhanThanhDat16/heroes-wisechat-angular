import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadHeroesSuccess, logout } from '../../store/hero/hero.actions';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  username: string = 'login';

  constructor(
    private store: Store,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe();
    this.userService.user$.subscribe({
      next: (data) => (this.username = data.username),
    });
  }

  handleLogout() {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  }

  handleNavigateProfile() {
    this.router.navigate(['/profile']);
  }

  handleNavigateTag() {
    this.router.navigate(['/tag']);
  }

  ngOnDestroy(): void {
    this.store.dispatch(loadHeroesSuccess({ heroes: [] }));
  }
}
