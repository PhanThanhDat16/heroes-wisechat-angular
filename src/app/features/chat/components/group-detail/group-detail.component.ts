import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketIOService } from '../../../../core/services/socket.service';
import { IGroup } from '../../../group/model/group';
import { Store } from '@ngrx/store';
import {
  loadGroupDetail,
} from '../../../../core/store/group/group.actions';
import { selectGroupDetail } from '../../../../core/store/group/group.selector';
import {
  loadMessage,
  updateIsRead,
} from '../../../../core/store/message/message.actions';
import { selectMembersGroup } from '../../../../core/store/message/message.selector';
import { IUser } from '../../../auth/model/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {
  groupData: IGroup;
  checkMessageGroup: boolean = false;
  userOnlineGroup: IUser[] = [];
  isGroupDetailBarVisible = true;
  groupSub: Subscription;
  groupId: string | null = null;
  userId = localStorage.getItem('userId');

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // console.log(params)
      this.groupId = params['id'];
      if (this.groupId) {
        this.checkMessageGroup = false;
        this.store.dispatch(loadGroupDetail({ groupId: this.groupId }));
        this.checkMessageGroup = false;
      }
    });

    this.store.select(selectGroupDetail).subscribe((groupDetail) => {
      this.groupData = groupDetail;
      this.store.dispatch(
        loadMessage({ groupId: this.groupId, page: 1, limit: 10 })
      );
    });

    this.store.select(selectMembersGroup).subscribe((members) => {
      if (members) {
        this.socketService.onlineUser$.subscribe((userIds) => {
          this.userOnlineGroup = members.filter((m) => userIds.includes(m._id));
        });
      }
    });

    this.socketService.receiveEditGroup().subscribe((data) => {
      if (this.groupData._id === data.groupId) {
        this.groupData = {
          ...this.groupData,
          name: data.name,
        };
      }
    });

    this.socketService.receiveMessage().subscribe((message) => {
      const route = this.route.snapshot.params['id'];
      if (message.groupId === route) {
        if (this.userId) {
          this.store.dispatch(
            updateIsRead({ groupId: route, userId: this.userId })
          );
        }
      }
    });
  }

  toggleGroupDetailBar() {
    this.isGroupDetailBarVisible = !this.isGroupDetailBarVisible;
  }
}
