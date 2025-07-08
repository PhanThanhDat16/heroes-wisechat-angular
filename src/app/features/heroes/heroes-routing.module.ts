import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DetailComponent } from "./components/detail/detail.component";
import { HeroesListComponent } from "./components/heroes-list/heroes-list.component";

const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'heroes/:id', component: DetailComponent},
    {path: 'heroes', component: HeroesListComponent},
]  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeroesRoutingModule{}