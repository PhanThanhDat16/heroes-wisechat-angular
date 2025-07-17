import {
  Component,
  inject,
  Input,
  OnInit,
  signal,
  TemplateRef,
  WritableSignal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from '../../../auth/model/user';
import { IGroup } from '../../model/group';
import { ToastService } from 'angular-toastify';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import {
  deleteMemberInGroupSuccess,
  leaveGroupSuccess,
} from '../../../../core/store/message/message.actions';
import { take } from 'rxjs';
import { Router } from '@angular/router';
import { GroupService } from '../../service/groupService.service';
import { notiService } from '../../../../core/services/noti.service';
import { deleteGroupSuccess } from '../../../../core/store/group/group.actions';

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
  @Input() listUserByGroupLeave: IUser[];

  constructor(
    private toastService: ToastService,
    private action$: Actions,
    private router: Router,
    private groupService: GroupService,
    private notiService: notiService
  ) {}

  ngOnInit(): void {
    if (this.listUserByGroupLeave && this.userId) {
      this.listUserByGroupLeave = this.listUserByGroupLeave.filter(
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

  handleChooseAdmin() {
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
        this.handleNotiAndTag();
        this.groupService.leaveGroup(
          this.groupData._id,
          this.userId,
          this.chooseAdmin
        );
        this.action$.pipe(ofType(leaveGroupSuccess), take(1)).subscribe(() => {
          this.closeModal();
          this.notiService.loadNoti(this.userId);
          this.groupService.loadGroup(this.userId);
          this.toastService.success('Leave group successful!');
          this.router.navigate(['/messages']);
        });
      }
    });
  }

  handleOpenModal(user: IUser, $event: any) {
    this.user = user;
    this.chooseAdmin = user._id;
  }

  handleNotiAndTag() {
    const notification = JSON.parse(localStorage.getItem('notification'));
    if (notification) {
      notification[this.groupData._id] = true;
      localStorage.setItem('notification', JSON.stringify(notification));
    }
    localStorage.removeItem('tagMap');
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
          this.handleNotiAndTag();
          this.groupService.deleteMemberInGroup(
            this.groupData._id,
            this.userId
          );
          this.action$
            .pipe(ofType(deleteMemberInGroupSuccess), take(1))
            .subscribe(() => {
              this.notiService.loadNoti(this.userId);
              this.toastService.success('Leave group successful!');
            });
        }
      });
    }
  }

  handleDeleteGroup() {
    this.groupService.deleteGroup(this.groupData._id);
    this.action$.pipe(ofType(deleteGroupSuccess), take(1)).subscribe(() => {
      this.closeModal();
      this.router.navigate(['/messages']);
      this.groupService.loadGroup(this.userId);
      this.notiService.loadNoti(this.userId);
    });
  }
}
