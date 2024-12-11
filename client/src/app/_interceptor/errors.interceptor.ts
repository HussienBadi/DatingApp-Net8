import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router,NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorsInterceptor: HttpInterceptorFn = (req, next) => {
 const router = inject(Router);
  const toastr = inject(ToastrService);
  return next(req).pipe(
    catchError(error => {
      if(error){
        switch (error.status) {
          case 400:
           if(error.error.errors){
            const modelStateErrors = [];
            for(const key in error.error.errors){
              modelStateErrors.push(error.error.errors[key]);
            }
            throw modelStateErrors.flat();
           }else{
                 toastr.error(error.error,error.status);
           }
            break;
            case 401:
              toastr.error("unauthorized",error.status);
              break;
              case 404:
                router.navigateByUrl("/not-found");
                break;
                case 500:
                  const navigationExtras : NavigationExtras = {state:{error:error.error}}
                  router.navigateByUrl("/server-error",navigationExtras);
                  break;
          default:
            toastr.error("Something unexpected went wrong");
            break;
        }
      }
        throw error;
    })
  );
};
