import { NgModule } from '@angular/core';
import { HeroesComponent } from './heroes.component';
import { CommonModule } from '@angular/common';
import { SharedPipeModule } from '../pipes/sharedPipe.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [HeroesComponent],
  imports: [CommonModule, SharedPipeModule, RouterModule, SharedModule],
  providers: [],
  exports: [HeroesComponent],
})
export class HeroesModule {}
