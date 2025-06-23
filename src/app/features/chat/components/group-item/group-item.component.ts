import { Component, Input, OnInit } from '@angular/core';
import { SocketIOService } from '../../../../core/services/socket.service';
import { IGroupMessage } from '../../../group/model/group';
import { Store } from '@ngrx/store';
import { loadUsersByGroup } from '../../../../core/store/group/group.actions';
import { selectUsersByGroup } from '../../../../core/store/group/group.selector';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.scss',
})
export class GroupItemComponent implements OnInit {
  @Input() itemGroup: IGroupMessage;
  userId = localStorage.getItem('userId');
  userOnlineGroup: string[] = [];
  itemRealtimeGroup: IGroupMessage | null = null;

  constructor(private store: Store, private socketService: SocketIOService) {}

  ngOnInit(): void {
    this.store.dispatch(loadUsersByGroup({ groupId: this.itemGroup._id }));
    this.store.select(selectUsersByGroup).subscribe((listUser) => {
      this.socketService.onlineUser$.subscribe({
        next: (userIds) => {
          const usersArray = Array.isArray(listUser) ? listUser : [];
          this.userOnlineGroup = usersArray
            .filter((m) => userIds.includes(m._id))
            .map((u) => u._id);
        },
      });
    });

    this.itemRealtimeGroup = null;

    this.socketService.receiveEditGroup().subscribe((data) => {
      if (this.itemGroup._id === data.groupId) {
        this.itemGroup = {
          ...this.itemGroup,
          name: data.name,
        };
      }
    });

    this.socketService.receiveMessage().subscribe((message) => {
      if (message.groupId === this.itemGroup._id) {
        this.itemGroup = {
          ...this.itemGroup,
          lastMessage: {
            content: message.content,
            senderId: message.senderId,
            senderName: message.senderName,
            createdAt: message.createdAt,
          },
        };
      }
    });
  }
}
