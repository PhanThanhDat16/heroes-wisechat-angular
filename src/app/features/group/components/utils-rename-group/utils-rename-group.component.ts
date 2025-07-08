import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalUtilsChatComponent } from '../../../../shared/components/modal-utils-chat/modal-utils-chat.component';
import { ToastService } from 'angular-toastify';
import { Store } from '@ngrx/store';
import {
  updateGroup,
  updateGroupSuccess,
} from '../../../../core/store/group/group.actions';
import { take } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';
import { loadNoti } from '../../../../core/store/notification/notification.actions';

@Component({
  selector: 'app-utils-rename-group',
  templateUrl: './utils-rename-group.component.html',
  styleUrl: './utils-rename-group.component.scss',
})
export class UtilsRenameGroupComponent {
  nameGroup = new FormControl('');
  userId: string = localStorage.getItem('userId')
  @ViewChild(ModalUtilsChatComponent) modalComponent!: ModalUtilsChatComponent;

  constructor(
    private store: Store,
    private action$: Actions,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  handlRenameGroup() {
    const groupId = this.route.snapshot.params['id'];

    if (groupId) {
      this.store.dispatch(updateGroup({ groupId, name: this.nameGroup.value }));
      
      this.action$.pipe(ofType(updateGroupSuccess), take(1)).subscribe(() => {
        this.store.dispatch(loadNoti({ userId: this.userId }));
        this.toastService.success('Rename successfull');
        this.modalComponent.closeModal();
      });
    }
  }
}
