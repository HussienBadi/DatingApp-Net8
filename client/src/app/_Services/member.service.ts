import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_Models/Member';
import { map, of, reduce, tap } from 'rxjs';
import { Photo } from '../_Models/Photo';
import { PaginatedResult } from '../_Models/Pagination';
import { UserParams } from '../_Models/userParams';
import { AccountService } from './account.service';
import { setPaginatedResponse, setPaginationHeader } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private http = inject(HttpClient);
  baseUrl = environment.ApiUrl;
  pagintedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCash = new Map();
  // rember filter
  private accountService = inject(AccountService);
  user = this.accountService.currentUser();
  userPrams = signal<UserParams>(new UserParams(this.user));

  resetUserParms(){
    this.userPrams.set(new UserParams(this.user))
  }

  getMembers(){
    const response = this.memberCash.get(Object.values(this.userPrams()).join('-'));
     if (response) return setPaginatedResponse(response,this.pagintedResult);

    let params = setPaginationHeader(this.userPrams().pageNumber,this.userPrams().pageSize);

    params = params.append('minAge',this.userPrams().minAge);
    params = params.append('maxAge',this.userPrams().maxAge);
    params = params.append('gender',this.userPrams().gender);
    params = params.append('orderBy',this.userPrams().orderBy);

    return this.http.get<Member[]>(this.baseUrl + "users",{observe:'response',params}).subscribe({
      next: response => {
       setPaginatedResponse(response,this.pagintedResult);
       this.memberCash.set(Object.values(this.userPrams()).join('-'),response);
      }
    })


  }



  getMember(username:string){

    const member: Member = [...this.memberCash.values()]
    .reduce((arr,elem) => arr.concat(elem.body),[])
    .find((m:Member) => m.username === username);

    if (member) return of(member);

    return this.http.get<Member>(this.baseUrl + "users/" + username);

  }

  updateMember(member:Member){
   return  this.http.put(this.baseUrl + 'users',member).pipe(
    // tap(()=>{
    //   this.members.update(members => members.map(m=>m.username == member.username ? member : m));
    // })
   );

  }

  setMainPhoto(photo:Photo){
    return this.http.put(this.baseUrl +'users/set-main-photo/'+ photo.id,{}).pipe(
      // tap(()=>{
      //   this.members.update(member=> member.map(m=>{
      //     if(m.photos.includes(photo)){
      //       m.photoUrl = photo.url
      //     }
      //     return m;
      //   }))

      // })
    );
  }

  deletePhoto(photo:Photo){
    return this.http.delete(this.baseUrl+"users/delete-photo/"+ photo.id).pipe(
      // tap(()=>{
      //   this.members.update(member => member.map(m=>{
      //     if(m.photos.includes(photo)){
      //       m.photos = m.photos.filter(x=>x.id !== photo.id)
      //     }
      //     return m;
      //   }))
      // })
    );
  }


}
