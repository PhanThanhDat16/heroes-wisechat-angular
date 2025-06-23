import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadHeroesSuccess } from '../../../core/store/hero/hero.actions';
import { SocketIOService } from '../../../core/services/socket.service';
import { loadGroup } from '../../../core/store/group/group.actions';
import { Subscription } from 'rxjs';
import { selectGroups } from '../../../core/store/group/group.selector';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnDestroy, OnInit {
  trackSub: Subscription;

  constructor(private store: Store, private socketService: SocketIOService) {}

  ngOnInit(): void {
    // this.socketService.receiveMessage().subscribe((message) => {
    //   console.log('Message received in Chatapp:', message);
    // });

     const userId = localStorage.getItem('userId');
      
      if (userId) {
      this.socketService.sendUserOnline(userId);
      this.store.dispatch(loadGroup({ userId }));
      this.trackSub = this.store.select(selectGroups).subscribe({
        next: (data) => {
          const listGroupId = data.map((g) => g._id);
          // JOIN GROUP SOCKET
          this.socketService.joinGroup(listGroupId);
        },
        error: (error) => {
          console.log(error)
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(loadHeroesSuccess({ heroes: [] }));
  }
}
