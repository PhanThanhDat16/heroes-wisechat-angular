import { NgModule } from "@angular/core";
import { CapitalizeWordsPipe } from "./capitalizeWords.pipe";

@NgModule({
    declarations: [CapitalizeWordsPipe],
    exports: [CapitalizeWordsPipe]
})
export class SharedPipeModule{}