import { NgModule } from '@angular/core';
import { ChatRoutingModule } from './chat-routing.module';
import { CommonModule } from '@angular/common';
import { ChatappComponent } from './components/chatapp/chatapp.component';
import { SharedModule } from '../../shared/shared.module';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupItemComponent } from './components/group-item/group-item.component';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { NgbDropdown, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilsViewMemberComponent } from './components/utils-view-member/utils-view-member.component';
import { UtilsRenameGroupComponent } from './components/utils-rename-group/utils-rename-group.component';
import { UtilsFindMessageGroupComponent } from './components/utils-find-message-group/utils-find-message-group.component';
import { UtilsAddTagGroupComponent } from './components/utils-add-tag-group/utils-add-tag-group.component';
// import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    ChatappComponent,
    GroupItemComponent,
    CreateGroupComponent,
    ChatMessageComponent,
    GroupDetailComponent,
    UtilsViewMemberComponent,
    UtilsRenameGroupComponent,
    UtilsFindMessageGroupComponent,
    UtilsAddTagGroupComponent,
  ],
  imports: [
    ChatRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    NgbDropdown,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbTooltipModule
  ],
})
export class ChatModule {}
