export interface Pagination{
  currentPage:number,
  itemsPerPage:number,
  totalItems:number,
  totalCount:number,
}

export class PaginatedResult<T>{
  item?:T;
  pagination?:Pagination

}



