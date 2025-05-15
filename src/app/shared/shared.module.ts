import { NgModule } from "@angular/core";
import { HeroCardComponent } from "../hero-card/hero-card.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [HeroCardComponent],
    imports: [RouterModule, CommonModule],
    exports: [HeroCardComponent]
})
export class SharedModule{}