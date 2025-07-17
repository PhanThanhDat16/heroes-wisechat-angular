import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalUtilsChatComponent } from '../../../../shared/components/modal-utils-chat/modal-utils-chat.component';
import { ToastService } from 'angular-toastify';
import { updateGroupSuccess } from '../../../../core/store/group/group.actions';
import { take } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { GroupService } from '../../service/groupService.service';
import { notiService } from '../../../../core/services/noti.service';

@Component({
  selector: 'app-utils-rename-group',
  templateUrl: './utils-rename-group.component.html',
  styleUrl: './utils-rename-group.component.scss',
})
export class UtilsRenameGroupComponent {
  nameGroup = new FormControl('');
  userId: string = localStorage.getItem('userId');
  @ViewChild(ModalUtilsChatComponent) modalComponent!: ModalUtilsChatComponent;

  constructor(
    private action$: Actions,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private groupService: GroupService,
    private notiService: notiService
  ) {}

  handlRenameGroup() {
    const groupId = this.route.snapshot.params['id'];
    if (groupId) {
      this.groupService.updateGroup(groupId, this.nameGroup.value);
      this.action$.pipe(ofType(updateGroupSuccess), take(1)).subscribe(() => {
        this.notiService.loadNoti(this.userId);
        this.toastService.success('Rename successfull');
        this.modalComponent.closeModal();
      });
    }
  }
}
