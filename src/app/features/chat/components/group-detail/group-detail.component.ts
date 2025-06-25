import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketIOService } from '../../../../core/services/socket.service';
import { IGroup } from '../../../group/model/group';
import { Store } from '@ngrx/store';
import { loadGroupDetail } from '../../../../core/store/group/group.actions';
import { selectGroupDetail } from '../../../../core/store/group/group.selector';
import { loadMessage, updateIsRead } from '../../../../core/store/message/message.actions';
import { selectMembersGroup } from '../../../../core/store/message/message.selector';
import { IUser } from '../../../auth/model/user';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
})
export class GroupDetailComponent implements OnInit {
  groupData: IGroup;
  checkMessageGroup: boolean = false;
  userOnlineGroup: IUser[] = [];

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = params['id'];

      if (groupId) {
        this.checkMessageGroup = false;

        this.store.dispatch(loadGroupDetail({ groupId }));

        this.store.select(selectGroupDetail).subscribe((groupDetail) => {
          this.groupData = groupDetail;
          this.store.dispatch(loadMessage({ groupId, page: 1, limit: 10 }));
        });

        this.store.select(selectMembersGroup).subscribe((members) => {
          if (members) {
            this.socketService.onlineUser$.subscribe((userIds) => {
              this.userOnlineGroup = members.filter((m) =>
                userIds.includes(m._id)
              );
            });
          }
        });
        this.checkMessageGroup = false;
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


    // this.socketService.receiveMessage().subscribe((message) => {
    //   const route = this.route.snapshot.params['id'];
    //   // if (message.groupId === route) {
    //   //   // this.store.dispatch(updateIsRead({groupId: message.groupId, userId: message.senderId}));
    //   // }
    // });
  }

  // ngOnDestroy(): void {
  //   // if (this.messageSub) this.messageSub.unsubscribe();
  // }
}

// this.store.select(selectGroupDetail).subscribe((groupDetail) => {
//   this.user = groupDetail.user as IUser;
//   this.groupData = groupDetail;
//   this.messagesGroup = [];
//   this.currentPage = 1;
//   this.hasMoreMessages = true;
//   this.isLoadingMessages = false;
//   this.store.dispatch(loadMessage({ groupId, page: 1, limit: 10 }));
//   this.store.select(selectMessage).subscribe((message) => {
//     this.socketService.onlineUser$.subscribe((userIds) => {
//       this.userOnlineGroup = message.members
//         .filter((m) => userIds.includes(m._id))
//         .map((m) => m._id);
//     });
//     // this.socketService.onlineUser$.subscribe((userIds) => {
//     //   this.userOnlineGroup = message.members.filter((m) =>
//     //     userIds.includes(m._id)
//     //   );
//     // });
//     this.messagesGroup = message.senderId;
//     this.checkMessageGroup = true;
//     this.shouldScrollToBottom = true;
//   });
// });
