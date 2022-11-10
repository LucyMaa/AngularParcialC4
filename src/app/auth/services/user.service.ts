import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../../environments/environment.prod";
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url = environment.baseURL;
  //private url = dev.basuURLdev;

  constructor(
    private http: HttpClient
  ) { }

  createUser(user: User){
    return this.http.post(`${this.url}/api/singup`, user);
  }

  loginUser(username: string, password:string){
    const credentials = {
      username,
      password
    };
    return this.http.post(`${this.url}/api/singin`, credentials).pipe(catchError(e => {
      return throwError(e);
    }));
  }
}
