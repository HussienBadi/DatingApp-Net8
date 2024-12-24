import { Component, EventEmitter, inject, input, Input, OnInit, output, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_Services/account.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from "../_forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
 private accountSernice = inject(AccountService);
 private toastr = inject(ToastrService);
 private router = inject(Router);
 cancelRegister = output<boolean>();
 registerForm : FormGroup = new FormGroup({});
 private fb = inject(FormBuilder);
 maxDate = new Date();
 validationError : string[] | undefined;

ngOnInit(): void {
this.initializeForm();
this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
}

initializeForm(){
  this.registerForm = this.fb.group({
    gender:['male'],
    username:['',Validators.required],
    knownAs:['',Validators.required],
    dateOfBirth:['',Validators.required],
    city:['',Validators.required],
    country:['',Validators.required],
    password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
    confirmPassword:['',[Validators.required,this.matchValue('password')]]
  });

// every time password change execut confirmpassword validation ------>
  this.registerForm.controls['password'].valueChanges.subscribe({
    next:()=>this.registerForm.controls['confirmPassword'].updateValueAndValidity()
  })
}

matchValue(matchTo:string):ValidatorFn {
  return (control:AbstractControl) =>{
    return control.value == control.parent?.get(matchTo)?.value ? null : {isMatching:true}
  }
}

 register(){
  const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
  this.registerForm.patchValue({dateOfBirth:dob})

 this.accountSernice.register(this.registerForm.value).subscribe({
  next : _ => this.router.navigateByUrl('/members'),
  error: error=> this.validationError = error
 });

 }

 cancel(){
  this.cancelRegister.emit(false);
 }

 private getDateOnly(dob:string | undefined){
  if(!dob) return;
  return new Date(dob).toISOString().slice(0,10);
 }
}
