import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../_Models/Member';
import { PaginatedResult } from '../_Models/Pagination';
import { setPaginatedResponse, setPaginationHeader } from './paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
 baseUrl = environment.ApiUrl;
 private http = inject(HttpClient);
 likeIds = signal<number[]>([]);
 paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

 toggleLike(targrtId :number){
  return this.http.post(`${this.baseUrl}likes/${targrtId}`,{});
 }

 getLikes( predicate :string,pageNumber : number,pageSize : number){

  let params = setPaginationHeader(pageNumber,pageSize);
  params = params.append('predicate',predicate);

 return this.http.get<Member[]>(`${this.baseUrl}likes`,{observe:'response',params}).subscribe({

  next: response=> setPaginatedResponse(response,this.paginatedResult)
 });
 }
getLikeIds(){
 return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
    next: ids => this.likeIds.set(ids)
  });
}
}
