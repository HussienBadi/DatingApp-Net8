import { Component, EventEmitter, inject, input, Input, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_Services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 model:any = {}
 //@Input() UsersFromHomeComponent : any;
// @Output() cancelRegister = new EventEmitter();
 accountSernice = inject(AccountService);
 cancelRegister = output<boolean>();
//  UsersFromHomeComponent = input.required<any>();
 register(){
 this.accountSernice.register(this.model).subscribe({
  next : responce =>{
    console.log(responce);
    this.cancel();
  },
  error:error=>console.log(error)
 });

 }

 cancel(){
  this.cancelRegister.emit(false);

 }
}
