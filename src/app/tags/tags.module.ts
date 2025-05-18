import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedPipeModule } from '../pipes/sharedPipe.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TagsComponent } from './tags.component';
import { TagsRoutingModule } from './tags-routing.module';

@NgModule({
  declarations: [TagsComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedPipeModule,
    SharedModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    TagsRoutingModule,
    FormsModule
  ],
})
export class TagModule {}
