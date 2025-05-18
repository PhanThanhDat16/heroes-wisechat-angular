import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HeroCardComponent } from "../heroes/hero-card/hero-card.component";

@NgModule({
    declarations: [HeroCardComponent],
    imports: [RouterModule, CommonModule],
    exports: [HeroCardComponent]
})
export class SharedModule{}