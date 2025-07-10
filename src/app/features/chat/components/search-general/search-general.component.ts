import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GroupService } from '../../../group/service/group.service';
import { IGroup } from '../../../group/model/group';
import { IMessageGeneral } from '../../model/message';
import { MessageService } from '../../service/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-general',
  templateUrl: './search-general.component.html',
  styleUrl: './search-general.component.scss',
})
export class SearchGeneralComponent implements OnChanges, OnDestroy {
  @Input() search;
  @Output() emitSearch = new EventEmitter<string>();
  userId = localStorage.getItem('userId');
  isLoading;
  listGroup: IGroup[] | null = null;
  listMessage: IMessageGeneral[] | null = null;

  constructor(
    private groupService: GroupService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.search !== '') {
      this.isLoading = true;
      this.groupService.getManyGroup(this.search).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.listGroup = data;
        },
      });
    }
  }

  handleFindMessageGenernal() {
    if (this.search) {
      this.isLoading = true;
      this.messageService.getManyMessage(this.search).subscribe({
        next: (data) => {
          this.isLoading = false;
          this.listMessage = data.senderId;
        },
      });
    }
  }

  handleNavigateGroup(groupId: string) {
    this.emitSearch.emit('')
    this.router.navigate(['/messages', groupId]);
  }

  ngOnDestroy(): void {
    this.listGroup = null;
    this.listMessage = null;
  }
}
