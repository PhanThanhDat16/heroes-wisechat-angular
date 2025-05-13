import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeroesModule } from './heroes/heroes.module';
import { DetailModule } from './detail/detail.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SharedPipeModule } from './pipes/sharedPipe.module';
import { ModalCreateModule } from './modal-create/modal-create.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HeroesModule,
    DetailModule,
    DashboardModule,
    SharedPipeModule,
    ModalCreateModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
