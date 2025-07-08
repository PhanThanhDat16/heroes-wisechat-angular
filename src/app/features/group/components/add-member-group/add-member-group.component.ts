import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IUser } from '../../../auth/model/user';
import { ModalAddChatComponent } from '../../../../shared/components/modal-add-chat/modal-add-chat.component';
import { debounceTime, Subscription, take } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { IGroup } from '../../model/group';
import {
  addMemberInGroup,
  addMemberInGroupSuccess,
} from '../../../../core/store/message/message.actions';
import { Actions, ofType } from '@ngrx/effects';
import { ToastService } from 'angular-toastify';
import { SocketIOService } from '../../../../core/services/socket.service';
import { selectMembersGroup } from '../../../../core/store/message/message.selector';
import { loadNoti } from '../../../../core/store/notification/notification.actions';

@Component({
  selector: 'app-add-member-group',
  templateUrl: './add-member-group.component.html',
  styleUrl: './add-member-group.component.scss',
})
export class AddMemberGroupComponent implements OnChanges, OnDestroy, OnInit {
  nameUser = new FormControl('');
  users: IUser[];
  listAddUser: IUser[] = [];
  allUser: IUser[] = [];
  nameGroup = '';
  userId = localStorage.getItem('userId');
  @ViewChild(ModalAddChatComponent) modalComponent!: ModalAddChatComponent;
  @ViewChildren('userCheckbox') viewChildrenUser!: ElementRef<HTMLInputElement>;
  @Input() listUserByGroup: IUser[];
  @Input() groupData: IGroup;
  private subscriptions = new Subscription();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private store: Store,
    private action$: Actions,
    private toastService: ToastService,
    private socketService: SocketIOService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = params['id'];
      if (groupId) {
        const getAllUSub = this.userService.getAllUser().subscribe({
          next: (data: IUser[]) => {
            this.users = data.filter((u) => u._id !== this.userId);
            this.allUser = data.filter((u) => u._id !== this.userId);
          },
          error: () => {
            this.users = [];
          },
        });
        this.subscriptions.add(getAllUSub);
      }
    });

    const memberGroupSub = this.store
      .select(selectMembersGroup)
      .subscribe((data) => {
        if (data) {
          const checkListId = data.map((uId) => uId._id);
          this.users = this.allUser.filter((u) => !checkListId.includes(u._id));
        }
      });
    this.subscriptions.add(memberGroupSub);

    // const socketKickUserSub = this.socketService
    //   .receiveKickedFromGroup()
    //   .subscribe(({ groupId, userId, ownerId }) => {
    //     if (this.userId !== ownerId && this.groupData._id === groupId) {
    //       const getUser = this.allUser.find((u) => u._id === userId);
    //       this.users = [...this.users, getUser];
    //     }
    //   });
    // this.subscriptions.add(socketKickUserSub);

    const socketAddUserSub = this.socketService
      .receiveAddMemberFromGroup()
      .subscribe(({ group, listUser, userId }) => {
        if (this.userId !== userId && this.groupData._id === group._id) {
          const checkListId = listUser.map((uId) => uId._id);
          this.users = this.users.filter((u) => !checkListId.includes(u._id));
        }
      });
    this.subscriptions.add(socketAddUserSub);

    const valueChangeSub = this.nameUser.valueChanges
      .pipe(debounceTime(300))
      .subscribe((search) => {
        const query = search?.trim() || '';
        this.userService.getAllUser(query).subscribe({
          next: (data: IUser[]) => {
            const listIdUserInGroup = this.listUserByGroup.map((u) => u._id);

            this.users = data.filter(
              (u) => u._id !== this.userId && !listIdUserInGroup.includes(u._id)
            );
          },
          error: () => {
            this.users = [];
          },
        });
      });
    this.subscriptions.add(valueChangeSub);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
    const listIdUser = this.listUserByGroup.map((u) => u._id);
    if (listIdUser.length > 0 && this.users) {
      this.users = this.users.filter((u) => !listIdUser.includes(u._id));
    }
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onResetStep(dataStep: 'CHOOSE_MEMBER' | 'CREATE_MEMBER') {
    this.listAddUser = [];
    if (this.viewChildrenUser && (this.viewChildrenUser as any).forEach) {
      (this.viewChildrenUser as any).forEach(
        (checkbox: ElementRef<HTMLInputElement>) => {
          checkbox.nativeElement.checked = false;
        }
      );
    }
  }

  handleAddMember() {
    if (this.userId) {
      const listUserId = this.listAddUser.map((uId) => uId._id);
      this.store.dispatch(
        addMemberInGroup({
          group: this.groupData,
          users: listUserId,
          userId: this.userId,
        })
      );

      const addMemberSub = this.action$
        .pipe(ofType(addMemberInGroupSuccess), take(1))
        .subscribe(() => {
          this.store.dispatch(loadNoti({ userId: this.userId }));
          this.toastService.success('Add member successful!');
          this.modalComponent.closeModal();
        });
      this.subscriptions.add(addMemberSub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
