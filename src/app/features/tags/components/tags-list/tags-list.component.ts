import { Component, OnInit } from '@angular/core';
import { ToastService } from 'angular-toastify';
import { UserService } from '../../../../api/user.service';
import { colorPalette } from '../../../../constant/color-palette.constant';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrl: './tags-list.component.scss',
})
export class TagsListComponent implements OnInit {
  tags: string[] = [];
  nametag: string = '';
  isLoading: boolean = false;
  colorPalette = colorPalette
  
  constructor(private userService: UserService, private toastService: ToastService) {}

  handleCreateTag() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.createTagByUser(userId, this.nametag).subscribe({
        next: (data) => {
          this.nametag = ""
          return this.tags = data.tags
        },
        error: (error) => this.toastService.error(error.error.message)
      });
    }
  }

  handleDeleteTag(tag: string) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.deleteTageByUser(userId, tag).subscribe({
        next: (data) => {
          this.tags = this.tags.filter((t) => t!==tag)
        },
      });
    }
  }

  handleDeleteAll(){
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userService.deleteAllTagByUser(userId, this.tags).subscribe({
        next: (data) => {
          this.tags = []
        },
      });
    }
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    this.isLoading = true
    if (userId) {
      this.userService.getTagsByUser(userId).subscribe({
        next: (data) => {
          this.tags = data
          this.isLoading = false
        },
      });
    }
  }
}
