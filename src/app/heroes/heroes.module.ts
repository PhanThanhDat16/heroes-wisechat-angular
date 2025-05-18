import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedPipeModule } from '../pipes/sharedPipe.module';
import { SharedModule } from '../shared/shared.module';
import { HeroesRoutingModule } from './heroes-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailComponent } from './detail/detail.component';
import { HeroesListComponent } from './heroes-list/heroes-list.component';
import { ModalCreateModule } from './modal-create/modal-create.module';
import { DropdownlableComponent } from './dropdownlable/dropdownlable.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DashboardComponent, DetailComponent, HeroesListComponent, DropdownlableComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedPipeModule,
    SharedModule,
    HeroesRoutingModule,
    ReactiveFormsModule,
    ModalCreateModule,
    NgbDropdownModule
  ],
  // exports: [DashboardComponent, DetailComponent, HeroesListComponent],
})
export class HeroesModule {}
