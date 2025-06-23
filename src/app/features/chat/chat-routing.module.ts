import { Routes } from '@angular/router';
import { ChatappComponent } from './components/chatapp/chatapp.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GroupDetailComponent } from './components/group-detail/group-detail.component';

const router: Routes = [
  {
    path: 'messages',
    component: ChatappComponent,
    children: [
      {
        path: ':id',
        component: GroupDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(router)],
  exports: [RouterModule],
})
export class ChatRoutingModule {}
