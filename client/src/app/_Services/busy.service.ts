import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

   requestCount = 0;
   private spinnerService = inject(NgxSpinnerService);

   busy(){
    this.requestCount ++;
    this.spinnerService.show(undefined,{
      type:'line-scale-party',
      bdColor:'rgba(255,255,255,0)',
      color:'#333333'
    })
   }

   idle(){
    this.requestCount --;
    if (this.requestCount <= 0){
      this.requestCount = 0;
      this.spinnerService.hide();
    }
   }

}
