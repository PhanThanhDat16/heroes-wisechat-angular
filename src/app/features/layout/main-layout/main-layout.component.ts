import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadHeroesSuccess } from '../../../core/store/hero/hero.actions';
import { SocketIOService } from '../../../core/services/socket.service';
import { GroupService } from '../../chat/service/group.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnDestroy, OnInit {
  constructor(
    private store: Store,
    private socketService: SocketIOService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    // this.socketService.receiveMessage().subscribe((message) => {
    //   console.log('Message received in Chatapp:', message);
    // });

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.groupService.getGroupsByUser(userId).subscribe({
        next: (data) => {
          const listGroupId = data.map((g) => g._id);
          // JOIN GROUP SOCKET
          this.socketService.joinGroup(listGroupId);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(loadHeroesSuccess({ heroes: [] }));
  }
}
