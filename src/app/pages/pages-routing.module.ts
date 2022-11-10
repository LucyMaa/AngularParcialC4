import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoomComponent } from './room/room.component';

export const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: '', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
      {path: 'room', component: RoomComponent, canActivate: [AuthGuard]}
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(pagesRoutes)
  ],
  exports:[
    RouterModule
  ]
})
export class PagesRoutingModule { }
