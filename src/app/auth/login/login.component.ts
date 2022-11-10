import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;

  constructor(
    private formLogin: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toast: ToastrService
  ) {
    this.createForm()
  }

  ngOnInit(): void {
  }

  createForm(): void{
    this.form = this.formLogin.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  login(): void{
    if(this.form.valid){
      const username = this.form.value.username;
      const password = this.form.value.password;
      this.loading = true;
      this.userService.loginUser(username, password).subscribe((res: any) => {
        this.loading = false;
        localStorage.setItem('token', JSON.stringify(res.token));
        localStorage.setItem('user', JSON.stringify(res.userFound.name));
        this.router.navigateByUrl('/client/home');
        this.toast.info('Bienvenido!!!!');
      }, error => {
        this.loading = false;
        this.toast.error(error.error.message);
      });

    }else{
      console.log("Formulario no valido")
    }
  }

  inputInvalid(campo: string){
    return this.form.get(campo)?.invalid && this.form.get(campo)?.touched;
  }

}
