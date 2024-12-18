import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { MemberService } from '../../_Services/member.service';
import { AccountService } from '../../_Services/account.service';
import { Member } from '../../_Models/Member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule,FormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
 @ViewChild('editForm') editForm?:NgForm
 @HostListener('window:beforeunload',['$event']) notify($event:any) {
  if(this.editForm?.dirty){
    $event.returnValue = true;
  }
 }

 private memberService = inject(MemberService)
 private accountService = inject(AccountService)
 private toastr = inject(ToastrService)
 member?:Member

 ngOnInit(): void {
  this.loadMember();
 }
loadMember(){
  var user = this.accountService.currentUser();
  if(!user) return;
  this.memberService.getMember(user.username).subscribe({
    next:member=>this.member =member
  });
}

 editMember(){
  this.memberService.updateMember(this.editForm?.value).subscribe({
    next:_=> {
      this.toastr.success("Profile updated successfully");
      this.editForm?.reset(this.member);
    }
  })}
}
