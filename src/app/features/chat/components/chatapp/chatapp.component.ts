import { Component, OnDestroy, OnInit } from '@angular/core';
import { IGroupMessage } from '../../../group/model/group';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter, map, startWith, Subscription } from 'rxjs';
import { SocketIOService } from '../../../../core/services/socket.service';
import { Store } from '@ngrx/store';
import {
  loadGroupSuccess,
} from '../../../../core/store/group/group.actions';
import { selectGroups } from '../../../../core/store/group/group.selector';
import { Actions, ofType } from '@ngrx/effects';
import { FormControl } from '@angular/forms';
import { GroupService } from '../../../group/service/groupService.service';
import { notiService } from '../../../../core/services/noti.service';

@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrl: './chatapp.component.scss',
})
export class ChatappComponent implements OnInit, OnDestroy {
  data: IGroupMessage[] = [];
  checkLinkDetail: string | undefined = undefined;
  userId = localStorage.getItem('userId');
  currentGroupId: string | null = null;
  checkGroupIdRead = '';
  query = '';
  searchGeneral = new FormControl('');
  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private action$: Actions,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketIOService,
    private groupService: GroupService,
    private notiService: notiService
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.route.firstChild?.snapshot.paramMap.get('id') || null),
        startWith(this.route.firstChild?.snapshot.paramMap.get('id') || null)
      )
      .subscribe((id) => (this.currentGroupId = id));

    const userId = localStorage.getItem('userId');
    if (userId) {
      const groupSub = this.store.select(selectGroups).subscribe((groups) => {
        this.data = groups;
      });
      this.subscriptions.add(groupSub);

      const newGroupSub = this.socketService
        .listenNewGroup()
        .subscribe((group: any) => {
          this.groupService.loadGroup(userId);
          const effectSub = this.action$
            .pipe(ofType(loadGroupSuccess))
            .subscribe(() => {
              this.socketService.joinGroup([group._id]);
            });
          this.subscriptions.add(effectSub);

          if (group.ownerId !== userId) {
            this.notiService.loadNoti(userId);
          }
        });
      this.subscriptions.add(newGroupSub);

      const receiveSub = this.socketService
        .receiveMessage()
        .subscribe((message) => {
          if (message) {
            // const dataClone = [...this.data];
            // const index = this.data.findIndex((g) => g._id === message.groupId);
            // if (index !== -1) {
            //   const updatedGroup = {
            //     ...this.data[index],
            //     lastMessage: {
            //       content: message.content,
            //       senderId: message.senderId,
            //       senderName: message.senderName,
            //       createdAt: message.createdAt,
            //     },
            //   };
            //   dataClone.splice(index, 1);
            //   dataClone.unshift(updatedGroup);
            //   this.data = dataClone;
            // }
            this.groupService.loadGroup(userId);
          }
        });
      this.subscriptions.add(receiveSub);
    }

    const routeSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLinkDetail = this.route.firstChild?.snapshot.params['id'];
      });
    this.subscriptions.add(routeSub);

    const kickedSelfSub = this.socketService
      .receiveKickedFromGroup()
      .subscribe(({ groupId, userId }) => {
        if (userId === this.userId) {
          this.data = this.data.filter((g) => g._id !== groupId);
          this.socketService.leaveGroup(groupId);
          this.router.navigate(['/messages']);
        }
      });
    this.subscriptions.add(kickedSelfSub);

    const addMemberGroupSub = this.socketService
      .receiveAddMemberFromGroup()
      .subscribe(({ group, listUser, userId }) => {
        if (this.userId !== userId) {
          this.socketService.joinGroup([group._id]);
          this.groupService.loadGroup(this.userId!);
        }
        //  else {
        //   console.log('đã join');
        //   const existingGroupIds = this.data.map((g) => g._id);
        //   if (!existingGroupIds.includes(group._id)) {
        //     this.store.dispatch(loadGroup({ userId: this.userId! }));
        //   }
        // }
      });
    this.subscriptions.add(addMemberGroupSub);

    const id = this.route.firstChild?.snapshot.params['id'];
    if (id) {
      this.checkLinkDetail = id;
    }

    this.searchGeneral.valueChanges
      .pipe(debounceTime(300))
      .subscribe((search) => {
        this.query = search?.trim() || '';
      });
  }

  handleResetSearch(search) {
    this.searchGeneral.setValue('');
    this.query = '';
  }

  trackByGroup(index: number, item: IGroupMessage) {
    return item._id;
  }

  handleResetGroupIdRead(id) {
    this.checkGroupIdRead = id;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
