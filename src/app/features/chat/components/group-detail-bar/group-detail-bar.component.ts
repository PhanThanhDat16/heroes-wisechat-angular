import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectGroupDetail,
} from '../../../../core/store/group/group.selector';
import { IGroup } from '../../../group/model/group';
import {
  selectMembersGroup,
  selectMessage,
} from '../../../../core/store/message/message.selector';
import { IUser } from '../../../auth/model/user';
import { SocketIOService } from '../../../../core/services/socket.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

const ListTheme = [
  '/assets/public/img/Theme-cloud.webp',
  '/assets/public/img/Theme-family.webp',
  '/assets/public/img/Theme-flower.webp',
  '/assets/public/img/Theme-green.webp',
  '/assets/public/img/Theme-halloween.webp',
];

@Component({
  selector: 'app-group-detail-bar',
  templateUrl: './group-detail-bar.component.html',
  styleUrl: './group-detail-bar.component.scss',
})
export class GroupDetailBarComponent implements OnInit, OnDestroy {
  ListTheme = ListTheme;
  notificationOn = true;
  userOnlineGroup: string[];
  groupData: IGroup;
  listUserByGroup: IUser[] = [];
  groupSub: Subscription;
  quantityImgAndFile: {
    image: number;
    file: number;
  } = {
    image: 0,
    file: 0,
  };

  constructor(
    private store: Store,
    private socketService: SocketIOService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.quantityImgAndFile.file = 0
      this.quantityImgAndFile.image = 0
    })

    this.groupSub = this.store
      .select(selectGroupDetail)
      .subscribe((groupDetail) => {
        this.groupData = groupDetail;
      });

    this.store.select(selectMembersGroup).subscribe((members) => {
      if (members) {
        this.listUserByGroup = members;
        this.socketService.onlineUser$.subscribe((userIds) => {
          this.userOnlineGroup = this.listUserByGroup
            .filter((u) => userIds.includes(u._id))
            .map((u) => u._id);
        });
      }
    });

    this.store.select(selectMessage).subscribe((message) => {
      if (message) {
         this.quantityImgAndFile = { image: 0, file: 0 };
        message.senderId.map((m) => {
          if(m.type === 'image'){
            this.quantityImgAndFile.image++
          }else if(m.type === 'excel' || m.type === 'word'){
            this.quantityImgAndFile.file++
          }
        })
      }
    });
  }

  ngOnDestroy(): void {
    this.groupSub.unsubscribe();
  }
}
