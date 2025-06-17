import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserService } from '../../../core/services/user.service';
import { logout } from '../../../core/store/hero/hero.actions';
import { SocketIOService } from '../../../core/services/socket.service';

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
    private userService: UserService,
    private socketService: SocketIOService
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
    this.socketService.disconnectSocket();
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
