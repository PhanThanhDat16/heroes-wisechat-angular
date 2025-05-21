import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CapitalizeWordsPipe } from './pipes/capitalizeWords.pipe';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ModalCreateComponent } from '../features/heroes/components/modal-create/modal-create.component';
import { CreateComponent } from '../features/heroes/components/create/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormatDatePipe } from './pipes/date.pipe';
import { HeaderComponent } from './components/header/header.component';
import { NgbDropdown, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    CapitalizeWordsPipe,
    FormatDatePipe,
    SpinnerComponent,
    ModalCreateComponent,
    CreateComponent,
    HeaderComponent,
  ],
  imports: [RouterModule, CommonModule, ReactiveFormsModule, NgbDropdown, NgbModule],
  exports: [
    CapitalizeWordsPipe,
    FormatDatePipe,
    SpinnerComponent,
    ModalCreateComponent,
    CreateComponent,
    HeaderComponent,
  ],
})
export class SharedModule {}
