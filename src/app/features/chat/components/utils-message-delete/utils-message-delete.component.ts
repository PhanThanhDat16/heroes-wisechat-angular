import { Component, Input, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { IMessageGroup } from '../../model/message';
import {
  deleteMessageEveryone,
  deleteMessageEveryoneSuccess,
  deleteMessageForMe,
  deleteMessageForMeSuccess,
} from '../../../../core/store/message/message.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';
import { ModalUtilsMessageComponent } from '../../../../shared/components/modal-utils-message/modal-utils-message.component';
import { SocketIOService } from '../../../../core/services/socket.service';

@Component({
  selector: 'app-utils-message-delete',
  templateUrl: './utils-message-delete.component.html',
  styleUrl: './utils-message-delete.component.scss',
})
export class UtilsMessageDeleteComponent {
  userId: string = localStorage.getItem('userId');
  @Input() message: IMessageGroup;
  @ViewChild(ModalUtilsMessageComponent)
  modalComponent!: ModalUtilsMessageComponent;

  constructor(
    private store: Store,
    private action$: Actions,
    private socketService: SocketIOService
  ) {}

  handleDeleteEveryone() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd3333',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.message && this.message._id) {
          this.store.dispatch(
            deleteMessageEveryone({ messageId: this.message._id })
          );

          this.action$
            .pipe(ofType(deleteMessageEveryoneSuccess), take(1))
            .subscribe(() => {
              Swal.fire({
                title: 'Delete Successfully',
                icon: 'success',
              }).then(() => {
                this.modalComponent?.closeModal();
                this.socketService.deleteMessage(
                  this.message._id,
                  this.message.groupId
                );
              });
            });
        }
      }
    });
  }

  handleDeleteForMe() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete the message for you only.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dd3333',
      cancelButtonColor: '#ccc',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.message && this.message._id && this.userId) {
          this.store.dispatch(
            deleteMessageForMe({ messageId: this.message._id, userId: this.userId })
          );

          this.action$
            .pipe(ofType(deleteMessageForMeSuccess), take(1))
            .subscribe(() => {
              Swal.fire({
                title: 'Delete Successfully',
                icon: 'success',
              }).then(() => {
                this.modalComponent?.closeModal();
                // this.socketService.deleteMessage(this.message._id, this.message.groupId)
              });
            });
        }
      }
    });
  }
}
