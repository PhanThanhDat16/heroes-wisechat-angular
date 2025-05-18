import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProfileInforComponent } from "./profile-infor/profile-infor.component";

const routes: Routes = [
    {path: 'profile', component: ProfileInforComponent},
]  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeroesRoutingModule{}