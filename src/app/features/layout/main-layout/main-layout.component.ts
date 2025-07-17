import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SocketIOService } from '../../../core/services/socket.service';
import { Subscription } from 'rxjs';
import { selectGroups } from '../../../core/store/group/group.selector';
import { GroupService } from '../../group/service/groupService.service';
import { HeroService } from '../../heroes/service/hero.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnDestroy, OnInit {
  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private socketService: SocketIOService,
    private groupService: GroupService,
    private heroService: HeroService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      this.socketService.connect();
      this.socketService.sendUserOnline(userId);
      this.groupService.loadGroup(userId);
      const groupSub = this.store.select(selectGroups).subscribe({
        next: (data) => {
          const listGroupId = data.map((g) => g._id);
          // JOIN GROUP SOCKET
          this.socketService.joinGroup(listGroupId);
        },
        error: (error) => {
          console.log(error);
        },
      });

      this.subscriptions.add(groupSub);
    }
  }

  ngOnDestroy(): void {
    this.heroService.loadHeroSuccess();
    this.subscriptions.unsubscribe();
  }
}
