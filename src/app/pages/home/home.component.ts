import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  mensajesSubscription: Subscription;
  texto: string;
  mensajes: any[] = [];
  elemento: HTMLElement;

  constructor(
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.mensajesSubscription.unsubscribe();
  }

  joinRoom(){
    this.router.navigateByUrl('/client/room');
    this.toast.success('Ingresaste a la sala!');
  }

}
