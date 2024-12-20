import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-test-error',
  standalone: true,
  imports: [],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.css'
})
export class TestErrorComponent {

  baseUrl = 'https://localhost:5001/api/';
  private httpClient = inject(HttpClient);
  validationError : string[]=[];

  get400Error(){
    this.httpClient.get(this.baseUrl +"buggy/bad-request").subscribe({
      next: response=> console.log(response),
      error: error=> console.log(error),

    })
  }

  get401Error(){
    this.httpClient.get(this.baseUrl +"buggy/auth").subscribe({
      next: response=> console.log(response),
      error: error=> console.log(error),

    })
  }

  get404Error(){
    this.httpClient.get(this.baseUrl +"buggy/not-found").subscribe({
      next: response=> console.log(response),
      error: error=> console.log(error),

    })
  }

  get400ValidationError(){
    this.httpClient.post(this.baseUrl +"account/register",{}).subscribe({
      next: response=> console.log(response),
      error: error=> {
        console.log(error)
        this.validationError = error;
      },

    })
  }

  get500Error(){

    this.httpClient.get(this.baseUrl +"buggy/server-error").subscribe({
      next: response=> console.log(response),
      error: error=> console.log(error),

    })
  }
}
