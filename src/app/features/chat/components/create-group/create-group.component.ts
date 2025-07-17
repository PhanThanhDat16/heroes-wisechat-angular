import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  ViewChild,
} from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { IUser } from '../../../auth/model/user';
import { ToastService } from 'angular-toastify';
import { ModalAddChatComponent } from '../../../../shared/components/modal-add-chat/modal-add-chat.component';
import { FormControl } from '@angular/forms';
import { debounceTime, take } from 'rxjs';
import {
  createGroupSuccess,
} from '../../../../core/store/group/group.actions';
import { IGroupCreate } from '../../../group/model/group';
import { Actions, ofType } from '@ngrx/effects';
import { GroupService } from '../../../group/service/groupService.service';
import { notiService } from '../../../../core/services/noti.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss',
})
export class CreateGroupComponent implements OnInit {
  nameUser = new FormControl('');
  users: IUser[];
  listAddUser: IUser[] = [];
  step: 'CHOOSE_MEMBER' | 'CREATE_MEMBER' = 'CHOOSE_MEMBER';
  nameGroup = '';
  @ViewChild(ModalAddChatComponent) modalComponent!: ModalAddChatComponent;
  @ViewChildren('userCheckbox') viewChildrenUser!: ElementRef<HTMLInputElement>;

  constructor(
    private action$: Actions,
    private userService: UserService,
    private toastService: ToastService,
    private groupService: GroupService,
    private notiService: notiService
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.userService.getAllUser().subscribe({
      next: (data: IUser[]) => {
        this.users = data.filter((u) => u._id !== userId);
      },
      error: () => {
        this.users = [];
      },
    });

    this.nameUser.valueChanges.pipe(debounceTime(300)).subscribe((search) => {
      const query = search?.trim() || '';
      this.userService.getAllUser(query).subscribe({
        next: (data: IUser[]) => {
          this.users = data.filter((u) => u._id !== userId);
        },
        error: () => {
          this.users = [];
        },
      });
    });
  }

  handleAddUser(user: IUser, $event: any) {
    const check = this.listAddUser.some((u) => u._id === user._id);
    if (!check && $event.target.checked) {
      this.listAddUser.push(user);
    } else {
      this.listAddUser = this.listAddUser.filter((u) => u._id !== user._id);
    }
  }

  isUserSelected(userId: string): boolean {
    return this.listAddUser.some((u) => u._id === userId);
  }

  handlNext() {
    this.step = 'CREATE_MEMBER';
  }

  onResetStep(dataStep: 'CHOOSE_MEMBER' | 'CREATE_MEMBER') {
    this.step = dataStep;
    this.listAddUser = [];
    if (this.viewChildrenUser && (this.viewChildrenUser as any).forEach) {
      (this.viewChildrenUser as any).forEach(
        (checkbox: ElementRef<HTMLInputElement>) => {
          checkbox.nativeElement.checked = false;
        }
      );
    }
  }

  handleBack(){
    this.step = 'CHOOSE_MEMBER'
  }

  handleCreate() {
    const userId = localStorage.getItem('userId');
    if (this.nameGroup.trim() === '') {
      this.toastService.error('Please enter name group');
      return;
    }

    if (userId) {
      const data: IGroupCreate = {
        name: this.nameGroup,
        ownerId: userId,
        members: this.listAddUser.map((u) => u._id),
      };
      this.groupService.createGroup(data)
      this.action$.pipe(ofType(createGroupSuccess), take(1)).subscribe(() => {
        this.notiService.loadNoti(userId)
        this.toastService.success('Create group successful!');
        this.nameGroup = ''
        this.modalComponent?.closeModal();
      });
    }
  }
}
