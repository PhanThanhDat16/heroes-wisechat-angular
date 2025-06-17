import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { GroupService } from '../../service/group.service';
import { IUser, IUserGet } from '../../../auth/model/user';
import { SocketIOService } from '../../../../core/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { IGroup } from '../../model/group';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-utils-view-member',
  templateUrl: './utils-view-member.component.html',
  styleUrl: './utils-view-member.component.scss',
})
export class UtilsViewMemberComponent implements OnInit, OnDestroy {
  groupData: IGroup;
  step: number = 1;
  userId = localStorage.getItem('userId');
  listUserByGroup: IUser[] = [];
  userOnlineGroup: string[] = [];
  nameUser = new FormControl('');
  user: IUserGet;
  nameUserSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private userService: UserService,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = params['id'];
      this.groupService.getListUserByGroup(groupId).subscribe({
        next: (data) => {
          this.listUserByGroup = data;
          this.socketService.onlineUser$.subscribe((userIds) => {
            this.userOnlineGroup = this.listUserByGroup
              .filter((u) => userIds.includes(u._id))
              .map((u) => u._id);
          });
        },
      });

      this.groupService.getGroupDetail(groupId).subscribe({
        next: (data) => (this.groupData = data),
      });

      if (this.nameUserSub) {
        this.nameUserSub.unsubscribe();
      }

      this.nameUserSub = this.nameUser.valueChanges
        .pipe(debounceTime(300))
        .subscribe((search) => {
          const query = search.trim() || '';
          console.log(groupId);
          this.groupService.getListUserByGroup(groupId, query).subscribe({
            next: (data: IUser[]) => {
              this.listUserByGroup = data;
            },
            error: () => {
              this.listUserByGroup = [];
            },
          });
        });
    });
  }

  onResetStep(dataStep: number) {
    this.step = dataStep;
  }

  handleViewProfile(id: string) {
    this.step = 2;
    this.userService.getUserDetail(id).subscribe({
      next: (data) => {
        this.user = data;
      },
    });
  }

  handleBackView() {
    this.step = 1;
  }

  ngOnDestroy(): void {
    this.nameUserSub.unsubscribe();
  }
}
