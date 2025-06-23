import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { ITag } from '../../model/tag';
import { TagService } from '../../service/tag.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss',
})
export class TagsListComponent implements OnInit {
  tags: ITag[] = [];
  nametag: string = '';
  isLoading: boolean = false;

  constructor(
    private tagService: TagService,
    private toastService: ToastService
  ) {}

  handleCreateTag() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.tagService.createTagByUser(userId, this.nametag).subscribe({
        next: (data) => {
          this.nametag = '';
          this.tags.push(data);
        },
        error: (error) => this.toastService.error(error.error.message),
      });
    }
  }

  handleDeleteTag(tagId: string) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.tagService.deleteTageByUser(userId, tagId).subscribe({
        next: (data) => {
          this.tags = this.tags.filter((t) => t._id !== tagId);
          this.toastService.success('Delete successfull')
        },
      });
    }
  }

  handleDeleteAll() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.tagService.deleteAllTagByUser(userId).subscribe({
        next: (data) => {
          this.tags = []
          this.toastService.success('Delete all successfull')
        },
      });
    }
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.isLoading = true;
    if (userId) {
      this.tagService.getTagsByUser(userId).subscribe({
        next: (data) => {
          this.tags = data;
          this.isLoading = false;
        },
      });
    }
  }
}
