import { NgModule } from '@angular/core';
import { CreateComponent } from './create.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedPipeModule } from '../pipes/sharedPipe.module';

@NgModule({
  declarations: [CreateComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedPipeModule],
  providers: [],
  exports: [CreateComponent],
})
export class CreateModule {}
