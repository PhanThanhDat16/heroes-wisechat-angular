import { NgModule } from "@angular/core";
import { HeroCardComponent } from "../hero-card/hero-card.component";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations: [HeroCardComponent],
    imports: [RouterModule],
    exports: [HeroCardComponent]
})
export class SharedModule{}