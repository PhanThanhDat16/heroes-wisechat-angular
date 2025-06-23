import { NgModule } from "@angular/core";
import { MainLayoutComponent } from "./main-layout/main-layout.component";
import { AuthLayoutComponent } from "./auth-layout/auth-layout.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
    declarations: [MainLayoutComponent, AuthLayoutComponent],
    imports: [CommonModule, RouterModule, SharedModule],
    exports: [MainLayoutComponent, AuthLayoutComponent],
})
export class LayoutModule {}