import { Component, DoCheck, OnInit } from '@angular/core';
import { IGroupMessage } from '../../model/group';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { SocketIOService } from '../../../../core/services/socket.service';
import { GroupService } from '../../service/group.service';

@Component({
  selector: 'app-chatapp',
  templateUrl: './chatapp.component.html',
  styleUrl: './chatapp.component.scss',
})
export class ChatappComponent implements OnInit {
  data: IGroupMessage[] = [];
  checkLinkDetail: string | undefined = undefined;

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.groupService.getGroupsByUser(userId).subscribe({
        next: (data) => {
          this.socketService.sendUserOnline(userId);
          this.data = data;
        },
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

  onResetDataGroup(data: { message: string; data: any }) {
    const newData = {
      ...data.data,
      lastMessage: 'New group',
    };
    this.data.push(newData);
  }
}
