import { Component, Input, OnInit } from '@angular/core';
import { ITagGroup, listTag } from '../../model/listTag';
import { GroupService } from '../../../group/service/groupService.service';
import { Store } from '@ngrx/store';
import { selectGroupDetail } from '../../../../core/store/group/group.selector';

@Component({
  selector: 'app-dropdown-label-group',
  templateUrl: './dropdown-label-group.component.html',
  styleUrl: './dropdown-label-group.component.scss',
})
export class DropdownLabelGroupComponent implements OnInit {
  listTagGroup = listTag;
  selectTagGroup: ITagGroup | null = null;
  userId = localStorage.getItem('userId');
  @Input() groupId;
  constructor(private groupService: GroupService, private store: Store) {}

  ngOnInit(): void {
    this.store.select(selectGroupDetail).subscribe((group) => {
      if (group) {
        console.log('group', group);
        this.selectTagGroup = listTag.find(
          (item) => item.tag.toLocaleLowerCase() === group.tag
        );
        this.listTagGroup = listTag.filter(
          (item) => item.tag.toLocaleLowerCase() !== group.tag
        );
      }
    });
  }

  handleAddTag(tag) {
    if (this.groupId && this.userId) {
      this.selectTagGroup = tag;
      this.groupService.addTagInGroup(
        this.groupId,
        this.userId,
        tag.tag.toLocaleLowerCase()
      );
      localStorage.setItem('tagGroup', tag.tag.toLocaleLowerCase());
      this.listTagGroup = listTag.filter(
        (item) => item.tag.toLocaleLowerCase() !== tag.tag.toLocaleLowerCase()
      );
    }
  }

  handleDeleteTag(tag) {
    if (this.groupId && this.userId) {
      this.groupService.addTagInGroup(
        this.groupId,
        this.userId,
        tag.toLocaleLowerCase()
      );
      localStorage.removeItem('tagGroup');
      this.selectTagGroup = null;
      this.listTagGroup = listTag;
    }
  }
}
