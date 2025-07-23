import { Component, Input, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { IMessageGroup } from '../../model/message';
import {
  deleteMessageEveryoneSuccess,
  deleteMessageForMeSuccess,
} from '../../../../core/store/message/message.actions';
import { Actions, ofType } from '@ngrx/effects';
import { take } from 'rxjs';
import { ModalUtilsMessageComponent } from '../../../../shared/components/modal-utils-message/modal-utils-message.component';
import { MessageService } from '../../service/message.service';

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
    private action$: Actions,
    private messageService: MessageService
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
          this.messageService.deleteMessageEveryone(this.message._id);

          this.action$
            .pipe(ofType(deleteMessageEveryoneSuccess), take(1))
            .subscribe(() => {
              Swal.fire({
                title: 'Delete Successfully',
                icon: 'success',
              }).then(() => {
                this.messageService.loadMessage(this.message.groupId);
                this.modalComponent?.closeModal();
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
          this.messageService.deleteMessageForMe(this.message._id, this.userId);
          this.action$
            .pipe(ofType(deleteMessageForMeSuccess), take(1))
            .subscribe(() => {
              Swal.fire({
                title: 'Delete Successfully',
                icon: 'success',
              }).then(() => {
                this.modalComponent?.closeModal();
              });
            });
        }
      }
    });
  }
}
