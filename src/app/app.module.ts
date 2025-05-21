import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthLayoutComponent } from './features/layout/auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { coreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { MainLayoutComponent } from './features/layout/main-layout/main-layout.component';
import { reducer } from './core/store';
import { HeroEffects } from './core/store/hero/hero.effects';
import { CheckTokenInterceptor } from './core/interceptors/checkToken.interceptor';

@NgModule({
  declarations: [AppComponent, AuthLayoutComponent, MainLayoutComponent],
  imports: [
    coreModule,
    SharedModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularToastifyModule,
    SweetAlert2Module.forRoot(),
    RouterModule.forRoot([]),
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot([HeroEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    ToastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CheckTokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
