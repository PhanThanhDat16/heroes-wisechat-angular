import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedPipeModule } from '../pipes/sharedPipe.module';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileInforComponent } from './profile-infor/profile-infor.component';
import { HeroesRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [ProfileInforComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedPipeModule,
    SharedModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    HeroesRoutingModule
  ],
})
export class ProfileModule {}
