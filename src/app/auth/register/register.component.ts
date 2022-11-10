import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading = false;

  constructor(
    private formRegister: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.createForm();
   }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    
  }

  createForm(): void {
    this.form = this.formRegister.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z\\s]+$')]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  inputInvalid(campo: string){
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

  register(){
    if(this.form.valid){
      const user: User = {
        name: this.form.value.name,
        username: this.form.value.username,
        email: this.form.value.email,
        password: this.form.value.password
      }
      this.loading = true;
      this.userService.createUser(user).subscribe((res: any) => {
        localStorage.setItem('token', JSON.stringify(res.token));
        this.loading = false;
        this.router.navigateByUrl('/client/home');
      });
      this.toast.success('Bienvenido!');
    }else{
      console.log('Formulario no valido!!!')
    }
    this.form.reset();
  }

}
