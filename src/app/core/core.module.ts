import { NgModule, Optional, SkipSelf } from '@angular/core';
// import { HeaderComponent } from '../features/layout/components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { RouterLink } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [SharedModule, RouterLink],
  exports: [],
})
export class coreModule {
  constructor(@Optional() @SkipSelf() parentModule: coreModule) {
    if (parentModule) {
      throw new Error(
        `CoreModule has already been loaded. Import it in the AppModule only.`
      );
    }
  }
}
