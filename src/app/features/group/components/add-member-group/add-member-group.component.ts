import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { IUser } from '../../../auth/model/user';
import { ModalAddChatComponent } from '../../../../shared/components/modal-add-chat/modal-add-chat.component';
import { debounceTime } from 'rxjs';
import { UserService } from '../../../../core/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-member-group',
  templateUrl: './add-member-group.component.html',
  styleUrl: './add-member-group.component.scss',
})
export class AddMemberGroupComponent implements OnChanges {
  nameUser = new FormControl('');
  users: IUser[];
  listAddUser: IUser[] = [];
  step: number = 1;
  nameGroup: string = '';
  userId = localStorage.getItem('userId');
  @ViewChild(ModalAddChatComponent) modalComponent!: ModalAddChatComponent;
  @ViewChildren('userCheckbox') viewChildrenUser!: ElementRef<HTMLInputElement>;
  @Input() listUserByGroup: IUser[];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const groupId = params['id'];
      if (groupId) {
        this.userService.getAllUser().subscribe({
          next: (data: IUser[]) => {
            this.users = data.filter((u) => u._id !== this.userId);
          },
          error: () => {
            this.users = [];
          },
        });
      }
    });

    this.nameUser.valueChanges.pipe(debounceTime(300)).subscribe((search) => {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    const listIdUser = this.listUserByGroup.map((u) => u._id);
    if (listIdUser.length > 0) {
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

  handlNext() {
    this.step = 2;
  }

  onResetStep(dataStep: number) {
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

  handleAddMember() {
    console.log(this.listAddUser);
  }
}
