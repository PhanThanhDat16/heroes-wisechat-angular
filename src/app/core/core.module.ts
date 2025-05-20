import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [HeaderComponent],
  imports: [SharedModule, NgbDropdown],
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
