// import {
//   Component,
//   ElementRef,
//   Input,
//   OnChanges,
//   OnDestroy,
//   SimpleChanges,
//   ViewChild,
//   ViewChildren,
//   OnInit,
// } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { IUser } from '../../../auth/model/user';
// import { ModalAddChatComponent } from '../../../../shared/components/modal-add-chat/modal-add-chat.component';
// import { debounceTime, Subscription, take } from 'rxjs';
// import { UserService } from '../../../../core/services/user.service';
// import { ActivatedRoute } from '@angular/router';
// import { Store } from '@ngrx/store';
// import { IGroup } from '../../model/group';
// import { addMemberInGroupSuccess } from '../../../../core/store/message/message.actions';
// import { Actions, ofType } from '@ngrx/effects';
// import { ToastService } from 'angular-toastify';
// import { SocketIOService } from '../../../../core/services/socket.service';
// import { selectMembersGroup } from '../../../../core/store/message/message.selector';
// import { GroupService } from '../../service/groupService.service';
// import { notiService } from '../../../../core/services/noti.service';
// import { MessageService } from '../../../chat/service/message.service';

// @Component({
//   selector: 'app-add-member-group',
//   templateUrl: './add-member-group.component.html',
//   styleUrl: './add-member-group.component.scss',
// })
// export class AddMemberGroupComponent implements OnChanges, OnDestroy, OnInit {
//   nameUser = new FormControl('');
//   users: IUser[];
//   listAddUser: IUser[] = [];
//   allUser: IUser[] = [];
//   nameGroup = '';
//   isLoading = false;
//   userId = localStorage.getItem('userId');
//   @ViewChild(ModalAddChatComponent) modalComponent!: ModalAddChatComponent;
//   @ViewChildren('userCheckbox') viewChildrenUser!: ElementRef<HTMLInputElement>;
//   @Input() listUserByGroup: IUser[];
//   @Input() groupData: IGroup;
//   private subscriptions = new Subscription();

//   constructor(
//     private userService: UserService,
//     private route: ActivatedRoute,
//     private store: Store,
//     private action$: Actions,
//     private toastService: ToastService,
//     private socketService: SocketIOService,
//     private groupService: GroupService,
//     private notiService: notiService,
//     private messageService: MessageService
//   ) {}

//   ngOnInit(): void {
//     this.route.params.subscribe((params) => {
//       const groupId = params['id'];
//       if (groupId) {
//         const getAllUSub = this.userService.getAllUser().subscribe({
//           next: (data: IUser[]) => {
//             this.users = data.filter((u) => u._id !== this.userId);
//             this.allUser = data.filter((u) => u._id !== this.userId);
//           },
//           error: () => {
//             this.users = [];
//           },
//         });
//         this.subscriptions.add(getAllUSub);
//       }
//     });

//     const memberGroupSub = this.store
//       .select(selectMembersGroup)
//       .subscribe((data) => {
//         if (data) {
//           const checkListId = data.map((uId) => uId._id);
//           this.users = this.allUser.filter((u) => !checkListId.includes(u._id));
//           console.log('Member group data:', this.users);
//         }
//       });
//     this.subscriptions.add(memberGroupSub);

//     const socketAddUserSub = this.socketService
//       .receiveAddMemberFromGroup()
//       .subscribe(({ group, listUser, userId }) => {
//         if (this.userId !== userId && this.groupData._id === group._id) {
//           const checkListId = listUser.map((uId) => uId._id);
//           this.users = this.users.filter((u) => !checkListId.includes(u._id));
//         }
//       });
//     this.subscriptions.add(socketAddUserSub);

//     const valueChangeSub = this.nameUser.valueChanges
//       .pipe(debounceTime(300))
//       .subscribe((search) => {
//         const query = search?.trim() || '';
//         this.userService.getAllUser(query).subscribe({
//           next: (data: IUser[]) => {
//             const listIdUserInGroup = this.listUserByGroup.map((u) => u._id);

//             this.users = data.filter(
//               (u) => u._id !== this.userId && !listIdUserInGroup.includes(u._id)
//             );
//           },
//           error: () => {
//             this.users = [];
//           },
//         });
//       });
//     this.subscriptions.add(valueChangeSub);
//   }

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   ngOnChanges(changes: SimpleChanges): void {
//     const listIdUser = this.listUserByGroup.map((u) => u._id);
//     if (listIdUser.length > 0 && this.users) {
//       this.users = this.users.filter((u) => !listIdUser.includes(u._id));
//     }
//   }

//   handleAddUser(user: IUser, $event: any) {
//     const check = this.listAddUser.some((u) => u._id === user._id);
//     if (!check && $event.target.checked) {
//       this.listAddUser.push(user);
//     } else {
//       this.listAddUser = this.listAddUser.filter((u) => u._id !== user._id);
//     }
//   }

//   isUserSelected(userId: string): boolean {
//     return this.listAddUser.some((u) => u._id === userId);
//   }

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   onResetStep(dataStep: 'CHOOSE_MEMBER' | 'CREATE_MEMBER') {
//     this.listAddUser = [];
//     if (this.viewChildrenUser && (this.viewChildrenUser as any).forEach) {
//       (this.viewChildrenUser as any).forEach(
//         (checkbox: ElementRef<HTMLInputElement>) => {
//           checkbox.nativeElement.checked = false;
//         }
//       );
//     }
//   }

//   handleAddMember() {
//     if (this.userId) {
//       this.isLoading = true;
//       const listUserId = this.listAddUser.map((uId) => uId._id);
//       this.groupService.addMemberInGroup(
//         this.groupData,
//         listUserId,
//         this.userId
//       );

//       const addMemberSub = this.action$
//         .pipe(ofType(addMemberInGroupSuccess), take(1))
//         .subscribe(() => {
//           this.notiService.loadNoti(this.userId);
//           this.messageService.loadMessage(this.groupData._id);
//           this.toastService.success('Add member successful!');
//           this.isLoading = false;
//           this.modalComponent.closeModal();
//         });
//       this.subscriptions.add(addMemberSub);
//     }
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.unsubscribe();
//   }
// }

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
import { addMemberInGroupSuccess } from '../../../../core/store/message/message.actions';
import { Actions, ofType } from '@ngrx/effects';
import { ToastService } from 'angular-toastify';
import { SocketIOService } from '../../../../core/services/socket.service';
import { selectMembersGroup } from '../../../../core/store/message/message.selector';
import { GroupService } from '../../service/groupService.service';
import { notiService } from '../../../../core/services/noti.service';
import { MessageService } from '../../../chat/service/message.service';

@Component({
  selector: 'app-add-member-group',
  templateUrl: './add-member-group.component.html',
  styleUrls: ['./add-member-group.component.scss'],
})
export class AddMemberGroupComponent implements OnInit, OnChanges, OnDestroy {
  nameUser = new FormControl('');
  users: IUser[] = [];
  allUser: IUser[] = [];
  listAddUser: IUser[] = [];
  isLoading = false;
  userId = localStorage.getItem('userId');
  @Input() listUserByGroup: IUser[] = [];
  @Input() groupData: IGroup;
  @ViewChild(ModalAddChatComponent) modalComponent!: ModalAddChatComponent;
  @ViewChildren('userCheckbox') viewChildrenUser!: ElementRef<HTMLInputElement>;
  private subscriptions = new Subscription();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private store: Store,
    private action$: Actions,
    private toastService: ToastService,
    private socketService: SocketIOService,
    private groupService: GroupService,
    private notiService: notiService,
    private messageService: MessageService
  ) {}

  private filterUsers() {
    const idsInGroup = this.listUserByGroup.map((u) => u._id);
    this.users = this.allUser.filter((u) => !idsInGroup.includes(u._id));
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = params['id'];
      if (groupId) {
        const sub = this.userService.getAllUser().subscribe({
          next: (data: IUser[]) => {
            this.allUser = data.filter((u) => u._id !== this.userId);
            this.filterUsers();
          },
          error: () => {
            this.users = [];
          },
        });
        this.subscriptions.add(sub);
      }
    });

    const memberSub = this.store
      .select(selectMembersGroup)
      .subscribe((data) => {
        if (data) {
          this.filterUsers();
        }
      });
    this.subscriptions.add(memberSub);

    const socketSub = this.socketService
      .receiveAddMemberFromGroup()
      .subscribe(({ group, listUser, userId }) => {
        if (this.userId !== userId && this.groupData?._id === group._id) {
          const addedIds = listUser.map((u) => u._id);
          this.allUser = this.allUser.filter((u) => !addedIds.includes(u._id));
          this.filterUsers();
        }
      });
    this.subscriptions.add(socketSub);

    const searchSub = this.nameUser.valueChanges
      .pipe(debounceTime(300))
      .subscribe((search) => {
        const keyword = search?.trim() || '';
        this.userService.getAllUser(keyword).subscribe({
          next: (data: IUser[]) => {
            this.allUser = data.filter((u) => u._id !== this.userId);
            this.filterUsers();
          },
          error: () => {
            this.users = [];
          },
        });
      });
    this.subscriptions.add(searchSub);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['listUserByGroup'] || changes['groupData']) {
      this.filterUsers();
    }
  }

  handleAddUser(user: IUser, $event: any) {
    const checked = $event.target.checked;
    if (checked) {
      if (!this.isUserSelected(user._id)) {
        this.listAddUser.push(user);
      }
    } else {
      this.listAddUser = this.listAddUser.filter((u) => u._id !== user._id);
    }
  }

  isUserSelected(userId: string): boolean {
    return this.listAddUser.some((u) => u._id === userId);
  }

  onResetStep(dataStep: 'CHOOSE_MEMBER' | 'CREATE_MEMBER') {
    this.listAddUser = [];
    if ((this.viewChildrenUser as any)?.forEach) {
      (this.viewChildrenUser as any).forEach(
        (checkbox: ElementRef<HTMLInputElement>) => {
          checkbox.nativeElement.checked = false;
        }
      );
    }
  }

  handleAddMember() {
    if (!this.userId) return;

    this.isLoading = true;
    const listUserId = this.listAddUser.map((u) => u._id);

    this.groupService.addMemberInGroup(this.groupData, listUserId, this.userId);

    const sub = this.action$
      .pipe(ofType(addMemberInGroupSuccess), take(1))
      .subscribe(() => {
        this.notiService.loadNoti(this.userId!);
        this.messageService.loadMessage(this.groupData._id);
        this.toastService.success('Add member successful!');
        this.isLoading = false;
        this.modalComponent.closeModal();
      });

    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
