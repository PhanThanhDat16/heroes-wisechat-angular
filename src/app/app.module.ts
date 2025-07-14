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
import { RouterModule } from '@angular/router';
import { coreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { reducer } from './core/store';
import { HeroEffects } from './core/store/hero/hero.effects';
import { CheckTokenInterceptor } from './core/interceptors/checkToken.interceptor';
import { LayoutModule } from './features/layout/layout.module';
import { GroupEffects } from './core/store/group/group.effects';
import { messageEffects } from './core/store/message/message.effects';
import { NotiEffects } from './core/store/notification/notification.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    coreModule,
    SharedModule,
    LayoutModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularToastifyModule,
    SweetAlert2Module.forRoot(),
    RouterModule.forRoot([]),
    StoreModule.forRoot(reducer),
    EffectsModule.forRoot([HeroEffects, GroupEffects, messageEffects, NotiEffects]),
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
