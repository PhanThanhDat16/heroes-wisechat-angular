import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GroupServiceAPI } from '../../../group/service/groupAPI.service';
import { IGroup } from '../../../group/model/group';
import { IMessageGeneral } from '../../model/message';
import { MessageAPIService } from '../../service/messageAPI.service';
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
    private groupServiceAPI: GroupServiceAPI,
    private messageAPIService: MessageAPIService,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.search !== '') {
      this.isLoading = true;
      this.groupServiceAPI.getManyGroup(this.search).subscribe({
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
      this.messageAPIService.getManyMessage(this.search).subscribe({
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
