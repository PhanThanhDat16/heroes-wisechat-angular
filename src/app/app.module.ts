import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { ModalCreateModule } from './heroes/modal-create/modal-create.module';
// import { SharedPipeModule } from './pipes/sharedPipe.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HeroEffects } from './store/hero/hero.effects';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from './store';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { coreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
  ],
  imports: [
    coreModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    AngularToastifyModule,
    SweetAlert2Module.forRoot(),
    RouterModule.forRoot([]),
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot([HeroEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [ToastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
