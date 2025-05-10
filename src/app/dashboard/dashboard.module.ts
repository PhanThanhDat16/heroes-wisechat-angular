import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { CapitalizeWordsPipe } from '../pipes/capitalizeWords.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedPipeModule } from '../pipes/sharedPipe.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, RouterModule, SharedPipeModule, SharedModule],
  providers: [],
  exports: [DashboardComponent],
})
export class DashboardModule {}
