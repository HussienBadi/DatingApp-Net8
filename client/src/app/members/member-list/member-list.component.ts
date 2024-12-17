import { Component, inject, OnInit } from '@angular/core';
import { MemberService } from '../../_Services/member.service';
import { Member } from '../../_Models/Member';
import { MemberCardComponent } from "../member-card/member-card.component";
import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MemberTableComponent } from "../member-table/member-table.component";

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, MatSlideToggleModule, MemberTableComponent],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {

  private memberService = inject(MemberService);
  private toastr = inject(ToastrService)
  members:Member[] = [];

  ngOnInit(): void {
    this.loadMembers()
  }

  editClick(){
  this.toastr.success("hi")
  }
  loadMembers(){
    this.memberService.getMembers().subscribe({
      next:member => this.members = member
    })
  }

}
