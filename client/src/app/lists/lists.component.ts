import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { LikesService } from '../_Services/likes.service';
import { Member } from '../_Models/Member';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FormsModule } from '@angular/forms';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-lists',
  standalone: true,
  imports: [ButtonsModule, FormsModule, MemberCardComponent,MemberCardComponent,PaginationModule],
  templateUrl: './lists.component.html',
  styleUrl: './lists.component.css'
})
export class ListsComponent implements OnInit , OnDestroy {
  likedService = inject(LikesService);
  predicate = 'liked'
  pageNumber = 1;
  pageSize = 5;

  ngOnInit(): void {
   this.loadLikes();
  }

  getTitle(){
    switch (this.predicate){
      case "liked" : return 'Member You liked'
      case 'likedBy' : return 'Member who liked you'
      default : return 'Mutual'
    }
  }

  loadLikes(){
    this.likedService.getLikes(this.predicate,this.pageNumber,this.pageSize);
  }

  pageChange(event:any){
    if(this.pageNumber !== event.pageNumber){
      this.pageNumber === event.pageNumber;
      this.loadLikes();
    }
  }

  ngOnDestroy(): void {
   this.likedService.paginatedResult.set(null);
  }

}
