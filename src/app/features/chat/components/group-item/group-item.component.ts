import { Component, Input, OnInit } from '@angular/core';
import { SocketIOService } from '../../../../core/services/socket.service';
import { IGroupMessage } from '../../../group/model/group';
import { Store } from '@ngrx/store';
import { loadUsersByGroup } from '../../../../core/store/group/group.actions';
import { selectUsersByGroup } from '../../../../core/store/group/group.selector';
import { updateIsRead } from '../../../../core/store/message/message.actions';
import { selectMessage } from '../../../../core/store/message/message.selector';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrl: './group-item.component.scss',
})
export class GroupItemComponent implements OnInit {
  @Input() itemGroup: IGroupMessage;
  userId = localStorage.getItem('userId');
  userOnlineGroup: string[] = [];
  // itemRealtimeGroup: IGroupMessage | null = null;
  isRead = false;

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

    // this.itemRealtimeGroup = null;

    this.socketService.receiveEditGroup().subscribe((data) => {
      if (this.itemGroup._id === data.groupId) {
        this.itemGroup = {
          ...this.itemGroup,
          name: data.name,
        };
      }
    });

    // this.store.select(selectMessage).subscribe((message) => {
    //   const lastMessage = message?.senderId.find(
    //     (m) => m.groupId === this.itemGroup._id
    //   );
    //   console.log(message) 
    //   console.log(lastMessage) 

      

    //   if(lastMessage){
    //     this.isRead = true;
    //   }else{
    //     this.isRead = false;
    //   }
     

    //   // if(lastMessage) {
    //   //   const check = lastMessage.isRead.includes(this.userId);
    //   //   console.log('check isRead', check);
    //   //   if(!check) {
    //   //     this.isRead = false;
    //   //   }else{
    //   //     this.isRead = true;
    //   //   }
    //   // }
    // });

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

  handleReadMessage(groupId: string) {
    if (this.userId) {

      // console.log('userId', this.userId);
      // this.store.dispatch(updateIsRead({ groupId, userId: this.userId }));
    }
  }
}
