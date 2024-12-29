import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../_Services/member.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { UserParams } from '../../_Models/userParams';
import { AccountService } from '../../_Services/account.service';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, MatSlideToggleModule,PaginationModule,FormsModule,ButtonsModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

   memberService = inject(MemberService);
   private toastr = inject(ToastrService);

   genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];


  ngOnInit(): void {
   if(!this.memberService.pagintedResult()) this.loadMembers()
  }

  resetFilters() {
      this.memberService.resetUserParms();
      this.loadMembers();
  }

  editClick(){
  this.toastr.success("hi")
  }

  loadMembers(){
    this.memberService.getMembers();
  }

  pageChange(event:any){
    if(this.memberService.userPrams().pageNumber !== event.page){
      this.memberService.userPrams().pageNumber = event.page;
      this.memberService.userPrams().maxAge = 100;
      this.loadMembers();
    }
  }

}
