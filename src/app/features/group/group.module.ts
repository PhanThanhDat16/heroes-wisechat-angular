import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbDropdownModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { UtilsViewMemberComponent } from './components/utils-view-member/utils-view-member.component';
import { UtilsRenameGroupComponent } from './components/utils-rename-group/utils-rename-group.component';
import { UtilsFindMessageGroupComponent } from './components/utils-find-message-group/utils-find-message-group.component';
import { UtilsAddTagGroupComponent } from './components/utils-add-tag-group/utils-add-tag-group.component';
import { SharedModule } from '../../shared/shared.module';
import { AddMemberGroupComponent } from './components/add-member-group/add-member-group.component';

@NgModule({
  declarations: [
    UtilsViewMemberComponent,
    UtilsRenameGroupComponent,
    UtilsFindMessageGroupComponent,
    UtilsAddTagGroupComponent,
    AddMemberGroupComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbTooltipModule,
    SharedModule,
  ],
  exports: [
    UtilsViewMemberComponent,
    UtilsRenameGroupComponent,
    UtilsFindMessageGroupComponent,
    UtilsAddTagGroupComponent,
    AddMemberGroupComponent
  ],
})
export class GroupModule {}
