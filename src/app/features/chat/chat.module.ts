import { NgModule } from '@angular/core';
import { ChatRoutingModule } from './chat-routing.module';
import { CommonModule } from '@angular/common';
import { ChatappComponent } from './components/chatapp/chatapp.component';
import { SharedModule } from '../../shared/shared.module';
import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDropdown, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GroupModule } from '../group/group.module';
import { GroupItemComponent } from './components/group-item/group-item.component';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';
import { MessageComponent } from './components/message/message.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { UtilsMessageDeleteComponent } from './components/utils-message-delete/utils-message-delete.component';
import { GroupDetailBarComponent } from './components/group-detail-bar/group-detail-bar.component';
import { SearchGroupDetailBarComponent } from './components/search-group-detail-bar/search-group-detail-bar.component';
import { SearchGeneralComponent } from './components/search-general/search-general.component';

@NgModule({
  declarations: [
    ChatappComponent,
    GroupItemComponent,
    GroupDetailComponent,
    CreateGroupComponent,
    ChatMessageComponent,
    MessageComponent,
    ChatInputComponent,
    UtilsMessageDeleteComponent,
    GroupDetailBarComponent,
    SearchGroupDetailBarComponent,
    SearchGeneralComponent,
  ],
  imports: [
    ChatRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    NgbDropdown,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    GroupModule,
    NgbCollapseModule,
  ],
  exports: [
    ChatappComponent,
    GroupItemComponent,
    GroupDetailComponent,
    CreateGroupComponent,
    ChatMessageComponent,
  ],
})
export class ChatModule {}
