import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from '../../../auth/model/user';
import { IGroup } from '../../model/group';
import { Store } from '@ngrx/store';
import { ToastService } from 'angular-toastify';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import {
  deleteMemberInGroup,
  deleteMemberInGroupSuccess,
} from '../../../../core/store/message/message.actions';
import { take } from 'rxjs';
import { loadNoti } from '../../../../core/store/notification/notification.actions';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'modal-choose-role-member',
  templateUrl: './modal-choose-role-member.component.html',
  styleUrl: './modal-choose-role-member.component.scss',
})
export class ModalChooseRoleMemberComponent implements OnInit {
  private modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');
  userOnlineGroup: string[] = [];
  user: IUser | null = null;
  userId = localStorage.getItem('userId');
  nameUser = new FormControl();
  chooseAdmin = '';
  @Input() groupData: IGroup;
  @Input() listUserByGroup: IUser[];

  constructor(
    private store: Store,
    private toastService: ToastService,
    private action$: Actions
  ) {}

  ngOnInit(): void {
    if (this.listUserByGroup && this.userId) {
      this.listUserByGroup = this.listUserByGroup.filter(
        (u) => u._id !== this.userId
      );
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  isUserSelected(userId: string) {
    // return this.listAddUser.some((u) => u._id === userId);
  }

  handleChooseAdmin() {}

  handleOpenModal(user: IUser, $event: any) {
    this.user = user;
  }

  handleLeaveGroup(content: TemplateRef<any>) {
    if (this.groupData.ownerId === this.userId) {
      this.modalService
        .open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
        .result.then(
          (result) => {
            this.closeResult.set(`Closed with: ${result}`);
          },
          (reason) => {
            this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
          }
        );
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dd3333',
        cancelButtonColor: '#ccc',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.store.dispatch(
            deleteMemberInGroup({
              groupId: this.groupData._id,
              memberId: this.userId,
            })
          );
          this.action$
          .pipe(ofType(deleteMemberInGroupSuccess), take(1))
          .subscribe(() => {
              this.store.dispatch(loadNoti({ userId: this.userId }));
              this.toastService.success('Leave group successful!');
            });
        }
      });
    }
  }
}
