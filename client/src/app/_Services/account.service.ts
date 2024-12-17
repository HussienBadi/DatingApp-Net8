import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { User } from '../_Models/User';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private httpClient = inject(HttpClient);
  baseUrl = environment.ApiUrl;
  currentUser = signal<User | null>(null);

  login(model:any){
    return this.httpClient.post<User>(this.baseUrl + "account/login",model).pipe(
      map(user => {
        if(user){
          localStorage.setItem("user",JSON.stringify(user));
          this.currentUser.set(user);
        }
      })
    );
  }

  register(model:any){
    return this.httpClient.post<User>(this.baseUrl + "account/register",model).pipe(
      map(user => {
        if(user){
          localStorage.setItem("user",JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    );
  }

  logOut(){
    localStorage.removeItem("user");
    this.currentUser.set(null);
  }

}
