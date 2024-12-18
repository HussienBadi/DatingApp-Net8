import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../_Services/member.service';
import { Member } from '../../_Models/Member';
import { MemberCardComponent } from "../member-card/member-card.component";
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, MatSlideToggleModule],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

   memberService = inject(MemberService);
  private toastr = inject(ToastrService)

  ngOnInit(): void {
   if(this.memberService.members().length === 0) this.loadMembers()
  }

  editClick(){
  this.toastr.success("hi")
  }
  loadMembers(){
    this.memberService.getMembers();
  }

}
