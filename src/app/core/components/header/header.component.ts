import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../../api/user.service';
import { logout } from '../../../store/hero/hero.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  username: string = 'login';

  constructor(
    private store: Store,
    private router: Router,
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
}
