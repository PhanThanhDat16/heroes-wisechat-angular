import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TagsRoutingModule } from './tags-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { TagsListComponent } from './components/tags-list/tags-list.component';

@NgModule({
  declarations: [TagsListComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TagsRoutingModule,
    FormsModule,
  ],
})
export class TagModule {}
