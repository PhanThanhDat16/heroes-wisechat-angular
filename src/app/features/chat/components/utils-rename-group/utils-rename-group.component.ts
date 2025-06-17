import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { GroupService } from '../../service/group.service';
import { ActivatedRoute } from '@angular/router';
import { SocketIOService } from '../../../../core/services/socket.service';
import { ModalUtilsChatComponent } from '../../../../shared/components/modal-utils-chat/modal-utils-chat.component';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-utils-rename-group',
  templateUrl: './utils-rename-group.component.html',
  styleUrl: './utils-rename-group.component.scss',
})
export class UtilsRenameGroupComponent {
  nameGroup = new FormControl('');
  @ViewChild(ModalUtilsChatComponent) modalComponent!: ModalUtilsChatComponent

  constructor(
    private groupService: GroupService,
    private route: ActivatedRoute,
    private socketService: SocketIOService,
    private toastService: ToastService
  ) {}

  handlRenameGroup() {
    const groupId = this.route.snapshot.params['id'];
    const userId = localStorage.getItem('userId')
    const username = localStorage.getItem('username')

    if (groupId) {
      this.groupService
        .updateGroup(groupId, { name: this.nameGroup.value })
        .subscribe({
          next: (data) => {
            this.toastService.success('Rename successfull')
            this.socketService.sendUpdateEditGroup({senderId: userId, senderName: username, groupId, name: data.name})
            this.modalComponent.closeModal()
          },
        });
    }
  }
}
