import {
  Component,
  OnInit,
  ElementRef,
  ViewChildren,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { IUser } from '../../../auth/model/user';
import { IGroupCreate } from '../../model/group';
import { ToastService } from 'angular-toastify';
import { ModalAddChatComponent } from '../../../../shared/components/modal-add-chat/modal-add-chat.component';
import { GroupService } from '../../service/group.service';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss',
})
export class CreateGroupComponent implements OnInit {
  nameUser = new FormControl('');
  users: IUser[];
  listAddUser: IUser[] = [];
  step: number = 1;
  nameGroup: string = '';
  @Output() newDataGroupEmitter = new EventEmitter();
  @ViewChild(ModalAddChatComponent) modalComponent!: ModalAddChatComponent;
  @ViewChildren('userCheckbox') viewChildrenUser!: ElementRef<HTMLInputElement>;

  constructor(
    private userService: UserService,
    private groupService: GroupService,
    private toastService: ToastService
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

    this.nameUser.valueChanges
      .pipe(debounceTime(300))
      .subscribe((search) => {
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
    if (!this.listAddUser.includes(user) && $event.target.checked) {
      this.listAddUser.push(user);
    } else {
      this.listAddUser = this.listAddUser.filter((u) => u._id !== user._id);
    }
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

  handleCreate() {
    const userId = localStorage.getItem('userId');
    if (this.nameGroup.trim() === '') {
      this.toastService.error('Please enter name group');
      return;
    }

    if (userId) {
      const data = {
        name: this.nameGroup,
        ownerId: userId,
        members: this.listAddUser.map((u) => u._id),
      };

      this.groupService.createGroup(data as IGroupCreate).subscribe({
        next: (data) => {
          this.newDataGroupEmitter.emit(data);
          this.toastService.success('Create group successfull!');
          this.modalComponent?.closeModal();
        },
      });
    }
  }
}
