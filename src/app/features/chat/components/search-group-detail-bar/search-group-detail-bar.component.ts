import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MessageAPIService } from '../../service/messageAPI.service';
import { IMessageGroup } from '../../model/message';

@Component({
  selector: 'app-search-group-detail-bar',
  templateUrl: './search-group-detail-bar.component.html',
  styleUrl: './search-group-detail-bar.component.scss',
})
export class SearchGroupDetailBarComponent implements OnInit {
  @Output() stepEmitter = new EventEmitter<'SEARCH_MESSAGE' | 'GROUP_BAR'>();
  messageFind = new FormControl('');
  listMessage: IMessageGroup[] | null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private messageAPIService: MessageAPIService
  ) {}

  ngOnInit(): void {
    const groupId = this.route.snapshot.params['id'];
    if (groupId) {
      this.messageFind.valueChanges
        .pipe(debounceTime(300))
        .subscribe((search) => {
          const query = search?.trim() || '';
          if (query && groupId) {
            this.isLoading = true;
            this.messageAPIService
              .getMessageByGroupService(groupId, 1, 10, search)
              .subscribe({
                next: (data) => {
                  this.isLoading = false;
                  this.listMessage = data.senderId.reverse();
                },
              });
          } else {
            this.listMessage = null;
          }
        });
    }
  }

  handleNavigateDetailBar() {
    this.stepEmitter.emit('GROUP_BAR');
  }
}
