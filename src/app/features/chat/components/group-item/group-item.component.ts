import { Component, Input, OnInit } from '@angular/core';
import { IGroupMessage } from '../../model/group';
import { SocketIOService } from '../../../../core/services/socket.service';
import { GroupService } from '../../service/group.service';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.scss',
})
export class GroupItemComponent implements OnInit {
  @Input() itemGroup: IGroupMessage;
  userId = localStorage.getItem('userId');
  userOnlineGroup: string[] = [];

  constructor(
    private groupService: GroupService,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    this.groupService.getListUserByGroup(this.itemGroup._id).subscribe({
      next: (listUser) => {
        this.socketService.onlineUser$.subscribe({
          next: (userIds) => {
            const usersArray = Array.isArray(listUser) ? listUser : [];
            this.userOnlineGroup = usersArray
              .filter((m) => userIds.includes(m._id))
              .map((u) => u._id);
          },
        });
      },
    });

    this.socketService.receiveEditGroup().subscribe((data) => {
      if(this.itemGroup._id === data.groupId){
        this.itemGroup.name = data.name
      }
    });
  }
}
