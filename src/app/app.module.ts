import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { FormsModule } from '@angular/forms';

import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { GojsAngularModule } from "gojs-angular";

const config: SocketIoConfig = {
  url: 'https://parcialsw2022.herokuapp.com',
  options: {
    transports: ['websocket', 'polling']
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AuthRoutingModule,
    HttpClientModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    GojsAngularModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-right', timeOut: 1000 }),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
