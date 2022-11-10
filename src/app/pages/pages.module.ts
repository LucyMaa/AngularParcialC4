import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from '../pages/pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoomComponent } from './room/room.component';
import DiagramComponent from './diagram/diagram.component';
import { LoadDiagramComponent } from './load-diagram/load-diagram.component';



@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    RoomComponent,
    DiagramComponent,
    LoadDiagramComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    PagesComponent
  ]
})
export class PagesModule { }
