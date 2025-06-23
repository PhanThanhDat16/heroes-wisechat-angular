import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroesRoutingModule } from './heroes-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DetailComponent } from './components/detail/detail.component';
import { HeroesListComponent } from './components/heroes-list/heroes-list.component';
import { DropdownlableComponent } from './components/dropdownlable/dropdownlable.component';
import { HeroCardComponent } from './components/hero-card/hero-card.component';
import { ModalCreateComponent } from './components/modal-create/modal-create.component';

@NgModule({
  declarations: [
    DashboardComponent,
    DetailComponent,
    HeroesListComponent,
    DropdownlableComponent,
    HeroCardComponent,
    ModalCreateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    HeroesRoutingModule,
    ReactiveFormsModule,
    NgbDropdownModule,
  ],
  exports: [
    DashboardComponent,
    DetailComponent,
    HeroesListComponent,
    DropdownlableComponent,
    HeroCardComponent,
  ],
})
export class HeroesModule {}
