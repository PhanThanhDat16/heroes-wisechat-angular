import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizeWordsPipe } from './pipes/capitalizeWords.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { CreateComponent } from '../features/heroes/components/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormatDatePipe } from './pipes/date.pipe';
import { HeaderComponent } from './components/header/header.component';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddChatComponent } from './components/modal-add-chat/modal-add-chat.component';
import { ModalUtilsChatComponent } from './components/modal-utils-chat/modal-utils-chat.component';
import { SmartDatePipe } from './pipes/smartDate.pipe';
import { FormatTimePipe } from './pipes/getTimeStamp.pipe';
import { ModalUtilsMessageComponent } from './components/modal-utils-message/modal-utils-message.component';

@NgModule({
  declarations: [
    CapitalizeWordsPipe,
    FormatDatePipe,
    SmartDatePipe,
    FormatTimePipe,
    SpinnerComponent,
    CreateComponent,
    HeaderComponent,
    ModalAddChatComponent,
    ModalUtilsChatComponent,
    ModalUtilsMessageComponent,
  ],
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgbDropdown, NgbModule],
  exports: [
    CapitalizeWordsPipe,
    FormatDatePipe,
    SmartDatePipe,
    FormatTimePipe,
    SpinnerComponent,
    CreateComponent,
    HeaderComponent,
    ModalAddChatComponent,
    ModalUtilsChatComponent,
    ModalUtilsMessageComponent,
  ],
})
export class SharedModule {}
