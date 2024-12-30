import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_Services/account.service';
import { HomeComponent } from "./home/home.component";
import { NgxSpinnerComponent } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [NavComponent,RouterOutlet,NgxSpinnerComponent]
})

export class AppComponent implements OnInit {

  private accountService = inject(AccountService);
  ngOnInit(): void {
   this.setCurrentUser();

  }

  setCurrentUser(){
    var userString = localStorage.getItem("user");
    if(!userString) return;
    var user = JSON.parse(userString);
    this.accountService.setCurrentUser(user);
  }


}
