import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TagsListComponent } from "./components/tags-list/tags-list.component";

const routes: Routes = [
    {path: 'tag', component: TagsListComponent},
]  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagsRoutingModule{}