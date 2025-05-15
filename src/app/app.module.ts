import { NgModule, isDevMode } from '@angular/core';
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
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HeroEffects } from './store/hero/hero.effects';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from './store';
import { LoginModule } from './login/login.module';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { RegisterComponent } from './register/register.component';
import { RegisterModule } from './register/register.module';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    AuthLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RegisterModule,
    NgbModule,
    LoginModule,
    HeroesModule,
    DetailModule,
    DashboardModule,
    SharedPipeModule,
    ModalCreateModule,
    HttpClientModule,
    AngularToastifyModule,
    SweetAlert2Module.forRoot(),
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot([HeroEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [ToastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
