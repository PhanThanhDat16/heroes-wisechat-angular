import { Component, DoCheck, OnInit } from '@angular/core';
import { IGroupMessage } from '../../../group/model/group';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SocketIOService } from '../../../../core/services/socket.service';
import { Store } from '@ngrx/store';
import { loadGroup, loadGroupSuccess } from '../../../../core/store/group/group.actions';
import { selectGroups } from '../../../../core/store/group/group.selector';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrl: './chatapp.component.scss',
})
export class ChatappComponent implements OnInit {
  data: IGroupMessage[] = [];
  checkLinkDetail: string | undefined = undefined;

  constructor(
    private store: Store,
    private action$ : Actions,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.store.select(selectGroups).subscribe((groups) => {
        this.data = groups;
      });

      this.socketService.listenNewGroup().subscribe((group: any) => {
        this.store.dispatch(loadGroup({ userId }));
        this.action$.pipe(
          ofType(loadGroupSuccess)
        ).subscribe(() => { 
          this.socketService.joinGroup([group._id]);
        })
      });
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const id = this.route.firstChild?.snapshot.params['id'];
        this.checkLinkDetail = id;
      });

    const id = this.route.firstChild?.snapshot.params['id'];
    if (id) {
      this.checkLinkDetail = id;
    }
  }
}
