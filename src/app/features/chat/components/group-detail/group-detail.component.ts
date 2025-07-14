import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketIOService } from '../../../../core/services/socket.service';
import { IGroup } from '../../../group/model/group';
import { Store } from '@ngrx/store';
import { loadGroupDetail } from '../../../../core/store/group/group.actions';
import {
  selectGroupDetail,
  selectGroups,
} from '../../../../core/store/group/group.selector';
import { loadMessage } from '../../../../core/store/message/message.actions';
import { selectMembersGroup } from '../../../../core/store/message/message.selector';
import { IUser } from '../../../auth/model/user';
import { Subscription } from 'rxjs';
import { ITheme } from '../../model/theme';
import { listTheme } from '../../model/listTheme';
import { listTag } from '../../model/listTag';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit, OnDestroy {
  groupData: IGroup;
  userOnlineGroup: IUser[] = [];
  isGroupDetailBarVisible = true;
  tag;
  theme: ITheme | null = null;
  isLoading = false;
  groupId: string | null = null;
  userId = localStorage.getItem('userId');
  isCollapsed = true;
  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    const routeSub = this.route.params.subscribe((params) => {
      this.groupId = params['id'];
      if (this.groupId) {
        this.isLoading = true;
        this.store.dispatch(loadGroupDetail({ groupId: this.groupId }));
      }
    });
    this.subscriptions.add(routeSub);

    this.store.select(selectGroups).subscribe((groups: any[]) => {
      if (groups && groups.length > 0) {
        const group = groups.find((gr: any) => gr._id === this.groupId);
        if (group) {
          this.tag = group.tag;
        }
      }
    });

    this.socketService
      .receiveKickedFromGroup()
      .subscribe(({ groupId, userId }) => {
        if (this.groupId === groupId) {
          this.store.dispatch(loadGroupDetail({ groupId: this.groupId }));
        }
      });

    const groupSub = this.store
      .select(selectGroupDetail)
      .subscribe((groupDetail) => {
        if (groupDetail) {
          this.theme = listTheme.find((t) => t.name === groupDetail.theme);
          this.groupData = groupDetail;
          this.isLoading = false;
          this.store.dispatch(
            loadMessage({ groupId: this.groupId, page: 1, limit: 10 })
          );
        }
      });
    this.subscriptions.add(groupSub);

    const selectMemberSub = this.store
      .select(selectMembersGroup)
      .subscribe((members) => {
        if (members) {
          this.socketService.onlineUser$.subscribe((userIds) => {
            this.userOnlineGroup = members.filter((m) =>
              userIds.includes(m._id)
            );
          });
        }
      });
    this.subscriptions.add(selectMemberSub);

    const receiveEdit = this.socketService
      .receiveEditGroup()
      .subscribe((data) => {
        if (
          this.groupData._id === data.groupId &&
          data.senderId !== this.userId
        ) {
          this.groupData = {
            ...this.groupData,
            name: data.name,
          };
        }
      });
    this.subscriptions.add(receiveEdit);

    // const receiveSub = this.socketService
    //   .receiveMessage()
    //   .subscribe((message) => {
    //     const route = this.route.snapshot.params['id'];
    //     if (message.groupId === route) {
    //       if (this.userId) {
    //         this.store.dispatch(
    //           updateIsRead({ groupId: route, userId: this.userId })
    //         );
    //       }
    //     }
    //   });
    // this.subscriptions.add(receiveSub);
    this.socketService.receiveChangeTheme().subscribe((data) => {
      if (data.groupId === this.groupData._id) {
        this.theme = data.theme;
      }
    });
  }

  toggleGroupDetailBar() {
    this.isGroupDetailBarVisible = !this.isGroupDetailBarVisible;
  }

  getTagStyle(tagName: string) {
    const found = listTag.find(
      (t) => t.tag.toLowerCase() === tagName?.toLowerCase()
    );
    return found
      ? {
          'background-color': found.background,
          color: found.color,
          padding: '4px 8px',
          'border-radius': '12px',
          'font-size': '12px',
        }
      : {};
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
